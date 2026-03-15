import type { ShoppingListItem } from '../types/shoppingList.types.ts';
import type { IngredientCategory } from '../types/ingredient.types.ts';

const CATEGORY_ORDER: IngredientCategory[] = [
  'produce',
  'meat',
  'dairy',
  'pantry',
  'frozen',
  'other',
];

export function groupByCategory(
  items: ShoppingListItem[]
): { category: IngredientCategory; items: ShoppingListItem[] }[] {
  const grouped = new Map<IngredientCategory, ShoppingListItem[]>();

  for (const cat of CATEGORY_ORDER) {
    grouped.set(cat, []);
  }

  for (const item of items) {
    const list = grouped.get(item.category) ?? [];
    list.push(item);
    grouped.set(item.category, list);
  }

  return CATEGORY_ORDER.map((category) => ({
    category,
    items: grouped.get(category) ?? [],
  })).filter(({ items }) => items.length > 0);
}
