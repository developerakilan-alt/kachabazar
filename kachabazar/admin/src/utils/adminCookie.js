import Cookies from "js-cookie";

export const getAdminInfoFromCookie = () => {
  const adminInfo = Cookies.get("adminInfo");

  if (!adminInfo) return null;

  try {
    return JSON.parse(adminInfo);
  } catch (err) {
    console.error("Failed to parse adminInfo cookie", err);
    Cookies.remove("adminInfo");
    return null;
  }
};
