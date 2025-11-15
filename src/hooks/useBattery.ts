import { useState, useEffect } from 'react';

interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  addEventListener(type: 'chargingchange', listener: (ev: Event) => void): void;
  removeEventListener(type: 'chargingchange', listener: (ev: Event) => void): void;
}

export const useBattery = () => {
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const updateBatteryStatus = (bat: BatteryManager) => {
      setIsCharging(bat.charging);
      setBatteryLevel(bat.level);
    };

    const handleChargingChange = () => {
      if (battery) {
        updateBatteryStatus(battery);
      }
    };

    const initBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          battery = await (navigator as any).getBattery() as BatteryManager;
          updateBatteryStatus(battery);
          battery.addEventListener('chargingchange', handleChargingChange);
        } catch (err) {
          console.log('Battery API not supported');
        }
      }
    };

    initBattery();

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', handleChargingChange);
      }
    };
  }, []);

  return { isCharging, batteryLevel };
};
