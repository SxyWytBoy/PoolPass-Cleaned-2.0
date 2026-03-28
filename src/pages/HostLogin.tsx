import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const HostLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    navigate('/host-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <section className="container mx-auto px-4 py-16 max-w-md">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Host Login</h1>
            <p className="text-gray-600">
              Sign in to manage your pool listing
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 bg-white rounded-2xl shadow-md p-8">

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-xs text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/host-apply" className="text-blue-600 hover:underline">
                Apply to list your pool
              </Link>
            </p>

          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HostLogin;
