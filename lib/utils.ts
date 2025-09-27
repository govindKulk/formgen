import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const debouncer = (time: number, cb: (...args: any[]) => any) => {
        let timer: NodeJS.Timeout | null = null;
        
        const debouncedFunction = (...args: any[]) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                try {
                    cb(...args);
                } catch (error) {
                    console.error('Debounced function error:', error);
                }
            }, time);
        };

        // Add cancel method to clear pending execution
        debouncedFunction.cancel = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };

        return debouncedFunction;
}