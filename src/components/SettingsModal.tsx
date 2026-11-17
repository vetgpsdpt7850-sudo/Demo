import React, { useState } from 'react';
import { ApiConfig } from '../services/gpsApi';
import { Language } from '../types/gps';
import { X, Save, RefreshCw, Sliders, Volume2, ShieldCheck, Play, Pause } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSaveConfig: (cfg: ApiConfig) => void;
  refreshInterval: number;
  onChangeRefreshInterval: (ms: number) => void;
  speedLimit: number;
  onChangeSpeedLimit: (lim: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  simulationActive: boolean;
  onToggleSimulation: () => void;
  lang: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  refreshInterval,
  onChangeRefreshInterval,
  speedLimit,
  onChangeSpeedLimit,
  soundEnabled,
  onToggleSound,
  simulationActive,
  onToggleSimulation,
  lang
}) => {
  const [pageIds, setPageIds] = useState(config.pageIds);
  const [username, setUsername] = useState(config.username);
  const [pwd, setPwd] = useState(config.pwd);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({ pageIds, username, pwd });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {lang === 'km' ? 'ការកំណត់ប្រព័ន្ធ Bus Pad' : 'Bus Pad System Settings'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'km' ? 'កំណត់រចនាសម្ព័ន្ធ API និងឧបករណ៍' : 'Configure GPS endpoint & onboard device'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Simulation Demo Mode */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{lang === 'km' ? 'ដំណើរការសាកល្បង (Simulation Demo)' : 'Live Motion Demo Simulator'}</span>
                {simulationActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-bold uppercase animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'km'
                  ? 'សាកល្បងរត់ចលនារថយន្តលើផ្លូវជាតិ គ.ម/ម៉ោង ផ្លាស់ប្តូរទីតាំង និងបត់បែនទិសដៅផ្ទាល់។'
                  : 'Simulate vehicle progression along Cambodian highways with live telemetry.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleSimulation}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg ${
                simulationActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {simulationActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{simulationActive ? (lang === 'km' ? 'ផ្អាក Demo' : 'Pause') : (lang === 'km' ? 'ចាប់ផ្តើម Demo' : 'Start Demo')}</span>
            </button>
          </div>

          {/* Refresh Interval */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'km' ? 'ល្បឿនទាញយកទិន្នន័យ GPS ឡើងវិញ (Auto-Refresh)' : 'GPS Polling Interval'}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { ms: 3000, label: '3s' },
                { ms: 5000, label: '5s (Default)' },
                { ms: 10000, label: '10s' },
                { ms: 30000, label: '30s' }
              ].map(item => (
                <button
                  key={item.ms}
                  type="button"
                  onClick={() => onChangeRefreshInterval(item.ms)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    refreshInterval === item.ms
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Limit Setting */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'km' ? 'ដែនកំណត់ល្បឿនរោទិ៍ព្រមាន (Speed Limit Alert)' : 'Speed Limit Alert Threshold'}</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="120"
                step="5"
                value={speedLimit}
                onChange={e => onChangeSpeedLimit(Number(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-sm text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {speedLimit} km/h
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'km'
                ? 'តាមច្បាប់ចរាចរណ៍ផ្លូវគោកកម្ពុជា ល្បឿនអតិបរមាសម្រាប់រថយន្តក្រុងលើផ្លូវជាតិគឺ 80 គ.ម/ម៉ោង។'
                : 'Cambodian road safety regulation limits heavy passenger buses to 80 km/h on national highways.'}
            </p>
          </div>

          {/* Audio Chime Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${soundEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {lang === 'km' ? 'សំឡេងរោទិ៍ & Chime' : 'Audio Notifications'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'km' ? 'សំឡេងរោទិ៍ពេលលើសល្បឿន និងដល់ចំណត' : 'Synthetic chime on overspeed & arrival'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                soundEnabled ? 'left-6.5' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Adsun API Credentials Section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {lang === 'km' ? 'គណនី Adsun GPS API' : 'Adsun GPS API Endpoint'}
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                Page IDs (pageIds)
              </label>
              <input
                type="text"
                value={pageIds}
                onChange={e => setPageIds(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  Password (pwd)
                </label>
                <input
                  type="password"
                  value={pwd}
                  onChange={e => setPwd(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              {lang === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'km' ? 'រក្សាទុក' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
