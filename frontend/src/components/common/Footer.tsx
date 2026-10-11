import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, FORMATTED_PHONE_DISPLAY } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3B1020] text-[#FFF9F1] pt-16 pb-12 border-t border-[#651D32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#651D32]/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                DD FASHION
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-[#C6A15B] font-semibold">
                South Indian Boutique
              </span>
            </Link>
            <p className="text-xs text-[#E8C9C7] leading-relaxed max-w-sm">
              Discover authentic South Indian women's fashion. Timeless Kanjeevarams, three-piece chudithar sets, comfortable combed cotton nightwear, and heritage temple jewellery.
            </p>

            {/* WHATSAPP CONTACT BLOCK */}
            <div className="p-4 bg-[#651D32]/60 border border-[#C6A15B]/30 max-w-sm space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#25D366]" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  DD FASHION — WhatsApp Orders
                </span>
              </div>
              <p className="text-[11px] text-[#E8C9C7]">
                Browse, inquire, or send your cart details directly to our store team.
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-[#DFC58A]">{FORMATTED_PHONE_DISPLAY}</span>
                <a
                  href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <MessageCircle size={12} />
                  <span>Chat with Us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#DFC58A] tracking-wider uppercase">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#E8C9C7]">
              <li>
                <Link to="/shop?category=chudithars" className="hover:text-white transition-colors">
                  Chudithar Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sarees" className="hover:text-white transition-colors">
                  Silk & Cotton Sarees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kurtis" className="hover:text-white transition-colors">
                  Kurtis & Kurta Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cotton-nighties" className="hover:text-white transition-colors">
                  Pure Cotton Nighties
                </Link>
              </li>
              <li>
                <Link to="/shop?category=half-sarees" className="hover:text-white transition-colors">
                  Half Sarees (Langa Davani)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=jewellery" className="hover:text-white transition-colors">
                  Temple Jewellery & Jhumkas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#DFC58A] tracking-wider uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-[#E8C9C7]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About DD FASHION
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=shipping" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=returns" className="hover:text-white transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/policies?tab=faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  My Account & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#DFC58A] tracking-wider uppercase">
              Boutique Inquiries
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8C9C7]">
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-[#C6A15B] mt-0.5 flex-shrink-0" />
                <span>{FORMATTED_PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-[#C6A15B] mt-0.5 flex-shrink-0" />
                <span>contact@ddfashion.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#C6A15B] mt-0.5 flex-shrink-0" />
                <span>Tamil Nadu & Pan-India Service</span>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-[#A69A90]">
              Working Hours: 10:00 AM – 8:00 PM IST (Mon – Sat)
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A69A90]">
          <p>© {new Date().getFullYear()} DD FASHION. All rights reserved. Authentic South Indian Women's Boutique.</p>
          <div className="flex items-center space-x-4">
            <Link to="/policies?tab=privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/policies?tab=terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
