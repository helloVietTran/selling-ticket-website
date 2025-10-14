import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

type SearchBoxProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export default function SearchBox({
  placeholder = 'Tìm kiếm...',
  value,
  onChange,
  onSearch,
  className = '',
  inputClassName = '',
  buttonClassName = '',
}: SearchBoxProps) {
  return (
    <div
      className={`flex max-w-md items-center rounded-sm bg-white shadow-sm ${className}`}>
      <div className="flex items-center px-3 flex-1 relative">
        <Search className="size-4 text-gray-500 mr-2" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`border-0 focus-visible:ring-0 focus:outline-none flex-1 text-[#333333] pr-6 ${inputClassName}`}
        />
        
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <Button
        onClick={onSearch}
        className={`rounded-l-none border-l border-gray-200 bg-white text-[#333333] hover:bg-gray-200 cursor-pointer ${buttonClassName}`}>
        Tìm kiếm
      </Button>
    </div>
  );
}
