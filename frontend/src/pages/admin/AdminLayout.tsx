import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Layers, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center">
        <p className="text-xs text-[#716963]">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center p-4">
        <div className="bg-white border border-[#C6A15B]/40 p-8 max-w-md text-center space-y-4 shadow-md">
          <ShieldAlert size={40} className="text-[#651D32] mx-auto" />
          <h2 className="font-serif text-xl font-bold text-[#282323]">Access Denied</h2>
          <p className="text-xs text-[#716963]">
            This area is restricted to authorized DD FASHION store administrators only.
          </p>
          <div className="pt-2">
            <Link to="/login" className="btn-primary">
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalogue', path: '/admin/products', icon: ShoppingBag },
    { name: 'Customer Orders', path: '/admin/orders', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#F7EFE4] text-[#282323] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#3B1020] text-white p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div>
            <span className="font-serif text-xl font-bold text-white tracking-wider block">
              DD FASHION
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#DFC58A] font-semibold">
              Admin Portal • 2026
            </span>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#651D32] text-white border-l-4 border-[#C6A15B]'
                      : 'text-[#E8C9C7] hover:bg-[#651D32]/50 hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#DFC58A]' : 'text-[#A69A90]'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#651D32] space-y-3">
          <div className="text-xs text-[#E8C9C7]">
            <p className="font-medium text-white">{user.full_name}</p>
            <p className="text-[10px] text-[#A69A90]">{user.email}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-[#DFC58A] hover:underline"
          >
            <ArrowLeft size={13} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
