import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface ReviewData {
  id: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  user_id?: string;
  pool_id?: string;
  created_at?: string;
}

const reviewsDataFallback: ReviewData[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop",
    date: "October 2023",
    rating: 5,
    comment: "Absolutely stunning pool! The facilities were immaculate and the host was incredibly accommodating.",
    user_id: "user1",
    pool_id: "1",
    created_at: "2023-10-15"
  },
  {
    id: "2",
    user: "Michael Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&auto=format&fit=crop",
    date: "September 2023",
    rating: 4,
    comment: "Great experience overall. The water temperature was perfect and the atmosphere was very relaxing.",
    user_id: "user2",
    pool_id: "1",
    created_at: "2023-09-28"
  }
];

export const useReviews = (poolId: string | undefined) => {
  const { data: rawReviews } = useQuery({
    queryKey: ['reviews', poolId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:user_id (full_name, avatar_url)
          `)
          .eq('pool_id', poolId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        return data || reviewsDataFallback;
      } catch (err) {
        console.error("Error fetching reviews:", err);
        return reviewsDataFallback;
      }
    },
    enabled: !!poolId,
  });

  const reviewsData: ReviewData[] = useMemo(() => {
    if (!rawReviews) return [];

    return rawReviews.map((review: any) => ({
      ...review,
      user: review.profiles?.full_name || review.user || "Anonymous",
      avatar: review.profiles?.avatar_url ||
        review.avatar ||
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop",
      date: review.created_at
        ? new Date(review.created_at).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
          })
        : review.date || "Unknown date",
    }));
  }, [rawReviews]);

  return { reviewsData };
};

export { reviewsDataFallback };
