import { useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminContext } from "@/context/AdminContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";

export function ProfileDropdown() {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const { showingTranslateValue } = useUtilsFunction();

  const adminName = showingTranslateValue(adminInfo?.name) || "Admin";
  const isDeliveryBoy = adminInfo?.role === "delivery-boy";

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    window.location.replace(`${import.meta.env.VITE_APP_ADMIN_URL}/login`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 items-center rounded-full border md:m-auto"
        >
          <Avatar className="h-8 w-6">
            <AvatarImage src={adminInfo?.image} alt="admin" />
            <AvatarFallback>{adminName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{adminName}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {adminInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/edit-profile">
              <FiUser className="mr-2 h-4 w-4" />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {!isDeliveryBoy && (
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <FiSettings className="mr-2 h-4 w-4" />
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <FiLogOut className="mr-2 h-4 w-4" />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
