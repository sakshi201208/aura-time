import { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Vibrate, Moon, Zap, Layout } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface Settings {
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  oledMode: boolean;
  autoSaveLaps: boolean;
  brightness: number;
  motionReduced: boolean;
  compactLayout: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: false,
    vibrateEnabled: true,
    oledMode: true,
    autoSaveLaps: true,
    brightness: 80,
    motionReduced: false,
    compactLayout: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));

    // Apply OLED mode
    if (key === 'oledMode') {
      document.documentElement.style.setProperty(
        '--background',
        value ? '0 0% 0%' : '0 0% 6%'
      );
    }

    // Apply motion preference
    if (key === 'motionReduced') {
      document.documentElement.style.setProperty(
        'animation-duration',
        value ? '0.01ms' : ''
      );
    }
  };

  const playHaptic = () => {
    if ('vibrate' in navigator && settings.vibrateEnabled) {
      navigator.vibrate(10);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full md:w-[480px] max-h-[85vh] glass-effect rounded-t-3xl md:rounded-3xl p-6 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light tracking-tight">Settings</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-8">
          {/* Stopwatch Settings */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider opacity-50 font-medium">Stopwatch</h3>
            
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 opacity-60" />
                <Label htmlFor="sound" className="text-base font-light">Sound Alerts</Label>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => {
                  updateSetting('soundEnabled', checked);
                  playHaptic();
                }}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 opacity-60" />
                <Label htmlFor="vibrate" className="text-base font-light">Haptic Feedback</Label>
              </div>
              <Switch
                id="vibrate"
                checked={settings.vibrateEnabled}
                onCheckedChange={(checked) => {
                  updateSetting('vibrateEnabled', checked);
                  if (checked && 'vibrate' in navigator) {
                    navigator.vibrate(10);
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 opacity-60" />
                <Label htmlFor="autosave" className="text-base font-light">Auto-Save Laps</Label>
              </div>
              <Switch
                id="autosave"
                checked={settings.autoSaveLaps}
                onCheckedChange={(checked) => {
                  updateSetting('autoSaveLaps', checked);
                  playHaptic();
                }}
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider opacity-50 font-medium">Display</h3>
            
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 opacity-60" />
                <Label htmlFor="oled" className="text-base font-light">OLED Pure Black</Label>
              </div>
              <Switch
                id="oled"
                checked={settings.oledMode}
                onCheckedChange={(checked) => {
                  updateSetting('oledMode', checked);
                  playHaptic();
                }}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 opacity-60" />
                <Label htmlFor="compact" className="text-base font-light">Compact Layout</Label>
              </div>
              <Switch
                id="compact"
                checked={settings.compactLayout}
                onCheckedChange={(checked) => {
                  updateSetting('compactLayout', checked);
                  playHaptic();
                }}
              />
            </div>

            <div className="py-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="brightness" className="text-base font-light">Brightness</Label>
                <span className="text-sm opacity-60">{settings.brightness}%</span>
              </div>
              <Slider
                id="brightness"
                value={[settings.brightness]}
                onValueChange={([value]) => {
                  updateSetting('brightness', value);
                }}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider opacity-50 font-medium">Accessibility</h3>
            
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <Label htmlFor="motion" className="text-base font-light">Reduce Motion</Label>
                <p className="text-xs opacity-50 mt-1">Minimize animations</p>
              </div>
              <Switch
                id="motion"
                checked={settings.motionReduced}
                onCheckedChange={(checked) => {
                  updateSetting('motionReduced', checked);
                  playHaptic();
                }}
              />
            </div>
          </div>

          {/* Reset */}
          <Button
            onClick={() => {
              localStorage.removeItem('app_settings');
              localStorage.removeItem('stopwatch_laps');
              playHaptic();
              window.location.reload();
            }}
            variant="ghost"
            className="w-full py-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Reset All Data
          </Button>
        </div>
      </div>
    </div>
  );
};
