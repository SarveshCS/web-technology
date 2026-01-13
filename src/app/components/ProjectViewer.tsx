"use client";

import { useState, useEffect, useRef } from "react";

type ViewMode = "fullscreen" | "mobile";

interface ProjectViewerProps {
  projectName: string;
  projectUrl: string;
}

// Icons
const FullscreenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

export default function ProjectViewer({ projectName, projectUrl }: ProjectViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("fullscreen");
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to avoid flash

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mobile: no mockup options, just render fullscreen
  // On desktop: show toggle for fullscreen or mobile mockup
  if (isMobile) {
    return (
      <iframe
        src={projectUrl}
        className="w-full h-screen bg-white border-0"
        title={projectName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Floating Toggle - Centered vertically on right side, reduced size */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 bg-black/40 backdrop-blur-md rounded-2xl p-1 shadow-2xl">
        <button
          onClick={() => setViewMode("fullscreen")}
          className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            viewMode === "fullscreen"
              ? "bg-white/20 text-white shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
          title="Fullscreen"
        >
          <FullscreenIcon />
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            viewMode === "mobile"
              ? "bg-white/20 text-white shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
          title="Mobile view"
        >
          <PhoneIcon />
        </button>
      </div>

      {/* Content */}
      {viewMode === "fullscreen" ? (
        <iframe
          src={projectUrl}
          className="w-full h-screen bg-white border-0"
          title={projectName}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <MobileMockup url={projectUrl} title={projectName} />
        </div>
      )}
    </div>
  );
}

// Flowbite iPhone Mockup with proper scaling
function MobileMockup({ url, title }: { url: string; title: string }) {
  // The mockup screen is 272x572px, but websites expect ~375px width minimum
  // We render at 375px width and scale down by 0.725 to fit perfectly
  const scale = 272 / 375; // ≈ 0.725
  
  // Custom scrollbar logic
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentHeight, setContentHeight] = useState(3000); // Initial estimate
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Measure actual content height from iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const measureContent = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc?.body) {
          // Get the actual scroll height of the iframe content
          const actualHeight = Math.max(
            iframeDoc.body.scrollHeight,
            iframeDoc.body.offsetHeight,
            iframeDoc.documentElement.scrollHeight,
            iframeDoc.documentElement.offsetHeight
          );
          setContentHeight(actualHeight);
          
          // Inject CSS to hide iframe's own scrollbar
          const style = iframeDoc.createElement('style');
          style.textContent = `
            html, body {
              overflow: hidden !important;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            body::-webkit-scrollbar {
              display: none !important;
            }
          `;
          if (!iframeDoc.head.querySelector('style[data-hide-scrollbar]')) {
            style.setAttribute('data-hide-scrollbar', 'true');
            iframeDoc.head.appendChild(style);
          }
        }
      } catch {
        // Cross-origin iframe - use fallback height
        console.log('Cannot access iframe content (cross-origin), using fallback');
      }
    };

    iframe.addEventListener('load', measureContent);
    
    // Also try to measure after a delay (for dynamic content)
    const timer = setTimeout(measureContent, 1000);
    
    return () => {
      iframe.removeEventListener('load', measureContent);
      clearTimeout(timer);
    };
  }, [url]);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  // Scrollbar thumb height and position
  const thumbHeight = 50;
  const trackHeight = 572 - 32;
  const thumbTop = (scrollProgress / 100) * (trackHeight - thumbHeight);

  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
      {/* Notch with camera and speaker */}
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10 flex items-center justify-center gap-2 px-4">
        {/* Front Camera - more subtle */}
        <div className="relative">
          <div className="w-[8px] h-[8px] bg-gray-900/80 rounded-full"></div>
          <div className="absolute inset-0 w-[8px] h-[8px] bg-gradient-to-br from-gray-600/20 to-transparent rounded-full"></div>
          <div className="absolute top-[1.5px] left-[1.5px] w-[2px] h-[2px] bg-gray-500/30 rounded-full"></div>
        </div>
        {/* Speaker Grill - more subtle */}
        <div className="flex gap-[2px]">
          <div className="w-[1.5px] h-[1.5px] bg-gray-900/40 rounded-full"></div>
          <div className="w-[1.5px] h-[1.5px] bg-gray-900/40 rounded-full"></div>
          <div className="w-[1.5px] h-[1.5px] bg-gray-900/40 rounded-full"></div>
          <div className="w-[1.5px] h-[1.5px] bg-gray-900/40 rounded-full"></div>
          <div className="w-[1.5px] h-[1.5px] bg-gray-900/40 rounded-full"></div>
        </div>
      </div>
      {/* Side Buttons */}
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      {/* Hide native scrollbars */}
      <style>{`
        .mobile-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mobile-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>
      {/* Screen - scrollable with custom scrollbar */}
      <div className="relative rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
        <div
          ref={scrollContainerRef}
          className="mobile-scroll w-full h-full overflow-y-auto overflow-x-hidden"
          onScroll={handleScroll}
        >
          {/* Wrapper that constrains to scaled height - prevents extra white space */}
          <div
            style={{
              width: '272px',
              height: `${contentHeight * scale}px`, // Scaled height to match visual size
            }}
          >
            <iframe
              ref={iframeRef}
              src={url}
              className="border-0"
              title={title}
              style={{
                width: '375px',
                height: `${contentHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                overflow: 'hidden',
              }}
            />
          </div>
        </div>
        {/* Custom iOS-style scrollbar indicator */}
        <div
          className={`absolute right-[3px] top-4 bottom-4 w-[3px] pointer-events-none z-20 transition-opacity duration-200 ${
            isScrolling ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ height: `${trackHeight}px` }}
        >
          <div
            className="absolute right-0 w-[3px] rounded-full"
            style={{
              height: `${thumbHeight}px`,
              top: `${thumbTop}px`,
              background: 'rgba(0, 0, 0, 0.35)',
              transition: isScrolling ? 'none' : 'opacity 0.2s',
            }}
          />
        </div>
      </div>
    </div>
  );
}
