import { MealProvider } from "@/providers/meal-provider";

export default function MealBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MealProvider>{children}</MealProvider>;
}
