import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const HostPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pool-dark to-pool-primary mt-16 md:mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Become a Pool Host</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Turn your private pool into a source of income. Join our community of hosts earning from their pool facilities.
          </p>
          <Link to="/host-apply">
            <Button className="bg-white text-pool-primary hover:bg-gray-100 px-8">
              List Your Pool
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Host Section */}
      <section className="bg-white section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Host Your Pool With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the growing community of pool owners earning additional income through PoolPass.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pool-primary">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Extra Income</h3>
              <p className="text-gray-500">Earn additional income from your pool during times when it would otherwise be unused.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pool-primary">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-500">You control when your pool is available for bookings - choose days and hours that work for you.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pool-primary">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Insurance Coverage</h3>
              <p className="text-gray-500">Our platform provides insurance coverage for all bookings, giving you peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Become a Host */}
      <section className="bg-gray-50 section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Become a Host</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our platform in 3 easy steps and start earning from your pool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-pool-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-2">Create Your Listing</h3>
                <p className="text-gray-600">
                  Submit your pool details using our simple application form. Add your location, amenities, availability, and pricing.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-pool-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-2">Get Approved</h3>
                <p className="text-gray-600">
                  Our team reviews your application within 48 hours. Once approved, your listing goes live on the PoolPass platform.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-pool-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4 mt-2">Start Earning</h3>
                <p className="text-gray-600">
                  Once your listing is live, swimmers can discover and book your pool. Payments are made within 24 hours of each completed visit.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/host-apply">
              <Button className="bg-pool-primary hover:bg-pool-secondary text-white px-8">
                Apply to List Your Pool
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Hosts Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop"
                    alt="Host"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">London Host since 2023</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've been able to offset the costs of maintaining my pool by hosting guests through PoolPass. It's been a fantastic experience and the platform makes it so easy to manage bookings."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&auto=format&fit=crop"
                    alt="Host"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Mark Davies</h4>
                  <p className="text-sm text-gray-500">Manchester Host since 2022</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a hotel owner, PoolPass has allowed us to generate additional revenue from our pool during off-peak hours. The verification process was smooth and we've had nothing but positive experiences."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Host FAQ</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">How much can I earn from hosting my pool?</h3>
              <p className="text-gray-600">Earnings vary based on your location, pool features, and availability. Hosts in popular areas with well-maintained pools typically earn between £100 and £300 per day.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">What insurance protection is provided?</h3>
              <p className="text-gray-600">We provide a comprehensive insurance policy that covers damage to your property and liability protection during guest bookings up to £1 million.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">What are the safety requirements for listing my pool?</h3>
              <p className="text-gray-600">Your pool must comply with local safety regulations. We require adequate safety equipment, clear depth markings, and proper maintenance. Our team will guide you through the verification process.</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold mb-2">How quickly will I receive payment?</h3>
              <p className="text-gray-600">Hosts receive payments within 24 hours after a guest's visit is completed, directly to your nominated bank account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pool-dark to-pool-primary section-padding">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Hosting?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Join our growing community of hosts and start earning from your swimming pool today.
          </p>
          <Link to="/host-apply">
            <Button className="bg-white text-pool-primary hover:bg-gray-100 px-8 py-6 text-lg">
              Apply to List Your Pool
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HostPage;
