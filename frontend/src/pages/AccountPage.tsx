import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, MapPin, User, LogOut, Plus, Trash2, Check, Clock, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, Address } from '../types';
import { api } from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Address Form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    is_default: false,
  });

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordList, addrList] = await Promise.all([
          api.getOrders(),
          api.getAddresses()
        ]);
        setOrders(ordList);
        setAddresses(addrList);
      } catch (e) {
        console.error('Failed to load account data', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await api.addAddress(newAddress);
      setAddresses([added, ...addresses]);
      setShowAddAddress(false);
      setNewAddress({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600040',
        is_default: false,
      });
    } catch (e: any) {
      alert(e.message || 'Error saving address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (e: any) {
      alert(e.message || 'Error deleting address');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(profileName, profilePhone);
      await refreshUser();
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Error updating profile');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#FFF9F1] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'My Account' }]} />

        {/* Account Header */}
        <div className="mt-4 mb-8 bg-white border border-[#C6A15B]/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C6A15B]">
              Customer Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#282323] mt-0.5">
              Vanakkam, {user.full_name}
            </h1>
            <p className="text-xs text-[#716963]">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link to="/admin" className="btn-secondary py-2 px-4 text-xs font-semibold">
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 text-red-700 border-red-300 hover:bg-red-50 hover:text-red-800"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#C6A15B]/20 mb-8 space-x-6 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <Package size={15} />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'addresses'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <MapPin size={15} />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-[#651D32] text-[#651D32]'
                : 'border-transparent text-[#716963] hover:text-[#282323]'
            }`}
          >
            <User size={15} />
            <span>Profile Details</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loading ? (
              <p className="text-xs text-[#716963]">Loading order history...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-[#C6A15B]/30 p-12 text-center space-y-4 shadow-sm">
                <Package size={32} className="text-[#A69A90] mx-auto" />
                <h3 className="font-serif text-xl text-[#282323]">No orders placed yet</h3>
                <p className="text-xs text-[#716963]">Your future traditional purchases will be tracked here.</p>
                <Link to="/shop" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-[#C6A15B]/30 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2 text-xs">
                    <div>
                      <span className="font-serif text-sm font-bold text-[#651D32] tracking-wider">
                        {ord.order_number}
                      </span>
                      <span className="text-[#716963] ml-3">Placed: {formatDate(ord.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-[#FAF3E8] border border-[#C6A15B]/30 text-[#651D32] uppercase text-[10px] font-bold">
                        {ord.order_status}
                      </span>
                      <span className="font-semibold text-sm text-[#282323]">
                        {formatPrice(ord.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-50">
                    {ord.items.map((it) => (
                      <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {it.product_image && (
                            <img src={it.product_image} alt={it.product_name} className="w-10 aspect-[3/4] object-cover" />
                          )}
                          <div>
                            <p className="font-medium text-[#282323]">{it.product_name}</p>
                            <p className="text-[10px] text-[#716963]">
                              {it.size ? `Size: ${it.size} • ` : ''}Qty: {it.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="font-medium text-[#282323]">{formatPrice(it.subtotal)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[11px] text-[#716963] border-t border-gray-50">
                    <span>Payment: <strong className="uppercase">{ord.payment_method}</strong> ({ord.payment_status})</span>
                    <Link to={`/order-confirmation/${ord.order_number}`} className="text-[#651D32] hover:underline font-semibold">
                      View Receipt &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-lg text-[#282323]">Your Delivery Locations</h2>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Add Address Form Modal / Inline */}
            {showAddAddress && (
              <form onSubmit={handleCreateAddress} className="bg-white border border-[#C6A15B]/40 p-6 space-y-4 shadow-md">
                <h3 className="font-serif text-base font-semibold text-[#651D32]">Add Delivery Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.full_name}
                      onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#282323] font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddress.address_line1}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#282323] font-medium mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.address_line2}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[#282323] font-medium mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                    />
                    <label htmlFor="is_default" className="text-xs text-[#282323]">Set as default address</label>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-primary py-2 px-5 text-xs">Save Address</button>
                  <button type="button" onClick={() => setShowAddAddress(false)} className="btn-secondary py-2 px-4 text-xs">Cancel</button>
                </div>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white border border-[#C6A15B]/30 p-5 shadow-sm space-y-2 relative text-xs">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-[#282323]">{addr.full_name}</h3>
                    {addr.is_default && (
                      <span className="bg-[#651D32] text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[#716963]">{addr.address_line1}</p>
                  {addr.address_line2 && <p className="text-[#716963]">{addr.address_line2}</p>}
                  <p className="text-[#716963]">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-[#282323] font-medium mt-1">Phone: {addr.phone}</p>
                  
                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-[#A69A90] hover:text-red-700 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#C6A15B]/30 p-8 max-w-xl shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#651D32] border-b border-[#C6A15B]/20 pb-2">
              Update Profile Information
            </h2>
            
            {profileMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-800">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#282323] font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 p-2.5 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[#282323] font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#282323] font-medium mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary py-3 px-6 text-xs">
                Save Changes
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
