import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromotionalBanner: React.FC = () => {
  return (
    <section className="relative bg-[#651D32] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden my-12">
      {/* Delicate background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF9F1_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Text */}
        <div className="lg:col-span-8 text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#3B1020] border border-[#C6A15B]/40 px-3 py-1">
            <Sparkles size={12} className="text-[#C6A15B]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#E8C9C7]">
              Seasonal Celebration
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            Festive Elegance — <br />
            <span className="italic font-serif text-[#DFC58A]">Celebrate in Style.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#E8C9C7] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Adorn yourself in timeless South Indian attire designed for weddings, family poojas, and memorable milestones. Complete your look with matching dupattas and temple ornaments.
          </p>

          <div className="pt-2">
            <Link
              to="/shop?category=bridal-wear"
              className="bg-[#C6A15B] hover:bg-[#DFC58A] text-[#282323] px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
            >
              <span>Explore Festive Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Decorative Silk Vignette */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-56 sm:w-64 aspect-[3/4] border-2 border-[#C6A15B]/50 p-2 bg-[#3B1020]/40 backdrop-blur-sm shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1596783049554-38d5823157e3?auto=format&fit=crop&w=800&q=80"
              alt="Festive South Indian Bridal Pattu - DD FASHION"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
