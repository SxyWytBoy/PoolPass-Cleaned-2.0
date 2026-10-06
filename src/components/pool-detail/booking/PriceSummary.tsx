import React from 'react';
import { formatPrice } from '@/lib/pools';

interface PriceSummaryProps {
  accessPrice: number;
  guests: number;
  extrasPrice: number;
  totalPrice: number;
  selectedExtras: string[];
}

const PriceSummary = ({ accessPrice, guests, extrasPrice, totalPrice, selectedExtras }: PriceSummaryProps) => {
  return (
    <div className="border-t border-gray-200 pt-4 mb-4 tabular-nums">
      <div className="flex justify-between mb-2">
        <span>Pool access ({guests} {guests === 1 ? 'guest' : 'guests'})</span>
        <span>{formatPrice(accessPrice)}</span>
      </div>
      {selectedExtras.length > 0 && (
        <div className="flex justify-between mb-2">
          <span>Extras</span>
          <span>{formatPrice(extrasPrice)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
