import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ImagePlus, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isLocalBackend } from '@/lib/supabase';
import { AMENITY_OPTIONS, DAYS_OF_WEEK, formatPrice, parseDateString, toDateString } from '@/lib/pools';
import { STATUS_LABELS, STATUS_STYLES } from '@/lib/booking-status';
import { VENUES } from '@/lib/venues';
import type { BookingRow, BookingStatus, HostApplicationRow, PoolDetails, PoolExtra, PoolRow, ProfileRow } from '@/types/supabase';

const MAX_IMAGES = 5;

const EMPTY_DETAILS: PoolDetails = { size: '', depth: '', temperature: '', maxGuests: 6 };

type Tab = 'bookings' | 'details' | 'availability' | 'photos';

type HostBooking = BookingRow & {
  profiles: Pick<ProfileRow, 'full_name'> | null;
};

const HostDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, loading: authLoading, signOut } = useAuth();

  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('bookings');

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [indoorOutdoor, setIndoorOutdoor] = useState<'indoor' | 'outdoor' | 'both'>('indoor');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [availableFrom, setAvailableFrom] = useState('09:00');
  const [availableTo, setAvailableTo] = useState('18:00');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [details, setDetails] = useState<PoolDetails>(EMPTY_DETAILS);
  const [extras, setExtras] = useState<PoolExtra[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [venueSlug, setVenueSlug] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/host-login');
  }, [authLoading, user, navigate]);

  const { data: pools = [], isLoading: poolsLoading } = useQuery({
    queryKey: ['host-pools', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pools')
        .select('*')
        .eq('host_id', user!.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as PoolRow[];
    },
    enabled: !!user,
  });

  const pool = useMemo(
    () => pools.find((p) => p.id === selectedPoolId) ?? pools[0] ?? null,
    [pools, selectedPoolId]
  );

  // Load the selected listing into the form.
  useEffect(() => {
    if (!pool) return;
    setName(pool.name || '');
    setLocation(pool.location || '');
    setDescription(pool.description || '');
    setPrice(pool.price?.toString() || '');
    setIndoorOutdoor(pool.indoor_outdoor || 'indoor');
    setAmenities(Array.isArray(pool.amenities) ? pool.amenities : []);
    setAvailableFrom(pool.available_from || '09:00');
    setAvailableTo(pool.available_to || '18:00');
    setAvailableDays(pool.available_days || []);
    setDetails({ ...EMPTY_DETAILS, ...(pool.pool_details || {}) });
    setExtras(Array.isArray(pool.extras) ? pool.extras : []);
    setIsActive(pool.is_active !== false);
    setVenueSlug(pool.venue_slug ?? '');
    setImages(pool.images?.length ? pool.images : pool.image_url ? [pool.image_url] : []);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setError('');
  }, [pool]);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', 'host', pool?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, profiles:user_id (full_name)')
        .eq('pool_id', pool!.id)
        .order('date', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as HostBooking[];
    },
    enabled: !!pool,
  });

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleDay = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const tooBig = files.filter(f => f.size > 5 * 1024 * 1024);
    if (tooBig.length > 0) setError(`${tooBig.map(f => f.name).join(', ')} is larger than 5MB and was skipped.`);
    const remaining = MAX_IMAGES - images.length - newImageFiles.length;
    const toAdd = files.filter(f => f.size <= 5 * 1024 * 1024).slice(0, remaining);

    setNewImageFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeExistingImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadNewImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      setUploadProgress(`Uploading image ${i + 1} of ${newImageFiles.length}...`);
      const filename = `${user!.id}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from('pool-images')
        .upload(filename, file);
      if (uploadError) throw new Error(`Failed to upload ${file.name}`);
      const { data } = supabase.storage.from('pool-images').getPublicUrl(filename);
      urls.push(data.publicUrl);
    }
    setUploadProgress('');
    return urls;
  };

  const refreshPools = () => {
    queryClient.invalidateQueries({ queryKey: ['host-pools'] });
    queryClient.invalidateQueries({ queryKey: ['pools'] });
    queryClient.invalidateQueries({ queryKey: ['pool'] });
  };

  const handleSave = async () => {
    if (!pool) return;
    setError('');

    const parsedPrice = parseFloat(price);
    if (!name.trim() || !location.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Add a name, a location and a price above £0 before saving.');
      setActiveTab('details');
      return;
    }
    if (isActive && availableDays.length === 0) {
      setError('Choose at least one day you are open before publishing.');
      setActiveTab('availability');
      return;
    }

    setSaving(true);
    try {
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        uploadedUrls = await uploadNewImages();
      }

      const allImages = [...images, ...uploadedUrls];

      const { error: updateError } = await supabase
        .from('pools')
        .update({
          name: name.trim(),
          location: location.trim(),
          description,
          price: parsedPrice,
          indoor_outdoor: indoorOutdoor,
          amenities,
          available_from: availableFrom,
          available_to: availableTo,
          available_days: availableDays,
          pool_details: details,
          extras: extras.filter(x => x.name.trim()),
          is_active: isActive,
          venue_slug: venueSlug || null,
          images: allImages,
          image_url: allImages[0] || null,
        })
        .eq('id', pool.id);

      if (updateError) throw new Error('Failed to save changes.');

      refreshPools();
      toast({ title: 'Listing saved', description: isActive ? 'Your changes are live.' : 'Saved as a draft. Turn on "Listed" to show it to guests.' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  const handleCreateListing = async () => {
    if (!user) return;
    setCreating(true);
    try {
      // Start from the host's application if they sent one.
      const { data: applications } = await supabase
        .from('host_applications')
        .select('*')
        .eq('host_email', (user.email ?? '').toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1);
      const application = (applications?.[0] ?? null) as HostApplicationRow | null;

      const { data, error: insertError } = await supabase
        .from('pools')
        .insert({
          host_id: user.id,
          name: application?.pool_name ?? 'My pool',
          location: application?.location ?? '',
          description: application?.description ?? '',
          price: application?.price ?? 30,
          indoor_outdoor: application?.indoor_outdoor ?? 'outdoor',
          amenities: application?.amenities ?? [],
          available_from: application?.available_from ?? '09:00',
          available_to: application?.available_to ?? '18:00',
          available_days: application?.available_days ?? [],
          images: application?.images ?? [],
          image_url: application?.images?.[0] ?? null,
          extras: [],
          pool_details: EMPTY_DETAILS,
          rating: 0,
          reviews: 0,
          is_active: false,
          venue_slug: application?.venue_slug ?? null,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;

      setSelectedPoolId((data as { id: string }).id);
      setActiveTab('details');
      refreshPools();
      toast({
        title: 'Draft listing created',
        description: application ? 'We filled it in from your application.' : 'Add your details, then publish it.',
      });
    } catch (err) {
      toast({ title: 'Could not create a listing', description: err instanceof Error ? err.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    if (updateError) {
      toast({ title: 'Could not update the booking', description: updateError.message, variant: 'destructive' });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    toast({ title: `Booking ${STATUS_LABELS[status].toLowerCase()}` });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/host-login');
  };

  if (authLoading || (user && poolsLoading)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-gray-400 pt-20">
          Loading your listing...
        </div>
        <Footer />
      </div>
    );
  }

  const today = toDateString(new Date());
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const upcomingRevenue = bookings
    .filter(b => b.status === 'confirmed' && b.date >= today)
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-10 max-w-3xl">

          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Host Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your listings and bookings</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>

          {!pool ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-gray-600 mb-2">You don't have a pool listing yet.</p>
              <p className="text-gray-400 text-sm mb-6">Create a draft, add your details and photos, then publish it when you're ready.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleCreateListing} disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {creating ? 'Creating...' : 'Create my listing'}
                </Button>
                <Link to="/host-apply">
                  <Button variant="outline" className="w-full">Send an application first</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {pools.length > 1 && (
                  <>
                    <label htmlFor="pool-picker" className="text-sm text-gray-500">Listing</label>
                    <select
                      id="pool-picker"
                      value={pool.id}
                      onChange={e => setSelectedPoolId(e.target.value)}
                      className="border rounded-md px-2 py-1 text-sm bg-white"
                    >
                      {pools.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </>
                )}
                <Link to={`/pools/${pool.id}`} className="text-sm text-blue-600 hover:underline">
                  {pool.is_active ? 'View public listing' : 'Preview listing'}
                </Link>
                <button
                  type="button"
                  onClick={handleCreateListing}
                  disabled={creating}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
                >
                  + Add another pool
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`font-semibold ${pool.is_active ? 'text-green-600' : 'text-amber-600'}`}>{pool.is_active ? 'Listed' : 'Draft'}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-xs text-gray-500">Awaiting reply</p>
                  <p className="font-semibold tabular-nums">{pendingCount}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-xs text-gray-500">Upcoming income</p>
                  <p className="font-semibold tabular-nums">{formatPrice(upcomingRevenue)}</p>
                </div>
              </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {(['bookings', 'details', 'availability', 'photos'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-3 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {tab === 'bookings' && pendingCount > 0 && (
                      <span className="ml-1.5 inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-blue-600 text-white text-xs">{pendingCount}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8 space-y-6">

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    {bookingsLoading && <p className="text-gray-500 text-sm">Loading bookings...</p>}
                    {!bookingsLoading && bookings.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No bookings yet. {pool.is_active ? 'Guests will appear here when they book.' : 'Publish your listing so guests can find it.'}
                      </p>
                    )}
                    {bookings.map(booking => {
                      const date = parseDateString(booking.date);
                      const isPast = booking.date < today;
                      return (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium">{booking.profiles?.full_name || 'Guest'}</p>
                              <p className="text-sm text-gray-500">
                                {date ? format(date, 'EEE d MMM yyyy') : booking.date} · {booking.time_slot} · {booking.guests ?? 1} {(booking.guests ?? 1) === 1 ? 'guest' : 'guests'}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold tabular-nums">{formatPrice(Number(booking.total_price))}</span>
                              <Badge variant="outline" className={`border-transparent ${STATUS_STYLES[booking.status]}`}>{STATUS_LABELS[booking.status]}</Badge>
                            </div>
                          </div>
                          {booking.extras?.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                              Extras: {booking.extras.map(id => pool.extras?.find(x => x.id === id)?.name ?? id).join(', ')}
                            </p>
                          )}
                          {(booking.status === 'pending' || (booking.status === 'confirmed' && isPast)) && (
                            <div className="flex gap-2 mt-3">
                              {booking.status === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
                                    Decline
                                  </Button>
                                </>
                              )}
                              {booking.status === 'confirmed' && isPast && (
                                <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, 'completed')}>
                                  Mark as completed
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <Label htmlFor="is-active" className="font-medium">Listed</Label>
                      <p className="text-sm text-gray-500">When on, guests can find and book this pool.</p>
                    </div>
                    <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <Label htmlFor="venue-link">Is this pool at one of these hotels?</Label>
                    <select
                      id="venue-link"
                      value={venueSlug}
                      onChange={e => setVenueSlug(e.target.value)}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option value="">No, it's not listed</option>
                      {VENUES.map(v => (
                        <option key={v.slug} value={v.slug}>{v.name} ({v.area})</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      {isLocalBackend
                        ? "When your listing is live, it replaces that hotel's information page on PoolPass."
                        : "We confirm you work at the hotel before linking. Once linked and live, your listing replaces the hotel's information page."}
                    </p>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Pool / Venue Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price per person, per day (£)</Label>
                      <Input id="price" type="number" min="1" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Pool Type</span>
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

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Amenities</span>
                      <div className="flex flex-wrap gap-2">
                        {AMENITY_OPTIONS.map(amenity => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                              amenities.includes(amenity)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="detail-size">Pool size</Label>
                        <Input id="detail-size" placeholder="e.g. 12m x 5m" value={details.size} onChange={e => setDetails({ ...details, size: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-depth">Depth</Label>
                        <Input id="detail-depth" placeholder="e.g. 1.2m - 1.8m" value={details.depth} onChange={e => setDetails({ ...details, depth: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-temp">Water temperature</Label>
                        <Input id="detail-temp" placeholder="e.g. 29°C" value={details.temperature} onChange={e => setDetails({ ...details, temperature: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detail-guests">Maximum guests</Label>
                        <Input id="detail-guests" type="number" min="1" max="50" value={details.maxGuests} onChange={e => setDetails({ ...details, maxGuests: Math.max(1, Number(e.target.value) || 1) })} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Paid extras</span>
                      {extras.length === 0 && <p className="text-sm text-gray-500">No extras yet. Towel hire or drinks are popular.</p>}
                      <div className="space-y-2">
                        {extras.map((extra, i) => (
                          <div key={extra.id} className="flex gap-2 items-center">
                            <Input
                              id={`extra-name-${i}`}
                              aria-label="Extra name"
                              value={extra.name}
                              onChange={e => setExtras(extras.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                            />
                            <Input
                              id={`extra-price-${i}`}
                              aria-label="Extra price in pounds"
                              type="number"
                              min="0"
                              step="0.5"
                              className="w-28"
                              value={extra.price}
                              onChange={e => setExtras(extras.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) || 0 } : x)))}
                            />
                            <button
                              type="button"
                              aria-label={`Remove ${extra.name || 'extra'}`}
                              onClick={() => setExtras(extras.filter((_, j) => j !== i))}
                              className="p-2 text-gray-400 hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setExtras([...extras, { id: `extra-${Date.now()}`, name: '', price: 5 }])}
                      >
                        Add an extra
                      </Button>
                    </div>
                  </>
                )}

                {/* Availability Tab */}
                {activeTab === 'availability' && (
                  <>
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
                      <span className="text-sm font-medium">Available Days</span>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map(day => (
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
                  </>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <>
                    <p className="text-sm text-gray-500">Upload up to {MAX_IMAGES} photos. The first photo is used as the cover image.</p>

                    {/* Existing images */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {images.map((src, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
                            <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            {i === 0 && (
                              <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              aria-label={`Remove photo ${i + 1}`}
                              onClick={() => removeExistingImage(i)}
                              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New image previews */}
                    {newImagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {newImagePreviews.map((src, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
                            <img src={src} alt={`New photo ${i + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                            <button
                              type="button"
                              aria-label={`Remove new photo ${i + 1}`}
                              onClick={() => removeNewImage(i)}
                              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload button */}
                    {images.length + newImageFiles.length < MAX_IMAGES && (
                      <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <ImagePlus className="h-7 w-7 mb-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Click to add photos</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP, up to 5MB each</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}

                    {images.length + newImageFiles.length >= MAX_IMAGES && (
                      <p className="text-sm text-gray-400 text-center">Maximum of {MAX_IMAGES} photos reached.</p>
                    )}
                  </>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {uploadProgress && <p className="text-blue-500 text-sm text-center">{uploadProgress}</p>}

                {activeTab !== 'bookings' && (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {saving ? (uploadProgress || 'Saving...') : 'Save Changes'}
                  </Button>
                )}

              </div>
            </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HostDashboard;
