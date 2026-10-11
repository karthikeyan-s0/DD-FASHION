import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';
import { OFFICIAL_WHATSAPP_NUMBER, FORMATTED_PHONE_DISPLAY } from '../utils/whatsapp';

export const OrderConfirmationPage: React.FC = () => {
  const { orderRef } = useParams<{ orderRef: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderRef) return;
    const fetchOrder = async () => {
      try {
        const o = await api.getOrderByRef(orderRef);
        setOrder(o);
      } catch (e) {
        console.error('Failed to load order', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderRef]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#651D32]" />
        <p className="text-xs text-[#716963] mt-3">Fetching your order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#282323]">Order Not Found</h2>
        <p className="text-xs text-[#716963]">We could not locate this order reference.</p>
        <Link to="/" className="btn-primary">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const whatsappShareUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi DD FASHION! I have placed order ${order.order_number} for ₹${order.total_amount}. Customer: ${order.customer_name}. Please confirm dispatch timeline.`
  )}`;

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Header */}
        <div className="bg-white border border-[#C6A15B]/30 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
              Order Placed Successfully
            </span>
            <h1 className="font-serif text-3xl text-[#282323] mt-1 font-normal">
              Thank You, {order.customer_name}!
            </h1>
            <p className="text-xs text-[#716963] mt-1">
              Your order has been recorded in our boutique system. A confirmation email has been dispatched to <strong>{order.customer_email}</strong>.
            </p>
          </div>

          <div className="bg-[#FAF3E8] p-4 border border-[#C6A15B]/30 inline-block text-center mt-2">
            <p className="text-[10px] uppercase tracking-wider text-[#A69A90] font-semibold">Order Reference Number</p>
            <p className="font-serif text-xl font-bold text-[#651D32] tracking-wider mt-0.5">
              {order.order_number}
            </p>
            <p className="text-[10px] text-[#716963] mt-1">Date: {formatDate(order.created_at)}</p>
          </div>

          {/* WhatsApp Direct Notification */}
          <div className="pt-2">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp py-3 px-6 text-xs font-semibold inline-flex items-center gap-2 shadow"
            >
              <MessageCircle size={16} />
              <span>Confirm Order with WhatsApp Assistant</span>
            </a>
            <p className="text-[10px] text-[#A69A90] mt-1.5">
              Official WhatsApp: {FORMATTED_PHONE_DISPLAY}
            </p>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white border border-[#C6A15B]/30 p-6 sm:p-8 space-y-6 shadow-sm text-xs">
          
          <h2 className="font-serif text-lg font-semibold text-[#282323] border-b border-[#C6A15B]/20 pb-3">
            Purchased Garments
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.product_image && (
                    <div className="w-14 aspect-[3/4] bg-[#FAF3E8] overflow-hidden flex-shrink-0">
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[#282323]">{item.product_name}</p>
                    <p className="text-[10px] text-[#716963] mt-0.5">
                      {item.size ? `Size: ${item.size} • ` : ''}Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-[#282323]">
                  {formatPrice(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing totals */}
          <div className="pt-4 border-t border-[#C6A15B]/20 space-y-2">
            <div className="flex justify-between text-[#716963]">
              <span>Items Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#716963]">
              <span>Delivery Charges</span>
              <span>{order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#651D32] pt-2 border-t border-gray-100">
              <span>Total Paid / Payable</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Delivery & Payment Metadata */}
          <div className="pt-4 border-t border-[#C6A15B]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAF3E8] p-4 border border-[#C6A15B]/20">
              <h3 className="font-semibold text-[#651D32] mb-1">Shipping Destination</h3>
              <p className="text-[#282323] font-medium">{order.shipping_address?.full_name}</p>
              <p className="text-[#716963] mt-0.5">{order.shipping_address?.address_line1}</p>
              {order.shipping_address?.address_line2 && (
                <p className="text-[#716963]">{order.shipping_address.address_line2}</p>
              )}
              <p className="text-[#716963]">
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
              </p>
              <p className="text-[#716963] mt-1">Phone: {order.shipping_address?.phone}</p>
            </div>

            <div className="bg-[#FAF3E8] p-4 border border-[#C6A15B]/20">
              <h3 className="font-semibold text-[#651D32] mb-1">Payment & Fulfillment</h3>
              <p className="text-[#282323]">
                <strong>Method: </strong>
                <span className="uppercase text-[11px] font-semibold text-[#651D32]">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </p>
              <p className="text-[#716963] mt-1">
                <strong>Payment Status: </strong>
                <span className="capitalize">{order.payment_status}</span>
              </p>
              <p className="text-[#716963] mt-1">
                <strong>Order Status: </strong>
                <span className="capitalize font-medium text-[#651D32]">{order.order_status}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/shop" className="btn-secondary py-3 px-8">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};
