"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "features" | "steps" | "hero";
}

export default function ParallaxSection({ 
  children, 
  className = "", 
  variant = "features" 
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth delayed parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const getVariantElements = () => {
    switch (variant) {
      case "features":
        return (
          <>
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-200/20 dark:from-green-400/15 dark:to-emerald-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-morph"
            />
            <motion.div
              style={{ y: y2, rotate }}
              className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-200/25 to-cyan-200/25 dark:from-blue-400/20 dark:to-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl animate-gentle-sway"
            />
            <motion.div
              style={{ y: y1, scale }}
              className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-300/40 dark:bg-purple-400/30 rounded-full animate-parallax-float animation-delay-2000"
            />
            <motion.div
              style={{ y: y3 }}
              className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-pink-300/50 dark:bg-pink-400/40 rounded-full animate-bounce-slow animation-delay-4000"
            />
          </>
        );
      case "steps":
        return (
          <>
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute top-32 right-16 w-56 h-56 bg-gradient-to-br from-orange-200/20 to-red-200/20 dark:from-orange-400/15 dark:to-red-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-morph"
            />
            <motion.div
              style={{ y: y2, rotate }}
              className="absolute bottom-16 left-16 w-40 h-40 bg-gradient-to-br from-indigo-200/25 to-violet-200/25 dark:from-indigo-400/20 dark:to-violet-400/20 rounded-full mix-blend-multiply filter blur-xl animate-gentle-sway"
            />
            <motion.div
              style={{ y: y1, scale }}
              className="absolute top-2/3 right-1/4 w-24 h-24 bg-yellow-300/40 dark:bg-yellow-400/30 rounded-full animate-parallax-drift animation-delay-1000"
            />
            <motion.div
              style={{ y: y3 }}
              className="absolute top-1/4 left-1/3 w-12 h-12 bg-teal-400/50 dark:bg-teal-400/40 rotate-45 animate-parallax-float animation-delay-3000"
            />
          </>
        );
      case "hero":
      default:
        return (
          <>
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-300/25 to-blue-300/25 dark:from-green-400/20 dark:to-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-morph"
            />
            <motion.div
              style={{ y: y2, rotate }}
              className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-300/30 dark:from-purple-400/25 dark:to-pink-400/25 rounded-full mix-blend-multiply filter blur-2xl animate-gentle-sway"
            />
            <motion.div
              style={{ y: y1, scale }}
              className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-300/40 dark:bg-yellow-400/35 rounded-full animate-parallax-float animation-delay-1500"
            />
            <motion.div
              style={{ y: y3, rotate }}
              className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-cyan-300/45 dark:bg-cyan-400/35 rounded-full animate-parallax-drift animation-delay-2500"
            />
          </>
        );
    }
  };

  return (
    <motion.div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getVariantElements()}
        
        {/* Common floating particles */}
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute top-1/4 left-1/5 w-6 h-6 bg-emerald-500/60 dark:bg-emerald-400/50 rounded-full animate-float animation-delay-1000"
        />
        <motion.div
          style={{ y: y3, rotate }}
          className="absolute bottom-1/5 right-1/5 w-8 h-8 bg-rose-500/60 dark:bg-rose-400/50 rounded-full animate-bounce-slow animation-delay-4000"
        />
        <motion.div
          style={{ y: y1, scale }}
          className="absolute top-3/4 left-2/3 w-4 h-4 bg-indigo-500/70 dark:bg-indigo-400/60 rounded-full animate-pulse-slow animation-delay-2000"
        />
      </div>

      {/* Content with smooth entrance */}
      <motion.div 
        className="relative z-10 h-full flex items-center flex-col"
        style={{ y: useTransform(scrollYProgress, [0, 0.5], [250, 0]) }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
