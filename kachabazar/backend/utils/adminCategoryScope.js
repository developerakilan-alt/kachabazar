const mongoose = require("mongoose");

const orderedCategoryAliases = [
  ["choker", "chokers"],
  ["necklace", "necklaces"],
  ["haram", "harams"],
  ["earing", "earring", "earrings"],
  ["bangles&bracelets", "bangles bracelets", "bangles", "bracelets"],
  ["bridalsets", "bridal sets", "bridal set"],
  ["american diamonds", "american diamond", "diamond look like"],
  ["anklets", "anklet"],
  ["hip belts", "hip belt", "hip chains", "hip chain"],
  ["hair accessories", "hair accessory", "hair bands clips", "hair bands & clips"],
  ["daily wears", "daily wear"],
];

const normalizeCategoryName = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const aliasOrder = new Map();

orderedCategoryAliases.forEach((aliases, index) => {
  aliases.forEach((alias) => {
    aliasOrder.set(normalizeCategoryName(alias), index);
  });
});

const getCategoryOrder = (category) => {
  const values = [
    category?.name?.en,
    category?.slug,
    category?.parentName,
    category?.id,
  ];

  for (const value of values) {
    const normalized = normalizeCategoryName(value);
    if (aliasOrder.has(normalized)) {
      return aliasOrder.get(normalized);
    }
  }

  return Number.MAX_SAFE_INTEGER;
};

const isScopedCategory = (category) =>
  getCategoryOrder(category) !== Number.MAX_SAFE_INTEGER;

const sortScopedCategories = (categories) =>
  [...categories].sort((a, b) => {
    const orderDiff = getCategoryOrder(a) - getCategoryOrder(b);
    if (orderDiff !== 0) return orderDiff;

    return normalizeCategoryName(a?.name?.en).localeCompare(
      normalizeCategoryName(b?.name?.en),
    );
  });

const getScopedCategoryIds = async (Category) => {
  const categories = await Category.find({}).select("_id name slug parentName id").lean();
  return sortScopedCategories(categories)
    .filter(isScopedCategory)
    .map((category) => new mongoose.Types.ObjectId(category._id));
};

const filterScopedCategories = (categories) =>
  sortScopedCategories(categories).filter(isScopedCategory);

module.exports = {
  filterScopedCategories,
  getScopedCategoryIds,
  isScopedCategory,
  sortScopedCategories,
  getCategoryOrder,
  normalizeCategoryName,
};
