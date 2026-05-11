
import { ICategory } from "@/redux/service/categories/type";
import { CategoryTree } from "./CategoryTree";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { IBrand } from "@/redux/service/brand/type";


type TFilterProps = {
    categories: ICategory[];
    activeCat: string;
    setActiveCat: (id: string) => void;
    brands: IBrand[];
    selectedBrands: string[];
    toggleBrand: (id: string) => void;
    minPrice: number;
    setMinPrice: Dispatch<SetStateAction<number>>;
    maxPrice: number;
    setMaxPrice: Dispatch<SetStateAction<number>>;
    activeRating: number;
    setActiveRating: Dispatch<SetStateAction<number>>;
    onClearAll: () => void;
}
export function FilterSidebar({ 
  categories, activeCat, setActiveCat,
  brands, selectedBrands, toggleBrand,
  minPrice, setMinPrice, maxPrice, setMaxPrice,
  activeRating, setActiveRating,
  onClearAll,
}:TFilterProps) {
  return (
    <div className="flex flex-col gap-6 text-sm">

      {/* Category Tree */}
      <CategoryTree
        categories={categories}
        activeCat={activeCat}
        setActiveCat={setActiveCat}
      />

      {/* Brands */}
      {brands && brands.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
            Brands
          </p>
          <div className="space-y-2">
            {brands.map((brand,i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand._id}`}
                  checked={selectedBrands.includes(brand?._id.toString())}
                  onCheckedChange={() => toggleBrand(brand?._id.toString())}
                />
                <Label
                  htmlFor={`brand-${brand._id}`}
                  className="flex items-center gap-2 cursor-pointer font-normal"
                >
                  {brand.logo && (
                    <Image
                      src={brand.logo}
                      width={16}
                      height={16}
                      alt={brand.name}
                      className="rounded-sm object-contain"
                    />
                  )}
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
          Price range
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
            className="w-full px-2 py-1.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
            className="w-full px-2 py-1.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
          Rating
        </p>
        <div className="flex gap-2 flex-wrap">
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRating(activeRating === r ? 0 : r)}
              className={cn(
                'px-3 py-1 text-xs rounded-full border transition-colors',
                activeRating === r
                  ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {r}★+
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onClearAll}
        className="text-xs text-muted-foreground underline underline-offset-2 text-left"
      >
        Clear all filters
      </button>
    </div>
  );
}