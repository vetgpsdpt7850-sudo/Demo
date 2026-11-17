import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GpsVehicle, MapTheme, RouteBreadcrumb, Language } from '../types/gps';
import {
  CAMBODIA_STOPS,
  RealRoadRouteResult,
  calculateETA
} from '../utils/cambodiaLocations';
import { Locate, Navigation, Plus, Minus, MapPin, Route } from 'lucide-react';

interface MapViewProps {
  activeVehicle: GpsVehicle;
  allVehicles: GpsVehicle[];
  routeTrail: RouteBreadcrumb[];
  mapTheme: MapTheme;
  onChangeMapTheme?: (theme: MapTheme) => void;
  autoFollow: boolean;
  onToggleAutoFollow: () => void;
  onSelectVehicle: (vehicle: GpsVehicle) => void;
  showAllVehicles?: boolean;
  lang: Language;
  targetStopId?: string;
  plannedRoute?: RealRoadRouteResult | null;
}

export const MapView: React.FC<MapViewProps> = ({
  activeVehicle,
  allVehicles,
  mapTheme,
  onChangeMapTheme,
  autoFollow,
  onToggleAutoFollow,
  onSelectVehicle,
  showAllVehicles = false,
  lang,
  targetStopId = 'sihanoukville',
  plannedRoute
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const activeMarkerRef = useRef<L.Marker | null>(null);
  const plannedRoutePolylineRef = useRef<L.Polyline | null>(null);
  const otherMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const stopsGroupRef = useRef<L.LayerGroup | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Smooth interpolation state refs for 60fps marker gliding
  const animFrameRef = useRef<number | null>(null);
  const currentPosRef = useRef<{ lat: number; lng: number; angle: number } | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = activeVehicle?.Lat || 12.1586;
      const initialLng = activeVehicle?.Lng || 105.1202;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      });

      mapInstanceRef.current = map;
      otherMarkersGroupRef.current = L.layerGroup().addTo(map);
      stopsGroupRef.current = L.layerGroup().addTo(map);

      const timer = setTimeout(() => {
        if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
          try {
            mapInstanceRef.current.invalidateSize({ debounceMoveend: true });
          } catch {}
        }
      }, 150);

      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        const ro = new ResizeObserver(() => {
          if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
            try {
              mapInstanceRef.current.invalidateSize({ debounceMoveend: true });
            } catch {}
          }
        });
        ro.observe(mapContainerRef.current);
        resizeObserverRef.current = ro;
      }

      return () => {
        clearTimeout(timer);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        }
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch {}
          mapInstanceRef.current = null;
          activeMarkerRef.current = null;
          plannedRoutePolylineRef.current = null;
          tileLayerRef.current = null;
          otherMarkersGroupRef.current = null;
          stopsGroupRef.current = null;
        }
      };
    }
  }, []);

  // Switch High-Clarity Tile Layers (with Native Khmer & English Labels)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._mapPane) return;

    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch {}
      tileLayerRef.current = null;
    }

    const url =
      mapTheme === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 20,
      keepBuffer: 4,
      updateWhenIdle: false
    }).addTo(map);
  }, [mapTheme]);

  // Render Vireak Buntham Branches ONLY when targetStopId or lang changes (Zero flicker on speed changes!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = stopsGroupRef.current;
    if (!map || !group || !(map as any)._mapPane) return;

    group.clearLayers();

    CAMBODIA_STOPS.forEach(stop => {
      const isTarget = stop.id === targetStopId;

      const stopIcon = L.divIcon({
        className: 'custom-stop-icon',
        html: isTarget
          ? `
          <div class="flex flex-col items-center transform -translate-x-1/2 -translate-y-full pb-1">
            <div class="px-3 py-1.5 rounded-xl bg-slate-950/95 border-2 border-emerald-400 text-white shadow-2xl whitespace-nowrap flex flex-col items-center">
              <div class="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>${lang === 'km' ? stop.capitalNameKm : stop.capitalNameEn}</span>
              </div>
              <div data-target-eta="true" class="text-[11px] font-mono font-bold text-slate-200 mt-0.5"></div>
            </div>
            <div class="w-3 h-3 rotate-45 bg-emerald-400 -mt-1.5 shadow-lg"></div>
          </div>
        `
          : `
          <div class="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950/85 text-sky-300 text-[10px] font-semibold rounded-full border border-sky-400/35 shadow-md whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>${lang === 'km' ? stop.capitalNameKm.replace('សាខា វីរៈប៊ុនថាំ ', '') : stop.provinceEn}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([stop.lat, stop.lng], {
        icon: stopIcon,
        zIndexOffset: isTarget ? 900 : 100
      });

      marker.bindPopup(`
        <div class="p-2.5 text-slate-100">
          <div class="text-[10px] font-bold text-sky-400 uppercase tracking-wider">${lang === 'km' ? 'សាខា វីរៈប៊ុនថាំ (VET)' : 'Vireak Buntham Branch'}</div>
          <div class="text-sm font-bold mt-0.5">${lang === 'km' ? stop.nameKm : stop.nameEn}</div>
          <div class="text-xs text-slate-400 mt-0.5">${stop.highway}</div>
        </div>
      `);
      group.addLayer(marker);
    });
  }, [lang, targetStopId]);

  // Update the target marker's ETA text in-place without recreating markers
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const etaNode = mapContainerRef.current.querySelector('[data-target-eta="true"]') as HTMLElement | null;
    if (!etaNode) return;

    if (plannedRoute) {
      const etaInfo = calculateETA(
        plannedRoute.distanceKm,
        activeVehicle?.Speed || 0,
        plannedRoute.durationMinutes
      );
      etaNode.textContent = `${plannedRoute.distanceKm.toFixed(1)} km · ${etaInfo.arrivalTime}`;
    } else {
      etaNode.textContent = '';
    }
  }, [plannedRoute, activeVehicle?.Speed, targetStopId, lang]);

  // Draw Planned Highway Route Line from Bus to Selected Vireak Buntham Branch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._mapPane) return;

    if (!plannedRoute || !plannedRoute.geometry || plannedRoute.geometry.length < 2) {
      if (plannedRoutePolylineRef.current) {
        map.removeLayer(plannedRoutePolylineRef.current);
        plannedRoutePolylineRef.current = null;
      }
      return;
    }

    if (!plannedRoutePolylineRef.current) {
      plannedRoutePolylineRef.current = L.polyline(plannedRoute.geometry, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    } else {
      plannedRoutePolylineRef.current.setLatLngs(plannedRoute.geometry);
    }
  }, [plannedRoute]);

  // 60 FPS Smooth Interpolated Active Bus Marker Update (No DOM Recreation!)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._mapPane || !activeVehicle || !activeVehicle.Lat || !activeVehicle.Lng) return;

    const targetLat = activeVehicle.Lat;
    const targetLng = activeVehicle.Lng;
    const speed = Math.round(activeVehicle.Speed || 0);
    const targetAngle = activeVehicle.Angle || 0;
    const isMoving = speed > 2;
    const accentColor = isMoving ? '#10b981' : activeVehicle.Key ? '#f59e0b' : '#ef4444';
    const plateLabel = activeVehicle.Plate || activeVehicle.Id;

    // Create marker once if it does not exist yet
    if (!activeMarkerRef.current) {
      const initialHtml = `
        <div class="relative flex items-center justify-center" style="width: 100px; height: 100px;">
          <!-- Sonar Wave Ring -->
          <div data-bus-sonar class="absolute w-16 h-16 rounded-full border-2 bus-sonar pointer-events-none" style="border-color: ${accentColor};"></div>

          <!-- Floating Plate & Speed Callout Pill -->
          <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/95 border border-white/20 text-xs font-bold text-white shadow-2xl whitespace-nowrap pointer-events-none">
            <span data-bus-dot class="w-2 h-2 rounded-full" style="background-color: ${accentColor};"></span>
            <span data-bus-plate>${plateLabel}</span>
            <span class="text-slate-500">·</span>
            <span data-bus-speed class="font-mono font-extrabold" style="color: ${accentColor};">${speed} km/h</span>
          </div>

          <!-- Rotating 3D Top-Down Luxury Coach SVG -->
          <div data-bus-rotator class="relative w-20 h-20 flex items-center justify-center" style="transform: rotate(${targetAngle}deg); will-change: transform;">
            <div data-bus-beam class="absolute -top-7 w-12 h-14 pointer-events-none opacity-55" style="background: linear-gradient(to top, ${accentColor}99, transparent); clip-path: polygon(25% 100%, 75% 100%, 100% 0%, 0% 0%);"></div>
            <svg width="38" height="58" viewBox="0 0 36 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)]">
              <rect x="4" y="4" width="28" height="48" rx="7" fill="#0f172a" stroke="#ffffff" stroke-width="2.5"/>
              <rect data-bus-body-tint x="6" y="6" width="24" height="44" rx="5" fill="${accentColor}" fill-opacity="0.18"/>
              <path d="M7 11C7 8.5 9 7 18 7C27 7 29 8.5 29 11L27 16H9L7 11Z" fill="#38bdf8"/>
              <rect x="9" y="19" width="18" height="24" rx="3" fill="#1e293b" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
              <rect data-bus-roof x="12" y="23" width="12" height="10" rx="2" fill="${accentColor}"/>
              <path d="M4 11L1 9V13L4 13Z" fill="#ffffff"/>
              <path d="M32 11L35 9V13L32 13Z" fill="#ffffff"/>
              <rect x="7" y="4.5" width="5" height="2" rx="1" fill="#fef08a"/>
              <rect x="24" y="4.5" width="5" height="2" rx="1" fill="#fef08a"/>
              <rect x="7" y="50" width="6" height="2" rx="1" fill="#ef4444"/>
              <rect x="23" y="50" width="6" height="2" rx="1" fill="#ef4444"/>
            </svg>
          </div>
        </div>
      `;

      const activeIcon = L.divIcon({
        className: 'active-bus-marker',
        html: initialHtml,
        iconSize: [100, 100],
        iconAnchor: [50, 50]
      });

      activeMarkerRef.current = L.marker([targetLat, targetLng], {
        icon: activeIcon,
        zIndexOffset: 1000
      }).addTo(map);

      currentPosRef.current = { lat: targetLat, lng: targetLng, angle: targetAngle };
      if (autoFollow) {
        map.panTo([targetLat, targetLng], { animate: true, duration: 0.8 });
      }
      return;
    }

    // Update text & colors in-place without destroying the DOM element
    const el = activeMarkerRef.current.getElement();
    if (el) {
      const plateEl = el.querySelector('[data-bus-plate]');
      const speedEl = el.querySelector('[data-bus-speed]') as HTMLElement | null;
      const dotEl = el.querySelector('[data-bus-dot]') as HTMLElement | null;
      const sonarEl = el.querySelector('[data-bus-sonar]') as HTMLElement | null;
      const roofEl = el.querySelector('[data-bus-roof]');
      const tintEl = el.querySelector('[data-bus-body-tint]');

      if (plateEl && plateEl.textContent !== plateLabel) plateEl.textContent = plateLabel;
      if (speedEl) {
        speedEl.textContent = `${speed} km/h`;
        speedEl.style.color = accentColor;
      }
      if (dotEl) dotEl.style.backgroundColor = accentColor;
      if (sonarEl) sonarEl.style.borderColor = accentColor;
      if (roofEl) roofEl.setAttribute('fill', accentColor);
      if (tintEl) tintEl.setAttribute('fill', accentColor);
    }

    // Smoothly interpolate position & rotation over 900ms using requestAnimationFrame
    const prev = currentPosRef.current || { lat: targetLat, lng: targetLng, angle: targetAngle };
    const distDelta = Math.hypot(targetLat - prev.lat, targetLng - prev.lng);

    // If switching to a completely different bus far away, snap immediately and flyTo
    if (distDelta > 0.08) {
      currentPosRef.current = { lat: targetLat, lng: targetLng, angle: targetAngle };
      activeMarkerRef.current.setLatLng([targetLat, targetLng]);
      const rotatorEl = el?.querySelector('[data-bus-rotator]') as HTMLElement | null;
      if (rotatorEl) rotatorEl.style.transform = `rotate(${targetAngle}deg)`;
      if (autoFollow) {
        map.panTo([targetLat, targetLng], { animate: true, duration: 0.9 });
      }
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startLat = prev.lat;
    const startLng = prev.lng;
    const startAngle = prev.angle;
    // Shortest angular delta (-180 to +180)
    const angleDiff = ((((targetAngle - startAngle) % 360) + 540) % 360) - 180;

    const durationMs = 950;
    const startTime = performance.now();

    const stepAnimation = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Smooth ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3);

      const interpLat = startLat + (targetLat - startLat) * ease;
      const interpLng = startLng + (targetLng - startLng) * ease;
      const interpAngle = startAngle + angleDiff * ease;

      currentPosRef.current = { lat: interpLat, lng: interpLng, angle: interpAngle };

      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLatLng([interpLat, interpLng]);
        const markerDom = activeMarkerRef.current.getElement();
        const rotatorEl = markerDom?.querySelector('[data-bus-rotator]') as HTMLElement | null;
        if (rotatorEl) {
          rotatorEl.style.transform = `rotate(${interpAngle.toFixed(1)}deg)`;
        }
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(stepAnimation);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(stepAnimation);

    if (autoFollow) {
      map.panTo([targetLat, targetLng], { animate: true, duration: 0.9, easeLinearity: 0.25 });
    }
  }, [
    activeVehicle?.Id,
    activeVehicle?.Lat,
    activeVehicle?.Lng,
    activeVehicle?.Speed,
    activeVehicle?.Angle,
    activeVehicle?.Key,
    autoFollow
  ]);

  // Render Fleet Vehicles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = otherMarkersGroupRef.current;
    if (!map || !group || !(map as any)._mapPane) return;

    group.clearLayers();
    if (!showAllVehicles) return;

    allVehicles.forEach(vehicle => {
      if (vehicle.Id === activeVehicle.Id || !vehicle.Lat || !vehicle.Lng) return;

      const isMoving = vehicle.Speed > 2;
      const markerColor = isMoving ? '#10b981' : vehicle.Key ? '#f59e0b' : '#ef4444';

      const icon = L.divIcon({
        className: 'fleet-vehicle-marker',
        html: `
          <div class="relative cursor-pointer group transform hover:scale-110 transition-transform flex items-center justify-center" style="width: 44px; height: 44px;">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-xl border-2 border-white text-white" style="background-color: ${markerColor}; transform: rotate(${vehicle.Angle}deg);">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L19 21L12 17L5 21L12 2Z"/></svg>
            </div>
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-slate-950/90 text-[10px] font-bold text-white rounded-full border border-white/20 whitespace-nowrap shadow-md">
              ${vehicle.Id}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([vehicle.Lat, vehicle.Lng], { icon });
      marker.on('click', () => onSelectVehicle(vehicle));
      group.addLayer(marker);
    });
  }, [allVehicles, activeVehicle.Id, showAllVehicles, onSelectVehicle]);

  const handleZoom = (delta: number) => {
    const map = mapInstanceRef.current;
    if (map && (map as any)._mapPane) {
      map.setZoom(map.getZoom() + delta, { animate: true });
    }
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (map && (map as any)._mapPane && activeVehicle?.Lat && activeVehicle?.Lng) {
      map.setView([activeVehicle.Lat, activeVehicle.Lng], 15, { animate: true });
    }
  };

  const handleFitRoute = () => {
    const map = mapInstanceRef.current;
    if (
      map &&
      (map as any)._mapPane &&
      plannedRoute &&
      plannedRoute.geometry &&
      plannedRoute.geometry.length >= 2
    ) {
      const bounds = L.latLngBounds(plannedRoute.geometry);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl ${
        mapTheme === 'dark' ? 'map-night-filter' : ''
      }`}
    >
      {/* Interactive Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top-Left Floating Map Theme Switcher Pill */}
      {onChangeMapTheme && (
        <div className="absolute top-4 left-4 z-[500] flex items-center gap-1 p-1 rounded-2xl pad-glass">
          {(
            [
              { id: 'streets', labelKm: 'ផែនទីថ្ងៃ', labelEn: 'Road Map' },
              { id: 'dark', labelKm: 'ផែនទីយប់', labelEn: 'Night HUD' },
              { id: 'satellite', labelKm: 'ផ្កាយរណប', labelEn: 'Satellite' }
            ] as const
          ).map(item => (
            <button
              key={item.id}
              onClick={() => onChangeMapTheme(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapTheme === item.id
                  ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {lang === 'km' ? item.labelKm : item.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* Top-Right Camera & Zoom Controls */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col items-end gap-2.5">
        <button
          onClick={onToggleAutoFollow}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-xl cursor-pointer ${
            autoFollow
              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-emerald-500/25'
              : 'pad-glass text-slate-200 hover:text-white'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>
            {autoFollow
              ? lang === 'km'
                ? 'កំពុងចាក់សោតាមឡាន'
                : 'Auto-Tracking'
              : lang === 'km'
              ? 'ចុចដើម្បីតាមឡាន'
              : 'Follow Bus'}
          </span>
        </button>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleRecenter}
            className="w-11 h-11 rounded-2xl pad-glass flex items-center justify-center text-sky-400 hover:text-white transition-all cursor-pointer"
            title={lang === 'km' ? 'មើលទីតាំងឡានផ្ទាល់' : 'Center on active bus'}
          >
            <Locate className="w-5 h-5" />
          </button>

          {plannedRoute && (
            <button
              onClick={handleFitRoute}
              className="w-11 h-11 rounded-2xl pad-glass flex items-center justify-center text-emerald-400 hover:text-white transition-all cursor-pointer"
              title={lang === 'km' ? 'មើលផ្លូវទៅដល់សាខា វីរៈប៊ុនថាំ' : 'View full route to VET Branch'}
            >
              <Route className="w-5 h-5" />
            </button>
          )}

          <div className="pad-glass rounded-2xl overflow-hidden flex flex-col divide-y divide-white/10">
            <button
              onClick={() => handleZoom(1)}
              className="w-11 h-11 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="w-11 h-11 flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Live Roadway & Coordinates Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[500] pointer-events-none flex justify-between items-end gap-4">
        <div className="pad-glass rounded-2xl px-4 py-3 pointer-events-auto flex items-center gap-3.5 max-w-xl">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 text-sky-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-bold text-sky-400">
              <span>{lang === 'km' ? 'ទីតាំងផ្លូវជាក់ស្តែង' : 'CURRENT LOCATION'}</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-400">
                {activeVehicle.Lat?.toFixed(5)}°N, {activeVehicle.Lng?.toFixed(5)}°E
              </span>
            </div>
            <div className="text-sm font-bold text-white truncate mt-0.5">
              {activeVehicle.Address || (lang === 'km' ? 'ផ្លូវជាតិកម្ពុជា' : 'National Highway, Cambodia')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
