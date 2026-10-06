
import React from 'react';
import { Star, MapPin } from 'lucide-react';

interface PoolHeaderProps {
  name: string;
  rating?: number;
  reviews?: number;
  location: string;
}

const PoolHeader = ({ name, rating = 0, reviews = 0, location }: PoolHeaderProps) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{name}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-6 space-y-2 sm:space-y-0">
        <div className="flex items-center mr-4">
          <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
            <span className="font-medium">{reviews > 0 ? rating.toFixed(1) : 'New'}</span>
            <span className="text-gray-500 ml-1">({reviews} {reviews === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
            <MapPin className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-gray-700">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolHeader;
