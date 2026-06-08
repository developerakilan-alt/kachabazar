require("dotenv").config();
const fetch = require("node-fetch");
const { connectDB } = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");

const WP_API = "https://hautecouturejewellery.in/wp-json/wp/v2";
const USER_AGENT = "Mozilla/5.0";

function stripInjection(text) {
  return text.replace(/<script[^>]*>.*?<\/script>/gs, "");
}

async function fetchAll(endpoint, params = {}) {
  const items = [];
  let page = 1;
  while (true) {
    const qs = new URLSearchParams({ ...params, per_page: "100", page: String(page) });
    const url = `${WP_API}/${endpoint}?${qs}`;
    console.log(`  Fetching ${url}`);
    const resp = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!resp.ok) {
      console.log(`  HTTP ${resp.status} on page ${page}, stopping`);
      break;
    }
    const total = parseInt(resp.headers.get("x-wp-total") || "0");
    const raw = await resp.text();
    const clean = stripInjection(raw);
    const data = JSON.parse(clean);
    items.push(...data);
    if (items.length >= total) break;
    page++;
    await new Promise((r) => setTimeout(r, 300));
  }
  return items;
}

async function fetchMediaForProduct(pid) {
  try {
    const url = `${WP_API}/media?parent=${pid}&per_page=10`;
    const resp = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!resp.ok) return [];
    const raw = await resp.text();
    const clean = stripInjection(raw);
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80) || `product-${Date.now()}`;
}

