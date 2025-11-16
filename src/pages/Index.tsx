import { useState, useEffect, useCallback, useRef } from 'react';
import { AnalogClock } from '@/components/AnalogClock';
import { DigitalClock } from '@/components/DigitalClock';
import { Stopwatch } from '@/components/Stopwatch';
import { Timer } from '@/components/Timer';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useBattery } from '@/hooks/useBattery';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Clock, Timer as TimerIcon, Hourglass, Settings } from 'lucide-react';

type Mode = 'split' | 'stopwatch' | 'timer';

const Index = () => {
  const [mode, setMode] = useState<Mode>('split');
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [scale, setScale] = useState(1);
  const { enterFullscreen } = useFullscreen();
  const { isCharging } = useBattery();
  const { settings, playHaptic } = useSettings();
  const [hasInitialized, setHasInitialized] = useState(false);
  const lastTapRef = useRef<number>(0);
  const hideTimeoutRef = useRef<number>();
  const touchStartRef = useRef<{ x: number; y: number; distance: number } | null>(null);

  // Auto fullscreen on charging, exit on unplug
  useEffect(() => {
    if (isCharging && !hasInitialized) {
      enterFullscreen();
      setHasInitialized(true);
    } else if (!isCharging && hasInitialized) {
      // Exit fullscreen when unplugged
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [isCharging, hasInitialized, enterFullscreen]);

  // Auto-hide controls after 5 seconds
  useEffect(() => {
    if (showControls && !showSettings) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showControls, showSettings]);

  // Handle single tap and double tap
  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300) {
      // Double tap - exit
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      // Single tap - toggle controls and fullscreen
      setShowControls(prev => !prev);
      if (!document.fullscreenElement) {
        enterFullscreen();
      }
    }

    lastTapRef.current = now;
  }, [enterFullscreen]);

  // Touch gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchStartRef.current = {
        x: touch1.clientX,
        y: touch1.clientY,
        distance
      };
    } else if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        distance: 0
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scaleChange = distance / touchStartRef.current.distance;
      setScale(prev => Math.max(0.5, Math.min(1.5, prev * scaleChange)));
      touchStartRef.current.distance = distance;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && touchStartRef.current) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      
      // Swipe left/right to change modes
      if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50) {
        if (deltaX > 0) {
          setMode(prev => prev === 'stopwatch' ? 'split' : prev === 'timer' ? 'stopwatch' : 'timer');
          playHaptic();
        } else {
          setMode(prev => prev === 'split' ? 'stopwatch' : prev === 'stopwatch' ? 'timer' : 'split');
          playHaptic();
        }
      } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        // Tap
        handleTap();
      }
    }
    touchStartRef.current = null;
  }, [handleTap, playHaptic]);

  return (
    <div 
      className="fixed inset-0 bg-background overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main content */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {mode === 'split' ? (
          <div className="w-full h-full flex flex-col landscape:flex-row gap-4 landscape:gap-8 items-center justify-center">
            <div className="flex-1 flex items-center justify-center min-h-[200px] landscape:min-h-[300px]">
              <AnalogClock scale={scale} />
            </div>
            <div className="hidden landscape:block w-px h-3/4 bg-border" />
            <div className="flex-1 flex items-center justify-center">
              <DigitalClock scale={scale} />
            </div>
          </div>
        ) : mode === 'stopwatch' ? (
          <Stopwatch />
        ) : (
          <Timer />
        )}
      </div>

      {/* Controls overlay */}
      <div 
        className={`fixed bottom-4 landscape:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 landscape:gap-4 glass-effect rounded-full px-4 landscape:px-6 py-3 landscape:py-4 smooth-transition ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <Button
          onClick={() => {
            setMode('split');
            playHaptic();
          }}
          size="lg"
          variant="ghost"
          className={`rounded-full ${mode === 'split' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Clock className="w-5 h-5 landscape:w-6 landscape:h-6" />
        </Button>
        <Button
          onClick={() => {
            setMode('stopwatch');
            playHaptic();
          }}
          size="lg"
          variant="ghost"
          className={`rounded-full ${mode === 'stopwatch' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <TimerIcon className="w-5 h-5 landscape:w-6 landscape:h-6" />
        </Button>
        <Button
          onClick={() => {
            setMode('timer');
            playHaptic();
          }}
          size="lg"
          variant="ghost"
          className={`rounded-full ${mode === 'timer' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Hourglass className="w-5 h-5 landscape:w-6 landscape:h-6" />
        </Button>
        <Button
          onClick={() => {
            setShowSettings(true);
            playHaptic();
          }}
          size="lg"
          variant="ghost"
          className="rounded-full"
        >
          <Settings className="w-5 h-5 landscape:w-6 landscape:h-6" />
        </Button>
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => {
          setShowSettings(false);
          playHaptic();
        }} 
      />

      {/* Charging indicator */}
      {isCharging && (
        <div className="fixed top-4 right-4 glass-effect rounded-full px-4 py-2 text-sm opacity-50">
          ⚡ Charging
        </div>
      )}
    </div>
  );
};

export default Index;
