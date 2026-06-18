import { NavGroup } from "@/layout/nav-group";
import { NavUser } from "@/layout/nav-user";
import logoDark from "@/assets/img/logo/logo-color.png";
import logoLight from "@/assets/img/logo/logo-dark.png";
import { useTheme } from "@/context/ThemeContext";
import useGetCData from "@/hooks/useGetCData";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useContext } from "react";
import { AdminContext } from "@/context/AdminContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/data/sidebar-data";

export function AppSidebar({ ...props }) {
  const { theme } = useTheme();
  const { accessList } = useGetCData();
  const { globalSetting, fixUrl } = useUtilsFunction();
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const isDeliveryBoy = adminInfo?.role === "delivery-boy";

  // Resolve store URL: globalSetting > env var > localhost fallback
  const storeUrl =
    globalSetting?.store_url ||
    import.meta.env.VITE_APP_STORE_URL ||
    "http://localhost:3000";

  // Filter sidebar based on role/access
  const getFilteredSidebar = () => {
    return sidebarData.navGroups
      .map((group) => {
        const filteredItems = group.items
          .map((item) => {
            // Skip deliveryBoyOnly items if user is not a delivery boy
            if (item.deliveryBoyOnly && !isDeliveryBoy) {
              return null;
            }

            if (item.items) {
              const validSubs = item.items.filter((sub) => {
                const routeKey = sub.url?.split("?")[0].split("/")[1];
                return (
                  accessList.includes(routeKey) ||
                  (accessList.includes("settings") && routeKey === "themes")
                );
              });
              if (validSubs.length > 0) {
                // Inject dynamic store URL for "View Store" items
                const updatedSubs = validSubs.map((sub) =>
                  sub.outside ? { ...sub, url: storeUrl } : sub,
                );
                return { ...item, items: updatedSubs };
              }
              return null;
            }
            const routeKey = item.url?.split("?")[0].split("/")[1];
            if (routeKey && accessList.includes(routeKey)) {
              return item.outside ? { ...item, url: storeUrl } : item;
            }
            return null;
          })
          .filter(Boolean);

        if (filteredItems.length > 0) {
          return { ...group, items: filteredItems };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredNavGroups = getFilteredSidebar();

  return (
    <Sidebar className="" collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div>
            <img
              src={
                theme === "dark"
                  ? fixUrl(globalSetting?.logo) || logoLight
                  : fixUrl(globalSetting?.logo_light) || logoDark
              }
              alt="hautecouturejewellery"
              className="h-8 w-auto object-contain"
            />
          </div>
          {/* <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">hautecouturejewellery</span>
          </div> */}
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
