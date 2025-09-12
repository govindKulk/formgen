"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ParallaxBackground({ children, className = "" }: ParallaxBackgroundProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Different parallax speeds for various elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -250]);

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Slow moving large blobs */}
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-green-200/30 dark:bg-green-400/20 rounded-full mix-blend-multiply filter blur-xl animate-morph"
        />
        <motion.div
          style={{ y: y1, rotate: rotate1 }}
          className="absolute top-20 -right-32 w-80 h-80 bg-blue-200/30 dark:bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-gentle-sway"
        />

        {/* Medium speed floating elements */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-300/40 dark:bg-purple-400/30 rounded-full animate-parallax-float"
        />
        <motion.div
          style={{ y: y2, rotate: rotate2 }}
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-300/40 dark:bg-pink-400/30 rounded-full animate-parallax-drift"
        />

        {/* Fast moving small elements */}
        <motion.div
          style={{ y: y3, scale }}
          className="absolute top-1/3 left-1/3 w-16 h-16 bg-yellow-400/50 dark:bg-yellow-400/40 rounded-full animate-float animation-delay-1000"
        />
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-orange-400/50 dark:bg-orange-400/40 rounded-full animate-bounce-slow animation-delay-3000"
        />

        {/* Geometric shapes with varied parallax */}
        <motion.div
          style={{ y: y4, rotate: rotate1 }}
          className="absolute top-1/2 left-1/5 w-12 h-12 bg-emerald-400/60 dark:bg-emerald-400/50 rotate-45 animate-parallax-drift animation-delay-2000"
        />
        <motion.div
          style={{ y: y4 }}
          className="absolute bottom-1/4 right-1/5 w-8 h-8 bg-indigo-400/60 dark:bg-indigo-400/50 rounded-full animate-pulse-slow animation-delay-4000"
        />

        {/* Ultra fast moving particles */}
        <motion.div
          style={{ y: y5 }}
          className="absolute top-2/3 left-2/3 w-4 h-4 bg-cyan-500/70 dark:bg-cyan-400/60 rounded-full animate-parallax-float animation-delay-1000"
        />
        <motion.div
          style={{ y: y5, rotate: rotate2 }}
          className="absolute top-1/5 right-2/3 w-6 h-6 bg-rose-500/70 dark:bg-rose-400/60 rounded-full animate-bounce-slow animation-delay-5000"
        />

        {/* Additional morphing shapes */}
        <motion.div
          style={{ y: y2, scale }}
          className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-teal-200/30 to-blue-200/30 dark:from-teal-400/20 dark:to-blue-400/20 rounded-full animate-morph filter blur-sm"
        />
        <motion.div
          style={{ y: y3 }}
          className="absolute top-10 right-10 w-28 h-28 bg-gradient-to-r from-violet-200/40 to-purple-200/40 dark:from-violet-400/30 dark:to-purple-400/30 rounded-full animate-gentle-sway filter blur-sm"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
