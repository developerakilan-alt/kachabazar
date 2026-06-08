const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const Campaign = require("../models/Campaign");
const Product = require("../models/Product");

/**
 * Add a new campaign
 */
const addCampaign = async (req, res) => {
  try {
    const { products, slug, isFeatured } = req.body;

    // Auto-generate slug if not provided
    let campaignSlug = slug;
    if (!campaignSlug && req.body.title) {
      const titleText =
        typeof req.body.title === "object"
          ? req.body.title.en || Object.values(req.body.title)[0] || "campaign"
          : req.body.title;
      campaignSlug = titleText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      // Add timestamp suffix to ensure uniqueness
      const existing = await Campaign.findOne({ slug: campaignSlug });
      if (existing) {
        campaignSlug = `${campaignSlug}-${Date.now()}`;
      }
      req.body.slug = campaignSlug;
    }

    // Check slug uniqueness
    const existingSlug = await Campaign.findOne({ slug: campaignSlug });
    if (existingSlug) {
      return res.status(400).send({ message: "Campaign slug already exists!" });
    }

    // If this campaign is featured, un-feature all others
    if (isFeatured) {
      await Campaign.updateMany(
        { isFeatured: true },
        { $set: { isFeatured: false } },
      );
    }

    // Validate products aren't in other active campaigns
    if (products && products.length > 0) {
      const productIds = products.map((p) => p.product);
      const conflicting = await Campaign.find({
        status: "show",
        endTime: { $gte: new Date() },
        "products.product": { $in: productIds },
        "products.isActive": true,
      });

      if (conflicting.length > 0) {
        const conflictProductIds = new Set();
        conflicting.forEach((c) => {
          c.products.forEach((p) => {
            if (productIds.includes(p.product.toString()) && p.isActive) {
              conflictProductIds.add(p.product.toString());
            }
          });
        });

        if (conflictProductIds.size > 0) {
          return res.status(400).send({
            message: `${conflictProductIds.size} product(s) are already in other active campaigns. A product can only belong to one active campaign.`,
            conflictProductIds: Array.from(conflictProductIds),
          });
        }
      }

      // Validate stock limits don't exceed product stock
      const productDocs = await Product.find({
        _id: { $in: productIds },
      }).lean();
      const productMap = {};
      productDocs.forEach((p) => (productMap[p._id.toString()] = p));

      for (const cp of products) {
        const prod = productMap[cp.product];
        if (!prod) {
          return res.status(400).send({
            message: `Product ${cp.product} not found!`,
          });
        }
        if (cp.stockLimit > prod.stock) {
          return res.status(400).send({
            message: `Stock limit (${cp.stockLimit}) for "${prod.title?.en || "product"}" exceeds available stock (${prod.stock}).`,
          });
        }
      }
    }

    const newCampaign = new Campaign(req.body);
    await newCampaign.save();
    res.status(201).send({ message: "Campaign Added Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Get all campaigns (admin - paginated)
 */
const getAllCampaigns = async (req, res) => {
  try {
    const { status, page, limit, search, sortBy, sortOrder, campaignStatus } =
      req.query;

    const queryObject = {};

    if (status) {
      queryObject.status = { $regex: `${status}`, $options: "i" };
    }

    // Filter by campaign timing status
    const now = new Date();
    if (campaignStatus === "active") {
      queryObject.startTime = { $lte: now };
      queryObject.endTime = { $gte: now };
    } else if (campaignStatus === "upcoming") {
      queryObject.startTime = { $gt: now };
    } else if (campaignStatus === "expired") {
      queryObject.endTime = { $lt: now };
    }

    // If no page/limit, return all
    if (!page && !limit) {
      const campaigns = await Campaign.find(queryObject)
        .populate("products.product", "title image prices stock slug")
        .sort({ _id: -1 });
      return res.send(campaigns);
    }

    // Search across multilingual title
    if (search) {
      const { languageCodes } = require("../utils/data");
      const titleQueries = languageCodes.map((lang) => ({
        [`title.${lang}`]: { $regex: search, $options: "i" },
      }));
      queryObject.$or = [
        ...titleQueries,
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Campaign.countDocuments(queryObject);
    const campaigns = await Campaign.find(queryObject)
      .populate("products.product", "title image prices stock slug sales")
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      campaigns,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Get active/showing campaigns for store (public)
 */
const getShowingCampaigns = async (req, res) => {
  try {
    const now = new Date();
    const campaigns = await Campaign.find({
      status: "show",
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate(
        "products.product",
        "title image prices stock slug sales category isCombination variants",
      )
      .sort({ isFeatured: -1, createdAt: -1 });

    // Filter out sold-out products from response
    const filtered = campaigns.map((campaign) => {
      const c = campaign.toObject({ virtuals: true });
      c.products = c.products.filter(
        (p) => p.isActive && p.soldCount < p.stockLimit && p.product,
      );
      return c;
    });

    res.send(filtered);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Get featured campaign for home page (public)
 */
const getFeaturedCampaign = async (req, res) => {
  try {
    const now = new Date();
    const campaign = await Campaign.findOne({
      status: "show",
      isFeatured: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate(
        "products.product",
        "title image prices stock slug sales category isCombination variants",
      )
      .sort({ createdAt: -1 });

    if (!campaign) {
      return res.send(null);
    }

    const c = campaign.toObject({ virtuals: true });
    c.products = c.products.filter(
      (p) => p.isActive && p.soldCount < p.stockLimit && p.product,
    );

    res.send(c);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Get all campaigns for flash sale page (public)
 */
const getAllShowingCampaigns = async (req, res) => {
  try {
    const now = new Date();
    const campaigns = await Campaign.find({
      status: "show",
      endTime: { $gte: now },
    })
      .populate(
        "products.product",
        "title image prices stock slug sales category isCombination variants",
      )
      .sort({ startTime: 1 });

    const filtered = campaigns.map((campaign) => {
      const c = campaign.toObject({ virtuals: true });
      c.products = c.products.filter(
        (p) => p.isActive && p.soldCount < p.stockLimit && p.product,
      );
      return c;
    });

    res.send(filtered);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Get campaign by slug (public)
 */
const getCampaignBySlug = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      slug: req.params.slug,
      status: "show",
    }).populate(
      "products.product",
      "title image prices stock slug sales category isCombination variants description",
    );

    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found!" });
    }

    const c = campaign.toObject({ virtuals: true });
    res.send(c);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Get campaign by ID (admin)
 */
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "products.product",
      "title image prices stock slug sales",
    );
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found!" });
    }
    res.send(campaign);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Update a campaign
 */
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found!" });
    }

    const { products, slug } = req.body;

    // Check slug uniqueness (exclude current)
    if (slug && slug !== campaign.slug) {
      const existingSlug = await Campaign.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existingSlug) {
        return res
          .status(400)
          .send({ message: "Campaign slug already exists!" });
      }
    }

    // Validate products aren't in other active campaigns
    if (products && products.length > 0) {
      const productIds = products.map((p) => p.product);
      const conflicting = await Campaign.find({
        _id: { $ne: req.params.id },
        status: "show",
        endTime: { $gte: new Date() },
        "products.product": { $in: productIds },
        "products.isActive": true,
      });

      if (conflicting.length > 0) {
        const conflictProductIds = new Set();
        conflicting.forEach((c) => {
          c.products.forEach((p) => {
            if (productIds.includes(p.product.toString()) && p.isActive) {
              conflictProductIds.add(p.product.toString());
            }
          });
        });

        if (conflictProductIds.size > 0) {
          return res.status(400).send({
            message: `${conflictProductIds.size} product(s) are already in other active campaigns.`,
            conflictProductIds: Array.from(conflictProductIds),
          });
        }
      }
    }

    // Merge title translations
    if (req.body.title) {
      campaign.title = { ...campaign.title, ...req.body.title };
    }
    if (req.body.description) {
      campaign.description = {
        ...campaign.description,
        ...req.body.description,
      };
    }

    if (req.body.slug) campaign.slug = req.body.slug;
    if (req.body.banner !== undefined) campaign.banner = req.body.banner;
    if (req.body.startTime) campaign.startTime = req.body.startTime;
    if (req.body.endTime) campaign.endTime = req.body.endTime;
    if (req.body.showSection) campaign.showSection = req.body.showSection;
    if (req.body.isFeatured !== undefined) {
      // If setting this campaign as featured, un-feature all others first
      if (req.body.isFeatured) {
        await Campaign.updateMany(
          { _id: { $ne: req.params.id }, isFeatured: true },
          { $set: { isFeatured: false } },
        );
      }
      campaign.isFeatured = req.body.isFeatured;
    }
    if (req.body.status) campaign.status = req.body.status;
    if (products) campaign.products = products;

    await campaign.save();
    res.send({ message: "Campaign Updated Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Update campaign status (show/hide)
 */
const updateStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    await Campaign.updateOne(
      { _id: req.params.id },
      { $set: { status: newStatus } },
    );
    res.status(200).send({
      message: `Campaign ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Record a sale for a campaign product (called during order processing)
 */
const recordCampaignSale = async (req, res) => {
  try {
    const { campaignId, productId, quantity } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found!" });
    }

    const campaignProduct = campaign.products.find(
      (p) => p.product.toString() === productId,
    );
    if (!campaignProduct) {
      return res.status(404).send({ message: "Product not in this campaign!" });
    }

    const newSoldCount = campaignProduct.soldCount + (quantity || 1);

    // Auto-deactivate if stock limit reached
    if (newSoldCount >= campaignProduct.stockLimit) {
      campaignProduct.isActive = false;
    }

    campaignProduct.soldCount = newSoldCount;
    await campaign.save();

    res.send({
      message: "Sale recorded successfully!",
      soldCount: newSoldCount,
      remaining: Math.max(0, campaignProduct.stockLimit - newSoldCount),
      isActive: campaignProduct.isActive,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Check if a product is in any active campaign (utility for orders)
 */
const checkProductCampaign = async (req, res) => {
  try {
    const { productId } = req.params;
    const now = new Date();

    const campaign = await Campaign.findOne({
      status: "show",
      startTime: { $lte: now },
      endTime: { $gte: now },
      "products.product": productId,
      "products.isActive": true,
    });

    if (!campaign) {
      return res.send({ inCampaign: false });
    }

    const campaignProduct = campaign.products.find(
      (p) => p.product.toString() === productId && p.isActive,
    );

    if (
      !campaignProduct ||
      campaignProduct.soldCount >= campaignProduct.stockLimit
    ) {
      return res.send({ inCampaign: false });
    }

    res.send({
      inCampaign: true,
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      campaignPrice: campaignProduct.campaignPrice,
      originalPrice: campaignProduct.originalPrice,
      discountType: campaignProduct.discountType,
      discountValue: campaignProduct.discountValue,
      remaining: campaignProduct.stockLimit - campaignProduct.soldCount,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Delete a campaign
 */
const deleteCampaign = async (req, res) => {
  try {
    await Campaign.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: "Campaign Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Delete many campaigns
 */
const deleteManyCampaigns = async (req, res) => {
  try {
    await Campaign.deleteMany({ _id: req.body.ids });
    res.send({ message: "Campaigns Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Update many campaigns
 */
const updateManyCampaigns = async (req, res) => {
  try {
    await Campaign.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
        },
      },
      { multi: true },
    );
    res.send({ message: "Campaigns Updated Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  addCampaign,
  getAllCampaigns,
  getShowingCampaigns,
  getFeaturedCampaign,
  getAllShowingCampaigns,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  updateStatus,
  recordCampaignSale,
  checkProductCampaign,
  deleteCampaign,
  deleteManyCampaigns,
  updateManyCampaigns,
};
