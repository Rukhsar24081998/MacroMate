"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-1 text-sm font-medium transition-colors",
        active ? "text-brand-800" : "text-gray-600 hover:text-gray-900",
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
      {active ? (
        <span className="absolute -bottom-4 left-0 h-0.5 w-full rounded-full bg-brand-700" />
      ) : null}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const isMealBuilder = pathname.startsWith("/meal-builder");

  return (
    <header className="border-b border-gray-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:gap-8 lg:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-brand-800">
          MacroMate
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="/meal-builder" active={isMealBuilder}>
            Meal Builder
          </NavLink>
          <NavLink href="/" active={pathname === "/" && !isMealBuilder}>
            About
          </NavLink>
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 items-center lg:flex">
          <label className="relative w-full">
            <span className="sr-only">Global search</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              readOnly
              onFocus={(e) => {
                e.currentTarget.blur();
                window.location.href = "/meal-builder";
              }}
              placeholder="Global search..."
              className="w-full rounded-full border border-gray-200 bg-surface-muted py-2 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/20"
            />
          </label>
        </div>

        <button
          type="button"
          disabled
          title="Sign in coming soon"
          className="hidden shrink-0 rounded-full bg-brand-800 px-5 py-2 text-sm font-medium text-white opacity-90 md:inline-flex"
        >
          Sign In
        </button>

        {isMealBuilder ? (
          <div
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-gray-500 md:hidden"
            aria-hidden="true"
          >
            RK
          </div>
        ) : null}
      </div>
    </header>
  );
}
