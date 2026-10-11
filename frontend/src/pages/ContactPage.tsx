import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, FORMATTED_PHONE_DISPLAY } from '../utils/whatsapp';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ContactPage: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setContactData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#282323]">Contact DD FASHION</h1>
          <p className="text-xs sm:text-sm text-[#716963]">
            Have an inquiry about an outfit, bridal order, or sizing? Our boutique team is always delighted to assist you.
          </p>
        </div>

        {/* WhatsApp Spotlight Card */}
        <div className="bg-[#651D32] text-white p-6 sm:p-8 border border-[#C6A15B]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MessageCircle size={22} className="text-[#25D366]" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Direct WhatsApp Support & Ordering
              </h2>
            </div>
            <p className="text-xs text-[#E8C9C7]">
              Message our store assistant for instant stock checks, custom colour requests, or photos.
            </p>
            <p className="text-sm font-bold text-[#DFC58A] pt-1">
              Official WhatsApp Number: {FORMATTED_PHONE_DISPLAY}
            </p>
          </div>
          <a
            href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=Hi%20DD%20FASHION!%20I%20have%20an%20inquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp py-3.5 px-6 text-xs font-semibold uppercase tracking-wider whitespace-nowrap self-start sm:self-auto"
          >
            <MessageCircle size={16} />
            <span>Chat with Us on WhatsApp</span>
          </a>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Column (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#C6A15B]/30 p-6 space-y-6 shadow-sm text-xs">
            <h3 className="font-serif text-base font-semibold text-[#651D32] border-b border-[#C6A15B]/20 pb-2">
              Boutique Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#C6A15B] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#282323]">Phone & WhatsApp</p>
                  <p className="text-[#716963] mt-0.5">{FORMATTED_PHONE_DISPLAY}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#C6A15B] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#282323]">Email Support</p>
                  <p className="text-[#716963] mt-0.5">contact@ddfashion.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#C6A15B] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#282323]">Customer Service Hours</p>
                  <p className="text-[#716963] mt-0.5">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                  <p className="text-[#A69A90] text-[11px]">Sunday: WhatsApp inquiries answered periodically</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C6A15B] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#282323]">Service Region</p>
                  <p className="text-[#716963] mt-0.5">Chennai, Tamil Nadu & Pan-India Express Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#C6A15B]/30 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-serif text-base font-semibold text-[#651D32] border-b border-[#C6A15B]/20 pb-2">
              Send a Message
            </h3>

            {formSent ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="Tell us what you're looking for or your order question..."
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
                <button type="submit" className="btn-primary py-3 px-6 text-xs uppercase tracking-wider font-semibold">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
