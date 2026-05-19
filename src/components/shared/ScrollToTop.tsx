"use client";

import { ArrowUp, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={` hidden
        cursor-pointer
        fixed bottom-5 right-5 z-50
        w-11 h-11 rounded-full
        bg-primary text-primary-foreground
        shadow-lg border
        md:flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        ${
          showButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
        }
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp  className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;