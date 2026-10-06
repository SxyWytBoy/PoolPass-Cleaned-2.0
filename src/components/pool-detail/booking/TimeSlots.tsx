import React from 'react';
import type { TimeSlot } from '@/lib/pools';
import { formatPrice } from '@/lib/pools';

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  price: number;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (timeSlot: string) => void;
}

const TimeSlots = ({ timeSlots, price, selectedTimeSlot, setSelectedTimeSlot }: TimeSlotsProps) => {
  return (
    <div className="mb-6">
      <span className="block text-sm font-medium text-gray-700 mb-2">Access Options</span>
      <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="Access options">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            role="radio"
            aria-checked={selectedTimeSlot === slot.id}
            className={`border rounded-md p-2 text-sm flex justify-between items-center transition-colors ${
              selectedTimeSlot === slot.id ? 'bg-pool-primary text-white border-pool-primary' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTimeSlot(slot.id)}
          >
            <span>{slot.time}</span>
            <span className="tabular-nums">{formatPrice(Math.round(price * slot.priceFactor * 100) / 100)} pp</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
