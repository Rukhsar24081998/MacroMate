import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">MacroMate</h1>
      <p className="mt-2 max-w-xl text-gray-600">
        Build custom meals and calculate calories and macronutrients in under a
        minute using trusted USDA nutrition data.
      </p>
      <div className="mt-6">
        <Link href="/meal-builder">
          <Button>Build a Meal</Button>
        </Link>
      </div>
    </div>
  );
}
