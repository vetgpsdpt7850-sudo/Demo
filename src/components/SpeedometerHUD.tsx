import React, { useEffect, useRef, useState } from 'react';
import { GpsVehicle, Language } from '../types/gps';
import { AlertTriangle, Compass } from 'lucide-react';

interface SpeedometerHUDProps {
  vehicle: GpsVehicle;
  speedLimit?: number;
  lang: Language;
}

function getCardinalDirection(angle: number, lang: Language): string {
  const normalized = ((angle % 360) + 360) % 360;
  const dirsEn = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const dirsKm = ['ជើង', 'ឦសាន', 'កើត', 'អាគ្នេយ៍', 'ត្បូង', 'និរតី', 'លិច', 'ពាយ័ព្យ'];
  const idx = Math.round(normalized / 45) % 8;
  return lang === 'km' ? `${dirsKm[idx]} (${dirsEn[idx]})` : dirsEn[idx];
}

export const SpeedometerHUD: React.FC<SpeedometerHUDProps> = ({
  vehicle,
  speedLimit = 80,
  lang
}) => {
  const rawSpeed = Math.max(0, vehicle.Speed || 0);
  const [smoothSpeed, setSmoothSpeed] = useState<number>(rawSpeed);
  const currentSpeedRef = useRef<number>(rawSpeed);
  const animRef = useRef<number | null>(null);

  // Smooth 60fps gauge sweep interpolation
  useEffect(() => {
    const startVal = currentSpeedRef.current;
    const targetVal = rawSpeed;
    if (Math.abs(targetVal - startVal) < 0.1) {
      setSmoothSpeed(targetVal);
      currentSpeedRef.current = targetVal;
      return;
    }

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startTime = performance.now();
    const duration = 550;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const next = startVal + (targetVal - startVal) * ease;
      currentSpeedRef.current = next;
      setSmoothSpeed(next);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [rawSpeed]);

  const speed = Math.round(smoothSpeed);
  const isOverSpeed = speed > speedLimit || vehicle.IsOverSpeed;
  const isMoving = rawSpeed > 2;
  const isEngineOn = vehicle.Key;
  const angle = Math.round(vehicle.Angle || 0);

  // Automatic transmission gear state
  const activeGear = isMoving ? 'D' : isEngineOn ? 'N' : 'P';

  // Gauge math: 240-degree sweep from 150° to 390°
  const maxSpeed = 120;
  const clampedSpeed = Math.min(maxSpeed, smoothSpeed);
  const startAngle = 150;
  const sweepAngle = 240;

  const cx = 130;
  const cy = 130;
  const r = 96;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAng: number, endAng: number) => {
    const start = polarToCartesian(x, y, radius, endAng);
    const end = polarToCartesian(x, y, radius, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const currentEndAngle = startAngle + (clampedSpeed / maxSpeed) * sweepAngle;
  const limitStartAngle = startAngle + (speedLimit / maxSpeed) * sweepAngle;

  // Generate tick marks (0 to 120 every 5 km/h, major every 20 km/h)
  const ticks = [];
  for (let s = 0; s <= maxSpeed; s += 5) {
    const deg = startAngle + (s / maxSpeed) * sweepAngle;
    const isMajor = s % 20 === 0;
    const isDanger = s >= speedLimit;
    const outerPt = polarToCartesian(cx, cy, r + 10, deg);
    const innerPt = polarToCartesian(cx, cy, isMajor ? r - 2 : r + 4, deg);
    const labelPt = polarToCartesian(cx, cy, r - 17, deg);

    ticks.push({
      s,
      isMajor,
      isDanger,
      x1: innerPt.x,
      y1: innerPt.y,
      x2: outerPt.x,
      y2: outerPt.y,
      lx: labelPt.x,
      ly: labelPt.y
    });
  }

  // Needle angle
  const needleTip = polarToCartesian(cx, cy, r - 6, currentEndAngle);

  return (
    <div
      className={`cockpit-card relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isOverSpeed ? 'ring-2 ring-rose-500/80 bg-rose-950/25' : ''
      }`}
    >
      {/* Top Row: Drive Mode Selector (P R N D) & Speed Limit Sign */}
      <div className="flex items-center justify-between z-10">
        {/* Gear PRND Indicator + Status */}
        <div className="flex items-center gap-2.5">
          <div className="cockpit-inset flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-bold">
            {(['P', 'N', 'D'] as const).map(g => {
              const active = activeGear === g;
              let activeStyle = 'text-slate-600';
              if (active) {
                activeStyle =
                  g === 'D'
                    ? 'text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30'
                    : g === 'N'
                    ? 'text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30'
                    : 'text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30';
              }
              return (
                <span key={g} className={`transition-all ${activeStyle}`}>
                  {g}
                </span>
              );
            })}
          </div>

          <span className="text-xs font-semibold text-slate-300">
            {isMoving
              ? lang === 'km'
                ? 'កំពុងបើកបរ'
                : 'Cruising'
              : isEngineOn
              ? lang === 'km'
                ? 'ឈប់បញ្ឆេះម៉ាស៊ីន'
                : 'Idling'
              : lang === 'km'
              ? 'ឈប់ចត'
              : 'Parked'}
          </span>
        </div>

        {/* Cambodian Highway Speed Limit Sign */}
        <div className="flex items-center gap-2 cockpit-inset px-2.5 py-1 rounded-xl">
          <div className="w-6 h-6 rounded-full border-[2.5px] border-rose-600 bg-white text-slate-950 flex items-center justify-center font-mono font-black text-[11px] leading-none shadow-sm">
            {speedLimit}
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-300 leading-tight">
              {lang === 'km' ? 'ល្បឿនកំណត់' : 'MAX LIMIT'}
            </div>
            <div className="text-[9px] font-mono text-slate-500 leading-tight">KM/H</div>
          </div>
        </div>
      </div>

      {/* Center Precision SVG Instrument Cluster */}
      <div className="relative my-1 flex items-center justify-center">
        <svg className="w-full max-w-[240px] h-auto select-none" viewBox="0 0 260 225">
          <defs>
            <linearGradient id="speedArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="55%" stopColor="#10b981" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glowArc" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Subtle Bezel Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r + 14}
            fill="none"
            stroke="rgba(148, 163, 184, 0.08)"
            strokeWidth="1"
          />

          {/* Background Track Arc */}
          <path
            d={describeArc(cx, cy, r, startAngle, startAngle + sweepAngle)}
            fill="none"
            stroke="rgba(30, 41, 59, 0.85)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Redline Warning Zone Track (80 -> 120 km/h) */}
          {speedLimit < maxSpeed && (
            <path
              d={describeArc(cx, cy, r, limitStartAngle, startAngle + sweepAngle)}
              fill="none"
              stroke="rgba(239, 68, 68, 0.22)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          )}

          {/* Active Glowing Speed Arc (60fps interpolated) */}
          {clampedSpeed > 0.3 && (
            <path
              d={describeArc(cx, cy, r, startAngle, currentEndAngle)}
              fill="none"
              stroke="url(#speedArcGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#glowArc)"
            />
          )}

          {/* Scale Ticks & Numerals */}
          {ticks.map(tk => (
            <g key={tk.s}>
              <line
                x1={tk.x1}
                y1={tk.y1}
                x2={tk.x2}
                y2={tk.y2}
                stroke={
                  tk.s <= clampedSpeed
                    ? tk.isDanger
                      ? '#f87171'
                      : '#38bdf8'
                    : tk.isDanger
                    ? 'rgba(239, 68, 68, 0.45)'
                    : tk.isMajor
                    ? 'rgba(148, 163, 184, 0.65)'
                    : 'rgba(71, 85, 105, 0.45)'
                }
                strokeWidth={tk.isMajor ? '2' : '1.2'}
                strokeLinecap="round"
              />
              {tk.isMajor && (
                <text
                  x={tk.lx}
                  y={tk.ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-[10px] font-bold"
                  fill={tk.isDanger ? '#fca5a5' : '#94a3b8'}
                >
                  {tk.s}
                </text>
              )}
            </g>
          ))}

          {/* Dynamic Indicator Dot on Arc Tip */}
          <circle
            cx={needleTip.x}
            cy={needleTip.y}
            r="4.5"
            fill={isOverSpeed ? '#ef4444' : '#38bdf8'}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>

        {/* Center Digital Speedometer Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-5 pointer-events-none">
          <div
            className={`text-6xl font-black font-mono tabular-nums tracking-tighter leading-none ${
              isOverSpeed ? 'text-rose-400' : 'text-white'
            }`}
          >
            {speed}
          </div>
          <div className="text-[11px] font-bold tracking-widest uppercase text-cyan-400 mt-1">
            {lang === 'km' ? 'គ.ម / ម៉ោង' : 'KM / H'}
          </div>

          {/* Compass Heading Pill */}
          <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md cockpit-inset text-[11px] font-mono text-slate-300">
            <Compass
              className="w-3.5 h-3.5 text-cyan-400 transition-transform duration-500"
              style={{ transform: `rotate(${angle}deg)` }}
            />
            <span>{angle}°</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-300 font-sans font-semibold">
              {getCardinalDirection(angle, lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Overspeed Alert Banner */}
      {isOverSpeed && (
        <div className="mb-2.5 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-bold animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            {lang === 'km'
              ? 'ល្បឿនលើសកំណត់ 80 គ.ម/ម៉ោង! សូមបន្ថយល្បឿន'
              : 'OVERSPEED WARNING! Reduce speed immediately'}
          </span>
        </div>
      )}

      {/* Bottom Instrument Sub-Readouts (Trip Distance, Odometer, Driving Time) */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800/80">
        <div className="cockpit-inset rounded-xl p-2 text-center">
          <div className="text-[10px] text-slate-400 font-medium truncate">
            {lang === 'km' ? 'ចម្ងាយជើងនេះ' : 'Trip Dist'}
          </div>
          <div className="text-xs sm:text-sm font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
            {(vehicle.TripKm || 0).toFixed(1)} <span className="text-[10px] text-slate-500">km</span>
          </div>
        </div>

        <div className="cockpit-inset rounded-xl p-2 text-center">
          <div className="text-[10px] text-slate-400 font-medium truncate">
            {isMoving
              ? lang === 'km'
                ? 'ម៉ោងបើកបរ'
                : 'Drive Time'
              : lang === 'km'
              ? 'ម៉ោងឈប់ចត'
              : 'Stop Time'}
          </div>
          <div className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-100 mt-0.5">
            {isMoving
              ? `${Math.floor((vehicle.DayDrivingTime || 0) / 60)}h ${(vehicle.DayDrivingTime || 0) % 60}m`
              : vehicle.StopTime?.slice(0, 5) || '00:00'}
          </div>
        </div>

        <div className="cockpit-inset rounded-xl p-2 text-center">
          <div className="text-[10px] text-slate-400 font-medium truncate">
            {lang === 'km' ? 'កុងទ័រសរុប' : 'Odometer'}
          </div>
          <div className="text-xs sm:text-sm font-bold font-mono tabular-nums text-cyan-300 mt-0.5">
            {Math.round(vehicle.Km || 0).toLocaleString()} <span className="text-[10px] text-slate-500">km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
