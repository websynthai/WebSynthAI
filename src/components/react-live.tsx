'use client';

import React, { useEffect, useState } from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';

const ReactLiveContent = ({
  react_code,
  theme,
}: {
  react_code: string;
  theme: string;
  uiType: string;
}) => {
  const [scope, setScope] = useState<Record<string, any> | null>(null);
  const [codeString, setCodeString] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const loadScope = async () => {
      try {
        const components = await import('@/components/ui');

        const newScope: Record<string, any> = {
          React,
          HTMLElement,
          HTMLDivElement,
          HTMLInputElement,
          HTMLButtonElement,
          useState: React.useState,
          useEffect: React.useEffect,
          ...components,
        };

        setScope(newScope);
      } catch (error) {
        console.error('Failed to load components:', error);
      }
    };

    loadScope();
  }, []);

  useEffect(() => {
    if (!scope || !react_code) return;
    const cleanedCodeString = react_code
      .replace(/import\s+({[^}]*})?\s+from\s+['"][^'"]+['"];\s*/g, '') // Remove all import statements
      .replace(/import\s+({[^}]*})?\s+from\s+['"][^'"]+['"]\s*/g, '') // Remove all import statements
      .replace(
        /import\s+([\w*]+(,\s*{[^}]*})?)?\s+from\s+['"][^'"]+['"];\s*/g,
        '',
      )
      .replace(/export default function \w+\s*\(\)\s*{/, '() => {') // Replace 'function FunctionName(' with '() => {'
      .trim(); // Remove leading or trailing newlines
    setCodeString(cleanedCodeString);
  }, [scope, react_code]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsFullScreen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!scope || !codeString) {
    return (
      <div className="flex items-center justify-center min-h-[300px] p-6">
        <div className="w-full space-y-8 bg-gray-800/5 rounded-lg p-6">
          {/* Header area */}
          <div className="space-y-4">
            <div className="h-8 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-3/4" />
            <div className="flex gap-2">
              <div className="h-4 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-24" />
              <div className="h-4 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-24" />
            </div>
          </div>

          {/* Content area */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-20 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-40" />
              <div className="h-20 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-40" />
            </div>
          </div>

          {/* Footer/actions area */}
          <div className="flex justify-end gap-3">
            <div className="h-9 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-24" />
            <div className="h-9 bg-[length:200%_100%] bg-gradient-to-r from-gray-800/5 via-gray-800/20 to-gray-800/5 animate-loading-shine rounded-md w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFullScreen ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : ''
      }`}
    >
      <div className={`${theme} relative bg-background`}>
        <LiveProvider code={codeString} scope={scope}>
          <LiveError className="text-red-800 bg-red-100 mt-2 p-4" />
          <LivePreview />
        </LiveProvider>
      </div>
    </div>
  );
};

export default ReactLiveContent;
