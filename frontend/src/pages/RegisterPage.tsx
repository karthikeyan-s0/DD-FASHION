import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, phone);
      navigate('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF9F1] min-h-[80vh] py-12 flex items-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        <div className="bg-white border border-[#C6A15B]/40 p-8 shadow-sm space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C6A15B]">
              New to DD FASHION
            </span>
            <h1 className="font-serif text-2xl font-normal text-[#282323]">Create Account</h1>
            <p className="text-xs text-[#716963]">
              Join us for authentic South Indian collections and seamless ordering.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#282323] font-medium mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sundaram"
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 pl-9 focus:outline-none focus:border-[#651D32]"
                />
                <User size={15} className="absolute left-3 top-3 text-[#A69A90]" />
              </div>
            </div>

            <div>
              <label className="block text-[#282323] font-medium mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 pl-9 focus:outline-none focus:border-[#651D32]"
                />
                <Mail size={15} className="absolute left-3 top-3 text-[#A69A90]" />
              </div>
            </div>

            <div>
              <label className="block text-[#282323] font-medium mb-1">Mobile Phone (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 pl-9 focus:outline-none focus:border-[#651D32]"
                />
                <Phone size={15} className="absolute left-3 top-3 text-[#A69A90]" />
              </div>
            </div>

            <div>
              <label className="block text-[#282323] font-medium mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2.5 pl-9 focus:outline-none focus:border-[#651D32]"
                />
                <Lock size={15} className="absolute left-3 top-3 text-[#A69A90]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-[#716963]">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#651D32] font-semibold hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
