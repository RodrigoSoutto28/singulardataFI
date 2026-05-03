import { useEffect, useRef, useState } from 'react';

export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, ...options },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isRevealed };
}
