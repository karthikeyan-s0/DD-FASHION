import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, ShieldCheck, Truck, RotateCcw, Check, Sparkles, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { formatPrice } from '../utils/formatters';
import { buildProductWhatsAppUrl, FORMATTED_PHONE_DISPLAY } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await api.getProductBySlug(slug);
        setProduct(p);
        setSelectedImageIndex(0);
        setSelectedSize(p.sizes?.[0] || '');
        setSelectedColor(p.colors?.[0] || '');
        setQuantity(1);
        setValidationError(null);

        // Fetch related products
        const related = await api.getRelatedProducts(p.id, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#651D32]" />
        <p className="text-xs text-[#716963] mt-3">Loading boutique piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#282323]">Product Not Found</h2>
        <p className="text-xs text-[#716963]">The requested garment could not be found or has been discontinued.</p>
        <Link to="/shop" className="btn-primary">
          Back to Collection
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [
    { id: 1, image_url: '/images/boutique_placeholder.svg', display_order: 0, is_primary: true }
  ];
  const activeImage = images[selectedImageIndex] || images[0];

  const isPendingPrice = product.tags?.includes('pending-price') || product.description?.includes('Pending Price Confirmation');
  const isPendingSize = !product.sizes || product.sizes.length === 0 || product.sizes.includes('Pending Confirmation');

  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !isPendingSize && !selectedSize) {
      setValidationError('Please select a size before adding to bag.');
      return;
    }
    setValidationError(null);
    try {
      await addToCart(product.id, quantity, isPendingSize ? 'Pending Confirmation' : selectedSize, selectedColor);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 4000);
    } catch {
      // Handled in context
    }
  };

  const whatsappUrl = buildProductWhatsAppUrl(
    product, 
    isPendingSize ? 'Pending Confirmation' : selectedSize, 
    selectedColor, 
    quantity
  );

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Shop', url: '/shop' },
            ...(product.category ? [{ label: product.category.name, url: `/shop?category=${product.category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        {/* Main Product Container */}
        <div className="mt-6 bg-white border border-[#C6A15B]/30 p-4 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Gallery Column (Desktop: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Thumbnail List */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] flex-shrink-0">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 sm:w-20 aspect-[3/4] border-2 overflow-hidden transition-all flex-shrink-0 ${
                        selectedImageIndex === idx ? 'border-[#651D32]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Primary Image View */}
              <div className="flex-1 aspect-[3/4] bg-[#FAF3E8] relative overflow-hidden border border-[#C6A15B]/20 group">
                <img
                  src={activeImage.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Wishlist Button on Image */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isWishlisted ? 'bg-[#651D32] text-white' : 'bg-white/90 text-[#282323] hover:text-[#651D32]'
                  } shadow-md backdrop-blur-sm z-10`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

            </div>

            {/* Product Meta & Actions Column (Desktop: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-[11px] text-[#A69A90] uppercase tracking-wider font-semibold">
                  <span>{product.category?.name || 'Exclusive'}</span>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* Product Name */}
                <h1 className="font-serif text-2xl sm:text-3xl text-[#282323] font-normal leading-snug">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-3 pt-1 border-b border-[#C6A15B]/20 pb-4">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#651D32]">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <>
                      <span className="text-sm text-[#A69A90] line-through">
                        {formatPrice(product.compare_at_price)}
                      </span>
                      <span className="bg-[#FAF3E8] border border-[#C6A15B]/40 text-[#651D32] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                        Save {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                      </span>
                    </>
                  )}
                  {isPendingPrice && (
                    <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
                      Pending Price Confirmation
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="text-xs">
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-700 font-medium inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                      In Stock — {product.stock_quantity <= 5 ? `Only ${product.stock_quantity} pieces left!` : 'Available for immediate dispatch'}
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Currently Out of Stock</span>
                  )}
                </div>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-[#282323] uppercase tracking-wider block">
                      Colour: <span className="font-normal text-[#716963]">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 text-xs border transition-all ${
                            selectedColor === c
                              ? 'border-[#651D32] bg-[#651D32] text-white font-medium'
                              : 'border-[#C6A15B]/40 bg-white text-[#282323] hover:border-[#651D32]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {isPendingSize ? (
                  <div className="p-3 bg-[#FAF3E8] border border-[#C6A15B]/40 rounded space-y-1">
                    <p className="text-xs font-semibold text-[#651D32] uppercase tracking-wider">
                      Sizes: Pending Confirmation
                    </p>
                    <p className="text-[11px] text-[#716963] leading-relaxed">
                      Specific garment dimensions and tailored size options are pending release. Contact the boutique directly on WhatsApp for custom pre-orders and measurements.
                    </p>
                  </div>
                ) : product.sizes && product.sizes.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#282323] uppercase tracking-wider block">
                        Select Size: <span className="font-normal text-[#716963]">{selectedSize}</span>
                      </label>
                      <span className="text-[10px] text-[#A69A90] underline cursor-pointer">
                        Size Guide
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedSize(s);
                            setValidationError(null);
                          }}
                          className={`px-3 py-1.5 text-xs border min-w-[44px] transition-all ${
                            selectedSize === s
                              ? 'border-[#651D32] bg-[#651D32] text-white font-medium'
                              : 'border-[#C6A15B]/40 bg-white text-[#282323] hover:border-[#651D32]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Quantity Counter */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-[#282323] uppercase tracking-wider block">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[#C6A15B]/40 w-fit bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 text-[#282323] hover:bg-[#FAF3E8] disabled:opacity-40"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-4 py-1 text-xs font-semibold min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2.5 text-[#282323] hover:bg-[#FAF3E8] disabled:opacity-40"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <p className="text-xs text-red-600 font-medium animate-fadeIn">
                    {validationError}
                  </p>
                )}

                {/* ACTION BUTTONS: Add to Bag + WHATSAPP DIRECT ORDERING */}
                <div className="space-y-3 pt-4">
                  {/* Primary Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0}
                    className="w-full btn-primary py-3.5 text-xs tracking-widest font-semibold disabled:opacity-50"
                  >
                    <ShoppingBag size={16} />
                    <span>{product.stock_quantity > 0 ? 'Add to Shopping Bag' : 'Sold Out'}</span>
                  </button>

                  {/* WHATSAPP DIRECT ORDER BUTTON (Explicit Master Prompt Requirement) */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-whatsapp py-3.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={17} />
                    <span>Order on WhatsApp</span>
                  </a>
                </div>

                {/* Added to Bag Feedback */}
                {addedNotice && (
                  <div className="bg-green-50 border border-green-200 p-2.5 text-xs text-green-800 flex items-center gap-2 animate-fadeIn">
                    <Check size={14} className="text-green-600" />
                    <span>Added to your bag! Open bag to complete your order.</span>
                  </div>
                )}
              </div>

              {/* Service Badges */}
              <div className="pt-6 border-t border-[#C6A15B]/20 grid grid-cols-2 gap-3 text-[11px] text-[#716963]">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-[#C6A15B]" />
                  <span>Free shipping above ₹1,999</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#C6A15B]" />
                  <span>100% Genuine Handloom</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={15} className="text-[#C6A15B]" />
                  <span>Easy 7-Day Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={15} className="text-[#25D366]" />
                  <span>WhatsApp: {FORMATTED_PHONE_DISPLAY}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Description & Fabric Specs Accordion */}
          <div className="mt-12 pt-8 border-t border-[#C6A15B]/30 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#282323]">
                Garment Description
              </h3>
              <p className="text-xs sm:text-sm text-[#716963] leading-relaxed">
                {product.description || 'Crafted with premium quality South Indian handloom techniques and fine stitching.'}
              </p>
            </div>

            <div className="space-y-3 bg-[#FAF3E8] p-5 border border-[#C6A15B]/30">
              <h3 className="font-serif text-base font-semibold text-[#651D32]">
                Fabric & Care Instructions
              </h3>
              <div className="space-y-2 text-xs text-[#282323]">
                {product.fabric && (
                  <div>
                    <strong>Fabric: </strong>
                    <span className="text-[#716963]">{product.fabric}</span>
                  </div>
                )}
                {product.care_instructions && (
                  <div>
                    <strong>Care: </strong>
                    <span className="text-[#716963]">{product.care_instructions}</span>
                  </div>
                )}
                <div>
                  <strong>Origin: </strong>
                  <span className="text-[#716963]">Tailored & Sourced in Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#C6A15B]/20">
              <h3 className="font-serif text-2xl text-[#282323]">
                You May Also Cherish
              </h3>
              <Link to="/shop" className="text-xs font-semibold text-[#651D32] hover:underline">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
