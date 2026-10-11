import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { buildCartWhatsAppUrl } from '../utils/whatsapp';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  const freeShippingThreshold = 1999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const whatsappUrl = buildCartWhatsAppUrl(cart.items, cart.subtotal);

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#FFF9F1] min-h-[70vh] flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4 space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#E8C9C7]/30 flex items-center justify-center text-[#651D32] mx-auto">
            <ShoppingBag size={36} />
          </div>
          <h1 className="font-serif text-3xl text-[#282323]">Your Shopping Bag is Empty</h1>
          <p className="text-xs text-[#716963] leading-relaxed">
            Discover our curated South Indian handloom sarees, three-piece chudithars, and comfortable combed cotton nightwear.
          </p>
          <div className="pt-2">
            <Link to="/shop" className="btn-primary">
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

        <div className="mt-4 mb-8">
          <h1 className="font-serif text-3xl text-[#282323]">Your Shopping Bag</h1>
          <p className="text-xs text-[#716963] mt-1">
            Review your selected boutique items before completing your order or forwarding to WhatsApp.
          </p>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-[#FAF3E8] border border-[#C6A15B]/30 p-4 mb-8 flex items-center justify-between text-xs text-[#282323]">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-[#C6A15B]" />
            <span>
              {amountToFreeShipping > 0 ? (
                <>
                  Add <strong className="text-[#651D32]">{formatPrice(amountToFreeShipping)}</strong> more of items to qualify for <strong>FREE Delivery</strong> across India!
                </>
              ) : (
                <strong className="text-[#651D32]">Congratulations! You qualify for FREE Delivery.</strong>
              )}
            </span>
          </div>
          <Link to="/shop" className="hidden sm:inline text-xs font-semibold text-[#651D32] underline">
            Continue Shopping
          </Link>
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#C6A15B]/30 p-4 sm:p-6 shadow-sm">
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => {
                const img = item.product.images?.[0]?.image_url || '/images/boutique_placeholder.svg';
                return (
                  <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    
                    {/* Thumbnail & Title */}
                    <div className="flex gap-4 items-center">
                      <div className="w-20 aspect-[3/4] bg-[#FAF3E8] flex-shrink-0 overflow-hidden border border-[#C6A15B]/20">
                        <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-medium text-sm text-[#282323] hover:text-[#651D32] transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 text-xs text-[#716963] mt-1">
                          {item.size && (
                            <span className="bg-[#FAF3E8] px-2 py-0.5 border border-[#C6A15B]/30">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="bg-[#FAF3E8] px-2 py-0.5 border border-[#C6A15B]/30">
                              Colour: {item.color}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#716963] mt-1 sm:hidden">
                          Unit: {formatPrice(item.product.price)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      <div className="hidden sm:block text-xs font-medium text-[#716963] min-w-[70px] text-right">
                        {formatPrice(item.product.price)}
                      </div>

                      <div className="flex items-center border border-[#C6A15B]/40 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-[#282323] hover:bg-[#FAF3E8]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#282323] hover:bg-[#FAF3E8]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-[#282323] min-w-[80px] text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#A69A90] hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
              <button
                onClick={clearCart}
                className="text-[#A69A90] hover:text-[#651D32] underline"
              >
                Clear Entire Bag
              </button>
              <Link to="/shop" className="text-[#651D32] font-semibold hover:underline">
                Add More Items &rarr;
              </Link>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#C6A15B]/30 p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#282323] pb-3 border-b border-[#C6A15B]/20">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#716963]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#282323]">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#716963]">
                <span>Standard Delivery</span>
                <span>
                  {cart.shipping_fee === 0 ? (
                    <span className="text-green-700 font-semibold uppercase">Free</span>
                  ) : (
                    formatPrice(cart.shipping_fee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#651D32] pt-3 border-t border-gray-100">
                <span>Total Amount</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            {/* WHATSAPP ORDER ENTIRE CART BUTTON */}
            <div className="pt-2 space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-whatsapp py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Order Cart on WhatsApp</span>
              </a>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <p className="text-[11px] text-[#A69A90] text-center pt-2 leading-relaxed">
              Safe & verified dispatch. Cash on Delivery available. Online orders processed via encrypted banking gateway.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
