import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

const SidebarSubMenu = ({ route }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <li className="relative px-6 py-3" key={route.name}>
        <button
          className="inline-flex items-center justify-between focus:outline-none w-full text-sm font-semibold transition-colors duration-150 hover:text-primary "
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
        >
          <span className="inline-flex items-center">
            <route.icon className="w-5 h-5" aria-hidden="true" />
            <span className="ml-4 mt-1">{t(`${route.name}`)}</span>
            <span className="pl-4 mt-1">
              {open ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
            </span>
          </span>
        </button>
        {open && (
          <ul
            className="p-2  overflow-hidden text-sm font-medium text-muted-foreground rounded-md  "
            aria-label="submenu"
          >
            {route.routes.map((child, i) => {
              const isActive = location.pathname === child.path;
              return (
                <li key={i + 1} className="relative">
                  {child?.outside ? (
                    <a
                      href={import.meta.env.VITE_APP_STORE_URL}
                      target="_blank"
                      className="flex items-center font-serif py-1 text-sm text-muted-foreground hover:text-primary cursor-pointer"
                      rel="noreferrer"
                    >
                      {isActive && (
                        <span
                          className="absolute inset-y-0 left-0 w-1 bg-primary rounded-tr-lg rounded-br-lg"
                          aria-hidden="true"
                        ></span>
                      )}
                      <span className="text-xs text-muted-foreground pr-1">
                        <IoRemoveSharp />
                      </span>
                      <span className="text-muted-foreground hover:text-primary ">
                        {t(`${child.name}`)}
                      </span>
                    </a>
                  ) : (
                    <NavLink
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center font-serif py-1 text-sm cursor-pointer ${
                          isActive
                            ? "text-primary "
                            : "text-muted-foreground hover:text-primary"
                        }`
                      }
                      rel="noreferrer"
                    >
                      {({ isActive: navActive }) => (
                        <>
                          {navActive && (
                            <span
                              className="absolute inset-y-0 left-0 w-1 bg-primary rounded-tr-lg rounded-br-lg"
                              aria-hidden="true"
                            ></span>
                          )}
                          <span className="text-xs text-muted-foreground pr-1">
                            <IoRemoveSharp />
                          </span>
                          <span className="hover:text-primary ">
                            {t(`${child.name}`)}
                          </span>
                        </>
                      )}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </li>
    </>
  );
};

export default SidebarSubMenu;
