"use client";
import { createContext, useContext, useState } from "react";

type PageTransitionContextType = {
    isNavigating: boolean;
    setIsNavigating: (value: boolean, direction?: string) => void;
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
        <PageTransitionContext.Provider value={{ isNavigating, setIsNavigating: handleNavigation }}>
            <div className="slide-transition-container">
                <div className="page-content">
                    {children}
                </div>
                
                <div className={`slide-overlay slide-${slideDirection} ${isNavigating ? 'active' : ''}`}></div>
            </div>
        </PageTransitionContext.Provider>
    );
}
