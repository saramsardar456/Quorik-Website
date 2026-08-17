import { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Disable completely on touch devices or small screens
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) {
      return;
    }

    let hasShown = false;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!hasShown) {
        hasShown = true;
        setIsVisible(true);
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClickable = !!target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
      if (isClickable !== isHoveringRef.current) {
        isHoveringRef.current = isClickable;
        setIsHovering(isClickable);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      hasShown = false;
    };

    const render = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        // High performance 60/120fps smooth follower lerp
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.25;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.25;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768)) {
    return null;
  }

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-3 h-3 bg-brand-teal rounded-full pointer-events-none z-[100] transition-opacity duration-150 ${
          isVisible ? 'opacity-90' : 'opacity-0'
        } ${isHovering ? 'scale-150' : 'scale-100'}`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'transform 0.05s ease-out, opacity 0.15s ease, scale 0.15s ease',
        }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 border border-brand-teal/40 rounded-full pointer-events-none z-[99] transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isHovering ? 'scale-125 border-brand-teal' : 'scale-100'}`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'transform 0.05s ease-out, opacity 0.15s ease, scale 0.2s ease, border-color 0.2s ease',
        }}
      />
    </>
  );
}
