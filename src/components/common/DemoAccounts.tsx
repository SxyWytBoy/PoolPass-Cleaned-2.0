import React from 'react';
import { isLocalBackend } from '@/lib/supabase';
import { DEMO_GUEST_EMAIL, DEMO_HOST_EMAIL, DEMO_PASSWORD } from '@/lib/seed-data';

interface DemoAccountsProps {
  onPick: (email: string, password: string) => void;
  only?: 'guest' | 'host';
}

/** Shown only on the demo backend: one-click sign-in details for the sample accounts. */
const DemoAccounts = ({ onPick, only }: DemoAccountsProps) => {
  if (!isLocalBackend) return null;

  const accounts = [
    { type: 'guest' as const, label: 'Guest', email: DEMO_GUEST_EMAIL },
    { type: 'host' as const, label: 'Host', email: DEMO_HOST_EMAIL },
  ].filter((a) => !only || a.type === only);

  return (
    <div className="mb-6 rounded-lg border border-pool-light bg-pool-light/40 p-4 text-sm">
      <p className="font-medium text-pool-dark mb-1">Try a demo account</p>
      <p className="text-gray-600 mb-3">
        Password for both: <code className="font-mono">{DEMO_PASSWORD}</code>
      </p>
      <div className="flex flex-wrap gap-2">
        {accounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onPick(account.email, DEMO_PASSWORD)}
            className="rounded-full border border-pool-primary/30 bg-white px-3 py-1 text-pool-primary hover:bg-pool-primary hover:text-white transition-colors"
          >
            {account.label}: {account.email}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
