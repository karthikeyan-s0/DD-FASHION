import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatPrice } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    customer_name: user?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    payment_method: 'cod',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If user has saved addresses, prefill
  useEffect(() => {
    if (user) {
      api.getAddresses().then((addrs) => {
        if (addrs && addrs.length > 0) {
          const def = addrs.find((a) => a.is_default) || addrs[0];
          setFormData((prev) => ({
            ...prev,
            customer_name: def.full_name || prev.customer_name,
            customer_phone: def.phone || prev.customer_phone,
            address_line1: def.address_line1,
            address_line2: def.address_line2 || '',
            city: def.city,
            state: def.state,
            pincode: def.pincode,
          }));
        }
      }).catch(() => {});
    }
  }, [user]);

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#FFF9F1] min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-2xl text-[#282323]">Your shopping bag is empty</h2>
          <Link to="/shop" className="btn-primary">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic frontend validations
    if (!formData.customer_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.customer_phone.trim() || formData.customer_phone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile phone number.');
      return;
    }
    if (!formData.address_line1.trim()) {
      setErrorMsg('Please enter your delivery street address.');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    try {
      setIsSubmitting(true);
      const order = await api.createOrder({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: {
          full_name: formData.customer_name,
          phone: formData.customer_phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        payment_method: formData.payment_method,
        notes: formData.notes,
      });

      await refreshCart();
      navigate(`/order-confirmation/${order.order_number}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not complete order. Please check item stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs
          items={[
            { label: 'Shopping Bag', url: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        <div className="mt-4 mb-8">
          <h1 className="font-serif text-3xl text-[#282323]">Checkout & Delivery</h1>
          <p className="text-xs text-[#716963] mt-1">
            Complete your order details below. We deliver across Tamil Nadu and pan-India with verified handling.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Customer & Delivery Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Details */}
            <div className="bg-white border border-[#C6A15B]/30 p-6 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#651D32] border-b border-[#C6A15B]/20 pb-2">
                1. Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#282323] font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Priya Sundaram"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. priya@example.com"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-[#C6A15B]/30 p-6 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#651D32] border-b border-[#C6A15B]/20 pb-2">
                2. Shipping Destination
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#282323] font-medium mb-1">
                    Flat / House No., Apartment, Street Address *
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Plot 42, 2nd Avenue, Anna Nagar"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    placeholder="e.g. Near Roundtana, Opposite Temple"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      placeholder="600001"
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none focus:border-[#651D32]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#C6A15B]/30 p-6 space-y-4">
              <h2 className="font-serif text-lg font-semibold text-[#651D32] border-b border-[#C6A15B]/20 pb-2">
                3. Payment Method
              </h2>
              <div className="space-y-3 text-xs">
                
                {/* Cash on Delivery */}
                <label className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                  formData.payment_method === 'cod' ? 'border-[#651D32] bg-[#FAF3E8]' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={formData.payment_method === 'cod'}
                    onChange={handleChange}
                    className="mt-0.5 text-[#651D32]"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-[#282323]">
                      <Banknote size={16} className="text-[#651D32]" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[#716963] mt-0.5 text-[11px]">
                      Pay in cash or UPI QR upon safe physical delivery to your doorstep.
                    </p>
                  </div>
                </label>

                {/* Online Payment / Razorpay Test Mode */}
                <label className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                  formData.payment_method === 'online_razorpay' ? 'border-[#651D32] bg-[#FAF3E8]' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="online_razorpay"
                    checked={formData.payment_method === 'online_razorpay'}
                    onChange={handleChange}
                    className="mt-0.5 text-[#651D32]"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-[#282323]">
                      <CreditCard size={16} className="text-[#C6A15B]" />
                      <span>UPI / NetBanking / Cards (Gateway Test Mode)</span>
                    </div>
                    <p className="text-[#716963] mt-0.5 text-[11px]">
                      Prepared for Razorpay payments. Test mode workflow with verified backend capture.
                    </p>
                  </div>
                </label>
              </div>

              {/* Special instructions */}
              <div className="pt-2 text-xs">
                <label className="block text-[#282323] font-medium mb-1">
                  Delivery Notes or Sizing Requests (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Please leave with security if unavailable, or blouse stitch request"
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Right Summary: Order Items & Submit (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#C6A15B]/30 p-6 space-y-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-[#282323] border-b border-[#C6A15B]/20 pb-3">
              Order Review ({cart.item_count} items)
            </h2>

            {/* Thumbnail items list */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex gap-3 text-xs">
                  <div className="w-14 aspect-[3/4] bg-[#FAF3E8] overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#282323] line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-[#716963] mt-0.5">
                      {item.size ? `Size: ${item.size} • ` : ''}Qty: {item.quantity}
                    </p>
                    <p className="font-semibold text-[#651D32] mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation */}
            <div className="pt-4 border-t border-[#C6A15B]/20 space-y-2 text-xs">
              <div className="flex justify-between text-[#716963]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#282323]">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#716963]">
                <span>Delivery Charges</span>
                <span>
                  {cart.shipping_fee === 0 ? (
                    <span className="text-green-700 font-semibold uppercase">Free</span>
                  ) : (
                    formatPrice(cart.shipping_fee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#651D32] pt-3 border-t border-gray-100">
                <span>Final Payable</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock size={14} />
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
            </button>

            <div className="text-[11px] text-[#716963] space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#C6A15B]" />
                <span>100% Secure Checkout & Database Persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#C6A15B]" />
                <span>Dispatches from Tamil Nadu within 24-48 hours</span>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
