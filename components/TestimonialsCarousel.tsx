'use client';

import * as React from 'react';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Star, Pause, Play } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/lib/testimonials';

const AUTOPLAY_INTERVAL = 5000;

type TestimonialsCarouselProps = {
  testimonials: Testimonial[];
};

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();
  const isPlayingRef = React.useRef(true);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: 'performance',
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 24 },
      },
      '(min-width: 1280px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
    defaultAnimation: { duration: 1200 },
    dragSpeed: 1,
  });

  const stopAutoplay = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const startAutoplay = React.useCallback(() => {
    stopAutoplay();
    if (!isPlayingRef.current) return;
    timerRef.current = setTimeout(() => {
      instanceRef.current?.next();
    }, AUTOPLAY_INTERVAL);
  }, [instanceRef, stopAutoplay]);

  React.useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  React.useEffect(() => {
    const slider = instanceRef.current;
    if (!slider) return;

    startAutoplay();

    const container = slider.container;

    const handleMouseEnter = () => setIsPlaying(false);
    const handleMouseLeave = () => setIsPlaying(true);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    slider.on('dragStarted', stopAutoplay);
    slider.on('animationEnded', startAutoplay);
    slider.on('updated', startAutoplay);

    slider.on('destroyed', () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      stopAutoplay();
    };
  }, [instanceRef, startAutoplay, stopAutoplay]);

  React.useEffect(() => {
    if (isPlaying) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }, [isPlaying, startAutoplay, stopAutoplay]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-3xl font-serif">Testimonios</h2>
          <p className="text-sm text-muted-foreground">
            Historias reales de clientes que confiaron en nosotros.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="hidden md:inline-flex"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pausar
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Reproducir
              </>
            )}
          </Button>
          <Button asChild variant="default" size="sm">
            <Link href="/proyectos">Casos de éxito</Link>
          </Button>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider">
        {testimonials.map((testimonial) => (
          <div className="keen-slider__slide" key={testimonial.id}>
            <Card className="h-full bg-background/80 shadow-soft">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    {testimonial.avatarUrl ? (
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                    ) : (
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-base font-semibold">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    )}
                  </div>
                </div>
                <p className="flex-1 italic text-muted-foreground">
                  &ldquo;{testimonial.message}&rdquo;
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const isFilled = index < Math.round(testimonial.rating);
                      return (
                        <Star
                          key={`${testimonial.id}-star-${index}`}
                          className={`h-4 w-4 ${
                            isFilled
                              ? 'text-amber-400 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {testimonial.rating.toFixed(1)} / 5
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-center md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pausar
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Reproducir
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}
