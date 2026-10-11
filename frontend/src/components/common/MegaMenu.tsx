import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'Traditional & Bridal',
      links: [
        { name: 'Kanjeevaram & Soft Silk Sarees', slug: 'sarees' },
        { name: 'Chudithar & Salwar Sets', slug: 'chudithars' },
        { name: 'Half Sarees (Langa Davani)', slug: 'half-sarees' },
        { name: 'Wedding & Bridal Ensembles', slug: 'bridal-wear' },
        { name: 'Anarkali Suits', slug: 'anarkali-suits' },
        { name: 'Handcrafted Aari Blouses', slug: 'blouses' },
      ],
    },
    {
      title: 'Everyday & Loungewear',
      links: [
        { name: 'Pure Cotton Nighties', slug: 'cotton-nighties' },
        { name: 'Printed & Batik Nighties', slug: 'printed-nighties' },
        { name: 'Maternity Feeding Nighties', slug: 'feeding-nighties' },
        { name: 'Kurtis & Kurta Sets', slug: 'kurtis-kurta-sets' },
        { name: 'Palazzo Sets & Coordinates', slug: 'palazzo-sets' },
        { name: 'Comfortable Leggings & Bottoms', slug: 'bottom-wear' },
        { name: 'House Dresses & Kaftans', slug: 'kaftans' },
      ],
    },
    {
      title: 'Heritage Jewellery & Accessories',
      links: [
        { name: 'Kemp Stone Temple Jewellery', slug: 'jewellery' },
        { name: 'Traditional Jhumkas & Chandbalis', slug: 'jhumkas' },
        { name: 'Antique Kada Bangles & Sets', slug: 'bangles' },
        { name: 'Kasu Malai & Mango Malas', slug: 'necklaces' },
        { name: 'Zardozi Clutches & Potlis', slug: 'handbags' },
        { name: 'Banarasi & Kalamkari Dupattas', slug: 'dupattas' },
      ],
    },
  ];

  return (
    <div
      className="absolute top-full left-0 w-full bg-[#FFF9F1] border-b border-[#C6A15B]/30 shadow-2xl py-8 px-6 z-50 transition-all duration-300"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {sections.map((col, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="font-serif text-base text-[#651D32] border-b border-[#E8C9C7] pb-2 font-semibold">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.slug}>
                  <Link
                    to={`/shop?category=${link.slug}`}
                    onClick={onClose}
                    className="text-xs text-[#716963] hover:text-[#651D32] transition-colors block font-medium tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Featured Visual Spotlight */}
        <div className="bg-[#FAF3E8] p-5 border border-[#C6A15B]/20 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#651D32] bg-[#E8C9C7]/50 px-2 py-0.5 rounded">
              Festive Edit 2026
            </span>
            <h4 className="font-serif text-lg text-[#282323] mt-2 font-bold">
              The Heritage Silk Showcase
            </h4>
            <p className="text-xs text-[#716963] mt-1.5 leading-relaxed">
              Hand-spun pure Kanchipuram silk sarees and zari chudithars woven with timeless South Indian grace.
            </p>
          </div>
          <Link
            to="/shop?category=sarees"
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-[#651D32] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all group"
          >
            <span>Explore Bridal Pattu</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
