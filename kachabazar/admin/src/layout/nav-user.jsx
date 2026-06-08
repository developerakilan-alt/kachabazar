import { useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { ChevronsUpDown, LogOut, Settings, LayoutGrid } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AdminContext } from "@/context/AdminContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";

export function NavUser() {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isMobile } = useSidebar();
  const { showingTranslateValue } = useUtilsFunction();

  const adminName = showingTranslateValue(adminInfo?.name) || "Admin";
  const isDeliveryBoy = adminInfo?.role === "delivery-boy";

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    window.location.replace(`${import.meta.env.VITE_APP_ADMIN_URL}/login`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={adminInfo?.image} alt="Admin" />
                <AvatarFallback className="rounded-lg">
                  {adminInfo?.email?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{adminName}</span>
                <span className="truncate text-xs">{adminInfo?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[14rem] rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={adminInfo?.image} alt="Admin" />
                  <AvatarFallback className="rounded-lg">
                    {adminInfo?.email?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{adminName}</span>
                  <span className="truncate text-xs">{adminInfo?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={isDeliveryBoy ? "/my-dashboard" : "/dashboard"}>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/edit-profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
