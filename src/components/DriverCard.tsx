import React, { useEffect, useState } from 'react';
import { GpsVehicle, Language } from '../types/gps';
import {
  getNearestAndTargetStops,
  calculateETA,
  fetchRealRoadRoute,
  RealRoadRouteResult
} from '../utils/cambodiaLocations';
import { VetBranchSelect } from './VetBranchSelect';
import { UserCheck, Bus, Navigation2, Clock, Route, Building2 } from 'lucide-react';

interface DriverCardProps {
  vehicle: GpsVehicle;
  lang: Language;
  targetStopId?: string;
  onChangeTargetStopId?: (stopId: string) => void;
  onRouteCalculated?: (route: RealRoadRouteResult, targetStopId: string) => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  vehicle,
  lang,
  targetStopId: propTargetStopId,
  onChangeTargetStopId,
  onRouteCalculated
}) => {
  const [internalStopId, setInternalStopId] = useState<string>('sihanoukville');
  const activeTargetId = propTargetStopId ?? internalStopId;

  const [roadRoute, setRoadRoute] = useState<RealRoadRouteResult | null>(null);
  const [routeTargetId, setRouteTargetId] = useState<string>(activeTargetId);

  const curLat = vehicle.Lat || 11.5847;
  const curLng = vehicle.Lng || 104.9161;

  const { closestStop, targetStop, distanceToTarget } = getNearestAndTargetStops(
    curLat,
    curLng,
    activeTargetId
  );

  // Immediately provide an instant fallback route when branch changes, then refine via OSRM
  useEffect(() => {
    let cancelled = false;

    const instantFallback: RealRoadRouteResult = {
      distanceKm: distanceToTarget,
      durationMinutes: Math.max(1, Math.round((distanceToTarget / 58) * 60)),
      geometry: [
        [curLat, curLng],
        [targetStop.lat, targetStop.lng]
      ],
      isRealOsrm: false
    };

    if (routeTargetId !== targetStop.id) {
      setRoadRoute(instantFallback);
      setRouteTargetId(targetStop.id);
      if (onRouteCalculated) {
        onRouteCalculated(instantFallback, targetStop.id);
      }
    }

    fetchRealRoadRoute(curLat, curLng, targetStop.lat, targetStop.lng)
      .then(res => {
        if (!cancelled) {
          setRoadRoute(res);
          setRouteTargetId(targetStop.id);
          if (onRouteCalculated) {
            onRouteCalculated(res, targetStop.id);
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [
    Math.round(curLat * 200) / 200,
    Math.round(curLng * 200) / 200,
    targetStop.id,
    targetStop.lat,
    targetStop.lng
  ]);

  const activeRouteMatchesTarget = roadRoute && routeTargetId === targetStop.id;
  const finalDistanceKm = activeRouteMatchesTarget ? roadRoute.distanceKm : distanceToTarget;
  const eta = calculateETA(
    finalDistanceKm,
    vehicle.Speed || 0,
    activeRouteMatchesTarget ? roadRoute.durationMinutes : undefined
  );

  const handleSelectChange = (newId: string) => {
    if (onChangeTargetStopId) {
      onChangeTargetStopId(newId);
    } else {
      setInternalStopId(newId);
    }
  };

  return (
    <div className="cockpit-card rounded-2xl p-4 flex flex-col gap-3.5">
      {/* Live Vireak Buntham Branch Distance & ETA Calculator Box */}
      <div className="cockpit-inset rounded-xl p-3.5 border border-cyan-500/20">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Navigation2 className="w-4 h-4 text-cyan-400 rotate-45 shrink-0" />
            <span className="text-xs font-extrabold text-cyan-400 tracking-wide truncate">
              {lang === 'km' ? 'វាស់ចម្ងាយផ្លូវ & ម៉ោងដល់សាខា វីរៈប៊ុនថាំ' : 'VET Branch Distance & ETA'}
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
            VET EXPRESS
          </span>
        </div>

        {/* Highlighted 2-Column Readout: Exact Kilometers + Exact Arrival Time */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {/* Box 1: Real Road Distance (KM) */}
          <div className="rounded-xl bg-slate-950/90 border border-emerald-500/25 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Route className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'km' ? 'ចម្ងាយផ្លូវជាក់ស្តែង' : 'Road Distance'}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                {activeRouteMatchesTarget && roadRoute?.isRealOsrm
                  ? lang === 'km'
                    ? 'ផ្លូវជាតិពិត'
                    : 'Real Road'
                  : 'GPS'}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-400 tracking-tight transition-all duration-200">
                {finalDistanceKm.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-300">
                {lang === 'km' ? 'គីឡូម៉ែត្រ (km)' : 'km'}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 truncate mt-1">
              {targetStop.highway}
            </div>
          </div>

          {/* Box 2: Exact Arrival Time & Duration */}
          <div className="rounded-xl bg-slate-950/90 border border-cyan-500/25 p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'km' ? 'ម៉ោងទៅដល់ប៉ាន់ស្មាន' : 'Arrival Time (ETA)'}
              </span>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded">
                {eta.arrivalTime24}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white tracking-tight transition-all duration-200">
                {eta.arrivalTime}
              </span>
            </div>

            <div className="text-[10px] font-semibold text-cyan-300 truncate mt-1">
              {lang === 'km'
                ? `នៅសល់ ${eta.etaFormattedKm}`
                : `In ${eta.etaFormattedEn} (@ ~${eta.effectiveSpeedKmh} km/h)`}
            </div>
          </div>
        </div>

        {/* Origin -> Target Vireak Buntham Branch Interactive Row (Search + Dropdown directly on "ទៅកាន់៖") */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/10 text-xs">
          <div className="min-w-0 flex items-center gap-1">
            <span className="text-[10px] text-slate-400 shrink-0">
              {lang === 'km' ? 'ចេញពីតំបន់៖' : 'From:'}
            </span>
            <span className="font-bold text-slate-200 truncate max-w-[125px]">
              {lang === 'km' ? closestStop.provinceKm : closestStop.provinceEn}
            </span>
          </div>

          <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-400" />
              {lang === 'km' ? 'ទៅកាន់៖' : 'To:'}
            </span>
            <VetBranchSelect
              selectedId={targetStop.id}
              onSelect={handleSelectChange}
              currentLat={curLat}
              currentLng={curLng}
              lang={lang}
              variant="inline"
            />
          </div>
        </div>
      </div>

      {/* Captain & Coach Specs Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-sm shrink-0 shadow-inner">
            {vehicle.DriverName ? vehicle.DriverName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>{lang === 'km' ? 'អ្នកបើកបររថយន្ត' : 'Assigned Captain'}</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
              {vehicle.DriverName || 'VET Express Captain'}
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate">
              ID: {vehicle.Liciense || 'D2TKH000'} · {vehicle.GroupName || 'AIRBUS'}
            </div>
          </div>
        </div>

        <div className="cockpit-inset px-3 py-1.5 rounded-xl text-right shrink-0">
          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-end gap-1">
            <Bus className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'km' ? 'ប្រភេទឡាន' : 'Coach'}</span>
          </div>
          <div className="text-xs font-bold text-slate-100 mt-0.5">
            {vehicle.VehicleType || 'Bus Airbus'}
          </div>
          <div className="text-[10px] font-mono text-cyan-400">
            {vehicle.SheeatsOrTons || '45 Seats'}
          </div>
        </div>
      </div>
    </div>
  );
};
