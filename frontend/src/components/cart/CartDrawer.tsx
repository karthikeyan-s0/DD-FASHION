import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { buildCartWhatsAppUrl } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingPercent = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const whatsappOrderUrl = buildCartWhatsAppUrl(cart.items, cart.subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F1] shadow-2xl flex flex-col justify-between border-l border-[#C6A15B]/30">
          
          {/* Header */}
          <div className="p-5 border-b border-[#C6A15B]/20 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#651D32]" />
              <h2 className="font-serif text-lg font-bold text-[#282323]">
                Shopping Bag ({cart.item_count})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#A69A90] hover:text-[#651D32] transition-colors"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FAF3E8] px-5 py-3 border-b border-[#C6A15B]/20">
            <div className="flex items-center justify-between text-xs text-[#282323] mb-1.5">
              <span className="flex items-center gap-1 font-medium">
                <Truck size={14} className="text-[#C6A15B]" />
                {amountToFreeShipping > 0 ? (
                  <>Add <strong className="text-[#651D32]">{formatPrice(amountToFreeShipping)}</strong> for FREE Delivery</>
                ) : (
                  <strong className="text-[#651D32]">You've unlocked FREE Delivery across India!</strong>
                )}
              </span>
              <span className="text-[10px] text-[#716963] font-semibold">{Math.round(freeShippingPercent)}%</span>
            </div>
            <div className="w-full bg-[#E8C9C7]/40 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#651D32] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8C9C7]/30 flex items-center justify-center text-[#651D32]">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#282323]">Your bag is empty</h3>
                  <p className="text-xs text-[#716963] mt-1">
                    Discover our exquisite collection of Kanjeevarams, Chudithars, and comfortable cottons.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="btn-primary mt-2"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.items.map((item) => {
                const img = item.product.images?.[0]?.image_url || '/images/boutique_placeholder.svg';
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-white p-3 border border-[#C6A15B]/20 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 aspect-[3/4] bg-[#FAF3E8] flex-shrink-0 overflow-hidden">
                      <img
                        src={img}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-medium text-xs text-[#282323] hover:text-[#651D32] line-clamp-2 leading-tight"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#A69A90] hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Variants */}
                        <div className="flex flex-wrap gap-2 text-[10px] text-[#716963] mt-1.5">
                          {item.size && (
                            <span className="bg-[#FAF3E8] border border-[#C6A15B]/30 px-1.5 py-0.5">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="bg-[#FAF3E8] border border-[#C6A15B]/30 px-1.5 py-0.5">
                              {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center border border-[#C6A15B]/40 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-[#282323] hover:bg-[#FAF3E8]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 py-0.5 text-xs font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#282323] hover:bg-[#FAF3E8]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-xs font-semibold text-[#282323]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Calculations and Action Buttons */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-[#C6A15B]/30 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#716963]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#282323]">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#716963]">
                  <span>Delivery Charges</span>
                  <span>
                    {cart.shipping_fee === 0 ? (
                      <span className="text-green-700 font-semibold uppercase text-[10px]">Free</span>
                    ) : (
                      formatPrice(cart.shipping_fee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#651D32] pt-2 border-t border-gray-100">
                  <span>Estimated Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* WHATSAPP ORDER BUTTON */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-whatsapp py-3 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide"
              >
                <MessageCircle size={16} />
                <span>Order Cart on WhatsApp</span>
              </a>

              {/* Standard Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-center pt-1">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="text-[11px] text-[#716963] hover:text-[#651D32] underline"
                >
                  View Full Shopping Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
