import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';

export interface Destination {
  id: string;
  title: string;
  location: string;
  description: string;
  highlights: string[];
  tag: string;
  image: string;
}

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'taj-mahal',
    title: 'The Monument of Love',
    location: 'Agra, Uttar Pradesh',
    description:
      'UNESCO World Heritage Site and eternal symbol of Mughal craftsmanship in pristine white marble.',
    highlights: ['Sunrise Viewing', 'Mughal Architecture', 'Yamuna Riverbank'],
    tag: 'Cultural Heritage',
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'kerala-backwaters',
    title: 'Serene Palm-Fringed Waters',
    location: 'Alleppey, Kerala',
    description:
      "Navigate emerald green canals on traditional Kettuvallam houseboats in God's Own Country.",
    highlights: ['Ayurvedic Wellness', 'Houseboat Cruises', 'Spice Plantations'],
    tag: 'Nature & Wellness',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'varanasi-ghats',
    title: 'The Eternal Spiritual City',
    location: 'Varanasi, Uttar Pradesh',
    description:
      'Ancient riverbank ghats, twilight Ganga Aarti ceremonies, and three millennia of spiritual devotion.',
    highlights: ['Ganga Aarti Ceremony', 'Ancient Temples', 'Dawn Boat Rides'],
    tag: 'Spiritual Journey',
    image:
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'jaipur-palaces',
    title: 'The Royal Pink City',
    location: 'Jaipur, Rajasthan',
    description:
      'Magnificent hill forts, ornate sandstone facades of Hawa Mahal, and timeless royal Rajput hospitality.',
    highlights: ['Amber Fort', 'Hawa Mahal', 'Handcrafted Textiles'],
    tag: 'Royal Heritage',
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ladakh-himalayas',
    title: 'The Land of High Passes',
    location: 'Leh-Ladakh, Jammu & Kashmir',
    description:
      'High-altitude desert mountains, turquoise Pangong Tso lake, and perched Buddhist gompas.',
    highlights: ['Pangong Lake', 'Monasteries', 'Stargazing Nights'],
    tag: 'High Adventure',
    image:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'goa-coasts',
    title: 'Golden Sands & Sunsets',
    location: 'Goa Coastline',
    description:
      'Portuguese colonial architecture, tranquil palm-lined shores, and vibrant coastal culture.',
    highlights: ['Sunset Cruises', 'Portuguese Churches', 'Seafood Cuisine'],
    tag: 'Tropical Leisure',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  },
];

export interface DestinationCarouselProps {
  destinations?: Destination[];
  autoPlayInterval?: number;
  className?: string;
  onExploreClick?: (dest: Destination) => void;
}

export function DestinationCarousel({
  destinations = POPULAR_DESTINATIONS,
  autoPlayInterval = 6000,
  className = '',
}: DestinationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeDest = destinations[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  }, [destinations.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  }, [destinations.length]);

  // Touch and Pointer Swipe Listeners via ref (keeps JSX a11y compliant)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX: number | null = null;
    let endX: number | null = null;
    const minDistance = 40;

    const onTouchStart = (e: TouchEvent) => {
      setIsPlaying(false);
      endX = null;
      startX = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
    };

    const onTouchEnd = () => {
      setIsPlaying(true);
      if (startX !== null && endX !== null) {
        const diff = startX - endX;
        if (diff > minDistance) {
          nextSlide();
        } else if (diff < -minDistance) {
          prevSlide();
        }
      }
      startX = null;
      endX = null;
    };

    const onMouseEnter = () => setIsPlaying(false);
    const onMouseLeave = () => setIsPlaying(true);

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [nextSlide, prevSlide]);

  // Auto play rotation
  useEffect(() => {
    if (!isPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [currentIndex, isPlaying, autoPlayInterval, nextSlide]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-white select-none ${className}`}
      role="region"
      aria-label="Incredible India Destination Carousel"
    >
      {/* Background Image — fills 100% of container */}
      <div className="relative w-full h-full min-h-[420px] overflow-hidden pointer-events-none">
        <img
          src={activeDest.image}
          alt={`${activeDest.title} in ${activeDest.location}`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
          loading="lazy"
        />
        {/* Cinematic gradient: heavy at bottom for text, light at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-black/10" />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
          {/* Top Bar with Tag */}
          <div className="flex items-center justify-between z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-black/40 backdrop-blur-md border border-white/15 text-slate-100">
              {activeDest.tag}
            </span>
          </div>

          {/* Bottom: Info + Dots */}

          <div className="space-y-4 z-10">
            {/* Destination Info */}
            <div className="space-y-3 max-w-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeDest.location}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white [text-wrap:balance]">
                  {activeDest.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed [text-wrap:pretty]">
                  {activeDest.description}
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-1.5">
                {activeDest.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 font-normal"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Slide Dots — inside image gradient */}
            <div
              className="flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Slide indicators"
            >
              {destinations.map((d, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={d.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 ${
                      isActive
                        ? 'w-6 h-2 bg-amber-500 shadow-xs'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1} of ${destinations.length}: ${d.title}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
