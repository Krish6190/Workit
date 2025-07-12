"use client";
import { createContext, useContext, useState, useEffect } from "react";

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
    const [isLoading, setIsLoading] = useState(false);
    const [slideDirection, setSlideDirection] = useState('top');
    const [isPageReady, setIsPageReady] = useState(false);

    useEffect(() => {
        setIsPageReady(true);
        return () => setIsPageReady(false);
    }, []);

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

    const contextValue = {
        isNavigating,
        isLoading,
        setIsNavigating: handleNavigation,
        setIsLoading
    };

    return (
        <PageTransitionContext.Provider value={contextValue}>
            <div className="slide-transition-container">
                <div className={`page-content ${!isPageReady || isLoading ? 'page-hidden' : ''}`}>
                    {children}
                </div>
                
                <div className={`slide-overlay slide-${slideDirection} ${isNavigating ? 'active' : ''}`}></div>
            </div>
        </PageTransitionContext.Provider>
    );
}
