import { Search } from "@/components/common/Search";
import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { ThemePicker } from "@/components/dropdown/ThemePicker";
import { LanguageDropdown } from "@/components/dropdown/LanguageDropdown";
import { NotificationDropdown } from "@/components/dropdown/NotificationDropdown";
import { ProfileDropdown } from "@/components/dropdown/ProfileDropdown";
import { CommandMenu } from "@/components/common/CommandMenu";
import { Header } from "@/layout/header";

const RootLayout = ({ children, navFixed = true, mainClass = "" }) => {
  return (
    <>
      <Header fixed={navFixed}>
        <div className="ml-auto flex items-center space-x-1 md:space-x-4">
          <Search />
          <LanguageDropdown />
          <ThemeSwitch />
          <ThemePicker />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>
      <CommandMenu />
      {children}
    </>
  );
};

export default RootLayout;
