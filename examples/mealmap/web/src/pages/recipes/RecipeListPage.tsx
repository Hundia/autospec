import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../../components/atoms/Button.tsx';

export default function RecipeListPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
        <Link to="/recipes/new">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Add Recipe
          </Button>
        </Link>
      </div>
      <div className="text-center py-24 text-gray-400">
        <p className="text-lg font-medium">Recipes coming in Sprint 1</p>
        <p className="text-sm mt-2">Recipe CRUD with search, filter, and scaling</p>
      </div>
    </div>
  );
}
