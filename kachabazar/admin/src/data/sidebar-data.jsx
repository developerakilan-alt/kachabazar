import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiGlobe,
  FiTarget,
  FiShoppingCart,
  FiTag,
  FiLayers,
  FiGift,
  FiFileText,
  FiStar,
  FiEye,
  FiEdit,
  FiTruck,
  FiLayout,
} from "react-icons/fi";

export const sidebarData = {
  navGroups: [
    {
      title: "SidebarGeneral",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: FiGrid,
        },
        {
          title: "My Dashboard",
          url: "/my-dashboard",
          icon: FiTruck,
          deliveryBoyOnly: true, // Only show for delivery boy role
        },
      ],
    },
    {
      title: "Catalog",
      items: [
        {
          title: "Products",
          icon: FiShoppingCart,
          url: "/products",
        },
        {
          title: "Categories",
          icon: FiTag,
          url: "/categories",
        },
        {
          title: "Attributes",
          icon: FiLayers,
          url: "/attributes",
        },
        {
          title: "Coupons",
          icon: FiGift,
          url: "/coupons",
        },
        {
          title: "Campaigns",
          icon: FiTarget,
          url: "/campaigns",
        },
      ],
    },
    {
      title: "SidebarSales",
      items: [
        {
          title: "SidebarOrders",
          icon: FiCompass,
          url: "/orders",
        },
        // {
        //   title: "DeliveryBoys",
        //   icon: FiTruck,
        //   url: "/delivery-boys",
        // },
        {
          title: "Customers",
          icon: FiUsers,
          url: "/customers",
        },
      ],
    },
    // {
    //   title: "SidebarStaff",
    //   items: [
    //     {
    //       title: "OurStaff",
    //       icon: FiUser,
    //       url: "/our-staff",
    //     },
    //   ],
    // },
    {
      title: "SidebarSettings",
      items: [
        {
          title: "Setting",
          icon: FiSettings,
          items: [
            {
              title: "GlobalSettings",
              url: "/settings",
              icon: FiSettings,
            },
            {
              title: "SidebarThemes",
              url: "/themes",
              icon: FiStar,
            },
          ],
        },
      ],
    },
    // {
    //   title: "International",
    //   items: [
    //     {
    //       title: "SidebarLocalization",
    //       icon: FiGlobe,
    //       items: [
    //         {
    //           title: "SidebarLanguages",
    //           url: "/languages",
    //           icon: FiFileText,
    //         },
    //         {
    //           title: "Currencies",
    //           url: "/currencies",
    //           icon: FiSlack,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: "OnlineStore",
      items: [
        {
          title: "OnlineStore",
          icon: FiTarget,
          items: [
            {
              title: "SidebarViewStore",
              url: "/store",
              icon: FiEye,
              outside: true,
            },
            {
              title: "SidebarStoreCustomization",
              url: "/store/customization",
              icon: FiEdit,
            },
            {
              title: "StoreSettings",
              url: "/store/store-settings",
              icon: FiSettings,
            },
            {
              title: "StoreLayouts",
              url: "/store-layouts",
              icon: FiLayout,
            },
          ],
        },
      ],
    },
  ],
};
