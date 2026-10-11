import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      const res = await api.subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message);
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-20 bg-[#FAF3E8] border-b border-[#C6A15B]/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#651D32] mx-auto shadow-sm border border-[#C6A15B]/30">
          <Mail size={22} />
        </div>

        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#282323] font-normal">
            Stay Connected with DD FASHION
          </h2>
          <p className="text-xs sm:text-sm text-[#716963] mt-2 max-w-md mx-auto">
            Receive exclusive updates on new Kanchipuram arrivals, festive releases, and boutique styling advice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="Enter your email address"
            className="flex-1 bg-white border border-[#C6A15B]/40 px-4 py-3 text-xs text-[#282323] placeholder-[#A69A90] focus:outline-none focus:border-[#651D32]"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary py-3 px-6 whitespace-nowrap text-xs tracking-widest font-semibold"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 text-xs text-green-700 bg-green-50 p-2.5 max-w-md mx-auto border border-green-200">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 max-w-md mx-auto border border-red-200">
            <AlertCircle size={16} />
            <span>{message}</span>
          </div>
        )}

      </div>
    </section>
  );
};
