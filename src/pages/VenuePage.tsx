import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, ExternalLink, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { Button } from '@/components/ui/button';
import { fetchActivePools } from '@/lib/pools';
import { findVenue, VENUES_CHECKED } from '@/lib/venues';

const VenuePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const venue = findVenue(slug);
  const { data: pools = [] } = useQuery({ queryKey: ['pools'], queryFn: fetchActivePools });

  if (!venue) return <NotFound />;

  // Once the venue has a live PoolPass listing, send people there instead.
  const listing = pools.find((p) => p.venue_slug === venue.slug);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <p className="text-sm text-gray-500 mb-2">
            <Link to="/pools" className="hover:underline">Pools</Link> / {venue.region}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{venue.name}</h1>
          <p className="flex items-center gap-1 text-gray-600 mb-6">
            <MapPin className="h-4 w-4" /> {venue.area}
          </p>

          <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-8">
            <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
              <img src={venue.image} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-3 right-3 rounded bg-black/60 px-3 py-1 text-xs text-white">
              Illustrative image, not a photo of this venue
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold mb-3">About this pool</h2>
                <p className="text-gray-700 leading-relaxed">{venue.summary}</p>
              </section>

              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {venue.facilities.map((facility) => (
                    <li key={facility} className="flex items-center p-3 rounded-lg bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="font-medium text-gray-800">{facility}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24 space-y-4">
                {listing ? (
                  <>
                    <p className="font-semibold">Now bookable on PoolPass</p>
                    <Link to={`/pools/${listing.id}`}>
                      <Button className="w-full bg-pool-primary hover:bg-pool-secondary">See prices and book</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="font-semibold mb-1">Day access</p>
                      <p className="text-sm text-gray-600">{venue.dayAccess}</p>
                    </div>
                    <a href={venue.url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-pool-primary hover:bg-pool-secondary">
                        Visit the hotel’s website <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    <Link to="/waitlist">
                      <Button variant="outline" className="w-full">Tell me when it’s on PoolPass</Button>
                    </Link>
                    <p className="text-xs text-gray-500">
                      Prices, times and availability are set by the hotel. PoolPass is not affiliated with {venue.name}.
                      Details checked {VENUES_CHECKED}.
                    </p>
                  </>
                )}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Work at {venue.name}?</p>
                  <Link to={`/host-apply?venue=${venue.slug}`} className="text-sm font-medium text-pool-primary hover:underline">
                    List your pool on PoolPass
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VenuePage;
