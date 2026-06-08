import { baseURL, handleResponse, resilientFetch } from "@services/CommonService";

const getShowingCategory = async () => {
  try {
    const response = await resilientFetch(`${baseURL}/category/show`, {
      // cache: "no-cache",
      next: { revalidate: 120 }, // revalidate every 2 minutes
    });

    const categories = await handleResponse(response);
    return { categories, error: null, loading: false };
  } catch (error) {
    return { categories: [], error: error.message, loading: false };
  }
};

export { getShowingCategory };
