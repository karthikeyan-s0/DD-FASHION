import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-24 bg-[#FFF9F1] border-b border-[#C6A15B]/20 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C6A15B]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF3E8] border border-[#C6A15B]/30 shadow-xs"
        >
          <Sparkles size={14} className="text-[#C6A15B] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[10px] tracking-[0.28em] uppercase font-semibold text-[#651D32]">
            The DD Fashion Philosophy
          </span>
          <Sparkles size={14} className="text-[#C6A15B] animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>

        <h2 className="font-serif text-3xl sm:text-4xl text-[#282323] font-normal leading-snug">
          Celebrating Every Woman's Grace, <br />
          <span className="italic font-serif text-[#651D32]">From Everyday Morning to Grand Festivities.</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#651D32] to-transparent mx-auto"
        />

        <p className="text-sm sm:text-base text-[#716963] leading-relaxed max-w-2xl mx-auto font-light">
          DD FASHION is created for women who value the balance of timeless South Indian heritage and everyday comfort. Whether it is slipping into a breathable combed cotton nighty at home, stepping out in a crisp office kurti, or draping a grand Kanjeevaram for a family wedding, we curate pieces that make you feel confident, comfortable, and elegant.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C6A15B] font-semibold"
        >
          <Heart size={14} className="text-[#651D32] fill-[#651D32]/20" />
          <span>Curated with Love in South India</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

