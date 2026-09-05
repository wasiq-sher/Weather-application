import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal Component for Atmosphere AI
 * Features accessible keyboard support (ESC), overlay backdrop blur,
 * ambient glow, and customizable header/body/footer.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className = '',
}) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeWidths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div
      ref={scrollContainerRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#020408]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="min-h-full flex flex-col justify-start items-center p-4 sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full ${sizeWidths[size] || sizeWidths.md} rounded-[32px] bg-[#020408]/95 border border-slate-800/70 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden text-slate-100 my-auto transition-all scale-100 ${className}`}
        >
          {/* Ambient background glow inside modal */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
              <div>
                {title && (
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  id="btn-close-modal"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white transition shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Modal Body */}
          <div className="relative z-10">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3 relative z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
