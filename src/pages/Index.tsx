import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import PoolCard from '@/components/PoolCard';
import WaitlistBanner from '@/components/WaitlistBanner';
import { FALLBACK_POOL_IMAGES, fetchActivePools, poolImage } from '@/lib/pools';

const Index = () => {
  const { data: pools = [] } = useQuery({ queryKey: ['pools'], queryFn: fetchActivePools });
  const featuredPools = pools.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <WaitlistBanner />
      <Navbar />

      <div className="mt-10 md:mt-12">
        <HeroSection />
      </div>

      {/* Featured Pools Section */}
      <section className="bg-white section-padding">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Pools</h2>
            <Link to="/pools" className="text-pool-primary font-medium hover:underline">
              View all pools
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPools.map((pool) => (
              <PoolCard
                key={pool.id}
                id={pool.id}
                name={pool.name}
                location={pool.location}
                price={pool.price}
                rating={pool.rating}
                reviews={pool.reviews}
                image={poolImage(pool)}
                indoorOutdoor={pool.indoor_outdoor}
                amenities={pool.amenities}
                fallbackImage={FALLBACK_POOL_IMAGES[pool.indoor_outdoor]}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/pools">
              <Button className="bg-pool-primary hover:bg-pool-secondary text-white">
                Explore More Pools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Host CTA Section */}
      <section className="bg-white section-padding">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pool-dark to-pool-primary rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Own a Pool? Become a Host
                </h2>
                <p className="text-white/90 mb-6 text-lg">
                  Turn your private or hotel pool into an income stream. Join PoolPass hosts across the UK earning extra revenue from their pool facilities.
                </p>
                <div>
                  <Link to="/host">
                    <Button className="bg-white text-pool-primary hover:bg-gray-100">
                      Learn More About Hosting
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-64 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1050&q=80&auto=format&fit=crop"
                  alt="Swimming Pool"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
