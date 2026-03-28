import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

const amenitiesOptions = [
  "Heated", "Loungers", "Towels Provided", "Food Available",
  "Changing Rooms", "Hot Tub/Jacuzzi", "Sauna", "WiFi",
  "Bar Service", "Parking", "Accessible", "Child Friendly",
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const MAX_IMAGES = 5;

interface PoolListing {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  indoor_outdoor: 'indoor' | 'outdoor' | 'both';
  amenities: string[];
  available_from: string;
  available_to: string;
  available_days: string[];
  image_url: string;
  images: string[];
  is_active: boolean;
}

const HostDashboard = () => {
  const navigate = useNavigate();
  const [pool, setPool] = useState<PoolListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'availability' | 'photos'>('details');

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
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    const fetchHostPool = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/host-login');
        return;
      }

      const { data, error } = await supabase
        .from('pools')
        .select('*')
        .eq('host_id', session.user.id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setPool(data);
      setName(data.name || '');
      setLocation(data.location || '');
      setDescription(data.description || '');
      setPrice(data.price?.toString() || '');
      setIndoorOutdoor(data.indoor_outdoor || 'indoor');
      setAmenities(data.amenities || []);
      setAvailableFrom(data.available_from || '09:00');
      setAvailableTo(data.available_to || '18:00');
      setAvailableDays(data.available_days || []);
      setImages(data.images || (data.image_url ? [data.image_url] : []));
      setLoading(false);
    };

    fetchHostPool();
  }, [navigate]);

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
    const remaining = MAX_IMAGES - images.length - newImageFiles.length;
    const toAdd = files.slice(0, remaining);

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
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
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

  const handleSave = async () => {
    if (!pool) return;
    setError('');
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
          name,
          location,
          description,
          price: parseFloat(price),
          indoor_outdoor: indoorOutdoor,
          amenities,
          available_from: availableFrom,
          available_to: availableTo,
          available_days: availableDays,
          images: allImages,
          image_url: allImages[0] || pool.image_url,
        })
        .eq('id', pool.id);

      if (updateError) throw new Error('Failed to save changes.');

      setImages(allImages);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/host-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-gray-400">
          Loading your listing...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-10 max-w-3xl">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Host Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your pool listing</p>
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
              <p className="text-gray-600 mb-4">You don't have an active pool listing yet.</p>
              <p className="text-gray-400 text-sm">Once your application is approved, your listing will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {(['details', 'availability', 'photos'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-8 space-y-6">

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
                      <Label htmlFor="price">Price per Session (£)</Label>
                      <Input id="price" type="number" min="1" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Pool Type</Label>
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
                      <Label>Amenities</Label>
                      <div className="flex flex-wrap gap-2">
                        {amenitiesOptions.map(amenity => (
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
                      <Label>Available Days</Label>
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
                        <span className="text-2xl mb-2">📷</span>
                        <span className="text-sm font-medium text-gray-600">Click to add photos</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP — max 5MB each</span>
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

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? (uploadProgress || 'Saving...') : saved ? '✓ Saved' : 'Save Changes'}
                </Button>

              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HostDashboard;
