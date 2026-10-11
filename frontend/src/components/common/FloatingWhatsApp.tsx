import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultMessage = encodeURIComponent(
    "Hi DD FASHION! I would like assistance with choosing an outfit from your boutique."
  );

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-end flex-col gap-2">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="bg-[#FFF9F1] border border-[#C6A15B] shadow-2xl rounded-sm p-3 max-w-[240px] text-xs text-[#282323] relative animate-fadeIn backdrop-blur-md">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-1 text-[#A69A90] hover:text-[#282323]"
            aria-label="Close tooltip"
          >
            <X size={12} />
          </button>
          <p className="font-serif font-semibold text-[#651D32] mb-0.5">DD FASHION Concierge</p>
          <p className="text-[11px] text-[#716963] leading-relaxed">
            Personal styling assistance & instant boutique orders on WhatsApp.
          </p>
        </div>
      )}

      {/* Floating Action Button with Luxury Gold Styling & Radar Wave */}
      <div className="relative">
        {/* Pulsing Radar Ring */}
        <span className="absolute inset-0 rounded-full bg-[#C6A15B]/40 animate-radar pointer-events-none" />

        <a
          href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${defaultMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative w-14 h-14 bg-gradient-to-tr from-[#9F7C38] via-[#C6A15B] to-[#F1DFC0] text-[#3D0C13] rounded-full shadow-[0_8px_25px_rgba(198,161,91,0.55)] border border-[#FFF9F1]/80 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#C6A15B]/40"
          aria-label="Chat with DD FASHION on WhatsApp at +91 98942 51098"
        >
          <MessageCircle size={26} className="transition-transform duration-300 group-hover:rotate-12 fill-current" />
          <span className="sr-only">Order on WhatsApp +91 98942 51098</span>
        </a>
      </div>
    </div>
  );
};
