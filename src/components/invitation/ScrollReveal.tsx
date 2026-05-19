"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  direction?: "up" | "down" | "left" | "right" | "none";
  rotate?: number; // degree
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 800,
  direction = "up",
  rotate = 0
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05, // triggers early for a smoother feel
        rootMargin: "0px 0px -50px 0px" // triggers slightly before entering view fully
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getTranslateValue = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(24px)";
        case "down":
          return "translateY(-24px)";
        case "left":
          return "translateX(24px)";
        case "right":
          return "translateX(-24px)";
        default:
          return "none";
      }
    }
    return "translate(0px, 0px)";
  };

  const getRotateValue = () => {
    if (!isVisible && rotate !== 0) {
      return `rotate(${rotate}deg)`;
    }
    return "rotate(0deg)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `${getTranslateValue()} ${getRotateValue()}`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "transform, opacity"
      }}
    >
      {children}
    </div>
  );
}
