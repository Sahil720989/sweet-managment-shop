import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SweetFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  categories: string[];
}

export function SweetFilters({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  categories
}: SweetFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search sweets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sweet-input pl-10"
        />
      </div>
      
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={onPriceRangeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="0-5">Under $5</SelectItem>
          <SelectItem value="5-10">$5 - $10</SelectItem>
          <SelectItem value="10-20">$10 - $20</SelectItem>
          <SelectItem value="20+">$20+</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
