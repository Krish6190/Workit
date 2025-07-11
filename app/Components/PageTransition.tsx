"use client";
import { createContext, useContext, useState } from "react";

type PageTransitionContextType = {
    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

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

    return (
        <PageTransitionContext.Provider value={{ isNavigating, setIsNavigating }}>
            <div className="slide-transition-container">
                <div className="page-content">
                    {children}
                </div>
                
                <div className={`slide-overlay ${isNavigating ? 'active' : ''}`}></div>
            </div>
        </PageTransitionContext.Provider>
    );
}
