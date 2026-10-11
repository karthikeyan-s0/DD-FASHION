import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { cart, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const isHome = location.pathname === '/';
  const isShop = location.pathname.startsWith('/shop');
  const isWishlist = location.pathname === '/wishlist';
  const isAccount = location.pathname === '/account' || location.pathname === '/login' || location.pathname === '/register';

  // Do not show on product detail page because product detail page has its own sticky checkout bar
  const isProductDetail = location.pathname.startsWith('/product/');
  if (isProductDetail) return null;

  return (
    <nav 
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F1]/95 backdrop-blur-md border-t border-[#C6A15B]/30 shadow-[0_-3px_15px_rgba(0,0,0,0.06)] px-2 py-1.5 transition-all select-none"
      aria-label="Mobile Navigation"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-5 items-center">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-90 ${
            isHome ? 'text-[#651D32]' : 'text-[#716963] hover:text-[#282323]'
          }`}
        >
          <div className="relative">
            <Home size={19} strokeWidth={isHome ? 2.3 : 1.8} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C6A15B] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${isHome ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </Link>

        {/* 2. Shop / Collections */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-90 ${
            isShop ? 'text-[#651D32]' : 'text-[#716963] hover:text-[#282323]'
          }`}
        >
          <div className="relative">
            <Compass size={19} strokeWidth={isShop ? 2.3 : 1.8} />
            {isShop && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C6A15B] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${isShop ? 'font-bold' : 'font-medium'}`}>
            Explore
          </span>
        </Link>

        {/* 3. Wishlist */}
        <Link
          to="/wishlist"
          className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-90 relative ${
            isWishlist ? 'text-[#651D32]' : 'text-[#716963] hover:text-[#282323]'
          }`}
        >
          <div className="relative">
            <Heart 
              size={19} 
              strokeWidth={isWishlist ? 2.3 : 1.8} 
              fill={isWishlist ? '#651D32' : 'none'} 
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C6A15B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length > 9 ? '9+' : wishlist.length}
              </span>
            )}
            {isWishlist && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C6A15B] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${isWishlist ? 'font-bold' : 'font-medium'}`}>
            Wishlist
          </span>
        </Link>

        {/* 4. Cart / Bag */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 transition-transform active:scale-90 text-[#716963] hover:text-[#282323] focus:outline-none"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag size={19} strokeWidth={1.8} />
            {cart.item_count > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#651D32] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {cart.item_count > 9 ? '9+' : cart.item_count}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            Bag
          </span>
        </button>

        {/* 5. Account */}
        <Link
          to={user ? '/account' : '/login'}
          className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-90 ${
            isAccount ? 'text-[#651D32]' : 'text-[#716963] hover:text-[#282323]'
          }`}
        >
          <div className="relative">
            <User size={19} strokeWidth={isAccount ? 2.3 : 1.8} />
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C6A15B] rounded-full" />
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${isAccount ? 'font-bold' : 'font-medium'}`}>
            {user ? 'Account' : 'Sign In'}
          </span>
        </Link>

      </div>
    </nav>
  );
};
