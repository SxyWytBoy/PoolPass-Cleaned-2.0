import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProfileRow, ReviewRow } from '@/types/supabase';

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

type ReviewWithProfile = ReviewRow & {
  profiles: Pick<ProfileRow, 'full_name' | 'avatar_url'> | null;
};

export const useReviews = (poolId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: rawReviews, isLoading } = useQuery({
    queryKey: ['reviews', poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles:user_id (full_name, avatar_url)')
        .eq('pool_id', poolId as string)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data ?? []) as unknown as ReviewWithProfile[];
    },
    enabled: !!poolId,
  });

  const reviewsData: ReviewData[] = useMemo(() => {
    if (!rawReviews) return [];

    return rawReviews.map((review) => ({
      ...review,
      user: review.profiles?.full_name || 'PoolPass guest',
      avatar: review.profiles?.avatar_url || '',
      date: review.created_at
        ? new Date(review.created_at).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
          })
        : '',
    }));
  }, [rawReviews]);

  const addReview = useMutation({
    mutationFn: async ({ userId, rating, comment }: { userId: string; rating: number; comment: string }) => {
      const { error } = await supabase
        .from('reviews')
        .insert({ pool_id: poolId as string, user_id: userId, rating, comment });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', poolId] });
      queryClient.invalidateQueries({ queryKey: ['pool', poolId] });
      queryClient.invalidateQueries({ queryKey: ['pools'] });
    },
  });

  return { reviewsData, isLoading, addReview };
};
