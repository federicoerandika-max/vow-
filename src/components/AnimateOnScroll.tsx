'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';
  delay?: number;
  duration?: number;
  className?: string;
}

const animationStyles = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(30px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden: { opacity: 0, transform: 'translateY(-30px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(30px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(-30px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    hidden: { opacity: 0, transform: 'scale(0.8)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    hidden: { opacity: 0, transform: 'scale(1.2)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
};

export default function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.9,
  className = '',
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setIsVisible(true);
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '-50px' }
      );

      observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }
  }, [delay]);

  const styles = animationStyles[animation];

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...styles.hidden,
        ...(isVisible ? styles.visible : {}),
        transition: `opacity ${duration}s ease, transform ${duration}s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
