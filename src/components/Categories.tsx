import { useEffect, useState } from 'react';
import { fetchCategories } from '../services/api';

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(['All', ...fetchedCategories]);
      setLoading(false);
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 -mx-4">
        <div className="px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 pb-2">
              <div className="h-9 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-9 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 -mx-4">
      <div className="px-4">
        <div className="flex overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
