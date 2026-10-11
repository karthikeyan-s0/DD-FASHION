import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { ProductCard } from '../common/ProductCard';
import { ProductSkeleton } from '../common/LoadingSkeleton';

export const FeaturedCollections: React.FC = () => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [sarees, setSarees] = useState<Product[]>([]);
  const [salwarSuits, setSalwarSuits] = useState<Product[]>([]);
  const [kurtis, setKurtis] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const bestsellersContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        // Fetch Bestsellers (featured products)
        const bestsellersRes = await api.getProducts({ is_featured: true, limit: 8 });
        setBestsellers(bestsellersRes.items);

        // Fetch Real Sarees
        const sareesRes = await api.getProducts({ category: 'sarees', limit: 4 });
        setSarees(sareesRes.items);

        // Fetch Real Salwar Suits
        const salwarRes = await api.getProducts({ category: 'salwar-suits', limit: 4 });
        setSalwarSuits(salwarRes.items);

        // Fetch Real Kurtis & Kurta Sets
        const kurtisRes = await api.getProducts({ category: 'kurtis-kurta-sets', limit: 4 });
        setKurtis(kurtisRes.items);
      } catch (err) {
        console.error('Failed to load collections', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const scrollBestsellers = (direction: 'left' | 'right') => {
    if (bestsellersContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      bestsellersContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-24 py-16 bg-[#FFF9F1] overflow-hidden">
      
      {/* SECTION 1: Best Selling / Featured Pieces */}
      {loading || bestsellers.length > 0 ? (
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Editorial Block */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
                Handpicked Essentials
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#282323] leading-tight font-normal">
                Best Selling <br />
                <span className="italic font-serif text-[#651D32]">for Women</span>
              </h2>
              <div className="w-10 h-0.5 bg-[#651D32]" />
              <p className="text-xs sm:text-sm text-[#716963] leading-relaxed">
                Discover our cherished handloom drapes, festive chudithars, elegant kurtis, and contemporary cape salwar suits.
              </p>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => scrollBestsellers('left')}
                  className="w-10 h-10 border border-[#651D32] text-[#651D32] hover:bg-[#651D32] hover:text-white transition-colors flex items-center justify-center active:scale-95 shadow-sm"
                  aria-label="Previous best sellers"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollBestsellers('right')}
                  className="w-10 h-10 bg-[#651D32] text-white hover:bg-[#3B1020] transition-colors flex items-center justify-center active:scale-95 shadow-md"
                  aria-label="Next best sellers"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop?featured=true"
                  className="text-xs font-semibold text-[#651D32] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all group"
                >
                  <span>View Full Bestseller Edit</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Right Column: Horizontal Scrollable Products Carousel */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div
                  ref={bestsellersContainerRef}
                  className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
                >
                  {bestsellers.map((product) => (
                    <div key={product.id} className="min-w-[240px] sm:min-w-[270px] max-w-[270px] snap-start flex-shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.section>
      ) : null}

      {/* SECTION 2: Sarees Collection */}
      {sarees.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FAF3E8] py-16 border-y border-[#C6A15B]/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
                  Pure South Indian Heritage
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#282323] mt-1 font-normal">
                  Sarees & Handloom Drapes
                </h2>
                <p className="text-xs text-[#716963] mt-1">
                  Timeless daily wear cottons, traditional temple border sarees, and royal occasion brocades.
                </p>
              </div>
              <Link
                to="/shop?category=sarees"
                className="text-xs font-semibold text-[#651D32] hover:underline self-start sm:self-auto flex items-center gap-1 group"
              >
                <span>Explore All Sarees</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {sarees.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>
        </motion.section>
      )}

      {/* SECTION 3: Designer Salwar Suits */}
      {salwarSuits.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
                Boutique Couture
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#282323] mt-1 font-normal">
                Designer Salwar Suits & Cape Ensembles
              </h2>
              <p className="text-xs text-[#716963] mt-1">
                Draped cowl capes, ruffled dhoti silhouettes, and shimmer halter festive suits.
              </p>
            </div>
            <Link
              to="/shop?category=salwar-suits"
              className="text-xs font-semibold text-[#651D32] hover:underline self-start sm:self-auto flex items-center gap-1 group"
            >
              <span>Explore Salwar Suits</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {salwarSuits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </motion.section>
      )}

      {/* SECTION 4: Kurtis & Kurta Sets */}
      {kurtis.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FAF8F5] py-16 border-t border-[#C6A15B]/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
                  Everyday & Festive Edit
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#282323] mt-1 font-normal">
                  Kurtis & Paired Kurta Sets
                </h2>
                <p className="text-xs text-[#716963] mt-1">
                  Breathable cotton kurtis, Kalamkari prints, and coordinated festive sets with trousers and dupattas.
                </p>
              </div>
              <Link
                to="/shop?category=kurtis-kurta-sets"
                className="text-xs font-semibold text-[#651D32] hover:underline self-start sm:self-auto flex items-center gap-1 group"
              >
                <span>Explore Kurti Sets</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {kurtis.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

    </div>
  );
};
