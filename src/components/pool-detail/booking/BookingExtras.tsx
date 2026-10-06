
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Extra {
  id: string;
  name: string;
  price: number;
}

interface BookingExtrasProps {
  extras?: Extra[];
  maxGuests?: number;
  guests: number;
  setGuests: (guests: number) => void;
  selectedExtras: string[];
  toggleExtra: (extraId: string) => void;
}

const BookingExtras = ({ extras, maxGuests = 1, guests, setGuests, selectedExtras, toggleExtra }: BookingExtrasProps) => {
  return (
    <div className="mb-6">
      <Tabs defaultValue="extras">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="extras" className="w-full">Add Extras</TabsTrigger>
          <TabsTrigger value="guests" className="w-full">Guests</TabsTrigger>
        </TabsList>
        <TabsContent value="extras">
          <div className="space-y-3">
            {(!extras || extras.length === 0) && (
              <p className="text-sm text-gray-500">This host doesn't offer extras.</p>
            )}
            {Array.isArray(extras) && extras.map((extra) => (
              <div key={extra.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox 
                    id={`extra-${extra.id}`}
                    checked={selectedExtras.includes(extra.id)}
                    onCheckedChange={() => toggleExtra(extra.id)}
                    className="mr-2"
                  />
                  <Label htmlFor={`extra-${extra.id}`}>{extra.name}</Label>
                </div>
                <span className="text-sm">+ £{extra.price}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="guests">
          <div className="flex items-center justify-between">
            <label htmlFor="booking-guests" className="text-sm">Number of Guests</label>
            <select
              id="booking-guests"
              className="border rounded-md p-1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[...Array(maxGuests)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingExtras;
