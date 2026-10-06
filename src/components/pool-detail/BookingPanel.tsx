import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { useBooking } from '@/hooks/use-booking';
import { isOpenOn, type TimeSlot } from '@/lib/pools';
import type { PoolExtra } from '@/types/supabase';
import BookingPrice from './booking/BookingPrice';
import DateSelector from './booking/DateSelector';
import TimeSlots from './booking/TimeSlots';
import BookingExtras from './booking/BookingExtras';
import PriceSummary from './booking/PriceSummary';
import BookingAction from './booking/BookingAction';

interface BookingPanelProps {
  pool: {
    id: string;
    price: number;
    rating?: number;
    reviews?: number;
    available_time_slots: TimeSlot[];
    available_days?: string[];
    extras?: PoolExtra[];
    pool_details?: {
      maxGuests: number;
    };
  };
  user: User | null;
}

const BookingPanel = ({ pool, user }: BookingPanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedExtras,
    toggleExtra,
    guests,
    setGuests,
    accessPrice,
    extrasPrice,
    totalPrice,
    submitting,
    handleBookNow,
  } = useBooking(pool.id, user?.id, pool.price, pool.available_time_slots, pool.extras);

  const handleBookNowClick = async () => {
    if (!user) {
      navigate('/sign-in', { state: { from: location.pathname } });
      return;
    }
    const booked = await handleBookNow();
    if (booked) navigate('/dashboard');
  };

  const isBookingValid = !!selectedDate && !!selectedTimeSlot;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
      <BookingPrice price={pool.price} rating={pool.rating} reviews={pool.reviews} />

      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDayAvailable={(day) => isOpenOn({ available_days: pool.available_days ?? [] }, day)}
      />

      {selectedDate && (
        <TimeSlots
          timeSlots={pool.available_time_slots}
          price={pool.price}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
        />
      )}

      <BookingExtras
        extras={pool.extras}
        maxGuests={pool.pool_details?.maxGuests}
        guests={guests}
        setGuests={setGuests}
        selectedExtras={selectedExtras}
        toggleExtra={toggleExtra}
      />

      <PriceSummary
        accessPrice={accessPrice}
        guests={guests}
        extrasPrice={extrasPrice}
        totalPrice={totalPrice}
        selectedExtras={selectedExtras}
      />

      <BookingAction
        isUserLoggedIn={!!user}
        isBookingValid={isBookingValid}
        submitting={submitting}
        onBookNow={handleBookNowClick}
      />
    </div>
  );
};

export default BookingPanel;
