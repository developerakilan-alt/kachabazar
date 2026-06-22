import { baseURL, handleResponse, resilientFetch } from "@services/CommonService";

/**
 * Fetch all showing (active) themes from the API.
 */
const getShowingThemes = async () => {
  try {
    const response = await resilientFetch(`${baseURL}/theme/show`, {
      next: { revalidate: 300 }, // revalidate every 5 minutes
    });

    const themes = await handleResponse(response);
    return { themes };
  } catch (error) {
    return { themes: [], error: error.message };
  }
};

/**
 * Fetch the default theme.
 */
const getDefaultTheme = async () => {
  try {
    const response = await resilientFetch(`${baseURL}/theme/default`, {
      next: { revalidate: 300 },
    });

    const theme = await handleResponse(response);
    return { theme };
  } catch (error) {
    return { theme: null, error: error.message };
  }
};

/**
 * Fetch all showing (active) store layouts from the API.
 */
const getShowingLayouts = async () => {
  try {
    const response = await resilientFetch(`${baseURL}/store-layout/show`, {
      next: { revalidate: 300 },
    });

    const layouts = await handleResponse(response);
    return { layouts };
  } catch (error) {
    return { layouts: [], error: error.message };
  }
};

/**
 * Fetch the default store layout.
 */
const getDefaultLayout = async () => {
  try {
    const response = await resilientFetch(`${baseURL}/store-layout/default`, {
      next: { revalidate: 300 },
    });

    const layout = await handleResponse(response);
    return { layout };
  } catch (error) {
    return { layout: null, error: error.message };
  }
};

export { getShowingThemes, getDefaultTheme, getShowingLayouts, getDefaultLayout };
