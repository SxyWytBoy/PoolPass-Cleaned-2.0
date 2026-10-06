import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { FALLBACK_POOL_IMAGES } from '@/lib/pools';

interface PhotoGalleryProps {
  images: string[];
  name: string;
}

const PhotoGallery = ({ images, name }: PhotoGalleryProps) => {
  const safeImages = images && images.length > 0 ? images : [FALLBACK_POOL_IMAGES.indoor];
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [images]);

  const show = (next: number) => setIndex((next + safeImages.length) % safeImages.length);

  return (
    <div className="mb-8">
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
          <img
            src={safeImages[index]}
            alt={`${name}, photo ${index + 1} of ${safeImages.length}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src !== FALLBACK_POOL_IMAGES.indoor) img.src = FALLBACK_POOL_IMAGES.indoor;
            }}
          />
        </div>
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => show(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => show(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white tabular-nums">
              {index + 1} / {safeImages.length}
            </span>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {safeImages.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'rounded-md overflow-hidden ring-offset-2 transition',
                i === index ? 'ring-2 ring-pool-primary' : 'opacity-70 hover:opacity-100'
              )}
            >
              <AspectRatio ratio={4 / 3}>
                <img src={image} alt="" className="w-full h-full object-cover" />
              </AspectRatio>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
