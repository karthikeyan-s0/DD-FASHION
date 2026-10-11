import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Crown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#FAF8F5] overflow-hidden border-b border-[#C6A15B]/25 select-none">
      
      {/* Background Micro-Texture / Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#651D32 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Background Watermark Layer: "KANJEEVARAM" with gentle drift */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <span 
          className="font-serif tracking-[0.25em] text-[#C6A15B]/[0.07] uppercase whitespace-nowrap select-none font-bold transform -translate-y-8 animate-watermark"
          style={{ fontSize: 'clamp(5rem, 15vw, 15rem)', letterSpacing: '0.18em' }}
        >
          KANJEEVARAM
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px] items-center py-10 lg:py-14 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Editorial Typography & Conversion Hub */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left pt-2">
            
            {/* Frosted Gold Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-[#FAF3E8]/90 border border-[#C6A15B]/50 px-4 py-1.5 rounded-full shadow-[0_2px_14px_rgba(198,161,91,0.2)] backdrop-blur-md"
            >
              <Sparkles size={12} className="text-[#C6A15B] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold text-[#651D32]">
                FESTIVE & BRIDAL EDIT 2026
              </span>
            </motion.div>

            {/* Monumental Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-3xl sm:text-5xl lg:text-7xl text-[#282323] leading-[1.12] sm:leading-[1.08] font-normal tracking-tight"
            >
              Tradition, <br />
              <span 
                className="font-serif italic font-normal text-[#3D0C13] tracking-wide inline-block mt-1"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              >
                Woven Beautifully.
              </span>
            </motion.h1>

            {/* Narrative Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm lg:text-base text-[#716963] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Discover South Indian fashion for every moment — from everyday combed cotton comfort to opulent Kanjeevarams, festive chudithars, and temple jewellery.
            </motion.p>

            {/* CTA Group */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-[#4A0E17] hover:bg-[#380A11] text-[#FFF9F1] border border-[#C6A15B] py-3.5 px-8 text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(74,14,23,0.35)] hover:shadow-[0_8px_30px_rgba(198,161,91,0.45)] flex items-center justify-center gap-2 rounded-sm group animate-shimmer"
              >
                <span>SHOP COLLECTIONS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold">→</span>
              </Link>
              
              <Link
                to="/shop?new=true"
                className="w-full sm:w-auto bg-transparent hover:bg-white text-[#3D0C13] border border-[#C6A15B]/70 hover:border-[#3D0C13] py-3.5 px-7 text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-md rounded-sm"
              >
                <span>EXPLORE NEW ARRIVALS</span>
              </Link>
            </motion.div>

            {/* Value Proposition Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 grid grid-cols-3 gap-1.5 sm:gap-6 border-t border-[#C6A15B]/30 max-w-lg mx-auto lg:mx-0"
            >
              
              {/* Badge 1: 100% Authentic Weaves */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5 sm:space-y-1 pr-1 sm:pr-2 group cursor-default">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5 sm:mb-1 transition-transform duration-300 group-hover:scale-110">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="8" y1="4" x2="8" y2="20" strokeDasharray="2 2" />
                  <line x1="16" y1="4" x2="16" y2="20" strokeDasharray="2 2" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeDasharray="2 2" />
                  <line x1="3" y1="14" x2="21" y2="14" strokeDasharray="2 2" />
                </svg>
                <span className="font-serif text-xs sm:text-base font-bold text-[#3D0C13] leading-none">100%</span>
                <span className="text-[8px] sm:text-[10px] text-[#716963] font-semibold uppercase tracking-wider leading-tight">Authentic Weaves</span>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5 sm:space-y-1 border-l border-[#C6A15B]/30 pl-2 sm:pl-5 pr-1 sm:pr-2 group cursor-default">
                <Crown size={20} className="text-[#C6A15B] mb-0.5 sm:mb-1 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.6} />
                <span className="font-serif text-xs sm:text-base font-bold text-[#3D0C13] leading-none">Direct</span>
                <span className="text-[8px] sm:text-[10px] text-[#716963] font-semibold uppercase tracking-wider leading-tight">Boutique Quality</span>
              </div>

              {/* Badge 3: Instant WhatsApp Ordering */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-0.5 sm:space-y-1 border-l border-[#C6A15B]/30 pl-2 sm:pl-5 group cursor-default">
                <MessageCircle size={20} className="text-[#C6A15B] mb-0.5 sm:mb-1 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.6} />
                <span className="font-serif text-xs sm:text-base font-bold text-[#3D0C13] leading-none">Instant</span>
                <span className="text-[8px] sm:text-[10px] text-[#716963] font-semibold uppercase tracking-wider leading-tight">WhatsApp Orders</span>
              </div>

            </motion.div>

          </div>

          {/* RIGHT COLUMN: Hero Couture Showcase (Temple Arch Portrait) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Ambient Warm Golden Rim Glow */}
            <div className="absolute w-[300px] h-[440px] sm:w-[380px] sm:h-[520px] rounded-full bg-[#C6A15B]/20 filter blur-3xl -z-0 animate-pulse-gold pointer-events-none" />
            
            {/* Arch Container with Gentle Floating Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[400px] group transition-transform duration-700 animate-float"
            >
              
              {/* Arch Image Asset with Luxury Deep Shadow */}
              <div className="relative overflow-hidden drop-shadow-[0_22px_45px_rgba(61,12,19,0.30)] hover:drop-shadow-[0_26px_50px_rgba(198,161,91,0.35)] transition-all duration-500">
                <img
                  src="/images/hero_kanjeevaram_arch_transparent.png"
                  alt="DD FASHION Luxury Bridal Kanjeevaram Silk Saree Collection"
                  className="w-full h-auto object-contain block mx-auto"
                />

                {/* Interactive Clickable Hotspot linking to Sarees Collection */}
                <Link
                  to="/shop?category=sarees"
                  className="absolute inset-0 z-20 cursor-pointer"
                  aria-label="View Kalyana Pattu Bridal Kanjeevaram Saree Collection"
                />
              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
