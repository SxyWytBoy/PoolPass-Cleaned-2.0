import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { FALLBACK_POOL_IMAGES } from '@/lib/pools';
import type { Venue } from '@/lib/venues';

const TYPE_LABEL = { indoor: 'Indoor', outdoor: 'Outdoor', both: 'Indoor & Outdoor' } as const;

/** An information-only card for a real hotel pool that isn't bookable on PoolPass yet. */
const VenueCard = ({ venue }: { venue: Venue }) => (
  <Link to={`/venues/${venue.slug}`} className="block transition-all duration-300 hover:-translate-y-1">
    <Card className="overflow-hidden border h-full group flex flex-col">
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
          <img
            src={venue.image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              const fallback = FALLBACK_POOL_IMAGES[venue.indoorOutdoor];
              if (el.src !== fallback) el.src = fallback;
            }}
          />
        </AspectRatio>
        <div className="absolute top-3 left-3">
          <Badge className="text-xs font-medium bg-pool-light text-pool-dark hover:bg-pool-light">{TYPE_LABEL[venue.indoorOutdoor]}</Badge>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/55 px-2 py-0.5 text-[10px] text-white">Illustrative image</span>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1">{venue.name}</CardTitle>
        <CardDescription className="text-sm flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {venue.area}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1">
          {venue.facilities.slice(0, 3).map((facility) => (
            <Badge key={facility} variant="outline" className="text-xs bg-pool-light text-pool-dark">
              {facility}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-sm text-gray-500">Day access via the hotel</span>
        <span className="inline-flex items-center text-xs font-medium text-pool-primary">
          View details <ArrowRight className="ml-1 h-3 w-3" />
        </span>
      </CardFooter>
    </Card>
  </Link>
);

export default VenueCard;
