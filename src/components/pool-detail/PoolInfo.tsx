
import React from 'react';
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import PersonAvatar from '@/components/common/Avatar';

interface PoolInfoProps {
  description: string;
  host: {
    name: string;
    image: string;
    joinedDate?: string;
    responseTime?: string;
  };
  poolDetails: {
    size: string;
    depth: string;
    temperature: string;
    maxGuests: number;
  };
  amenities: { name: string; included: boolean }[];
}

const PoolInfo = ({ description, host, poolDetails, amenities }: PoolInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">About this pool</h2>
          <p className="text-gray-600">Hosted by {host.name}</p>
          {(host.joinedDate || host.responseTime) && (
            <p className="text-sm text-gray-500 mt-1">
              {host.joinedDate && <>Hosting since {host.joinedDate}</>}
              {host.joinedDate && host.responseTime && ' · '}
              {host.responseTime && <>Replies {host.responseTime.toLowerCase()}</>}
            </p>
          )}
        </div>
        <div className="relative">
          <PersonAvatar
            name={host.name}
            src={host.image}
            className="w-14 h-14 border-2 border-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(poolDetails).map(([key, value]) => (
          <div key={key} className="bg-gray-50 p-4 rounded-lg text-center transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-sm">
            <p className="text-sm text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="font-medium text-gray-800">{value.toString()}</p>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Array.isArray(amenities) && amenities.map((amenity, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center p-3 rounded-lg transition-all duration-200",
              amenity.included 
                ? "bg-green-50 hover:bg-green-100" 
                : "bg-gray-50 hover:bg-gray-100"
            )}
          >
            {amenity.included ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <span className="h-5 w-5 border rounded-full flex items-center justify-center mr-2 text-gray-400">
                <Info className="h-3 w-3" />
              </span>
            )}
            <span className={cn(
              amenity.included ? 'text-gray-800' : 'text-gray-400 line-through',
              "font-medium"
            )}>
              {amenity.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoolInfo;
