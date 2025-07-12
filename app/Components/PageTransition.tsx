"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type PageTransitionContextType = {
    isNavigating: boolean;
    isLoading: boolean;
    setIsNavigating: (value: boolean, direction?: string) => void;
    setIsLoading: (value: boolean) => void;
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);
const horizontalDirections = ['left', 'right'];

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
    const [slideDirection, setSlideDirection] = useState('top');
    const [prevChildren, setPrevChildren] = useState<React.ReactNode>(children);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!isNavigating) {
            setPrevChildren(children);
        }
    }, [children, isNavigating]);

    useEffect(() => {
        if (isNavigating) {
            setTimeout(() => {
                setIsNavigating(false);
            }, 1500);
        }
    }, [pathname, searchParams]);

    const handleNavigation = (value: boolean, direction?: string) => {
        if (value) {
            if (direction) {
                setSlideDirection(direction);
            } else {
                const randomDirection = horizontalDirections[Math.floor(Math.random() * horizontalDirections.length)];
                setSlideDirection(randomDirection);
            }
        }
        setIsNavigating(value);
    };

    return (
        <PageTransitionContext.Provider value={{
            isNavigating,
            isLoading: false,
            setIsNavigating: handleNavigation,
            setIsLoading: () => {}
        }}>
            <div className="slide-transition-container">
                <div className="page-content">
                    {isNavigating ? prevChildren : children}
                </div>
                <div className={`slide-overlay slide-${slideDirection} ${isNavigating ? 'active' : ''}`}></div>
            </div>
        </PageTransitionContext.Provider>
    );
}
