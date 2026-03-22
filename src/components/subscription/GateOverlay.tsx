import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';

type GateOverlayProps = {
  children: React.ReactNode;
  blurredContent: React.ReactNode;
};

export const GateOverlay: React.FC<GateOverlayProps> = ({ children, blurredContent }) => {
  const { state, isMobile } = useSidebar();

  const sidebarOffset = isMobile
    ? '0px'
    : state === 'collapsed'
      ? 'var(--sidebar-width-icon)'
      : 'var(--sidebar-width)';

  return (
    <div className="relative h-full min-h-[400px]">
      <div className="blur-sm pointer-events-none select-none">
        {blurredContent}
      </div>

      <div
        className="fixed inset-0 bg-[#F0F7F4]/80 backdrop-blur-sm flex items-center justify-center z-10"
        style={{ left: sidebarOffset }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          {children}
        </div>
      </div>
    </div>
  );
};
