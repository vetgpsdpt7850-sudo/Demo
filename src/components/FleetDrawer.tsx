import React, { useState } from 'react';
import { GpsVehicle, Language } from '../types/gps';
import { Search, X, Check, Bus, Gauge, MapPin } from 'lucide-react';

interface FleetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: GpsVehicle[];
  activeVehicleId: string;
  onSelectVehicle: (v: GpsVehicle) => void;
  lang: Language;
}

export const FleetDrawer: React.FC<FleetDrawerProps> = ({
  isOpen,
  onClose,
  vehicles,
  activeVehicleId,
  onSelectVehicle,
  lang
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'moving' | 'stopped'>('all');

  if (!isOpen) return null;

  // Extract unique groups
  const groups = Array.from(new Set(vehicles.map(v => v.GroupName).filter(Boolean)));

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.Plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.Id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.DriverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.Address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedGroup === 'all' || v.GroupName === selectedGroup;

    const isMoving = v.Speed > 2;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'moving' && isMoving) ||
      (statusFilter === 'stopped' && !isMoving);

    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {lang === 'km' ? 'បញ្ជីរថយន្តទាំងអស់ (Fleet)' : 'Vehicle Fleet List'}
              </h2>
              <p className="text-xs text-slate-400">
                {filteredVehicles.length} {lang === 'km' ? 'គ្រឿងក្នុងប្រព័ន្ធ' : 'active vehicles'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col gap-3 bg-slate-900/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={lang === 'km' ? 'ស្វែងរកស្លាកលេខ ឬអ្នកបើកបរ...' : 'Search plate or driver...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Group and Status Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                statusFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {lang === 'km' ? 'ទាំងអស់' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('moving')}
              className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                statusFilter === 'moving'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {lang === 'km' ? 'កំពុងរត់' : 'Moving'}
            </button>
            <button
              onClick={() => setStatusFilter('stopped')}
              className={`px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                statusFilter === 'stopped'
                  ? 'bg-rose-500 text-white border-rose-400 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {lang === 'km' ? 'ឈប់' : 'Stopped'}
            </button>
          </div>

          {groups.length > 0 && (
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">{lang === 'km' ? 'គ្រប់ក្រុមយានយន្ត' : 'All Vehicle Groups'}</option>
              {groups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
        </div>

        {/* List of Vehicles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              {lang === 'km' ? 'រកមិនឃើញរថយន្តដែលត្រូវនឹងការស្វែងរក' : 'No vehicles found matching search'}
            </div>
          ) : (
            filteredVehicles.map(v => {
              const isActive = v.Id === activeVehicleId;
              const isMoving = v.Speed > 2;

              return (
                <div
                  key={v.Id}
                  onClick={() => {
                    onSelectVehicle(v);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isMoving ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                      <div className="font-bold text-white text-sm">
                        {v.Plate || v.Id}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {v.GroupName || 'VET'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span className={isMoving ? 'text-emerald-400' : 'text-slate-400'}>
                        {Math.round(v.Speed)} km/h
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{v.Address || 'Cambodia'}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span>
                      {lang === 'km' ? 'អ្នកបើក:' : 'Driver:'} <strong className="text-slate-200">{v.DriverName || 'N/A'}</strong>
                    </span>
                    <span className="font-mono">
                      {v.VehicleType || 'Bus'}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute top-3 right-3 text-cyan-400">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
