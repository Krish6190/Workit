"use client";
import { useRouter } from "next/navigation";
import { usePageTransition } from "../Components/PageTransition";

export function useDelayedNavigation() {
    const router = useRouter();
    const { setIsNavigating } = usePageTransition();

    const navigateWithDelay = (path: string, direction?: string) => {
        setIsNavigating(true, direction);
        setTimeout(() => {
            router.push(path);
        }, 600);
    };

    return { navigateWithDelay };
}
