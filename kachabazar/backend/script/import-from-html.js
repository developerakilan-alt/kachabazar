require("dotenv").config();
const { connectDB } = require("../config/db");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");
const Category = require("../models/Category");
const Setting = require("../models/Setting");

// ── Config ──
const HTML_PATH = path.resolve(
  __dirname,
  "../../../../jwellery_site.html"
);
const SETTINGS_DATA = require("../utils/settings");
const CONCURRENCY = 5;

// ── Read HTML ──
const html = fs.readFileSync(HTML_PATH, "utf-8");

// ══════════════════════════════════════════════════
// 1. EXTRACT CATEGORIES FROM NAV MENU
// ══════════════════════════════════════════════════
function extractCategories(html) {
  const categoryPattern =
    /<a[^>]*href="https:\/\/hautecouturejewellery\.in\/product-category\/([^"/]+)(?:\/([^"/]+))?\/?"[^>]*>[\s\n]*<(?:span|b)[^>]*class="[^"]*menu-title[^"]*"[^>]*>([^<]+)<\/(?:span|b)>/g;

  const cats = {};
  let match;
  while ((match = categoryPattern.exec(html)) !== null) {
    const parentSlug = match[1];
    const childSlug = match[2] || null;
    const name = match[3].replace(/&amp;/g, "&").trim();

    if (!childSlug) {
      // Top-level category
      if (!cats[parentSlug]) {
        cats[parentSlug] = { name, slug: parentSlug, children: [] };
      } else {
        cats[parentSlug].name = name;
      }
    } else {
      if (!cats[parentSlug]) {
        cats[parentSlug] = { name: parentSlug, slug: parentSlug, children: [] };
      }
      // Avoid duplicates
      if (!cats[parentSlug].children.find((c) => c.slug === childSlug)) {
        cats[parentSlug].children.push({
          name,
          slug: childSlug,
          parent: parentSlug,
        });
      }
    }
  }

  // Also collect any product_cat from product listings that aren't in nav
  const productCatRegex = /product_cat-([a-zA-Z0-9_-]+)/g;
  while ((match = productCatRegex.exec(html)) !== null) {
    const slug = match[1];
    const knownSlugs = new Set(["imitation-jewels", "diamond-look-like", "accessories"]);
    if (!Object.keys(cats).includes(slug) && !knownSlugs.has(slug)) {
      // Might be a child category, check if it has a parent
      const parentMatch = html.slice(0, match.index).match(/product_cat-([a-zA-Z0-9_-]+)/g);
      // Actually let's just add it as a top level or check children
      let found = false;
      for (const p of Object.values(cats)) {
        if (p.children.find((c) => c.slug === slug)) {
          found = true;
          break;
        }
      }
      if (!found) {
        const name = slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        // Check if it might be a child of something
        // For now just add it
        if (!cats[slug]) {
          cats[slug] = { name, slug, children: [] };
        }
      }
    }
  }

  return cats;
}

function extractCategoryList(html) {
  // Get product_cat-* from all product grid items
  const productRegex =
    /<div class="products-grid[^>]*product_cat-([a-zA-Z0-9_-]+(?: product_cat-[a-zA-Z0-9_-]+)*)[^>]*>/g;
  const catSet = new Set();
  let m;
  while ((m = productRegex.exec(html)) !== null) {
    m[1].split(" ").forEach((c) => {
      const slug = c.replace("product_cat-", "");
      catSet.add(slug);
    });
  }

  // Navigation categories
  const navPattern =
    /<a[^>]*href="https:\/\/hautecouturejewellery\.in\/product-category\/([^"/]+)(?:\/([^"/]+))?\/?"[^>]*>[\s\n]*<(?:span|b)[^>]*class="[^"]*menu-title[^"]*"[^>]*>([^<]+)<\/(?:span|b)>/g;
  while ((m = navPattern.exec(html)) !== null) {
    catSet.add(m[1]);
    if (m[2]) catSet.add(m[2]);
  }

  return [...catSet].sort();
}

// ══════════════════════════════════════════════════
// 2. EXTRACT PRODUCT INFO FROM HTML
// ══════════════════════════════════════════════════
function extractProductsFromHTML(html) {
  // Split by product blocks
  const blocks = html.match(
    /<div class="products-grid product type-product[^>]*>.*?<div class="product-block[^>]*>.*?<\/div>\s*<\/div>\s*<\/div>/gs
  );

  if (!blocks) return [];

  return blocks.map((block) => {
    // Product ID
    const idMatch = block.match(/data-product-id="(\d+)"/);
    const productId = idMatch ? idMatch[1] : "";

    // SKU
    const skuMatch = block.match(/data-product_sku="([^"]*)"/);
    const sku = skuMatch ? skuMatch[1] : "";

    // Title from aria-label
    const titleMatch = block.match(
      /aria-label="[^:]*: &ldquo;([^&]*)&rdquo;/
    );
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Product URL
    const urlMatch = block.match(/href="(https:\/\/hautecouturejewellery\.in\/product\/[^"]+)"/);
    const url = urlMatch ? urlMatch[1] : "";

    // Image
    const imgMatch = block.match(/<img[^>]*src="([^"]+)"[^>]*class="image-no-effect"[^>]*>/);
    const image = imgMatch ? imgMatch[1] : "";

    // Categories from css classes
    const catClasses = (block.match(/product_cat-([a-zA-Z0-9_-]+)/g) || []).map(
      (c) => c.replace("product_cat-", "")
    );

    // Prices
    const origMatch = block.match(/<del[^>]*>.*?&#8377;([\d,]+\.?\d*).*?<\/del>/);
    const saleMatch = block.match(/<ins[^>]*>.*?&#8377;([\d,]+\.?\d*).*?<\/ins>/);
    const originalPrice = origMatch
      ? parseFloat(origMatch[1].replace(/,/g, ""))
      : 0;
    const salePrice = saleMatch
      ? parseFloat(saleMatch[1].replace(/,/g, ""))
      : 0;

    // Discount
    const discountMatch = block.match(/Save (\d+)%/);
    const discount = discountMatch ? parseInt(discountMatch[1]) : 0;

    return {
      productId,
      sku,
      title,
      url,
      image,
      categories: [...new Set(catClasses)],
      originalPrice,
      salePrice,
      discount,
    };
  });
}

// ══════════════════════════════════════════════════
// 3. CREATE CATEGORIES IN DB
// ══════════════════════════════════════════════════
async function createCategories(cats) {
  const createdMap = {};

  for (const [slug, cat] of Object.entries(cats)) {
    // Create or update parent
    let parent = await Category.findOne({ slug: cat.slug });
    if (!parent) {
      parent = await Category.create({
        name: { en: cat.name },
        slug: cat.slug,
        status: "show",
      });
      console.log(`  ✓ Category created: ${cat.name} (${cat.slug})`);
    } else {
      console.log(`  ○ Category exists: ${cat.name} (${cat.slug})`);
    }
    createdMap[cat.slug] = parent._id;

    // Create children
    for (const child of cat.children) {
      let childCat = await Category.findOne({ slug: child.slug });
      if (!childCat) {
        childCat = await Category.create({
          name: { en: child.name },
          slug: child.slug,
          parentId: String(parent._id),
          parentName: cat.name,
          status: "show",
        });
        console.log(`  ✓ Subcategory created: ${child.name} (${child.slug})`);
      } else {
        console.log(`  ○ Subcategory exists: ${child.name} (${child.slug})`);
      }
      createdMap[child.slug] = childCat._id;
    }
  }

  return createdMap;
}

// ══════════════════════════════════════════════════
// 4. SCRAPE A SINGLE PRODUCT PAGE
// ══════════════════════════════════════════════════
async function scrapeProductPage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = await response.text();

    // Title
    const titleMatch = body.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>\s*(.*?)\s*<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // SKU (extract from innermost span to avoid "SKU:" label wrapper)
    let sku = "";
    const skuInnerMatch = body.match(/<span class="sku">([A-Za-z0-9-]+)<\/span>/);
    if (skuInnerMatch) {
      sku = skuInnerMatch[1].trim();
    } else {
      const skuFallback = body.match(/<span[^>]*class="[^"]*sku[^"]*"[^>]*>\s*(.*?)\s*<\/span>/);
      if (skuFallback) {
        sku = skuFallback[1].replace(/<[^>]+>/g, "").replace(/^SKU:\s*/i, "").trim();
      }
    }

    // Price
    const origMatch = body.match(/<del[^>]*>.*?&#8377;([\d,]+\.?\d*).*?<\/del>/s);
    const saleMatch = body.match(/<ins[^>]*>.*?&#8377;([\d,]+\.?\d*).*?<\/ins>/s);
    const singlePriceMatch = body.match(/<p[^>]*class="[^"]*price[^"]*"[^>]*>.*?&#8377;([\d,]+\.?\d*)/s);
    
    const originalPrice = origMatch ? parseFloat(origMatch[1].replace(/,/g, "")) : 0;
    const salePrice = saleMatch ? parseFloat(saleMatch[1].replace(/,/g, "")) : 0;
    
    // Fallback: if no del/ins, the single price IS the price
    let price = salePrice || originalPrice || 0;
    let original = originalPrice || salePrice || 0;
    if (!origMatch && !saleMatch && singlePriceMatch) {
      price = parseFloat(singlePriceMatch[1].replace(/,/g, ""));
      original = price;
    }

    // Images (gallery)
    const images = [];
    const galleryMatch = body.match(/<figure[^>]*class="[^"]*woocommerce-product-gallery__wrapper[^"]*"[^>]*>(.*?)<\/figure>/s);
    if (galleryMatch) {
      const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/g;
      let im;
      while ((im = imgRegex.exec(galleryMatch[1])) !== null) {
        // Get full-size if available or as-is
        const src = im[1].replace(/-(\d+x\d+)(?=\.\w+)/, "");
        if (!images.includes(src)) images.push(src);
      }
    }
    // Fallback: also look for main product image
    if (images.length === 0) {
      const mainImgMatch = body.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/);
      if (mainImgMatch) images.push(mainImgMatch[1]);
    }

    // Short description
    const descMatch = body.match(/<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    let description = "";
    if (descMatch) {
      description = descMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    // Categories from product page
    const catLinks = [];
    const catLinkRegex = /<a[^>]*href="https:\/\/hautecouturejewellery\.in\/product-category\/([^"]+)"[^>]*rel="tag"[^>]*>([^<]+)<\/a>/g;
    let cm;
    while ((cm = catLinkRegex.exec(body)) !== null) {
      catLinks.push({
        slug: cm[1].replace(/\/$/, ""),
        name: cm[2].trim(),
      });
    }

    return {
      title,
      sku,
      price,
      originalPrice: original,
      images,
      description,
      categories: catLinks,
    };
  } catch (err) {
    console.error(`  ✗ Failed to scrape ${url}: ${err.message}`);
    return null;
  }
}

// ══════════════════════════════════════════════════
// 5. CREATE SLUG FROM TITLE
// ══════════════════════════════════════════════════
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

// ══════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════
async function main() {
  console.log("═══ Import Products from HTML ═══\n");

  // ── Connect DB ──
  await connectDB();

  // ── 1. Create Categories ──
  console.log("\n── Categories ──");
  const catMap = {};

  // Define the known category structure
  const categoryStructure = {
    "imitation-jewels": {
      name: "Imitation Jewels",
      slug: "imitation-jewels",
      children: [
        { name: "Chokers", slug: "chokers" },
        { name: "Necklaces", slug: "necklaces" },
        { name: "Harams", slug: "harams" },
        { name: "Tikka", slug: "tikka" },
        { name: "Earrings", slug: "earrings" },
        { name: "Anklets", slug: "anklets" },
        { name: "Bangles", slug: "bangles" },
        { name: "Invisible Chains", slug: "invisible-chains" },
        { name: "Bridal Sets", slug: "bridal-sets" },
        { name: "Hip Chains", slug: "hip-chains" },
      ],
    },
    "diamond-look-like": {
      name: "Diamond Look Like",
      slug: "diamond-look-like",
      children: [
        { name: "Necklaces", slug: "necklaces-diamond-look-like" },
        { name: "Harams", slug: "harams-diamond-look-like" },
        { name: "Earrings", slug: "earrings-diamond-look-like" },
        { name: "Choker", slug: "choker" },
      ],
    },
    accessories: {
      name: "Accessories",
      slug: "accessories",
      children: [
        { name: "Jada Billa", slug: "jada-billa" },
        { name: "Hair Bands & Clips", slug: "hair-bands-clips" },
        { name: "Others", slug: "others" },
      ],
    },
  };

  let catCount = 0;
  for (const [slug, cat] of Object.entries(categoryStructure)) {
    let parent = await Category.findOne({ slug });
    if (!parent) {
      parent = await Category.create({
        name: { en: cat.name },
        slug,
        status: "show",
      });
      catCount++;
      console.log(`  ✓ Category: ${cat.name}`);
    } else {
      console.log(`  ○ Category exists: ${cat.name}`);
    }
    catMap[slug] = parent._id;

    for (const child of cat.children) {
      let childCat = await Category.findOne({ slug: child.slug });
      if (!childCat) {
        childCat = await Category.create({
          name: { en: child.name },
          slug: child.slug,
          parentId: String(parent._id),
          parentName: cat.name,
          status: "show",
        });
        catCount++;
        console.log(`  ✓ Subcategory: ${child.name}`);
      } else {
        console.log(`  ○ Subcategory exists: ${child.name}`);
      }
      catMap[child.slug] = childCat._id;
    }
  }

  // Handle hip-chains alias (it's under imitation-jewels but no separate nav entry)
  if (!catMap["hip-chains"]) {
    // Check if it's already been handled under a different name
    let hc = await Category.findOne({ slug: "hip-chains" });
    if (!hc) {
      const parent = await Category.findOne({ slug: "imitation-jewels" });
      hc = await Category.create({
        name: { en: "Hip Chains" },
        slug: "hip-chains",
        parentId: String(parent._id),
        parentName: "Imitation Jewels",
        status: "show",
      });
      catCount++;
      console.log(`  ✓ Subcategory: Hip Chains`);
    }
    catMap["hip-chains"] = hc._id;
    catMap["vaddanam"] = hc._id; // alias
  }

  console.log(`\nCategories created/found: ${catCount}`);

  // ── 2. Extract products from HTML ──
  console.log("\n── Products from HTML ──");
  const htmlProducts = extractProductsFromHTML(html);
  console.log(`  Found ${htmlProducts.length} product listings in HTML`);

  // Track by URL to deduplicate
  const productMap = new Map();
  for (const p of htmlProducts) {
    if (p.url && !productMap.has(p.url)) {
      productMap.set(p.url, p);
    }
  }

  // ── 3. Scrape product pages for those not fully detailed ──
  console.log("\n── Scraping product pages ──");
  const urls = Array.from(productMap.keys());
  let scraped = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((url) => scrapeProductPage(url))
    );

    for (let j = 0; j < results.length; j++) {
      const url = batch[j];
      const data = results[j];
      const existing = productMap.get(url);

      if (data) {
        scraped++;
        // Merge scraped data with HTML data
        existing.title = data.title || existing.title;
        existing.sku = data.sku || existing.sku;
        existing.price = data.price || existing.salePrice;
        existing.originalPrice = data.originalPrice || existing.originalPrice;
        existing.description = data.description;
        existing.galleryImages = data.images;

        // Merge categories from scraped page
        if (data.categories && data.categories.length > 0) {
          data.categories.forEach((c) => {
            const slug = c.slug;
            if (!existing.categories.includes(slug)) {
              existing.categories.push(slug);
            }
          });
        }
      } else {
        failed++;
      }
    }

    const pct = Math.round(((i + batch.length) / urls.length) * 100);
    console.log(`  Progress: ${Math.min(i + batch.length, urls.length)}/${urls.length} (${pct}%)`);
  }

  console.log(`\n  Scraped: ${scraped}, Failed: ${failed}`);

  // ── 4. Import products into MongoDB ──
  console.log("\n── Importing into MongoDB ──");

  // First, clear existing products
  const deleteResult = await Product.deleteMany({});
  console.log(`  Deleted ${deleteResult.deletedCount} existing products`);

  let imported = 0;
  let errors = 0;

  for (const [url, p] of productMap) {
    try {
      // Map categories to ObjectIds
      const catIds = [];
      for (const slug of p.categories) {
        const id = catMap[slug];
        if (id) {
          if (!catIds.includes(id)) catIds.push(id);
        }
      }

      // Prefer specific subcategory over parent category
      const parentSlugs = ["imitation-jewels", "diamond-look-like", "accessories"];
      const specificIds = catIds.filter(
        (id) => !parentSlugs.includes(
          Object.entries(catMap).find(([, v]) => v === id)?.[0] || ""
        )
      );
      let primaryCategory = specificIds[0] || catIds[0] || null;

      if (!primaryCategory) {
        // Default to imitation-jewels
        primaryCategory = catMap["imitation-jewels"];
        catIds.push(primaryCategory);
      }

      // Images
      const images = p.galleryImages && p.galleryImages.length > 0
        ? p.galleryImages
        : p.image
          ? [p.image]
          : [];

      // Slug
      const slug = slugify(p.title) || `product-${p.productId}`;

      // Build product document
      const productDoc = {
        productId: p.productId || String(Date.now()) + Math.random().toString(36).slice(2, 8),
        sku: p.sku || "",
        title: { en: p.title },
        description: { en: p.description || "" },
        slug,
        categories: catIds,
        category: primaryCategory,
        image: images,
        stock: 10,
        sales: 0,
        prices: {
          originalPrice: p.originalPrice || p.price,
          price: p.price || p.originalPrice || 0,
          discount: p.discount || 0,
        },
        variants: [],
        isCombination: false,
        average_rating: 0,
        total_reviews: 0,
        status: "show",
        seo: {
          meta_title: { en: p.title },
          meta_description: { en: "" },
          meta_keywords: [],
        },
      };

      await Product.create(productDoc);
      imported++;
    } catch (err) {
      console.error(`  ✗ Error importing "${p.title}": ${err.message}`);
      errors++;
    }
  }

  console.log(`\n  Products imported: ${imported}`);
  console.log(`  Errors: ${errors}`);

  // ── 5. Import Settings ──
  console.log("\n── Settings ──");
  let settingsImported = 0;
  for (const s of SETTINGS_DATA) {
    if (s.setting && s.setting.enable_guest_order === true) {
      try {
        await Setting.findOneAndUpdate(
          { name: s.name },
          { $set: s },
          { upsert: true }
        );
        settingsImported++;
        console.log(`  ✓ Setting: ${s.name}`);
      } catch (err) {
        console.error(`  ✗ Error importing setting "${s.name}": ${err.message}`);
      }
    }
  }
  console.log(`\n  Settings imported/updated: ${settingsImported}`);

  // ── Summary ──
  console.log("\n═══ SUMMARY ═══");
  console.log(`  Categories: ${catCount}`);
  console.log(`  Products imported: ${imported}`);
  console.log(`  Product errors: ${errors}`);
  console.log(`  Settings imported: ${settingsImported}`);
  console.log(`  Pages scraped: ${scraped}`);
  console.log(`  Scrape failures: ${failed}`);

  await mongoose.connection.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
