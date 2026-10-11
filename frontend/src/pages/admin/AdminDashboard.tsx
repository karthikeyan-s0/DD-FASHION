import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Clock, AlertTriangle, Package, ArrowRight } from 'lucide-react';
import { AdminStats } from '../../types';
import { api } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-12 text-center text-xs text-[#716963]">
        Loading store metrics from database...
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.total_revenue),
      subtext: 'From verified orders',
      icon: DollarSign,
      color: 'text-green-700 bg-green-50 border-green-200',
    },
    {
      title: 'Total Orders',
      value: stats.total_orders,
      subtext: 'Lifetime transactions',
      icon: Package,
      color: 'text-[#651D32] bg-[#FAF3E8] border-[#C6A15B]/30',
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders,
      subtext: 'Awaiting fulfillment',
      icon: Clock,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Low Stock Items',
      value: stats.low_stock_products,
      subtext: '5 or fewer remaining',
      icon: AlertTriangle,
      color: 'text-red-700 bg-red-50 border-red-200',
    },
    {
      title: 'Active Products',
      value: stats.total_products,
      subtext: 'Catalog inventory',
      icon: ShoppingBag,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl text-[#282323]">Store Overview & Metrics</h1>
        <p className="text-xs text-[#716963] mt-1">
          Live database metrics for DD FASHION sales and inventory.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white border p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#716963]">{card.title}</span>
                <div className={`p-2 rounded-none border ${card.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#282323]">{card.value}</p>
                <p className="text-[10px] text-[#A69A90] mt-0.5">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#C6A15B]/30 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-[#282323]">Recent Customer Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-[#651D32] hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {stats.recent_orders.length === 0 ? (
          <p className="text-xs text-[#716963] py-4 text-center">No orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF3E8] border-y border-[#C6A15B]/20 text-[#651D32] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Order Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recent_orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-semibold text-[#651D32]">{ord.order_number}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#282323]">{ord.customer_name}</p>
                      <p className="text-[10px] text-[#A69A90]">{ord.customer_phone}</p>
                    </td>
                    <td className="py-3 px-3 text-[#716963]">{ord.items?.length || 1} item(s)</td>
                    <td className="py-3 px-3 font-semibold text-[#282323]">{formatPrice(ord.total_amount)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-[#716963]">{ord.payment_method} ({ord.payment_status})</span>
                    </td>
                    <td className="py-3 px-3 text-[#A69A90]">{formatDate(ord.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
