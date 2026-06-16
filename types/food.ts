export interface NormalizedFoodSummary {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner: string | null;
  servingSize: number | null;
  servingSizeUnit: string | null;
  householdServingFullText?: string | null;
}
