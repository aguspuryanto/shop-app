import { useState } from 'react';

export type CategoryType = 'All' | 'Software' | 'Ebook' | 'Courses' | 'Source Code' | 'Video';

interface CategoriesProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export default function Categories({ selectedCategory, onSelectCategory }: CategoriesProps) {
  const categories: CategoryType[] = ['All', 'Software', 'Ebook', 'Courses', 'Source Code', 'Video'];

  return (
    <div className="mb-6 -mx-4">
      <div className="px-4">
        <div className="flex overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
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
