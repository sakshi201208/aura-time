import { useEffect, useRef, useState } from 'react';

interface AnalogClockProps {
  scale?: number;
}

export const AnalogClock = ({ scale = 1 }: AnalogClockProps) => {
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300 * scale;
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.85;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Glass effect background
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Hour markers
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -radius + 15);
      ctx.lineTo(0, -radius + 30);
      ctx.stroke();
      ctx.rotate(-angle);
    }
    ctx.restore();

    // Minute markers
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        const angle = (i * 6 * Math.PI) / 180;
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -radius + 15);
        ctx.lineTo(0, -radius + 22);
        ctx.stroke();
        ctx.rotate(-angle);
      }
    }
    ctx.restore();

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Hour hand
    ctx.save();
    ctx.translate(centerX, centerY);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
    ctx.rotate(hourAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius * 0.5, 0);
    ctx.stroke();
    ctx.restore();

    // Minute hand
    ctx.save();
    ctx.translate(centerX, centerY);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    ctx.rotate(minuteAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius * 0.7, 0);
    ctx.stroke();
    ctx.restore();

    // Second hand with smooth sweep
    ctx.save();
    ctx.translate(centerX, centerY);
    const secondAngle = ((seconds + milliseconds / 1000) * 6 - 90) * (Math.PI / 180);
    ctx.rotate(secondAngle);
    
    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(96, 165, 250, 0.8)';
    ctx.strokeStyle = 'rgb(96, 165, 250)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(radius * 0.85, 0);
    ctx.stroke();
    ctx.restore();

    // Center dot
    ctx.fillStyle = 'rgb(96, 165, 250)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(96, 165, 250, 0.6)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    
  }, [time, scale]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="watch-shadow rounded-full"
        style={{ transform: `scale(${Math.min(1, scale)})` }}
      />
    </div>
  );
};
