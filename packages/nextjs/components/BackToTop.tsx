import { useEffect, useState } from "react";

interface Props {
  scrollViewSelector?: string;
}
export function BackToTop({ scrollViewSelector }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollView = scrollViewSelector ? document.querySelector(scrollViewSelector) : window;
    scrollView?.addEventListener("scroll", handleScroll);
    return () => {
      scrollView?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = (e: Event) => {
    const scrollView = e.currentTarget as HTMLElement;
    if (scrollView) {
      setScrolled((scrollView.scrollTop != null ? scrollView.scrollTop : window.scrollY) > 0);
    }
  };

  const scrollToTop = () => {
    const scrollView = scrollViewSelector ? document.querySelector(scrollViewSelector) : window;
    scrollView?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {scrolled && (
        <button
          type="button"
          className="btn btn-circle btn-outlined fixed bottom-0 right-0 h-16 w-16"
          onClick={scrollToTop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
            />
          </svg>
        </button>
      )}
    </>
  );
}
