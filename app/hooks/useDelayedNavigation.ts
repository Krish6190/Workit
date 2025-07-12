"use client";
import { useRouter } from "next/navigation";
import { usePageTransition } from "../Components/PageTransition";

export function useDelayedNavigation() {
    const router = useRouter();
    const { setIsNavigating } = usePageTransition();

    const navigateWithDelay = (path: string, direction?: string) => {
        
        const animationDuration = direction === 'left' || direction === 'right' ? 1500 : 1400;
        const midPoint = animationDuration * 0.4; 
        setIsNavigating(true, direction);
        setTimeout(() => {
            router.push(path);
        }, midPoint);

        setTimeout(() => {
            setIsNavigating(false);
        }, animationDuration);
    };

    return { navigateWithDelay };
}
