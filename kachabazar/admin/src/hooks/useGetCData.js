import { AdminContext } from "@/context/AdminContext";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const allAccess = [
  "dashboard", "products", "categories", "attributes", "coupons",
  "campaigns", "campaign", "customers", "orders", "delivery-boys",
  "delivery-boy", "my-dashboard", "our-staff", "settings", "themes",
  "languages", "currencies", "store", "customization", "store-settings",
  "product", "order", "edit-profile", "customer-order", "notifications",
  "coming-soon",
];

const useGetCData = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;

  const location = useLocation();
  const segments = location?.pathname?.split("?")[0].split("/").filter(Boolean);
  const path = segments ? (segments[1] || segments[0] || "") : "";

  const [role, setRole] = useState();
  const [accessList, setAccessList] = useState(allAccess);

  const decryptData = async (encryptedData, iv) => {
    const secretKey = import.meta.env.VITE_APP_ENCRYPT_PASSWORD;

    if (!crypto.subtle) {
      throw new Error("Web Crypto API not available (non-secure context)");
    }

    const keyBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(secretKey)
    );

    const encryptedArray = new Uint8Array(
      encryptedData.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const ivBuffer = new Uint8Array(
      iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: ivBuffer,
        },
        await crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-CBC" },
          false,
          ["decrypt"]
        ),
        encryptedArray
      );

      const decodedData = new TextDecoder().decode(decrypted);
      return decodedData;
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDecryptedData = async () => {
      if (adminInfo?.data && adminInfo?.iv) {
        try {
          const decryptedString = await decryptData(
            adminInfo.data,
            adminInfo.iv
          );
          if (!decryptedString) return;
          const decryptedArray = JSON.parse(decryptedString);

          const lastElement = decryptedArray.pop();
          setRole(lastElement);
          setAccessList(decryptedArray);
        } catch (error) {
          console.error("Failed to decrypt and parse data:", error);
        }
      }
    };

    fetchDecryptedData();
  }, [adminInfo]);

  return {
    role,
    path,
    accessList,
  };
};

export default useGetCData;