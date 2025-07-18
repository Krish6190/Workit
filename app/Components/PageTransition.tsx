"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
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
    const [currentChildren, setCurrentChildren] = useState<React.ReactNode>(children);
    const [pageLoaded, setPageLoaded] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isNavigating) {
            setPrevChildren(currentChildren);
            setCurrentChildren(children);
            setPageLoaded(false);
        }
    }, [children, isNavigating]);

    // Wait for page to load after navigation starts
    useEffect(() => {
        if (isNavigating && !pageLoaded) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            // Wait for next tick to allow React to render the new content
            const checkPageLoad = () => {
                // Wait for images, fonts, and other resources to load
                if (document.readyState === 'complete') {
                    setPageLoaded(true);
                } else {
                    // If not complete, wait a bit more
                    timeoutRef.current = setTimeout(checkPageLoad, 100);
                }
            };
            
            // Start checking after a short delay to allow React to update
            timeoutRef.current = setTimeout(checkPageLoad, 100);
            
            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [isNavigating, pageLoaded]);

    // Handle the slide-out animation after page loads
    useEffect(() => {
        if (isNavigating && pageLoaded) {
            // Page is loaded, now wait for the slide-out animation to complete
            const slideOutTimer = setTimeout(() => {
                setIsNavigating(false);
                setPrevChildren(currentChildren);
                setCurrentChildren(children);
                setPageLoaded(false);
            }, 1500); // 1500ms for slide-out animation
            
            return () => clearTimeout(slideOutTimer);
        }
    }, [pageLoaded, isNavigating, children, currentChildren]);

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
