import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

const WaitlistBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full px-4 py-2 bg-transparent">
      <div className="relative rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 opacity-95" />

        {/* Subtle shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />

        {/* Content */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4">

          {/* Text + dismiss row on mobile */}
          <div className="flex items-start justify-between gap-3 sm:contents">
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

            {/* Dismiss — top right on mobile, inline on larger screens */}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="text-white/70 hover:text-white transition-colors p-1 shrink-0 sm:order-last"
            >
              <X size={16} />
            </button>
          </div>

          {/* CTA button — full width on mobile, auto width on larger screens */}
          <Link
            to="/waitlist"
            className="flex items-center justify-center gap-1 bg-white text-blue-600 hover:bg-blue-50 transition-colors text-sm font-semibold px-4 py-2 rounded-xl w-full sm:w-auto shrink-0"
          >
            Join waitlist
            <ArrowRight size={14} />
          </Link>

        </div>
      </div>
    </div>
  );
};

export default WaitlistBanner;
