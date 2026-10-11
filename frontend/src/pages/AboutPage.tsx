import React from 'react';
import { Sparkles, Heart, ShieldCheck, Truck } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <Breadcrumbs items={[{ label: 'About DD FASHION' }]} />

        {/* Hero Banner */}
        <div className="bg-[#FAF3E8] border border-[#C6A15B]/30 p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <Sparkles size={14} className="text-[#C6A15B]" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#651D32]">
              South Indian Boutique
            </span>
            <Sparkles size={14} className="text-[#C6A15B]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#282323] font-normal">
            About DD FASHION
          </h1>
          <div className="w-16 h-0.5 bg-[#651D32] mx-auto" />
          <p className="text-sm text-[#716963] max-w-2xl mx-auto leading-relaxed">
            A celebration of authentic textiles, everyday ease, and South Indian grace.
          </p>
        </div>

        {/* Narrative */}
        <div className="bg-white border border-[#C6A15B]/30 p-8 sm:p-10 space-y-6 text-xs sm:text-sm text-[#716963] leading-relaxed shadow-sm">
          <h2 className="font-serif text-2xl text-[#282323] font-normal">
            Tradition Crafted for the Modern Woman
          </h2>
          <p>
            DD FASHION is a dedicated destination for women in Tamil Nadu and across South India who seek traditional elegance combined with the comfort needed for modern life. Our collections span from breathable 100% combed cotton nighties and everyday office kurtis to opulent wedding Kanjeevarams, three-piece chudithar sets, and heritage temple jewellery.
          </p>
          <p>
            We believe that every woman deserves apparel that respects both cultural heritage and genuine physical comfort. Our design philosophy avoids synthetic discomfort in favor of climate-appropriate South Indian natural cottons, hand-woven soft silks, and breathable mulmuls.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100 text-center">
            <div className="p-4 bg-[#FAF3E8] border border-[#C6A15B]/20 space-y-2">
              <Heart size={24} className="text-[#651D32] mx-auto" />
              <h3 className="font-serif text-base font-semibold text-[#282323]">Everyday Ease</h3>
              <p className="text-xs text-[#716963]">Roomy cuts, soft fabrics, and nursing-friendly options for real life.</p>
            </div>
            <div className="p-4 bg-[#FAF3E8] border border-[#C6A15B]/20 space-y-2">
              <Sparkles size={24} className="text-[#C6A15B] mx-auto" />
              <h3 className="font-serif text-base font-semibold text-[#282323]">Festive Grandeur</h3>
              <p className="text-xs text-[#716963]">Opulent zari borders, temple motifs, and bridal ensembles.</p>
            </div>
            <div className="p-4 bg-[#FAF3E8] border border-[#C6A15B]/20 space-y-2">
              <ShieldCheck size={24} className="text-[#651D32] mx-auto" />
              <h3 className="font-serif text-base font-semibold text-[#282323]">Honest Craft</h3>
              <p className="text-xs text-[#716963]">Direct boutique curation with verified fabrics and tested dyes.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
