import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, MapPin } from 'lucide-react';

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
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeDest = destinations[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
    setProgress(0);
  }, [destinations.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
    setProgress(0);
  }, [destinations.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const intervalStep = 50;
    const increment = (intervalStep / autoPlayInterval) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextSlide();
          return 0;
        }
        return p + increment;
      });
    }, intervalStep);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentIndex, isPlaying, autoPlayInterval, nextSlide]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-white ${className}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      role="region"
      aria-label="Incredible India Destination Carousel"
    >
      {/* Background Image with Clean Cinematic Overlay */}
      <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden">
        <img
          src={activeDest.image}
          alt={`${activeDest.title} in ${activeDest.location}`}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out outline outline-1 outline-black/10 dark:outline-white/10 -outline-offset-1"
          loading="lazy"
        />
        {/* Subtle dark gradient for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
          {/* Top Bar with Tag and Auto-Play Toggle */}
          <div className="flex items-center justify-between z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-black/40 backdrop-blur-md border border-white/15 text-slate-100">
              {activeDest.tag}
            </span>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/15 transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Bottom Destination Info */}
          <div className="space-y-3 max-w-xl z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{activeDest.location}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white [text-wrap:balance]">
                {activeDest.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed [text-wrap:pretty]">
                {activeDest.description}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
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
        </div>
      </div>

      {/* Slide Navigation & Progress Bar Footer */}
      <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
        {/* Progress Bar & Indicators */}
        <div className="flex items-center gap-1.5">
          {destinations.map((d, index) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
              }}
              className="relative h-1.5 w-8 rounded-full bg-slate-800 overflow-hidden cursor-pointer"
              aria-label={`Go to slide ${index + 1}: ${d.title}`}
            >
              {index === currentIndex && (
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              )}
              {index < currentIndex && <div className="h-full bg-slate-500 rounded-full w-full" />}
            </button>
          ))}
        </div>

        {/* Previous / Next Controls */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {currentIndex + 1} / {destinations.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevSlide}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              aria-label="Previous destination"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              aria-label="Next destination"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
