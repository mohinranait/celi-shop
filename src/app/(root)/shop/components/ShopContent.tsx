'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useGetCategoriesQuery } from '@/redux/service/categories';
import { SlidersHorizontal, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import ProductCard from '@/components/products/ProductCard';
import { useGetBrandsByCategoryQuery, useGetProductsForFiltersQuery } from '@/redux/client/products';
import { IProductFilterParams } from '@/redux/client/products/type';
import { FilterSidebar } from './Filter';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];


export function ShopContent() {
  const searchParams = useSearchParams();

  const search = searchParams.get('search');
  const activeCat = searchParams.get('category') || '';

  // const [activeCat, setActiveCat] = useState(searchParams.get('category') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [activeRating, setActiveRating] = useState(0);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  const { data: catData } = useGetCategoriesQuery('status=true&isDelete=false');
  const categories = catData?.data || [];

  const { data: brandData } = useGetBrandsByCategoryQuery(activeCat || undefined);
  const getAllBrands = brandData?.data || [];
  const brands = getAllBrands.filter(brand => !brand.isDelete)
  const router = useRouter();
  const queryParams = useMemo((): IProductFilterParams => {
    const p: IProductFilterParams = { sort, page, limit: 20 };
    if (activeCat) p.category = activeCat;
    if (search) p.search = search;
    if (selectedBrands.length) p.brand = selectedBrands.join(',');
    if (minPrice > 0) p.minPrice = minPrice;
    if (maxPrice > 0) p.maxPrice = maxPrice;
    if (activeRating > 0) p.minRating = activeRating;
    return p;
  }, [activeCat, selectedBrands, minPrice, maxPrice, activeRating, sort, page, search]);

  const { data: productData, isLoading } = useGetProductsForFiltersQuery(queryParams);
  const products = productData?.data || [];
  const meta = productData?.meta;

  const toggleBrand = (id: string) =>
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );

  const handleCatChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (id) {
      params.set('category', id);
    } else {
      params.delete('category');
    }

    router.push(`/shop?${params.toString()}`);

    setSelectedBrands([]);
    setPage(1);
  };


  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('category');

    router.push(`/shop?${params.toString()}`);

    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(0);
    setActiveRating(0);
    setSort('default');
    setPage(1);
  };

  const activeCatName = categories.find((c) => c._id === activeCat)?.name;

  const activeTags = [
    activeCat && { label: activeCatName, clear: () => handleCatChange('') },
    ...selectedBrands.map((id) => {
      const b = brands.find((br) => br._id === id);
      return b ? { label: b.name, clear: () => toggleBrand(id) } : null;
    }).filter(Boolean),
    (minPrice > 0 || maxPrice > 0) && {
      label: `৳${minPrice}–৳${maxPrice}`,
      clear: () => { setMinPrice(0); setMaxPrice(0); },
    },
    activeRating > 0 && {
      label: `${activeRating}★+`,
      clear: () => setActiveRating(0),
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const filterProps = {
    categories, activeCat, handleCatChange,
    brands, selectedBrands, toggleBrand,
    minPrice, setMinPrice, maxPrice, setMaxPrice,
    activeRating, setActiveRating,
    onClearAll: clearAll,
  };

  return (
    <section>
      <div className="container mx-auto px-2 lg:px-4 py-8">
        <div className="flex gap-6">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 border-r border-border pr-6">
            <FilterSidebar {...filterProps} />
          </aside>

          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">

                {/* Mobile filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 px-4 pt-10 overflow-y-auto">
                    <FilterSidebar {...filterProps} />
                  </SheetContent>
                </Sheet>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Shop{activeCatName ? ` / ${activeCatName}` : ''}
                  </p>
                  <p className="text-sm font-medium">
                    {meta?.total ?? products.length} products
                  </p>
                </div>
              </div>

              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="text-sm px-3 py-1.5 border border-border rounded-lg bg-background focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Active filter tags */}
            {activeTags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {activeTags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="gap-1 cursor-pointer pr-1.5"
                    onClick={tag.clear}
                  >
                    {tag.label} <X className="w-3 h-3" />
                  </Badge>
                ))}
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground underline underline-offset-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={clearAll}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline" size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground px-3">
                      Page {page} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline" size="sm"
                      disabled={page === meta.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}