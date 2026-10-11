import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const CraftsmanshipStory: React.FC = () => {
  return (
    <section className="py-24 bg-[#FAF3E8] border-b border-[#C6A15B]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Images Gallery Block */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden border border-[#C6A15B]/30 shadow-md group rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Weaver Textile Artistry"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-4 bg-white border border-[#C6A15B]/20 text-center shadow-xs">
                <p className="font-serif text-2xl font-bold text-[#651D32]">100%</p>
                <p className="text-[11px] text-[#716963] uppercase tracking-wider mt-0.5">Combed Natural Cotton</p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 bg-[#651D32] text-white text-center shadow-xs">
                <p className="font-serif text-2xl font-bold text-[#DFC58A]">Pure Zari</p>
                <p className="text-[11px] text-[#E8C9C7] uppercase tracking-wider mt-0.5">Heritage Korvai Borders</p>
              </div>
              <div className="aspect-[3/4] overflow-hidden border border-[#C6A15B]/30 shadow-md group rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                  alt="Silk Saree Border Weave"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 border border-[#C6A15B]/30 shadow-xs">
              <Sparkles size={13} className="text-[#C6A15B]" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#651D32]">
                Our Craftsmanship & Heritage
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#282323] leading-snug font-normal">
              Woven with Soul, <br />
              <span className="italic font-serif text-[#651D32]">Tailored for Grace.</span>
            </h2>

            <p className="text-sm text-[#716963] leading-relaxed">
              At DD FASHION, we believe that true luxury lies in the touch of natural fibers and authentic handloom techniques. From the bustling looms of Kanchipuram and Coimbatore to your home, every garment is inspected for textile purity, vibrant colorfastness, and meticulous seam finishes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-white border border-[#C6A15B]/20 hover:border-[#651D32]/40 transition-colors shadow-xs">
                <ShieldCheck size={20} className="text-[#C6A15B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-xs text-[#282323]">Authentic Handloom</h4>
                  <p className="text-[11px] text-[#716963] mt-0.5">Woven by skilled artisan weavers across Tamil Nadu.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white border border-[#C6A15B]/20 hover:border-[#651D32]/40 transition-colors shadow-xs">
                <HeartHandshake size={20} className="text-[#C6A15B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-xs text-[#282323]">Skin-Friendly Comfort</h4>
                  <p className="text-[11px] text-[#716963] mt-0.5">Breathable 80s count cottons suited for tropical climates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white border border-[#C6A15B]/20 hover:border-[#651D32]/40 transition-colors shadow-xs">
                <Award size={20} className="text-[#C6A15B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-xs text-[#282323]">Quality Verified</h4>
                  <p className="text-[11px] text-[#716963] mt-0.5">Triple quality check before packaging and swift dispatch.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white border border-[#C6A15B]/20 hover:border-[#651D32]/40 transition-colors shadow-xs">
                <Sparkles size={20} className="text-[#C6A15B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-xs text-[#282323]">Personal WhatsApp Help</h4>
                  <p className="text-[11px] text-[#716963] mt-0.5">Direct styling advice and sizing confirmation on WhatsApp.</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
