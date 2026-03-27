import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';

type UserType = 'swimmer' | 'pool_owner' | '';

const Waitlist = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !userType) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const { error: supabaseError } = await supabase
      .from('waitlist')
      .insert([{ name, email, user_type: userType }]);

    setLoading(false);

    if (supabaseError) {
      if (supabaseError.code === '23505') {
        setError('This email is already on the waitlist.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <section className="container mx-auto px-4 py-16 max-w-lg">

          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Join the PoolPass Waitlist</h1>
                <p className="text-gray-600 text-lg">
                  PoolPass is launching soon. Be the first to access the UK's best private and hotel pools — or list your own.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-md p-8">

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType('swimmer')}
                      className={`border rounded-xl p-4 text-sm font-medium transition-all ${
                        userType === 'swimmer'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                    >
                      🏊 Swimmer
                      <p className="font-normal text-xs mt-1 text-gray-500">I want to book pools</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('pool_owner')}
                      className={`border rounded-xl p-4 text-sm font-medium transition-all ${
                        userType === 'pool_owner'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                    >
                      🏡 Pool Owner
                      <p className="font-normal text-xs mt-1 text-gray-500">I want to list my pool</p>
                    </button>
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
                  {loading ? 'Joining...' : 'Join the Waitlist'}
                </Button>

                <p className="text-xs text-center text-gray-400">
                  No spam. We'll only contact you when PoolPass launches.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold mb-4">You're on the list!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Thanks {name} — we'll be in touch when PoolPass launches. Keep an eye on your inbox.
              </p>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Waitlist;
