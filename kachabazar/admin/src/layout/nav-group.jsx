import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavGroup({ title, items }) {
  const { state } = useSidebar();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(title)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={pathname} />;

          if (state === "collapsed")
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                href={pathname}
              />
            );

          return (
            <SidebarMenuCollapsible key={key} item={item} href={pathname} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({ item, href }) => {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={!item.outside && checkIsActive(href, item)}
        tooltip={t(item.title)}
      >
        {item.outside ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpenMobile(false)}
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </a>
        ) : (
          <Link to={item.url} onClick={() => setOpenMobile(false)}>
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({ item, href }) => {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(item.title)}>
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={!subItem.outside && checkIsActive(href, subItem)}
                  className=""
                >
                  {subItem.outside ? (
                    <a
                      href={subItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpenMobile(false)}
                    >
                      {subItem.icon && <subItem.icon />}
                      <span>{t(subItem.title)}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </a>
                  ) : (
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon />}
                      <span>{t(subItem.title)}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  )}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({ item, href }) => {
  const { t } = useTranslation();
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={t(item.title)}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {t(item.title)} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              {sub.outside ? (
                <a href={sub.url} target="_blank" rel="noopener noreferrer">
                  {sub.icon && <sub.icon />}
                  <span className="max-w-[13rem] text-wrap">
                    {t(sub.title)}
                  </span>
                  {sub.badge && (
                    <span className="ml-auto text-xs">{sub.badge}</span>
                  )}
                </a>
              ) : (
                <Link
                  to={sub.url}
                  className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
                >
                  {sub.icon && <sub.icon />}
                  <span className="max-w-[13rem] text-wrap">
                    {t(sub.title)}
                  </span>
                  {sub.badge && (
                    <span className="ml-auto text-xs">{sub.badge}</span>
                  )}
                </Link>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(href, item, mainNav = false) {
  return (
    href === item.url ||
    href.split("?")[0] === item.url ||
    !!item?.items?.filter((i) => i.url === href).length ||
    (mainNav &&
      href.split("/")[1] !== "" &&
      href.split("/")[1] === item?.url?.split("/")[1])
  );
}
