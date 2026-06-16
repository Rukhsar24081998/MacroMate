import Link from "next/link";

/** App header with MacroMate branding — Phase 0 shell */
export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          MacroMate
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link
            href="/meal-builder"
            className="text-gray-600 hover:text-gray-900"
          >
            Meal Builder
          </Link>
        </nav>
      </div>
    </header>
  );
}
