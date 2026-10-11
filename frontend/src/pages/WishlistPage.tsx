import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  return (
    <div className="bg-[#FFF9F1] min-h-[75vh] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />

        <div className="mt-4 mb-8">
          <h1 className="font-serif text-3xl text-[#282323]">Your Wishlist</h1>
          <p className="text-xs text-[#716963] mt-1">
            Cherished traditional outfits and festive jewellery saved for later.
          </p>
        </div>

        {!user && wishlist.length > 0 && (
          <div className="mb-6 p-3 bg-[#FAF3E8] border border-[#C6A15B]/30 flex items-center justify-between text-xs text-[#716963]">
            <span>Your wishlist items are saved in this browser.</span>
            <Link to="/login" className="text-[#651D32] font-semibold underline hover:text-[#3B1020]">
              Sign in to sync across devices &rarr;
            </Link>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="bg-white border border-[#C6A15B]/30 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <Heart size={36} className="text-[#A69A90] mx-auto" />
            <h2 className="font-serif text-xl text-[#282323]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#716963]">
              Browse our collections and tap the heart icon on any product to save it here.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="btn-primary">
                Explore Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
