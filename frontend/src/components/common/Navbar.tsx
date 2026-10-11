import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { MegaMenu } from './MegaMenu';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { cart, openCart } = useCart();
  const { wishlist } = useWishlist();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F1]/95 backdrop-blur-md border-b border-[#C6A15B]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#282323] hover:text-[#651D32] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo & Wordmark */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-center group text-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#651D32] group-hover:text-[#3B1020] transition-colors">
                DD FASHION
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#C6A15B] font-semibold -mt-0.5">
                South Indian Boutique
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-wider font-medium text-[#282323]">
            <Link to="/" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Home
            </Link>
            <Link to="/shop?new=true" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32] text-[#651D32] font-semibold flex items-center gap-1">
              <Sparkles size={11} className="text-[#C6A15B]" />
              New Arrivals
            </Link>
            <Link to="/shop?category=chudithars" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Chudithars
            </Link>
            <Link to="/shop?category=sarees" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Sarees
            </Link>
            <Link to="/shop?category=kurtis" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Kurtis
            </Link>
            <Link to="/shop?category=cotton-nighties" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Nighties
            </Link>
            
            {/* MegaMenu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <button
                className="flex items-center gap-1 hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                <span>Collections</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#651D32]' : ''}`} />
              </button>
            </div>

            <Link to="/shop?category=jewellery" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Jewellery
            </Link>
            <Link to="/shop?featured=true" className="hover:text-[#651D32] transition-colors py-2 border-b-2 border-transparent hover:border-[#651D32]">
              Sale
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#282323]">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 hover:text-[#651D32] transition-colors"
              aria-label="Search store"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-1.5 hover:text-[#651D32] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#651D32] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag / Cart */}
            <button
              onClick={openCart}
              className="p-1.5 hover:text-[#651D32] transition-colors relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={19} />
              {cart.item_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#651D32] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.item_count}
                </span>
              )}
            </button>

            {/* Account / Admin */}
            <div className="relative group">
              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                className="p-1.5 hover:text-[#651D32] transition-colors flex items-center gap-1.5"
                aria-label="User Account"
              >
                <UserIcon size={19} />
                {user && (
                  <span className="hidden xl:inline text-xs font-medium max-w-[90px] truncate">
                    {user.full_name.split(' ')[0]}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Drawer */}
        {isSearchOpen && (
          <div className="py-4 border-t border-[#C6A15B]/20 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Chudithars, Kanjeevarams, Cotton Nighties, Jhumkas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white border border-[#C6A15B]/40 px-4 py-2.5 pl-10 text-xs text-[#282323] placeholder-[#A69A90] focus:outline-none focus:border-[#651D32]"
                />
                <Search size={16} className="absolute left-3.5 top-3 text-[#A69A90]" />
              </div>
              <button type="submit" className="btn-primary py-2 px-5">
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MegaMenu Component */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />

      {/* Mobile Slide-out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-[#FFF9F1] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#C6A15B]/30">
                <div>
                  <span className="font-serif text-xl font-bold text-[#651D32]">DD FASHION</span>
                  <p className="text-[10px] uppercase tracking-widest text-[#C6A15B]">South Indian Boutique</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#282323] hover:text-[#651D32]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="py-6 space-y-4 text-sm font-medium">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/shop?new=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#651D32] font-semibold flex items-center justify-between"
                >
                  <span>New Arrivals</span>
                  <span className="text-[10px] bg-[#E8C9C7] text-[#651D32] px-2 py-0.5 rounded font-bold">2026</span>
                </Link>
                <Link
                  to="/shop?category=chudithars"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Chudithar Sets
                </Link>
                <Link
                  to="/shop?category=sarees"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Sarees (Kanjeevaram & Cotton)
                </Link>
                <Link
                  to="/shop?category=kurtis"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Kurtis & Kurta Sets
                </Link>
                <Link
                  to="/shop?category=cotton-nighties"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Cotton Nighties & Loungewear
                </Link>
                <Link
                  to="/shop?category=half-sarees"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Half Sarees (Langa Davani)
                </Link>
                <Link
                  to="/shop?category=jewellery"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Temple Jewellery & Jhumkas
                </Link>
                <Link
                  to="/shop?category=handbags"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#282323] hover:text-[#651D32] transition-colors"
                >
                  Potlis & Wedding Clutches
                </Link>
                <Link
                  to="/shop?featured=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#651D32] hover:text-[#3B1020] transition-colors font-semibold"
                >
                  Festive Special Sale
                </Link>
              </div>
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-6 border-t border-[#C6A15B]/30 space-y-3">
              {user ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : '/account'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs font-semibold text-[#651D32]"
                  >
                    Logged in as {user.full_name} ({user.role})
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs text-[#716963] hover:text-[#282323]"
                  >
                    My Orders & Addresses
                  </Link>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 btn-secondary text-center py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 btn-primary text-center py-2"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
