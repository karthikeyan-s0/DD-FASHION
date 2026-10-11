import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { buildProductWhatsAppUrl } from '../../utils/whatsapp';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const primaryImage = product.images?.[0]?.image_url || '/images/boutique_placeholder.svg';
  const isPendingPrice = product.tags?.includes('pending-price') || product.description?.includes('Pending Price Confirmation');
  const isPendingSize = !product.sizes || product.sizes.length === 0 || product.sizes.includes('Pending Confirmation');

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = isPendingSize ? undefined : product.sizes?.[0];
    const defaultColor = product.colors?.[0];
    await addToCart(product.id, 1, defaultSize, defaultColor);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  const whatsappUrl = buildProductWhatsAppUrl(
    product, 
    isPendingSize ? 'Pending Confirmation' : product.sizes?.[0], 
    product.colors?.[0], 
    1
  );

  return (
    <div className="group relative flex flex-col bg-white border border-[#C6A15B]/20 hover:border-[#651D32]/40 transition-all duration-300 shadow-sm hover:shadow-md">
      
      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF3E8]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/boutique_placeholder.svg';
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.is_new_arrival && (
            <span className="bg-[#651D32] text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5">
              New
            </span>
          )}
          {isPendingPrice ? (
            <span className="bg-amber-700 text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
              Price Pending
            </span>
          ) : product.compare_at_price && product.compare_at_price > product.price ? (
            <span className="bg-[#C6A15B] text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5">
              {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% Off
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-[#651D32] text-white'
              : 'bg-white/80 text-[#282323] hover:bg-white hover:text-[#651D32]'
          } shadow-md backdrop-blur-sm z-10`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <Link
            to={`/product/${product.slug}`}
            className="bg-white/95 hover:bg-[#651D32] hover:text-white text-[#282323] text-[10px] font-medium py-2 px-2.5 shadow transition-colors flex items-center justify-center gap-1 uppercase tracking-wider"
          >
            <Eye size={12} />
            <span>Details</span>
          </Link>
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-white/95 hover:bg-[#651D32] hover:text-white text-[#282323] text-[10px] font-medium py-2 px-2.5 shadow transition-colors flex items-center justify-center gap-1 uppercase tracking-wider"
          >
            <ShoppingBag size={12} />
            <span>Add to Bag</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2 shadow transition-colors flex items-center justify-center"
            title="Order on WhatsApp"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle size={14} />
          </a>
        </div>
      </div>

      {/* Product Details Block */}
      <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category Tag */}
          {product.category && (
            <p className="text-[10px] uppercase tracking-wider text-[#A69A90] font-semibold mb-1">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="font-medium text-xs sm:text-sm text-[#282323] hover:text-[#651D32] transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Size status badge / details */}
          {isPendingSize ? (
            <p className="text-[10px] text-amber-700 italic font-medium mt-1">
              Sizes: Pending Confirmation
            </p>
          ) : product.sizes && product.sizes.length > 0 ? (
            <p className="text-[10px] text-[#716963] mt-1 font-medium">
              Sizes: {product.sizes.join(', ')}
            </p>
          ) : null}
        </div>

        {/* Price & Pending Status */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#282323]">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-[#A69A90] line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* View Details Link */}
            <Link
              to={`/product/${product.slug}`}
              className="text-[11px] text-[#651D32] hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>View</span>
              <span>→</span>
            </Link>
          </div>

          {isPendingPrice && (
            <span className="text-[9px] uppercase tracking-wider text-amber-800 font-semibold">
              *Pending Price Confirmation
            </span>
          )}
        </div>

        {/* Mobile WhatsApp Quick Button */}
        <div className="mt-2 sm:hidden pt-2 border-t border-gray-100 flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#651D32] text-white text-[11px] py-1.5 uppercase font-medium"
          >
            Add
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-2 py-1.5 flex items-center justify-center text-xs"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
