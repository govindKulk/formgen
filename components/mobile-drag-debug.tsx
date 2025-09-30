"use client";

import { useIsMobile } from '@/hooks/use-media-query';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Info } from 'lucide-react';

export function MobileDragDebug() {
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasShownInstructions, setHasShownInstructions] = useState(false);

  // only on first visit
  useEffect(() => {
    if (isMobile && !hasShownInstructions) {
      const hasSeenInstructions = localStorage.getItem('mobile-drag-instructions-seen');
      if (!hasSeenInstructions) {
        setShowInstructions(true);
      }
    }
  }, [isMobile, hasShownInstructions]);

  const dismissInstructions = () => {
    setShowInstructions(false);
    setHasShownInstructions(true);
    localStorage.setItem('mobile-drag-instructions-seen', 'true');
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Instructions overlay */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="w-5 h-5" />
                Mobile Drag & Drop
              </h3>
              <Button variant="ghost" size="sm" onClick={dismissInstructions}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>To drag components:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Press and hold on any component for 500ms</li>
                <li>You'll feel a vibration when drag mode is active</li>
                <li>Then drag the component to move it around</li>
              </ul>
              <p>
                <strong>To delete:</strong> Tap a component first, then tap the trash icon.
              </p>
            </div>
            <Button onClick={dismissInstructions} className="w-full mt-4">
              Got it!
            </Button>
          </div>
        </div>
      )}

      {/* Info button */}
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInstructions(true)}
          className="bg-background/80 backdrop-blur-sm border-border/50"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
}

export default MobileDragDebug;