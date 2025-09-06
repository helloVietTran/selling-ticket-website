import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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
      className={`flex w-[350px] max-w-md items-center rounded-sm bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center px-3 flex-1">
        <Search className="size-4 text-gray-500 mr-2" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`border-0 focus-visible:ring-0 focus:outline-none flex-1 text-[#333333] ${inputClassName}`}
        />
      </div>

      <Button
        onClick={onSearch}
        className={`rounded-l-none border-l border-gray-200 bg-white text-[#333333] hover:bg-gray-200 cursor-pointer ${buttonClassName}`}
      >
        Tìm kiếm
      </Button>
    </div>
  );
}
