import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';

// Traditional South Indian boutique floral / kolam motif separator matching reference
const FloralMotif: React.FC = () => (
  <span className="inline-flex items-center justify-center mx-5 sm:mx-8 md:mx-10 shrink-0 text-[#C6A15B] opacity-85 select-none" aria-hidden="true">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      {/* Central diamond dot */}
      <circle cx="12" cy="12" r="3" />
      {/* 4 cardinal flower petals */}
      <circle cx="12" cy="4" r="2.2" />
      <circle cx="12" cy="20" r="2.2" />
      <circle cx="4" cy="12" r="2.2" />
      <circle cx="20" cy="12" r="2.2" />
      {/* 4 diagonal accent dots */}
      <circle cx="6.5" cy="6.5" r="1.4" />
      <circle cx="17.5" cy="6.5" r="1.4" />
      <circle cx="6.5" cy="17.5" r="1.4" />
      <circle cx="17.5" cy="17.5" r="1.4" />
    </svg>
  </span>
);

export const BoutiqueRunningRibbon: React.FC = () => {
  const marqueeItems = [
    'STYLE',
    'BEAUTY',
    'FASHION',
    'CONFIDENCE',
    'SAIDAPET',
    'CHENNAI',
    'TRADITION',
    'ELEGANCE',
    'DD FASHION',
    'HERITAGE',
  ];

  const handleScrollToExplore = () => {
    const target = document.getElementById('categories') || document.getElementById('collections');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#0C0608] text-white overflow-hidden select-none border-t border-[#C6A15B]/30">
      
      {/* Background Micro-Dot Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(198, 161, 91, 0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Bar: Scroll To Explore & Saidapet Pill */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        
        {/* Top-Right Floating Boutique Badge (Matches Screenshot) */}
        <div className="sm:absolute sm:right-6 lg:right-8 sm:top-5 mb-4 sm:mb-0 flex justify-center sm:justify-end">
          <div className="inline-flex items-center gap-3 bg-[#180A10]/90 border border-[#C6A15B]/50 px-4 py-2 rounded-xl backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] group hover:border-[#C6A15B] transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-[#C6A15B]/20 border border-[#C6A15B]/60 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-[#C6A15B] animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#FFF9F1] uppercase leading-none">
                SAIDAPET • CHENNAI
              </span>
              <span className="text-[9px] font-medium text-[#C6A15B]/90 tracking-wider mt-1">
                Local Fashion & Style
              </span>
            </div>
          </div>
        </div>

        {/* Center: Scroll To Explore Indicator */}
        <div className="flex flex-col items-center justify-center text-center">
          <button
            onClick={handleScrollToExplore}
            className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform duration-300 hover:scale-105"
            aria-label="Scroll down to explore categories"
          >
            <span className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-[#C6A15B]/90 group-hover:text-[#C6A15B] transition-colors">
              SCROLL TO EXPLORE
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="text-[#C6A15B] group-hover:text-white transition-colors"
            >
              <ChevronDown size={15} strokeWidth={2.5} />
            </motion.div>
          </button>
        </div>

      </div>

      {/* Full-Width Luxury Running Marquee Ribbon */}
      <div className="w-full bg-[#080406] border-y border-[#C6A15B]/35 py-3.5 sm:py-4.5 overflow-hidden relative shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
        
        {/* Edge Gradient Masks for Smooth Dissolve */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#080406] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#080406] to-transparent z-10" />

        {/* Seamless Infinite Running Track */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex items-center whitespace-nowrap">
            {/* Set 1 */}
            {marqueeItems.map((word, idx) => (
              <React.Fragment key={`set1-${idx}`}>
                <span 
                  className="font-serif text-sm sm:text-base md:text-lg tracking-[0.28em] uppercase text-[#F8F5EE] font-light hover:text-[#C6A15B] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                >
                  {word}
                </span>
                <FloralMotif />
              </React.Fragment>
            ))}

            {/* Set 2 (Exact clone for 100% gapless loop) */}
            {marqueeItems.map((word, idx) => (
              <React.Fragment key={`set2-${idx}`}>
                <span 
                  className="font-serif text-sm sm:text-base md:text-lg tracking-[0.28em] uppercase text-[#F8F5EE] font-light hover:text-[#C6A15B] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                >
                  {word}
                </span>
                <FloralMotif />
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
