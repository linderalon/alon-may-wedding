"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

class SeededRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  range(min: number, max: number): number { return min + this.next() * (max - min); }
}

interface ImageData { src: string; alt: string; id: string; }
interface ScatterPosition { x: number; y: number; rotation: number; scale: number; }

interface ImageStackProps {
  images?: ImageData[];
  maxRotation?: number;
  scatterRadius?: number;
  seed?: number;
  className?: string;
  onReshuffle?: () => void;
}

interface ImageStackRef { reshuffle: () => void; }

// Viewport tier drives card size and scatter distance
type Tier = "xs" | "sm" | "md" | "lg";
function getTier(w: number): Tier {
  if (w < 480) return "xs";
  if (w < 768) return "sm";
  if (w < 1024) return "md";
  return "lg";
}

const CARD_SIZE: Record<Tier, { w: number; h: number; pad: number; caption: number }> = {
  xs:  { w: 140, h: 175, pad: 8,  caption: 28 },
  sm:  { w: 190, h: 240, pad: 10, caption: 32 },
  md:  { w: 240, h: 300, pad: 12, caption: 36 },
  lg:  { w: 320, h: 384, pad: 16, caption: 44 },
};

// x scatter: on mobile keep near-centre; on desktop scatter left
const SCATTER_X: Record<Tier, [number, number]> = {
  xs: [-50,  50],
  sm: [-80,  80],
  md: [-160, -120],
  lg: [-280, -240],
};

const CONTAINER_H: Record<Tier, number> = {
  xs: 420,
  sm: 560,
  md: 700,
  lg: 900,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 1.5 } },
};

const cardVariants = {
  hidden: (custom: { zIndex: number }) => ({
    x: 0, y: 0, rotate: 0, scale: 1, zIndex: custom.zIndex,
  }),
  visible: (custom: { position: ScatterPosition; zIndex: number; springConfig: object }) => ({
    x: custom.position.x,
    y: custom.position.y,
    rotate: custom.position.rotation,
    scale: custom.position.scale,
    zIndex: custom.zIndex,
    transition: custom.springConfig,
  }),
};

const ImageStack = React.forwardRef<ImageStackRef, ImageStackProps>(
  (
    {
      images = [
        { id: "1", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop", alt: "Mountain landscape" },
        { id: "2", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop", alt: "Forest path" },
        { id: "3", src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=800&fit=crop", alt: "Ocean waves" },
        { id: "4", src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=800&fit=crop", alt: "Desert dunes" },
        { id: "5", src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=800&fit=crop", alt: "City skyline" },
      ],
      maxRotation = 15,
      scatterRadius = 40,
      seed = 12345,
      className = "",
      onReshuffle,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [imagesLoaded, setImagesLoaded] = React.useState(false);
    const [scatterPositions, setScatterPositions] = React.useState<ScatterPosition[]>([]);
    const [currentSeed, setCurrentSeed] = React.useState(seed);
    const [tier, setTier] = React.useState<Tier>("lg");

    const containerRef = React.useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Detect viewport tier
    React.useEffect(() => {
      const update = () => setTier(getTier(window.innerWidth));
      update();
      window.addEventListener("resize", update, { passive: true });
      return () => window.removeEventListener("resize", update);
    }, []);

    const generateScatterPositions = React.useCallback(
      (seedValue: number, currentTier: Tier) => {
        const rng = new SeededRandom(seedValue);
        const [xMin, xMax] = SCATTER_X[currentTier];
        return images.map(() => ({
          x: rng.range(xMin, xMax),
          y: rng.range(-scatterRadius, scatterRadius),
          rotation: rng.range(-maxRotation, maxRotation),
          scale: rng.range(0.95, 1.05),
        }));
      },
      [images, scatterRadius, maxRotation]
    );

    React.useEffect(() => {
      const preload = async () => {
        await Promise.allSettled(
          images.map((img) => new Promise<void>((resolve) => {
            const el = new Image();
            el.onload = el.onerror = () => resolve();
            el.src = img.src;
          }))
        );
        setImagesLoaded(true);
      };
      preload();
    }, [images]);

    React.useEffect(() => {
      setScatterPositions(generateScatterPositions(currentSeed, tier));
    }, [currentSeed, tier, generateScatterPositions]);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && imagesLoaded) setIsVisible(true); },
        { threshold: 0.2 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [imagesLoaded]);

    const reshuffle = React.useCallback(() => {
      const newSeed = Math.floor(Math.random() * 1000000);
      setCurrentSeed(newSeed);
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
      onReshuffle?.();
    }, [onReshuffle]);

    React.useImperativeHandle(ref, () => ({ reshuffle }), [reshuffle]);

    const springConfig = prefersReducedMotion
      ? { type: "tween", duration: 0.3 }
      : { type: "spring", stiffness: 100, damping: 20 };

    const card = CARD_SIZE[tier];
    const containerH = CONTAINER_H[tier];
    // Centre-offset so card starts at true centre before scatter
    const marginLeft = -(card.w / 2);
    const marginTop  = -((card.h + card.pad * 2 + card.caption) / 2);

    return (
      <div className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}
        style={{ height: containerH }}>
        <motion.div
          ref={containerRef}
          className="relative w-full h-full"
          style={{ perspective: "1000px" }}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-sans text-sm text-[#5C4A3A]/40 tracking-widest">Loading…</p>
            </div>
          )}
          {images.map((image, index) => {
            const position = scatterPositions[index];
            if (!position) return null;
            return (
              <motion.div
                key={`${image.id}-${currentSeed}`}
                className="absolute"
                variants={cardVariants}
                custom={{ position, zIndex: images.length - index, springConfig }}
                style={{ left: "50%", top: "50%", marginLeft, marginTop }}
              >
                <div
                  className="bg-white shadow-xl border border-gray-100"
                  style={{ padding: `${card.pad}px ${card.pad}px ${card.caption}px` }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    style={{ width: card.w, height: card.h, objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='384'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E";
                    }}
                  />
                  <div
                    className="text-center font-sans font-light text-[#5C4A3A]/50 tracking-wide"
                    style={{ fontSize: 11, marginTop: 8 }}
                  >
                    {image.alt}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <Button
          onClick={reshuffle}
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4 z-50 min-h-[44px] min-w-[44px] font-sans font-light text-[11px] tracking-widest uppercase text-[#5C4A3A]/60 border-[#5C4A3A]/20 hover:border-[#5C4A3A]/40 hover:bg-white/60 active:scale-[0.97]"
          aria-label="Reshuffle photos"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:mr-2" />
          <span className="hidden sm:inline">Reshuffle</span>
        </Button>
      </div>
    );
  }
);
ImageStack.displayName = "ImageStack";

export { ImageStack };
export type { ImageData, ImageStackProps, ImageStackRef };
