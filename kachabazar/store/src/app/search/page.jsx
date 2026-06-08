import { Suspense } from "react";
import { cookies } from "next/headers";

// Server Actions from lib
import { searchProducts } from "@lib/actions/product.actions";
import { getAttributes } from "@lib/actions/attribute.actions";
import { getCategories } from "@lib/actions/category.actions";
import { getGlobalSettings } from "@lib/actions/settings.actions";

// Client Component
import SearchClient from "./_components/search-client";
import SearchLoading from "./loading";

// Metadata
export async function generateMetadata({ searchParams }) {
  const { query, _id } = await searchParams;

  return {
    title: query ? `Search: ${query}` : "Search Products",
    description: query
      ? `Find the best deals on ${query}`
      : "Search and discover amazing products",
    keywords: query
      ? [query, "search", "products", "deals"]
      : ["search", "products"],
  };
}

const Search = async ({ searchParams }) => {
  const { _id: category, query } = await searchParams;

  // Fetch all data in parallel
  const [
    { products, error: productsError },
    { attributes, error: attributesError },
    { categories, error: categoriesError },
    { globalSetting, error: settingsError },
  ] = await Promise.all([
    searchProducts({
      category: category || "",
      query: query || "",
    }),
    getAttributes(),
    getCategories(),
    getGlobalSettings(),
  ]);

  const error =
    productsError || attributesError || categoriesError || settingsError;

  // Read layout from cookie first, then admin setting
  const cookieStore = await cookies();
  const storeLayout =
    cookieStore.get("_store_layout")?.value ||
    globalSetting?.store_layout ||
    "default";

  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchClient
        products={products || []}
        attributes={attributes || []}
        categories={categories || []}
        searchQuery={query || ""}
        selectedCategory={category || ""}
        error={error}
        storeLayout={storeLayout}
      />
    </Suspense>
  );
};

export default Search;
