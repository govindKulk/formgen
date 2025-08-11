import { useEffect, useRef } from 'react';


export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  excludeSelectors?: string[] // New parameter to exclude specific elements
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return; // Click is inside the target element
      }

      // Check if click is on any excluded elements
      if (excludeSelectors) {
        const target = event.target as Element;
        for (const selector of excludeSelectors) {
          if (target.closest(selector)) {
            return; // Click is on an excluded element
          }
        }
      }

      callback();
    };


    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback, excludeSelectors]);

  return ref;
}
