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
        "text-sm font-medium transition-colors",
        active ? "text-brand-800" : "text-gray-500 hover:text-gray-900",
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const isMealBuilder = pathname.startsWith("/meal-builder");

  return (
    <header className="border-b border-gray-200/80 bg-white">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">MacroMate</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink href="/meal-builder" active={isMealBuilder}>
            Meal Builder
          </NavLink>
          <NavLink href="/" active={pathname === "/" && !isMealBuilder}>
            About
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/meal-builder"
            className="rounded-full p-2 text-gray-400 hover:bg-surface-muted hover:text-gray-600"
            aria-label="Search foods"
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
