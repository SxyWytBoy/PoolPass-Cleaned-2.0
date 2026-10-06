
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PoolFiltersProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  poolType: string;
  setPoolType: (type: string) => void;
  amenitiesOptions: string[];
  clearFilters: () => void;
  className?: string;
}

const PoolFilters = ({
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
  poolType,
  setPoolType,
  amenitiesOptions,
  clearFilters,
  className
}: PoolFiltersProps) => {
  
  const handleAmenityChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
      <h2 className="text-lg font-medium mb-4">Filters</h2>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Price Range (per person, per day)</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 100]}
            min={0}
            max={100}
            step={5}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      {/* Pool Type Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Pool Type</h3>
        <RadioGroup value={poolType} onValueChange={setPoolType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="type-all" />
            <Label htmlFor="type-all">All Pools</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="indoor" id="type-indoor" />
            <Label htmlFor="type-indoor">Indoor Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outdoor" id="type-outdoor" />
            <Label htmlFor="type-outdoor">Outdoor Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="type-both" />
            <Label htmlFor="type-both">Indoor & Outdoor</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Amenities Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Amenities</h3>
        <div className="space-y-2 max-h-60 overflow-auto">
          {amenitiesOptions.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <Checkbox 
                id={`amenity-${amenity}`} 
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityChange(amenity)}
                className="mr-2"
              />
              <label 
                htmlFor={`amenity-${amenity}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clear Filters Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default PoolFilters;
