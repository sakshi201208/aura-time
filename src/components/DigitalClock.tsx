import { useEffect, useState } from 'react';

interface DigitalClockProps {
  scale?: number;
}

export const DigitalClock = ({ scale = 1 }: DigitalClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  const dateStr = time.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div 
      className="flex flex-col items-center justify-center gap-2 smooth-transition"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="flex items-center gap-1 font-light tracking-tight">
        <span className="text-[6rem] leading-none">{hours}</span>
        <span className="text-[6rem] leading-none opacity-50 animate-pulse">:</span>
        <span className="text-[6rem] leading-none">{minutes}</span>
        <span className="text-[3rem] leading-none opacity-40 self-end mb-2">{seconds}</span>
      </div>
      <div className="text-xl opacity-40 tracking-wide uppercase font-light">
        {dateStr}
      </div>
    </div>
  );
};
