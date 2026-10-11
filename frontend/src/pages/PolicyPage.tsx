import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, FileText, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PolicyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'shipping';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setActiveTab(t);
  }, [searchParams]);

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={[{ label: 'Store Policies & FAQ' }]} />

        <div>
          <h1 className="font-serif text-3xl text-[#282323]">Store Policies & Support</h1>
          <p className="text-xs text-[#716963] mt-1">
            Transparent terms and guidance for your DD FASHION shopping experience.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#C6A15B]/30 overflow-x-auto space-x-6 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          <button
            onClick={() => selectTab('shipping')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'shipping'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <Truck size={14} />
            <span>Shipping Policy</span>
          </button>
          <button
            onClick={() => selectTab('returns')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'returns'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <RotateCcw size={14} />
            <span>Returns & Refunds</span>
          </button>
          <button
            onClick={() => selectTab('privacy')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => selectTab('terms')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <FileText size={14} />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => selectTab('faq')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'faq'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <HelpCircle size={14} />
            <span>FAQs</span>
          </button>
        </div>

        {/* Policy Body */}
        <div className="bg-white border border-[#C6A15B]/30 p-6 sm:p-10 text-xs sm:text-sm text-[#716963] leading-relaxed space-y-6 shadow-sm">
          
          {/* SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#651D32] font-normal">Shipping & Delivery Policy</h2>
              <p>
                At DD FASHION, we ensure all South Indian handlooms, bridal silk sarees, and nightwear garments are carefully inspected and securely packed before dispatch.
              </p>
              <h3 className="font-serif text-base text-[#282323] font-semibold pt-2">Delivery Charges</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders over ₹1,999: <strong>FREE Delivery</strong> across all states in India.</li>
                <li>Standard Flat Shipping Fee: <strong>₹99</strong> for orders under ₹1,999.</li>
              </ul>
              <h3 className="font-serif text-base text-[#282323] font-semibold pt-2">Dispatch & Delivery Timelines</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tamil Nadu & Puducherry:</strong> Delivery within 2 to 3 business days.</li>
                <li><strong>South India (Karnataka, Kerala, Andhra Pradesh, Telangana):</strong> 3 to 4 business days.</li>
                <li><strong>Rest of India:</strong> 4 to 7 business days via express courier partners.</li>
              </ul>
              <p>
                A tracking SMS and WhatsApp update will be sent as soon as your parcel is dispatched.
              </p>
            </div>
          )}

          {/* RETURNS */}
          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#651D32] font-normal">Return & Exchange Policy</h2>
              <p>
                We want you to be completely delighted with your purchase. If you are not satisfied with the fit or color, we provide an easy 7-day return and exchange window.
              </p>
              <h3 className="font-serif text-base text-[#282323] font-semibold pt-2">Conditions for Returns</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Garments must be unworn, unwashed, and undamaged with all original boutique tags intact.</li>
                <li>Sarees with unstitched blouse pieces must not be cut or separated.</li>
                <li>Customized or tailored blouses/alterations are non-returnable.</li>
                <li>Hygiene-sensitive items: Feeding nighties and innerwear are exchangeable only for manufacturing defects.</li>
              </ul>
              <h3 className="font-serif text-base text-[#282323] font-semibold pt-2">How to Request a Return</h3>
              <p>
                Simply message us on WhatsApp (+91 98942 51098) or email contact@ddfashion.com with your Order Number and photo of the product. Our team will arrange pickup or share return instructions within 24 hours.
              </p>
            </div>
          )}

          {/* PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#651D32] font-normal">Privacy & Data Protection</h2>
              <p>
                Your privacy is paramount at DD FASHION. We collect only the information necessary to fulfill your orders, provide styling assistance, and communicate dispatch updates.
              </p>
              <h3 className="font-serif text-base text-[#282323] font-semibold pt-2">Data Security</h3>
              <p>
                Passwords are cryptographically hashed using industry-standard bcrypt algorithms. We never store payment card numbers, CVVs, or net banking passwords in plaintext.
              </p>
              <p>
                We do not sell, rent, or trade customer contact details with third-party advertising brokers.
              </p>
            </div>
          )}

          {/* TERMS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#651D32] font-normal">Terms and Conditions</h2>
              <p>
                By placing an order on DD FASHION (either via the website storefront or via official WhatsApp chat), you agree to our standard boutique terms of service.
              </p>
              <p>
                While we strive for color accuracy in all photography, slight natural variations in silk sheen and handloom textures may occur due to screen calibration and organic dye lots.
              </p>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl text-[#651D32] font-normal">Frequently Asked Questions</h2>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-[#282323]">How does WhatsApp Ordering work?</h4>
                <p>
                  You can tap "Order on WhatsApp" from any product or from your shopping bag. This opens WhatsApp with your pre-filled item specifications. You simply send the message, and our boutique assistant confirms stock, delivery timeline, and payment.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="font-semibold text-[#282323]">Do you offer Cash on Delivery (COD)?</h4>
                <p>
                  Yes, Cash on Delivery is available for all standard pin codes across Tamil Nadu and India.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="font-semibold text-[#282323]">Are your silk sarees certified?</h4>
                <p>
                  All our pure Kanchipuram and Kalyana Pattu sarees are woven with tested zari and pure mulberry silk fibers, adhering to traditional South Indian weaving standards.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="font-semibold text-[#282323]">Are the cotton nighties pre-shrunk?</h4>
                <p>
                  Yes! All DD FASHION pure combed Coimbatore cotton nighties undergo pre-washing to minimize shrinkage and ensure lasting softness.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
