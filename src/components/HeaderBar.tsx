import React, { useState, useEffect } from 'react';
import { GpsVehicle, Language } from '../types/gps';
import {
  Bus,
  Maximize2,
  Minimize2,
  Settings,
  Globe,
  Play,
  Pause,
  Smartphone,
  ChevronDown,
  Gauge
} from 'lucide-react';

interface HeaderBarProps {
  activeVehicle: GpsVehicle;
  allVehiclesCount: number;
  lang: Language;
  onToggleLanguage: () => void;
  onOpenFleetDrawer: () => void;
  onOpenSettings: () => void;
  onOpenReactNative: () => void;
  isLoading: boolean;
  simulationActive: boolean;
  onToggleSimulation: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeVehicle,
  allVehiclesCount,
  lang,
  onToggleLanguage,
  onOpenFleetDrawer,
  onOpenSettings,
  onOpenReactNative,
  simulationActive,
  onToggleSimulation
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Phnom_Penh',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      setCurrentDate(
        now.toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', {
          timeZone: 'Asia/Phnom_Penh',
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const isMoving = (activeVehicle.Speed || 0) > 2;

  return (
    <header className="w-full h-16 px-4 bg-[#080d19]/95 border-b border-white/10 flex items-center justify-between gap-4 z-30 shrink-0 backdrop-blur-xl">
      {/* Left: Brand & Active Bus Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/20">
            <Bus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-extrabold tracking-tight text-white leading-none">
              VET EXPRESS
            </div>
            <div className="text-[11px] font-medium text-sky-400 mt-1 leading-none">
              {lang === 'km' ? 'អេក្រង់គោល Bus Pad GPS' : 'Live Bus Pad Cockpit'}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* Active Vehicle Pill Selector */}
        <button
          onClick={onOpenFleetDrawer}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group cursor-pointer"
          title="Switch Active Vehicle"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isMoving ? 'bg-emerald-400 animate-pulse' : activeVehicle.Key ? 'bg-amber-400' : 'bg-rose-500'
            }`}
          />
          <div className="text-left">
            <div className="text-xs font-extrabold text-white font-mono leading-none">
              {activeVehicle.Plate || activeVehicle.Id}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 leading-none">
              {activeVehicle.GroupName || 'AIRBUS'} · {allVehiclesCount} {lang === 'km' ? 'គ្រឿង' : 'buses'}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-1" />
        </button>
      </div>

      {/* Center: Single Main Screen Badge (អេក្រង់គោល) */}
      <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-sky-500/10 border border-sky-400/25 text-sky-300 text-xs font-extrabold">
        <Gauge className="w-4 h-4 text-sky-400" />
        <span>{lang === 'km' ? 'អេក្រង់គោល (Bus Pad)' : 'Main Bus Pad'}</span>
      </div>

      {/* Right: Actions, React Native Code, Simulator & Cambodia Clock */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Demo Drive Button */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            simulationActive
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
          }`}
          title="Test live driving simulation"
        >
          {simulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-400" />}
          <span className="hidden sm:inline">
            {simulationActive
              ? lang === 'km'
                ? 'កំពុងរត់សាកល្បង'
                : 'Simulating'
              : lang === 'km'
              ? 'សាកល្បងរត់'
              : 'Demo Drive'}
          </span>
        </button>

        {/* React Native Export Button */}
        <button
          onClick={onOpenReactNative}
          className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 text-xs font-bold transition-all cursor-pointer"
          title="View React Native Mobile/Tablet Code"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>React Native</span>
        </button>

        {/* Cambodia Live Clock */}
        <div className="hidden lg:flex flex-col text-right px-2">
          <span className="text-sm font-extrabold font-mono text-white leading-none">
            {currentTime || '17:26:00'}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 leading-none">
            {currentDate || 'Cambodia'}
          </span>
        </div>

        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Fullscreen Tablet Mode"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
