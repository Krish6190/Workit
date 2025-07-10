"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PageTransitionProps = {
    children: React.ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [prevPage, setPrevPage] = useState<React.ReactNode | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentPage, setCurrentPage] = useState(children);
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            setPrevPage(currentPage);
            setCurrentPage(children);
            setIsAnimating(true);

            const timeout = setTimeout(() => {
                setPrevPage(null);
                setIsAnimating(false);
                prevPathRef.current = pathname;
            }, 700);

            return () => clearTimeout(timeout);
        } else {
            setCurrentPage(children);
        }
    }, [children, pathname]);

    return (
        <div className={`page-transition-wrapper${isAnimating ? " page-animating" : ""}`}>
            {isAnimating && prevPage && (
                <div className="page page-old page-fade-out">
                    {prevPage}
                </div>
            )}
            <div className={`page page-new${isAnimating ? " page-slide-in" : ""}`}>
                {currentPage}
            </div>
        </div>
    );
}
