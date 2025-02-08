import { Filter } from 'lucide-react';

export type SortOption = 'relevance' | 'cheaper' | 'popular';

interface SearchFilterProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SearchFilter({ selectedSort, onSortChange }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Filter className="h-5 w-5 text-gray-400" />
      <div className="flex gap-2">
        <button
          onClick={() => onSortChange('relevance')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedSort === 'relevance'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Relevance
        </button>
        <button
          onClick={() => onSortChange('cheaper')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedSort === 'cheaper'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cheaper First
        </button>
        <button
          onClick={() => onSortChange('popular')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedSort === 'popular'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Most Popular
        </button>
      </div>
    </div>
  );
}
