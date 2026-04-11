"use client";

import { useEffect, useState } from "react";

/**
 * PageTransition wraps page content and fades it in when the page loads.
 *
 * How it works:
 * - When the component first renders, it's invisible (opacity 0, shifted down).
 * - After a tiny delay (so the browser has time to paint), it transitions
 *   to fully visible and in its normal position.
 * - This creates a smooth "slide up and fade in" effect on every page load.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure the initial state is painted first
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}
