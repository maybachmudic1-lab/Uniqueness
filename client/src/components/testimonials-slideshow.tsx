import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@shared/schema";

export function TestimonialsSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const featured = testimonials?.slice(0, 6) || [];

  useEffect(() => {
    if (!isAutoPlaying || featured.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featured.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  };

  if (!featured.length) return null;

  const current = featured[currentIndex];

  return (
    <div className="relative" data-testid="testimonials-slideshow">
      <Card className="border-card-border bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="shrink-0">
              <Avatar className="w-24 h-24 border-4 border-primary" data-testid={`avatar-slide-${currentIndex}`}>
                {current.photo && (
                  <AvatarImage 
                    src={`/attached_assets/stock_images/${current.photo}`} 
                    alt={current.name}
                  />
                )}
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl">
                  {current.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="text-2xl font-bold" data-testid={`text-slide-name-${currentIndex}`}>
                    {current.name}
                  </h3>
                  <Badge variant="secondary" className="mt-1 font-bold" data-testid={`badge-slide-profit-${currentIndex}`}>
                    {current.profit}
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
                      />
                    ))}
                  </div>
                  {current.date && (
                    <p className="text-xs text-muted-foreground" data-testid={`text-slide-date-${currentIndex}`}>
                      {new Date(current.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-lg text-muted-foreground italic leading-relaxed" data-testid={`text-slide-testimonial-${currentIndex}`}>
                "{current.testimonial}"
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="hover-elevate"
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {featured.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-border hover:bg-primary/50'
                  }`}
                  data-testid={`button-dot-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="hover-elevate"
              data-testid="button-next-slide"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
