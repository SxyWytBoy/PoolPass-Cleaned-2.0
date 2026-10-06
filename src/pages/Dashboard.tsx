import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PersonAvatar from '@/components/common/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { FALLBACK_POOL_IMAGES, formatPrice, parseDateString, toDateString } from '@/lib/pools';
import { STATUS_LABELS, STATUS_STYLES } from '@/lib/booking-status';
import type { BookingRow, PoolRow } from '@/types/supabase';

type BookingWithPool = BookingRow & {
  pools: Pick<PoolRow, 'id' | 'name' | 'location' | 'images'> | null;
};

const Dashboard = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, pools:pool_id (id, name, location, images)')
        .eq('user_id', user?.id as string)
        .order('date', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as BookingWithPool[];
    },
    enabled: !!user,
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Booking cancelled', description: 'The host has been told you can no longer make it.' });
      setConfirmCancelId(null);
    },
    onError: (error) => {
      toast({ title: 'Could not cancel booking', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    },
  });

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile({ full_name: fullName.trim() || null });
    if (result.error) {
      toast({ title: 'Could not save your profile', description: result.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Profile updated' });
    setEditing(false);
  };

  const today = toDateString(new Date());
  const upcoming = bookings.filter((b) => b.date >= today && b.status !== 'cancelled');
  const past = bookings.filter((b) => b.date < today || b.status === 'cancelled').reverse();
  const displayName = profile?.full_name || user?.email || 'Guest';

  const renderBooking = (booking: BookingWithPool, canCancel: boolean) => {
    const pool = booking.pools;
    const date = parseDateString(booking.date);
    return (
      <div key={booking.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-28 h-40 sm:h-24 rounded-md overflow-hidden bg-gray-100 shrink-0">
          <img
            src={pool?.images?.[0] || FALLBACK_POOL_IMAGES.indoor}
            alt={pool?.name || 'Pool'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{pool?.name || 'Pool no longer listed'}</h3>
            <Badge variant="outline" className={`border-transparent ${STATUS_STYLES[booking.status]}`}>{STATUS_LABELS[booking.status]}</Badge>
          </div>
          <p className="text-gray-600 text-sm">{pool?.location}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm">{date ? format(date, 'EEE d MMM yyyy') : booking.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Access</p>
              <p className="text-sm">{booking.time_slot}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Guests</p>
              <p className="text-sm">{booking.guests ?? 1}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-sm tabular-nums">{formatPrice(Number(booking.total_price))}</p>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-start sm:items-end gap-2">
          {pool && (
            <Link to={`/pools/${pool.id}`}>
              <Button variant="outline" size="sm">View pool</Button>
            </Link>
          )}
          {canCancel && (booking.status === 'pending' || booking.status === 'confirmed') && (
            confirmCancelId === booking.id ? (
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={() => cancelBooking.mutate(booking.id)} disabled={cancelBooking.isPending}>
                  Confirm cancel
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmCancelId(null)}>Keep</Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setConfirmCancelId(booking.id)}>
                Cancel booking
              </Button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 pt-28">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">My Profile</h2>
              <div className="flex items-center gap-4">
                <PersonAvatar name={displayName} src={profile?.avatar_url} className="w-16 h-16 text-2xl" />
                <div className="min-w-0">
                  <p className="font-medium">{profile?.full_name || 'Add your name'}</p>
                  <p className="text-gray-600 break-all">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1 capitalize">Account type: {profile?.user_type ?? 'guest'}</p>
                </div>
              </div>
              {editing ? (
                <form onSubmit={saveProfile} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
                  <Input
                    id="profile-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="bg-pool-primary hover:bg-pool-secondary">Save</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFullName(profile?.full_name ?? '');
                      setEditing(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>

              {bookingsLoading ? (
                <p className="text-gray-500">Loading your bookings...</p>
              ) : upcoming.length > 0 ? (
                <div className="space-y-4">{upcoming.map((b) => renderBooking(b, true))}</div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You have no upcoming swims booked.</p>
                  <Link to="/pools">
                    <Button className="bg-pool-primary hover:bg-pool-secondary">Find Pools to Book</Button>
                  </Link>
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Past and Cancelled</h2>
                <div className="space-y-4">{past.map((b) => renderBooking(b, false))}</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
