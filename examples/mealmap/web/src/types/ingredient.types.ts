export type IngredientCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'other';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  createdAt: string;
}
