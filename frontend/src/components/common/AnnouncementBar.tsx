import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { FORMATTED_PHONE_DISPLAY, OFFICIAL_WHATSAPP_NUMBER } from '../../utils/whatsapp';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#3D0C13] text-[#FFF9F1] text-[11px] sm:text-xs py-2 px-4 border-b border-[#C6A15B]/30 tracking-wider">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-[#C6A15B]" />
          <span className="font-serif tracking-wide text-[#FAF8F5]">
            Celebrate Every Moment In Style | Discover DD FASHION
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] sm:text-[11px] tracking-wider uppercase text-[#E8C9C7]">
          <span className="hidden md:inline font-medium">Free Delivery on orders above ₹1,999</span>
          <span className="hidden md:inline text-[#C6A15B]/50">|</span>
          <a
            href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=Hi%20DD%20FASHION!%20I%20have%20an%20inquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#C6A15B] hover:text-[#FAF8F5] transition-colors font-medium"
          >
            <MessageCircle size={13} className="text-[#25D366]" />
            <span>WhatsApp Orders: {FORMATTED_PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
