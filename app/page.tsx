import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          USDA-powered nutrition
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
          Build meals. Track macros. Hit your goals.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          MacroMate helps you search ingredients, set quantities, and calculate calories and
          macronutrients in under a minute.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/meal-builder">
            <Button className="min-w-[160px]">Build a Meal</Button>
          </Link>
          <Link href="/meal-builder">
            <Button variant="outline">Try Meal Builder</Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/screens/meal-builder-desktop.png"
          alt="MacroMate meal builder preview"
          className="h-full w-full object-cover object-top"
        />
      </Card>
    </div>
  );
}
