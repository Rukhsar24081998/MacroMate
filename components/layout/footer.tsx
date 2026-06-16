"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsLgUp } from "@/lib/hooks/use-breakpoint";

export function Footer() {
  const pathname = usePathname();
  const isLgUp = useIsLgUp();
  const hideOnDashboard = pathname.startsWith("/meal-builder") && isLgUp;

  if (hideOnDashboard) return null;

  return (
    <footer className="mt-12 border-t border-gray-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p className="font-medium text-gray-700">MacroMate</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-gray-800">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-gray-800">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-gray-800">
            Contact Support
          </Link>
        </nav>
        <p className="text-gray-400">© 2024 MacroMate. All rights reserved.</p>
      </div>
    </footer>
  );
}
