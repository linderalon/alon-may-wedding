"use client";

import * as React from "react";

const LEAF_SRCS = [
  "/leaf-1.png",
  "/leaf-2.png",
  "/leaf-3.png",
  "/leaf-4.png",
  "/leaf-5.png",
  "/leaf-6.png",
];

interface Leaf {
  imgIdx: number;
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpeed: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
}

function makeLeaf(cw: number, ch: number, fromTop = false): Leaf {
  const size = 28 + Math.random() * 38;
  return {
    imgIdx:     Math.floor(Math.random() * LEAF_SRCS.length),
    x:          (0.20 + Math.random() * 0.60) * cw,
    y:          fromTop ? -(size * 2) : Math.random() * ch,
    size,
    rot:        Math.random() * Math.PI * 2,
    rotSpeed:   (Math.random() - 0.5) * 0.022,
    vy:         0.55 + Math.random() * 0.85,
    sway:       22 + Math.random() * 38,
    swaySpeed:  0.007 + Math.random() * 0.010,
    swayOffset: Math.random() * Math.PI * 2,
    opacity:    0.60 + Math.random() * 0.35,
  };
}

export function FallingLeaves() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // prefers-reduced-motion — skip animation entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let t   = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // preload images
    const imgs: HTMLImageElement[] = LEAF_SRCS.map((src) => {
      const img = new window.Image();
      img.src   = src;
      return img;
    });

    // seed leaves
    const COUNT  = 18;
    const leaves: Leaf[] = Array.from({ length: COUNT }, () =>
      makeLeaf(canvas.width, canvas.height, false)
    );

    const tick = () => {
      t++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const leaf of leaves) {
        const img = imgs[leaf.imgIdx];
        if (!img.complete || !img.naturalWidth) {
          leaf.y += leaf.vy;
          if (leaf.y > height + leaf.size) Object.assign(leaf, makeLeaf(width, height, true));
          continue;
        }

        const sx = leaf.x + Math.sin(t * leaf.swaySpeed + leaf.swayOffset) * leaf.sway;
        const aspect = img.naturalWidth / img.naturalHeight;
        const w = leaf.size * aspect;
        const h = leaf.size;

        ctx.save();
        ctx.globalAlpha = leaf.opacity;
        ctx.translate(sx, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();

        leaf.y   += leaf.vy;
        leaf.rot += leaf.rotSpeed;

        if (leaf.y > height + leaf.size * 2) {
          Object.assign(leaf, makeLeaf(width, height, true));
        }
      }

      raf = requestAnimationFrame(tick);
    };

    // wait for at least first image before starting
    const start = () => { raf = requestAnimationFrame(tick); };
    if (imgs[0].complete) { start(); }
    else { imgs[0].onload = start; }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 4 }}
    />
  );
}
