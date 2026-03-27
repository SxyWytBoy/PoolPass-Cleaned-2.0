import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

const WaitlistBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 opacity-95" />

        {/* Subtle animated shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />

        {/* Content */}
        <div className="relative flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="text-white font-semibold text-sm md:text-base leading-tight">
                PoolPass is launching soon
              </p>
              <p className="text-white/80 text-xs md:text-sm">
                Get early access to the UK's best private pools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/waitlist"
              className="flex items-center gap-1 bg-white text-blue-600 hover:bg-blue-50 transition-colors text-xs md:text-sm font-semibold px-4 py-2 rounded-xl"
            >
              Join waitlist
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
