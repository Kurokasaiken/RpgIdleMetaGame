import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="
            absolute z-10 px-3 py-2 text-sm font-medium text-white
            bg-gray-900 rounded-lg shadow-sm
            bottom-full mb-2 left-1/2 transform -translate-x-1/2
            max-w-xs whitespace-normal
          "
        >
          {content}
        </div>
      )}
    </div>
  );
};

export const TooltipProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
export const TooltipTrigger: React.FC<{ asChild?: boolean; children: ReactNode }> = ({ children }) => <>{children}</>;
export const TooltipContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bg-gray-900 text-white p-2 rounded">{children}</div>
);