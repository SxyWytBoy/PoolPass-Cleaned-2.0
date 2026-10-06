
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { FALLBACK_POOL_IMAGES } from '@/lib/pools';

interface PoolCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  amenities?: string[];
  fallbackImage?: string; // Added fallbackImage property
  className?: string;
}

const PoolCard = ({
  id,
  name,
  location,
  price,
  rating,
  reviews,
  image,
  indoorOutdoor,
  amenities = [],
  fallbackImage, // Added fallbackImage parameter
  className
}: PoolCardProps) => {
  
  return (
    <Link 
      to={`/pools/${id}`}
      className={cn("block transition-all duration-300 hover:-translate-y-1", className)}
    >
      <Card className="overflow-hidden border h-full group">
        {/* Image Container */}
        <div className="relative">
          <AspectRatio ratio={4/3}>
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                const fallback = fallbackImage || FALLBACK_POOL_IMAGES[indoorOutdoor];
                if (img.src !== fallback) img.src = fallback;
              }}
            />
          </AspectRatio>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="text-xs font-medium px-2 py-0.5 bg-pool-light text-pool-dark capitalize hover:bg-pool-light">
              {indoorOutdoor === 'both' ? 'Indoor & Outdoor' : indoorOutdoor}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-1">({reviews})</span>
            </div>
          </div>
          <CardDescription className="text-sm">{location}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          {/* Amenities */}
          {amenities && amenities.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {amenities.slice(0, 3).map((amenity, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-pool-light text-pool-dark">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge variant="outline" className="text-xs bg-pool-light text-pool-dark">
                  +{amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-pool-primary">
            <span className="font-bold text-lg">£{price}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-pool-light text-pool-primary hover:bg-pool-primary hover:text-white"
          >
            View Details
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PoolCard;