async function main() {
  await connectDB();

  // ── 1. Fetch categories ──
  console.log("── Fetching categories ──");
  const apiCats = await fetchAll("product_cat");
  console.log(`  Got ${apiCats.length} categories`);

  // Build parent map
  const catMap = {};
  for (const c of apiCats) {
    catMap[c.id] = c;
  }

  // ── 2. Create categories in DB ──
  console.log("\n── Creating categories ──");
  await Category.deleteMany({});
  console.log("  Cleared existing categories");

  const slugToId = {};
  for (const c of apiCats) {
    if (c.slug === "uncategorized") continue;
    const parentDoc = c.parent ? catMap[c.parent] : null;
    const doc = {
      name: { en: c.name.replace(/&amp;/g, "&") },
      slug: c.slug,
      status: "show",
    };
    if (parentDoc) {
      if (slugToId[parentDoc.slug]) {
        doc.parentId = String(slugToId[parentDoc.slug]);
        doc.parentName = parentDoc.name.replace(/&amp;/g, "&");
      } else {
        // Parent not yet created; create placeholder first
        const parentExists = await Category.findOne({ slug: parentDoc.slug });
        if (parentExists) {
          doc.parentId = String(parentExists._id);
          doc.parentName = parentDoc.name.replace(/&amp;/g, "&");
        }
      }
    }
    let cat = await Category.findOne({ slug: c.slug });
    if (!cat) {
      cat = await Category.create(doc);
      console.log(`  ✓ ${c.name.replace(/&amp;/g, "&")} (${c.slug})`);
    } else {
      // Update parent if needed
      if (doc.parentId) {
        cat.parentId = doc.parentId;
        cat.parentName = doc.parentName;
        await cat.save();
      }
      console.log(`  ○ ${c.name.replace(/&amp;/g, "&")} (${c.slug})`);
    }
    slugToId[c.slug] = cat._id;
  }

  // Fix parent references for any that were created before their parent
  for (const c of apiCats) {
    if (!c.parent || c.slug === "uncategorized") continue;
    const parentApiCat = catMap[c.parent];
    const child = await Category.findOne({ slug: c.slug });
    const parent = await Category.findOne({ slug: parentApiCat.slug });
    if (child && parent && String(child.parentId) !== String(parent._id)) {
      child.parentId = String(parent._id);
      child.parentName = parentApiCat.name.replace(/&amp;/g, "&");
      await child.save();
    }
  }

  // ── 3. Fetch products ──
  console.log("\n── Fetching products ──");
  const apiProducts = await fetchAll("product", {
    _fields: "id,slug,title,content,excerpt,featured_media,product_cat,class_list,status,link",
  });
  console.log(`  Got ${apiProducts.length} products`);

  // ── 4. Fetch media for each product ──
  console.log("\n── Fetching product media ──");
  const mediaMap = {};
  let mediaCount = 0;
  for (let i = 0; i < apiProducts.length; i++) {
    const p = apiProducts[i];
    const pid = p.id;
    const media = await fetchMediaForProduct(pid);
    if (media.length > 0) {
      mediaMap[pid] = media;
      mediaCount += media.length;
    }
    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${apiProducts.length}`);
    }
  }
  console.log(`  Total media items: ${mediaCount}`);

  // ── 5. Import into MongoDB ──
  console.log("\n── Importing into MongoDB ──");
  await Product.deleteMany({});
  console.log("  Cleared existing products");

  let imported = 0;
  let errors = 0;

  for (const p of apiProducts) {
    try {
      const pid = p.id;
      const title = p.title?.rendered?.trim() || "";
      const slug = p.slug || slugify(title);

      // Description from content or excerpt
      let description = "";
      if (p.content?.rendered) {
        description = p.content.rendered.replace(/<[^>]+>/g, "").trim();
      }
      if (!description && p.excerpt?.rendered) {
        description = p.excerpt.rendered.replace(/<[^>]+>/g, "").trim();
      }

      // Categories
      const catSlugs = [];
      if (p.class_list) {
        for (const key of Object.keys(p.class_list)) {
          const val = p.class_list[key];
          if (val.startsWith("product_cat-")) {
            catSlugs.push(val.replace("product_cat-", ""));
          }
        }
      }
      const catIds = [...new Set(catSlugs.map((s) => slugToId[s]).filter(Boolean))];

      // Primary category: prefer most specific (exclude parent slugs)
      const parentSlugs = ["imitation-jewels", "diamond-look-like", "accessories"];
      const specificIds = catIds.filter((id) => {
        const entry = Object.entries(slugToId).find(([, v]) => String(v) === String(id));
        return entry && !parentSlugs.includes(entry[0]);
      });
      const primaryCategory = specificIds[0] || catIds[0] || slugToId["imitation-jewels"];

      // Images from media API
      const productMedia = mediaMap[pid] || [];
      const images = productMedia
        .filter((m) => m.media_type === "image" || !m.media_type)
        .map((m) => m.source_url || "")
        .filter(Boolean);

      // Extract price from class_list (simple products)
      // For variable products, price info is in the product_cat/class_list
      // Default values since WP API doesn't expose prices in wp/v2/product
      const prices = { originalPrice: 0, price: 0, discount: 0 };

      const doc = {
        productId: String(pid),
        sku: "",
        title: { en: title },
        description: { en: description },
        slug,
        categories: catIds,
        category: primaryCategory || catIds[0],
        image: images,
        stock: 10,
        sales: 0,
        prices,
        variants: [],
        isCombination: false,
        status: "show",
        flashSale: false,
      };

      await Product.create(doc);
      imported++;
    } catch (err) {
      console.error(`  Error importing product ${p.id} (${p.title?.rendered?.substring(0, 30)}): ${err.message}`);
      errors++;
    }
  }

  console.log(`\n  Imported: ${imported}, Errors: ${errors}`);

  // ── 6. Post-process: prices and SKUs from HTML source ──
  const fs = require("fs");
  const htmlPath = "/home/sri-ajay/Ajay/jwellery_ecommerce/jwellery_site.html";
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf8");

    // --- 6a. Update prices ---
    console.log("── Updating prices from HTML source ──");
    const priceRegex = /data-product-id="(\d+)"[\s\S]*?href="https:\/\/hautecouturejewellery\.in\/product\/([^\/"]+)\//g;
    let pm;
    let priceUpdated = 0;

    while ((pm = priceRegex.exec(html)) !== null) {
      const slug = pm[2];
      const start = pm.index;
      const context = html.substring(start, start + 3000);

      const origMatch = context.match(/<del[^>]*>[\s\S]*?&#8377;([\d,]+\.?\d*)/);
      const saleMatch = context.match(/<ins[^>]*>[\s\S]*?&#8377;([\d,]+\.?\d*)/);
      const singleMatch = context.match(/<span class="woocommerce-Price-amount amount">[\s\S]*?&#8377;([\d,]+\.?\d*)/);
      const discountMatch = context.match(/Save (\d+)%/);

      const originalPrice = origMatch ? parseFloat(origMatch[1].replace(/,/g, "")) : 0;
      const salePrice = saleMatch ? parseFloat(saleMatch[1].replace(/,/g, "")) : 0;
      let price = salePrice || originalPrice || 0;
      let original = originalPrice || salePrice || 0;
      if (!origMatch && !saleMatch && singleMatch) {
        price = parseFloat(singleMatch[1].replace(/,/g, ""));
        original = price;
      }
      const discount = discountMatch ? parseInt(discountMatch[1]) : 0;

      if (price > 0) {
        await Product.updateOne(
          { slug },
          { $set: { prices: { originalPrice: original || price, price, discount } } }
        );
        priceUpdated++;
      }
    }
    console.log(`  Updated prices for ${priceUpdated} products`);

    // --- 6b. Update SKUs ---
    console.log("── Updating SKUs from HTML source ──");
    const skuRegex = /data-product-id="(\d+)"[\s\S]*?data-product_sku="([^"]*)"[\s\S]*?href="https:\/\/hautecouturejewellery\.in\/product\/([^\/"]+)\//g;
    let sm;
    let skuUpdated = 0;

    while ((sm = skuRegex.exec(html)) !== null) {
      const slug = sm[3];
      const sku = sm[2];
      if (sku) {
        const result = await Product.updateOne({ slug }, { $set: { sku } });
        if (result.modifiedCount > 0) skuUpdated++;
      }
    }
    console.log(`  Updated SKUs for ${skuUpdated} products`);
  }

  // ── 7. Summary ──
  const totalProducts = await Product.countDocuments();
  const categoryCount = await Category.countDocuments();
  console.log(`\n═══ IMPORT COMPLETE ═══`);
  console.log(`  Products: ${totalProducts}`);
  console.log(`  Categories: ${categoryCount}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
