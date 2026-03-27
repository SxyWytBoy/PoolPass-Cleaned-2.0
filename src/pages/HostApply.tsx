import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const amenitiesOptions = [
  "Heated",
  "Loungers",
  "Towels Provided",
  "Food Available",
  "Changing Rooms",
  "Hot Tub/Jacuzzi",
  "Sauna",
  "WiFi",
  "Bar Service",
  "Parking",
  "Accessible",
  "Child Friendly",
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const HostApply = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pool details
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [indoorOutdoor, setIndoorOutdoor] = useState<'indoor' | 'outdoor' | 'both' | ''>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Availability
  const [availableFrom, setAvailableFrom] = useState('09:00');
  const [availableTo, setAvailableTo] = useState('18:00');
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  // Host contact
  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPhone, setHostPhone] = useState('');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleDay = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !location || !price || !indoorOutdoor || !hostName || !hostEmail) {
      setError('Please fill in all required fields.');
      return;
    }

    if (availableDays.length === 0) {
      setError('Please select at least one available day.');
      return;
    }

    setLoading(true);

    const { error: supabaseError } = await supabase
      .from('host_applications')
      .insert([{
        pool_name: name,
        location,
        description,
        price: parseFloat(price),
        indoor_outdoor: indoorOutdoor,
        amenities: selectedAmenities,
        available_from: availableFrom,
        available_to: availableTo,
        available_days: availableDays,
        host_name: hostName,
        host_email: hostEmail,
        host_phone: hostPhone,
        status: 'pending',
      }]);

    setLoading(false);

    if (supabaseError) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-16 max-w-lg text-center">
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Application received!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Thanks {hostName} — we'll review your listing and be in touch within 48 hours.
            </p>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <section className="container mx-auto px-4 py-12 max-w-2xl">

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Pool on PoolPass</h1>
            <p className="text-gray-600 text-lg">
              Fill in the details below and we'll review your application within 48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-md p-8">

            {/* Pool Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Pool Details</h2>
              <div className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="name">Pool / Venue Name <span className="text-red-500">*</span></Label>
                  <Input id="name" type="text" placeholder="e.g. The Kensington Swim Club" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input id="location" type="text" placeholder="e.g. Kensington, London" value={location} onChange={e => setLocation(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Tell swimmers what makes your pool special..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Session (£) <span className="text-red-500">*</span></Label>
                  <Input id="price" type="number" min="1" step="0.01" placeholder="e.g. 35" value={price} onChange={e => setPrice(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Pool Type <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['indoor', 'outdoor', 'both'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setIndoorOutdoor(type)}
                        className={`border rounded-xl p-3 text-sm font-medium capitalize transition-all ${
                          indoorOutdoor === type
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 text-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenitiesOptions.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedAmenities.includes(amenity)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Availability</h2>
              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="available_from">Open From</Label>
                    <Input id="available_from" type="time" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="available_to">Open Until</Label>
                    <Input id="available_to" type="time" value={availableTo} onChange={e => setAvailableTo(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Days <span className="text-red-500">*</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          availableDays.includes(day)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Host Contact */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Contact Details</h2>
              <div className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="host_name">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="host_name" type="text" placeholder="Jane Smith" value={hostName} onChange={e => setHostName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host_email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="host_email" type="email" placeholder="jane@example.com" value={hostEmail} onChange={e => setHostEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host_phone">Phone Number</Label>
                  <Input id="host_phone" type="tel" placeholder="07700 900000" value={hostPhone} onChange={e => setHostPhone(e.target.value)} />
                </div>

              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>

            <p className="text-xs text-center text-gray-400">
              We review all applications within 48 hours. You'll hear from us by email.
            </p>

          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HostApply;
