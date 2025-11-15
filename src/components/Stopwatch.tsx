import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface Lap {
  time: number;
  lapTime: number;
}

export const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const { settings, playHaptic, playSound } = useSettings();

  useEffect(() => {
    // Load persisted laps
    const savedLaps = localStorage.getItem('stopwatch_laps');
    if (savedLaps) {
      setLaps(JSON.parse(savedLaps));
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = window.setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    playHaptic();
    playSound();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    if (settings.autoSaveLaps) {
      localStorage.removeItem('stopwatch_laps');
    }
    playHaptic();
  };

  const handleLap = () => {
    const lapTime = laps.length > 0 ? time - laps[laps.length - 1].time : time;
    const newLaps = [...laps, { time, lapTime }];
    setLaps(newLaps);
    if (settings.autoSaveLaps) {
      localStorage.setItem('stopwatch_laps', JSON.stringify(newLaps));
    }
    playHaptic();
    playSound();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 p-8">
      <div className="text-8xl font-light tracking-tight tabular-nums">
        {formatTime(time)}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleStartPause}
          size="lg"
          className="w-20 h-20 rounded-full glass-effect hover:scale-110 spring-transition"
          variant="ghost"
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>

        {isRunning && (
          <Button
            onClick={handleLap}
            size="lg"
            className="w-20 h-20 rounded-full glass-effect hover:scale-110 spring-transition"
            variant="ghost"
          >
            <Flag className="w-7 h-7" />
          </Button>
        )}

        {!isRunning && time > 0 && (
          <Button
            onClick={handleReset}
            size="lg"
            className="w-20 h-20 rounded-full glass-effect hover:scale-110 spring-transition"
            variant="ghost"
          >
            <RotateCcw className="w-7 h-7" />
          </Button>
        )}
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-md max-h-64 overflow-y-auto space-y-2 glass-effect rounded-3xl p-4">
          {laps.map((lap, index) => (
            <div 
              key={index} 
              className="flex justify-between text-lg opacity-70 py-2 border-b border-white/10 last:border-0"
            >
              <span>Lap {index + 1}</span>
              <span className="tabular-nums">{formatTime(lap.lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
