import { useContext } from "react";
import { FiCheck, FiGlobe } from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function LanguageDropdown() {
  const { handleLanguageChange, currLang, lang } = useContext(SidebarContext);
  const { languages, langError, langLoading, showingTranslateValue } =
    useUtilsFunction();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-lg"
        >
          <span>
            {currLang?.flag || <FiGlobe className="h-5 w-5" />}
            <span className="text-sm font-medium">{lang?.toUpperCase()}</span>
          </span>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 p-1">
        {!langError &&
          !langLoading &&
          languages?.map((language) => (
            <DropdownMenuItem
              key={language._id || language.code}
              onClick={() => handleLanguageChange(language)}
              className="flex cursor-pointer items-center justify-between gap-2 px-2 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{language.flag}</span>
                <span>{showingTranslateValue(language.name)}</span>
              </div>
              {lang === language.code && (
                <FiCheck className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
