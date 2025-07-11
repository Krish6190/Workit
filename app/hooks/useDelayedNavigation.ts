"use client";
import { useRouter } from "next/navigation";
import { usePageTransition } from "../Components/PageTransition";

export function useDelayedNavigation() {
    const router = useRouter();
    const { setIsNavigating } = usePageTransition();

    const navigateWithDelay = (path: string, delay: number = 500, direction?: string) => {
        setIsNavigating(true, direction);
        
        setTimeout(() => {
            router.push(path);
            setTimeout(() => {
                setIsNavigating(false);
            }, 700); 
        }, delay);
    };

    return { navigateWithDelay };
}
