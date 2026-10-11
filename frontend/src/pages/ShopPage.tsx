import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { ProductSkeleton } from '../components/common/LoadingSkeleton';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const isNewParam = searchParams.get('new') === 'true';
  const isFeaturedParam = searchParams.get('featured') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [page, setPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter metadata options
  const [filterMeta, setFilterMeta] = useState<{
    colors: string[];
    sizes: string[];
    fabrics: string[];
    min_price: number;
    max_price: number;
  }>({ colors: [], sizes: [], fabrics: [], min_price: 0, max_price: 20000 });

  // Fetch initial categories and filter meta
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, meta] = await Promise.all([
          api.getCategories(),
          api.getFilterMeta()
        ]);
        setCategories(cats);
        setFilterMeta(meta);
      } catch (e) {
        console.error('Error fetching meta', e);
      }
    };
    fetchMeta();
  }, []);

  // Update current category object when categoryParam changes
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const found = categories.find((c) => c.slug === categoryParam);
      setCurrentCategory(found || null);
    } else {
      setCurrentCategory(null);
    }
  }, [categoryParam, categories]);

  // Fetch products whenever filters or search parameters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          category: categoryParam || undefined,
          search: searchParam || undefined,
          is_new_arrival: isNewParam ? true : undefined,
          is_featured: isFeaturedParam ? true : undefined,
          min_price: minPrice !== '' ? minPrice : undefined,
          max_price: maxPrice !== '' ? maxPrice : undefined,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          fabric: selectedFabric || undefined,
          in_stock_only: inStockOnly || undefined,
          sort_by: sortBy,
          page,
          limit: 24,
        };

        const res = await api.getProducts(params);
        setProducts(res.items);
        setTotal(res.total);
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [
    categoryParam,
    searchParam,
    isNewParam,
    isFeaturedParam,
    minPrice,
    maxPrice,
    selectedSize,
    selectedColor,
    selectedFabric,
    inStockOnly,
    sortBy,
    page,
  ]);

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setSelectedFabric('');
    setInStockOnly(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  const getPageTitle = () => {
    if (searchParam) return `Search Results for "${searchParam}"`;
    if (isNewParam) return 'New Arrivals 2026';
    if (isFeaturedParam) return 'Festive & Bridal Highlights';
    if (currentCategory) return currentCategory.name;
    return 'All Collections';
  };

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Shop', url: '/shop' },
            ...(currentCategory ? [{ label: currentCategory.name }] : []),
            ...(searchParam ? [{ label: `Search: "${searchParam}"` }] : []),
          ]}
        />

        {/* Category Banner */}
        <div className="mt-4 mb-8 bg-[#FAF3E8] border border-[#C6A15B]/30 p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#651D32]">
              DD FASHION Storefront
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#282323] mt-1 font-normal">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-[#716963] mt-2 leading-relaxed">
              {currentCategory?.description ||
                'Curated South Indian women’s apparel tailored in authentic handloom silks, fine combed cottons, and comfortable daily wear.'}
            </p>
          </div>
          {currentCategory?.image_url && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
              <img
                src={currentCategory.image_url}
                alt={currentCategory.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C6A15B]/20 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
            <span className="text-xs text-[#716963]">
              Showing <strong className="text-[#282323]">{products.length}</strong> of{' '}
              <strong className="text-[#282323]">{total}</strong> products
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-[#716963] font-medium whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#C6A15B]/40 px-3 py-2 text-xs text-[#282323] focus:outline-none focus:border-[#651D32]"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#C6A15B]/30">
              <span className="font-serif text-base font-semibold text-[#651D32]">Filter By</span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#A69A90] hover:text-[#651D32] underline"
              >
                Reset All
              </button>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#282323]">
                Category
              </h4>
              <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-2 text-xs">
                <li>
                  <button
                    onClick={() => {
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    }}
                    className={`w-full text-left py-1 hover:text-[#651D32] transition-colors ${
                      !categoryParam ? 'font-bold text-[#651D32]' : 'text-[#716963]'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        searchParams.set('category', cat.slug);
                        setSearchParams(searchParams);
                      }}
                      className={`w-full text-left py-1 hover:text-[#651D32] transition-colors flex items-center justify-between ${
                        categoryParam === cat.slug ? 'font-bold text-[#651D32]' : 'text-[#716963]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {categoryParam === cat.slug && <Check size={12} className="text-[#651D32]" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-4 border-t border-[#C6A15B]/20">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#282323]">
                Price Range (₹)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-1/2 bg-white border border-[#C6A15B]/40 px-2 py-1.5 text-xs text-[#282323] focus:outline-none"
                />
                <span className="text-xs text-[#A69A90]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-1/2 bg-white border border-[#C6A15B]/40 px-2 py-1.5 text-xs text-[#282323] focus:outline-none"
                />
              </div>
            </div>

            {/* Size Filter */}
            {filterMeta.sizes.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-[#C6A15B]/20">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#282323]">
                  Size
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSize('')}
                    className={`px-2.5 py-1 text-xs border ${
                      !selectedSize
                        ? 'border-[#651D32] bg-[#651D32] text-white'
                        : 'border-[#C6A15B]/40 bg-white text-[#282323] hover:border-[#651D32]'
                    }`}
                  >
                    All
                  </button>
                  {filterMeta.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`px-2.5 py-1 text-xs border ${
                        selectedSize === s
                          ? 'border-[#651D32] bg-[#651D32] text-white'
                          : 'border-[#C6A15B]/40 bg-white text-[#282323] hover:border-[#651D32]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fabric Filter */}
            {filterMeta.fabrics.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-[#C6A15B]/20">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#282323]">
                  Fabric
                </h4>
                <ul className="space-y-1 text-xs text-[#716963] max-h-36 overflow-y-auto pr-1">
                  {filterMeta.fabrics.slice(0, 8).map((f) => (
                    <li key={f}>
                      <button
                        onClick={() => setSelectedFabric(selectedFabric === f ? '' : f)}
                        className={`w-full text-left py-0.5 hover:text-[#651D32] flex items-center justify-between ${
                          selectedFabric === f ? 'font-bold text-[#651D32]' : ''
                        }`}
                      >
                        <span className="truncate">{f}</span>
                        {selectedFabric === f && <Check size={12} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* In Stock Checkbox */}
            <div className="pt-4 border-t border-[#C6A15B]/20">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#282323]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#651D32] focus:ring-[#651D32]"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>

          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-[#C6A15B]/30 p-12 text-center space-y-4">
                <h3 className="font-serif text-xl text-[#282323]">No Products Found</h3>
                <p className="text-xs text-[#716963] max-w-md mx-auto">
                  We could not find any products matching your selected criteria. Try resetting the filters or exploring other categories.
                </p>
                <button onClick={handleResetFilters} className="btn-primary mt-2">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Slide Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-[#FFF9F1] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#C6A15B]/30">
                <h3 className="font-serif text-lg font-bold text-[#651D32]">Filter Products</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Category Select */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-[#282323]">Category</h4>
                <select
                  value={categoryParam}
                  onChange={(e) => {
                    if (e.target.value) {
                      searchParams.set('category', e.target.value);
                    } else {
                      searchParams.delete('category');
                    }
                    setSearchParams(searchParams);
                  }}
                  className="w-full bg-white border border-[#C6A15B]/40 p-2 text-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile In Stock Only */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#C6A15B]/30 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full btn-primary py-3"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full btn-secondary py-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
