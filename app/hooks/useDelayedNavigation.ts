"use client";
import { useRouter, usePathname} from "next/navigation";
import { usePageTransition } from "../Components/PageTransition";

export function useDelayedNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { setIsNavigating, isNavigating } = usePageTransition();

    const navigateWithDelay = (path: string, direction?: string) => {
        if (pathname === path || isNavigating) return;
        setIsNavigating(true, direction);
        setTimeout(() => {
            router.push(path);
        }, 600); 
    };

    return { navigateWithDelay };
}
