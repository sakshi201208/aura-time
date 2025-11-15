import { useState, useEffect } from 'react';

export interface AppSettings {
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  oledMode: boolean;
  autoSaveLaps: boolean;
  brightness: number;
  motionReduced: boolean;
  compactLayout: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: false,
  vibrateEnabled: true,
  oledMode: true,
  autoSaveLaps: true,
  brightness: 80,
  motionReduced: false,
  compactLayout: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  const playHaptic = () => {
    if ('vibrate' in navigator && settings.vibrateEnabled) {
      navigator.vibrate(10);
    }
  };

  const playSound = () => {
    if (settings.soundEnabled) {
      // Create a subtle beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  return {
    settings,
    playHaptic,
    playSound,
  };
};
