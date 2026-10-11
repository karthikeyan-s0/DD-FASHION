import React, { useEffect, useState } from 'react';
import { Search, Package, MapPin, CheckCircle, MessageCircle, ExternalLink } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders(searchTerm || undefined, statusFilter || undefined);
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = async (orderId: number, newOrderStatus: string, newPaymentStatus: string) => {
    try {
      const updated = await api.updateAdminOrderStatus(orderId, newOrderStatus, newPaymentStatus);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (e: any) {
      alert(e.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-serif text-3xl text-[#282323]">Customer Orders</h1>
        <p className="text-xs text-[#716963] mt-0.5">
          Process dispatches, verify payments, and manage fulfillment.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#C6A15B]/30 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by order ref, customer name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 px-3 py-2 pl-9 text-xs focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-3 text-[#A69A90]" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#C6A15B]/40 px-3 py-2 text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#C6A15B]/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#716963]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#716963]">No matching orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF3E8] border-b border-[#C6A15B]/20 text-[#651D32] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 font-semibold text-[#651D32] font-mono">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#282323]">{ord.customer_name}</p>
                      <p className="text-[10px] text-[#A69A90]">{ord.customer_phone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#282323]">
                      {formatPrice(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value, ord.payment_status)}
                        className="bg-[#FAF3E8] border border-[#C6A15B]/40 text-[#651D32] font-semibold text-[11px] p-1.5 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.payment_status}
                        onChange={(e) => handleUpdateStatus(ord.id, ord.order_status, e.target.value)}
                        className="bg-white border border-gray-200 text-[#282323] text-[11px] p-1.5 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-[#A69A90] whitespace-nowrap">
                      {formatDate(ord.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="text-[#651D32] hover:underline font-semibold text-xs"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border border-[#C6A15B]/50 w-full max-w-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-[#C6A15B]/30 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C6A15B]">Order Details</span>
                <h3 className="font-serif text-lg font-bold text-[#651D32]">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {/* Delivery address */}
            <div className="bg-[#FAF3E8] p-4 border border-[#C6A15B]/30 space-y-1">
              <p className="font-semibold text-[#651D32]">Shipping Destination</p>
              <p className="text-[#282323]">{selectedOrder.shipping_address?.full_name}</p>
              <p className="text-[#716963]">{selectedOrder.shipping_address?.address_line1}</p>
              {selectedOrder.shipping_address?.address_line2 && (
                <p className="text-[#716963]">{selectedOrder.shipping_address.address_line2}</p>
              )}
              <p className="text-[#716963]">
                {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
              </p>
              <p className="text-[#282323] font-medium pt-1">Phone: {selectedOrder.shipping_address?.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="font-semibold text-[#282323]">Items Ordered ({selectedOrder.items?.length})</p>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[#282323]">{it.product_name}</p>
                      <p className="text-[10px] text-[#A69A90]">SKU: {it.product_sku} • Qty: {it.quantity}</p>
                    </div>
                    <span className="font-semibold text-[#282323]">{formatPrice(it.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-[#651D32]">Order Total: {formatPrice(selectedOrder.total_amount)}</span>
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary py-1.5 px-4 text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
