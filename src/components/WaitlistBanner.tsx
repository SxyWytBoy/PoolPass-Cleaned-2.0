import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const WaitlistBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex-1 text-center text-sm md:text-base font-medium">
        🚀 PoolPass is launching soon —{' '}
        <Link
          to="/waitlist"
          className="underline underline-offset-2 hover:text-blue-100 transition-colors"
        >
          join the waitlist for early access
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="shrink-0 hover:text-blue-200 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default WaitlistBanner;
