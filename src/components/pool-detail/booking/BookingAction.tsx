import React from 'react';
import { Button } from '@/components/ui/button';

interface BookingActionProps {
  isUserLoggedIn: boolean;
  isBookingValid: boolean;
  submitting?: boolean;
  onBookNow: () => void;
}

const BookingAction = ({ isUserLoggedIn, isBookingValid, submitting = false, onBookNow }: BookingActionProps) => {
  return (
    <>
      <Button
        className="w-full bg-pool-primary hover:bg-pool-secondary"
        onClick={onBookNow}
        disabled={submitting || (isUserLoggedIn && !isBookingValid)}
      >
        {!isUserLoggedIn ? 'Sign in to Book' : submitting ? 'Booking...' : 'Request Booking'}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        {isUserLoggedIn && !isBookingValid
          ? 'Choose a date and access option to continue'
          : "You won't be charged until the host confirms"}
      </p>
    </>
  );
};

export default BookingAction;
