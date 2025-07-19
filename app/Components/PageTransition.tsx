"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type PageTransitionContextType = {
    isNavigating: boolean;
    isLoading: boolean;
    setIsNavigating: (value: boolean, direction?: string) => void;
    setIsLoading: (value: boolean) => void;
    startTransition: (callback: () => void, direction?: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);
const allDirections = ['left', 'right', 'top', 'bottom'];

export function usePageTransition() {
    const context = useContext(PageTransitionContext);
    if (!context) {
        throw new Error('usePageTransition must be used within a PageTransitionProvider');
    }
    return context;
}

type PageTransitionProps = {
    children: React.ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
    const [isNavigating, setIsNavigating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [slideDirection, setSlideDirection] = useState('top');
    const [displayChildren, setDisplayChildren] = useState<React.ReactNode>(children);
    const pathname = usePathname();
    const navigationCallbackRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!isNavigating) {
            setDisplayChildren(children);
        }
    }, [children, isNavigating]);

    useEffect(() => {
        if (isLoading) {

            const slideCompleteTimer = setTimeout(() => {
                setDisplayChildren(children);
                setIsLoading(false);

                setTimeout(() => {
                    setIsNavigating(false);
                }, 400);
            }, 200);
            return () => clearTimeout(slideCompleteTimer);
        }
    }, [isLoading, children]);

    const handleNavigation = (value: boolean, direction?: string) => {
        if (value) {
            if (direction) {
                setSlideDirection(direction);
            } else {
                const randomDirection = allDirections[Math.floor(Math.random() * allDirections.length)];
                setSlideDirection(randomDirection);
            }
        }
        setIsNavigating(value);
    };

    const startTransition = (callback: () => void, direction?: string) => {
        if (isNavigating) {
            return;
        }

        if (direction) {
            setSlideDirection(direction);
        } else {
            const randomDirection = allDirections[Math.floor(Math.random() * allDirections.length)];
            setSlideDirection(randomDirection);
        }
        setIsNavigating(true);
        navigationCallbackRef.current = callback;
        setTimeout(() => {
            if (navigationCallbackRef.current) {
                setIsLoading(true);
                navigationCallbackRef.current();
            }
        }, 600);
    };
    useEffect(() => {
        if (!isNavigating && isLoading) {
            setIsLoading(false);
            navigationCallbackRef.current = null;
        }
    }, [isNavigating, isLoading]);
    return (
        <PageTransitionContext.Provider value={{
            isNavigating,
            isLoading,
            setIsNavigating: handleNavigation,
            setIsLoading,
            startTransition
        }}>
            <div className="slide-transition-container">
                <div className="page-content">
                    {displayChildren}
                </div>
                <div className={`slide-overlay slide-${slideDirection} ${isNavigating ? 'active' : ''}`}></div>
            </div>
        </PageTransitionContext.Provider>
    );
}
