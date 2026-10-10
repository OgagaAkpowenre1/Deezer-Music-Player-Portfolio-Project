import { Link, NavLink } from "react-router-dom";
import { AudioLines, House, Search } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: House, end: true },
  { to: "/search", label: "Search", Icon: Search, end: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col gap-2">
      <div className="rounded-lg bg-sp-panel px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 px-3 pb-5">
          <span className="grid size-8 place-items-center rounded-full bg-sp-green text-black">
            <AudioLines size={18} strokeWidth={2.75} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            SoundVault
          </span>
        </Link>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-md px-3 py-2.5 text-base font-bold transition-colors ${
                  isActive ? "text-white" : "text-sp-sub hover:text-white"
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
      </div>

      <div className="flex-1 rounded-lg bg-sp-panel p-5">
        <h2 className="text-base font-bold">Preview player</h2>
        <p className="mt-2 text-sm leading-relaxed text-sp-sub">
          Songs play 30-second previews from the Deezer catalog. Search for
          artists, albums and tracks, or test your ear with the Song Guesser on
          the home page.
        </p>
      </div>
    </aside>
  );
}
