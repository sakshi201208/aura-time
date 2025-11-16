import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const PRESET_TIMES = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
  { label: '45 min', seconds: 2700 },
];

export const Timer = () => {
  const [selectedTime, setSelectedTime] = useState(1500);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<number>();
  const { playHaptic, playSound } = useSettings();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playHaptic();
            playSound();
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playHaptic, playSound]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    setIsComplete(false);
    playHaptic();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime);
    setIsComplete(false);
    playHaptic();
  };

  const handlePresetSelect = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setIsComplete(false);
    playHaptic();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((selectedTime - timeLeft) / selectedTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 p-8">
      {/* Timer Display */}
      <div className="relative flex items-center justify-center">
        <svg className="w-64 h-64 md:w-80 md:h-80 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
            opacity="0.2"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            className="smooth-transition"
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl md:text-8xl font-light tabular-nums tracking-tight text-foreground">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {isComplete && (
            <div className="text-sm text-primary animate-pulse mt-2">Time's up!</div>
          )}
        </div>
      </div>

      {/* Preset Times */}
      {!isRunning && (
        <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
          {PRESET_TIMES.map(preset => (
            <Button
              key={preset.seconds}
              onClick={() => handlePresetSelect(preset.seconds)}
              variant={selectedTime === preset.seconds ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={handleStartPause}
          size="lg"
          className="rounded-full w-16 h-16"
          variant="default"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>
        <Button
          onClick={handleReset}
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
