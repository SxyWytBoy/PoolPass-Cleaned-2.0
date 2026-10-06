import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PoolHeader from '@/components/pool-detail/PoolHeader';
import PhotoGallery from '@/components/pool-detail/PhotoGallery';
import PoolInfo from '@/components/pool-detail/PoolInfo';
import ReviewsSection from '@/components/pool-detail/ReviewsSection';
import BookingPanel from '@/components/pool-detail/BookingPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { usePoolData } from '@/hooks/use-pool-data';
import { useReviews } from '@/hooks/use-reviews';
import { supabase } from '@/lib/supabase';

const PoolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { poolData, isLoading } = usePoolData(id);
  const { reviewsData, addReview } = useReviews(id);

  // Guests can review a pool once they have booked it.
  const { data: userBookingCount = 0 } = useQuery({
    queryKey: ['bookings', 'for-pool', id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('pool_id', id as string)
        .eq('user_id', user?.id as string);
      if (error) throw error;
      return data?.length ?? 0;
    },
    enabled: !!id && !!user,
  });

  const hasReviewed = !!user && reviewsData.some((review) => review.user_id === user.id);

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user) return;
    try {
      await addReview.mutateAsync({ userId: user.id, rating, comment });
      toast({ title: 'Review posted', description: 'Thanks for helping other swimmers.' });
    } catch (error) {
      toast({
        title: 'Could not post your review',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-48 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = !!user && poolData?.host.id === user.id;

  if (!poolData || (!poolData.is_active && !isOwner)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-3">We couldn't find that pool</h1>
            <p className="text-gray-600 mb-6">It may have been removed by its host, or the link may be wrong.</p>
            <Link to="/pools">
              <Button className="bg-pool-primary hover:bg-pool-secondary">Browse all pools</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-20">
        {!poolData.is_active && isOwner && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-sm text-center py-2 px-4 mt-4">
            This is a preview. Your listing is hidden from guests until you publish it in the{' '}
            <Link to="/host-dashboard" className="underline">host dashboard</Link>.
          </div>
        )}
        <div className="container mx-auto px-4 py-6">
          <PoolHeader
            name={poolData.name}
            rating={poolData.rating}
            reviews={poolData.reviews}
            location={poolData.location}
          />

          <PhotoGallery images={poolData.images} name={poolData.name} />
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PoolInfo
                description={poolData.description}
                host={poolData.host}
                poolDetails={poolData.pool_details}
                amenities={poolData.amenities}
              />

              <ReviewsSection
                rating={poolData.rating}
                reviews={poolData.reviews}
                reviewsData={reviewsData}
                isSignedIn={!!user}
                canReview={!!user && !isOwner && userBookingCount > 0}
                hasReviewed={hasReviewed}
                onSubmitReview={handleSubmitReview}
              />
            </div>

            <div className="lg:col-span-1">
              <BookingPanel pool={poolData} user={user} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoolDetail;
