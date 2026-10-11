import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { CategorySkeleton } from '../common/LoadingSkeleton';

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Sort categories so collections with verified imagery appear first, then display top 8
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.image_url && !b.image_url) return -1;
    if (!a.image_url && b.image_url) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });
  const displayCategories = sortedCategories.slice(0, 8);

  return (
    <section id="categories" className="py-20 bg-[#FAF8F5] border-b border-[#C6A15B]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
            Curated Boutiques
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#282323] mt-2 font-normal">
            Shop by Category
          </h2>
          <div className="w-12 h-0.5 bg-[#651D32] mx-auto mt-3" />
          <p className="text-xs sm:text-sm text-[#716963] mt-3">
            Explore authentic handloom textiles, everyday essentials, and opulent bridal collections.
          </p>
        </motion.div>

        {/* Category Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden bg-[#FAF3E8] border border-[#C6A15B]/30 hover:border-[#C6A15B] transition-all duration-500 shadow-sm hover:shadow-[0_14px_35px_rgba(61,12,19,0.18)] block rounded-sm"
                >
                  {/* Background Image with Smooth Zoom */}
                  <img
                    src={cat.image_url || '/images/boutique_placeholder.svg'}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/boutique_placeholder.svg';
                    }}
                  />

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Overlay Card matching User Reference Mockup */}
                  <div className="absolute inset-x-3 bottom-3 p-3.5 bg-white/95 backdrop-blur-sm border border-[#C6A15B]/30 text-center transition-transform duration-300 group-hover:-translate-y-1 shadow-sm">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-[#282323] uppercase tracking-wider group-hover:text-[#651D32] transition-colors truncate">
                      {cat.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-[#651D32]">
                      <span>Shop Collection</span>
                      <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Categories Link */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/shop"
            className="btn-secondary py-3 px-8 text-xs font-semibold tracking-wider inline-flex items-center gap-2 shadow-sm hover:shadow"
          >
            <span>Explore All Collections ({categories.length})</span>
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
