import type { RecipeIngredient } from '../types/recipe.types.ts';

export function scaleIngredients(
  ingredients: RecipeIngredient[],
  originalServings: number,
  targetServings: number
): RecipeIngredient[] {
  const factor = targetServings / originalServings;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: (parseFloat(ing.quantity) * factor).toFixed(2),
  }));
}
