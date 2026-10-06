import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileFilterToggle from '@/components/pools/MobileFilterToggle';
import PoolFilters from '@/components/pools/PoolFilters';
import PoolGrid, { PoolItem } from '@/components/pools/PoolGrid';
import PoolResultsHeader from '@/components/pools/PoolResultsHeader';
import SearchHeader from '@/components/pools/SearchHeader';
import { useToast } from '@/components/ui/use-toast';
import { AMENITY_OPTIONS, fetchActivePools, isOpenOn, parseDateString, poolImage } from '@/lib/pools';

const Pools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationQuery = searchParams.get('location')?.trim() ?? '';
  const dateParam = searchParams.get('date');
  const date = useMemo(() => parseDateString(dateParam), [dateParam]);
  const amenitiesParam = searchParams.get('amenities');

  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    () => amenitiesParam?.split(',').filter((a) => AMENITY_OPTIONS.includes(a)) ?? []
  );

  // A new search from the search bar replaces the amenity filters.
  useEffect(() => {
    setSelectedAmenities(amenitiesParam?.split(',').filter((a) => AMENITY_OPTIONS.includes(a)) ?? []);
  }, [amenitiesParam]);
  const [poolType, setPoolType] = useState<string>(() => searchParams.get('type') ?? 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>('price_asc');
  const { toast } = useToast();

  const { data: pools = [], isLoading, isError } = useQuery({
    queryKey: ['pools'],
    queryFn: fetchActivePools,
  });

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setSelectedAmenities([]);
    setPoolType('all');
    setSearchParams({});

    toast({
      title: 'Filters reset',
      description: 'All filters have been reset to default values.',
    });
  };

  const sortedPools: PoolItem[] = useMemo(() => {
    const query = locationQuery.toLowerCase();
    const filtered = pools.filter((pool) => {
      if (pool.price < priceRange[0] || pool.price > priceRange[1]) return false;
      if (poolType !== 'all' && pool.indoor_outdoor !== poolType) return false;
      if (query && !`${pool.location} ${pool.name}`.toLowerCase().includes(query)) return false;
      if (date && !isOpenOn(pool, date)) return false;
      const amenities = pool.amenities ?? [];
      return selectedAmenities.every((amenity) => amenities.includes(amenity));
    });

    return filtered
      .sort((a, b) => {
        switch (sortOrder) {
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'reviews':
            return b.reviews - a.reviews;
          case 'price_asc':
          default:
            return a.price - b.price;
        }
      })
      .map((pool) => ({
        id: pool.id,
        name: pool.name,
        location: pool.location,
        price: pool.price,
        rating: pool.rating,
        reviews: pool.reviews,
        image: poolImage(pool),
        indoorOutdoor: pool.indoor_outdoor,
        amenities: pool.amenities ?? [],
      }));
  }, [pools, priceRange, poolType, locationQuery, date, selectedAmenities, sortOrder]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <SearchHeader />

        <div className="container mx-auto px-4 py-8">
          {(locationQuery || date) && (
            <p className="mb-4 text-sm text-gray-600">
              Showing pools
              {locationQuery && <> matching <strong>"{locationQuery}"</strong></>}
              {date && <> open on <strong>{format(date, 'EEEE d MMMM')}</strong></>}
            </p>
          )}
          <div className="lg:flex gap-6">
            <MobileFilterToggle
              isFilterOpen={isFilterOpen}
              toggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            />

            <aside className={`lg:w-1/4 space-y-6 mb-8 lg:mb-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
              <PoolFilters
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                poolType={poolType}
                setPoolType={setPoolType}
                amenitiesOptions={AMENITY_OPTIONS}
                clearFilters={resetFilters}
              />
            </aside>

            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-80 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : isError ? (
                <div className="bg-white p-8 rounded-lg text-center text-gray-600">
                  We couldn't load pools right now. Check your connection and refresh the page.
                </div>
              ) : (
                <>
                  <PoolResultsHeader
                    count={sortedPools.length}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                  />
                  <PoolGrid pools={sortedPools} resetFilters={resetFilters} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pools;
