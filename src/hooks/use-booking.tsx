import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { toDateString, type TimeSlot } from '@/lib/pools';
import type { PoolExtra } from '@/types/supabase';

export const calculateExtrasPrice = (selectedExtras: string[], extras: PoolExtra[] | undefined) =>
  selectedExtras.reduce((total, extraId) => {
    const extra = extras?.find((e) => e.id === extraId);
    return total + (extra ? extra.price : 0);
  }, 0);

export const useBooking = (
  poolId: string | undefined,
  userId: string | undefined,
  price: number,
  timeSlots: TimeSlot[],
  extras: PoolExtra[] | undefined
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((current) =>
      current.includes(extraId) ? current.filter((id) => id !== extraId) : [...current, extraId]
    );
  };

  const slot = timeSlots.find((s) => s.id === selectedTimeSlot);
  const accessPrice = Math.round(price * (slot?.priceFactor ?? 1) * guests * 100) / 100;
  const extrasPrice = calculateExtrasPrice(selectedExtras, extras);
  const totalPrice = accessPrice + extrasPrice;

  /** Creates the booking. Resolves to true when it was saved. */
  const handleBookNow = async (): Promise<boolean> => {
    if (!userId) {
      toast({
        title: 'Sign in to book',
        description: 'Create a free account or sign in to book this pool.',
      });
      return false;
    }

    if (!poolId || !selectedDate || !slot) {
      toast({
        title: 'Choose a date and access option',
        variant: 'destructive',
      });
      return false;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        pool_id: poolId,
        user_id: userId,
        date: toDateString(selectedDate),
        time_slot: slot.time,
        guests,
        extras: selectedExtras,
        total_price: totalPrice,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Booking requested',
        description: 'The host will confirm shortly. You can follow it in your dashboard.',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      resetForm();
      return true;
    } catch (error) {
      console.error('Error booking pool:', error);
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setSelectedExtras([]);
    setGuests(1);
  };

  return {
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
  };
};
