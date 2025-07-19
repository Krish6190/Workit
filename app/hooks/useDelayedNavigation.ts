"use client";
import { useRouter, usePathname} from "next/navigation";
import { usePageTransition } from "../Components/PageTransition";

export function useDelayedNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { startTransition, isNavigating } = usePageTransition();

    const navigateWithDelay = (path: string, direction?: string) => {
        if (pathname === path) {
            return;
        }
        
        if (isNavigating) {
            return;
        }
        startTransition(() => {
            router.push(path);
        }, direction);
    };

    return { navigateWithDelay };
}
