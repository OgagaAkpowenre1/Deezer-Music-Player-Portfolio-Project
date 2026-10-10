import { NavLink } from "react-router-dom";
import { House, Search } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: House, end: true },
  { to: "/search", label: "Search", Icon: Search, end: false },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden grid grid-cols-2 bg-black pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              isActive ? "text-white" : "text-sp-sub"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={24}
                strokeWidth={isActive ? 2.75 : 2}
                fill={isActive && label === "Home" ? "currentColor" : "none"}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
