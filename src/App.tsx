import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GpsVehicle, MapTheme, Language, RouteBreadcrumb } from './types/gps';
import {
  fetchLiveGpsData,
  FALLBACK_VEHICLES,
  ApiConfig,
  loadBreadcrumbs,
  saveBreadcrumbs
} from './services/gpsApi';
import { HeaderBar } from './components/HeaderBar';
import { MapView } from './components/MapView';
import { SpeedometerHUD } from './components/SpeedometerHUD';
import { DriverCard } from './components/DriverCard';
import { FleetDrawer } from './components/FleetDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ReactNativeModal } from './components/ReactNativeModal';
import { playChime, playOverspeedWarning } from './utils/audioAlerts';
import { RealRoadRouteResult } from './utils/cambodiaLocations';
import {
  BatteryCharging,
  KeyRound,
  Wind,
  DoorClosed,
  DoorOpen,
  Radio,
  Satellite
} from 'lucide-react';

const STORAGE_ACTIVE_BUS = 'buspad_active_bus_id';
const STORAGE_LANG = 'buspad_lang';
const STORAGE_THEME = 'buspad_map_theme_v2';
const STORAGE_SPEED_LIMIT = 'buspad_speed_limit';
const STORAGE_TARGET_PROVINCE = 'buspad_target_province';

export default function App() {
  const [vehicles, setVehicles] = useState<GpsVehicle[]>(FALLBACK_VEHICLES);
  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ACTIVE_BUS) || 'A49  (3G-8311)';
  });
  const [mapTheme, setMapTheme] = useState<MapTheme>(() => {
    return (localStorage.getItem(STORAGE_THEME) as MapTheme) || 'streets';
  });
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_LANG) as Language) || 'km';
  });
  const [speedLimit, setSpeedLimit] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_SPEED_LIMIT);
    return saved ? Number(saved) : 80;
  });
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  const [autoFollow, setAutoFollow] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFleetDrawerOpen, setIsFleetDrawerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRnModalOpen, setIsRnModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);

  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    pageIds: '6208',
    username: 'vetadmin',
    pwd: '12345'
  });

  const [routeTrail, setRouteTrail] = useState<RouteBreadcrumb[]>([]);
  const [targetStopId, setTargetStopId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_TARGET_PROVINCE) || 'sihanoukville';
  });
  const [plannedRoute, setPlannedRoute] = useState<RealRoadRouteResult | null>(null);

  const simStepRef = useRef<number>(0);
  const prevOverSpeedRef = useRef<boolean>(false);

  const handleChangeTargetStop = useCallback((stopId: string) => {
    setTargetStopId(stopId);
    localStorage.setItem(STORAGE_TARGET_PROVINCE, stopId);
  }, []);

  const activeVehicle =
    vehicles.find(v => v.Id === activeVehicleId) ||
    vehicles.find(v => v.Plate === activeVehicleId) ||
    vehicles.find(v => v.Speed > 5) ||
    vehicles[0] ||
    FALLBACK_VEHICLES[0];

  useEffect(() => {
    if (activeVehicle?.Id) {
      localStorage.setItem(STORAGE_ACTIVE_BUS, activeVehicle.Id);
    }
  }, [activeVehicle?.Id]);

  useEffect(() => {
    if (activeVehicle?.Id) {
      const savedTrail = loadBreadcrumbs(activeVehicle.Id);
      setRouteTrail(savedTrail);
    }
  }, [activeVehicle?.Id]);

  const loadGpsData = useCallback(async () => {
    if (simulationActive) return;

    setIsLoading(true);
    try {
      const result = await fetchLiveGpsData(apiConfig);
      if (result.vehicles && result.vehicles.length > 0) {
        setVehicles(result.vehicles);

        const currentActive =
          result.vehicles.find(v => v.Id === activeVehicleId) ||
          result.vehicles.find(v => v.Speed > 5) ||
          result.vehicles[0];

        if (currentActive && currentActive.Lat && currentActive.Lng) {
          const newPt: RouteBreadcrumb = {
            lat: currentActive.Lat,
            lng: currentActive.Lng,
            speed: currentActive.Speed,
            angle: currentActive.Angle,
            timestamp: new Date().toISOString()
          };

          setRouteTrail(prev => {
            const last = prev[prev.length - 1];
            if (
              last &&
              Math.abs(last.lat - newPt.lat) < 0.00005 &&
              Math.abs(last.lng - newPt.lng) < 0.00005
            ) {
              return prev;
            }
            const updated = [...prev, newPt];
            saveBreadcrumbs(currentActive.Id, updated);
            return updated;
          });

          const isOver = currentActive.Speed > speedLimit;
          if (isOver && !prevOverSpeedRef.current && soundEnabled) {
            playOverspeedWarning();
          }
          prevOverSpeedRef.current = isOver;
        }
      }
    } catch (err) {
      console.error('Failed to load GPS data', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiConfig, activeVehicleId, simulationActive, speedLimit, soundEnabled]);

  useEffect(() => {
    loadGpsData();
    const timer = setInterval(() => {
      loadGpsData();
    }, refreshInterval);
    return () => clearInterval(timer);
  }, [loadGpsData, refreshInterval]);

  // Live Highway Simulation Mode
  useEffect(() => {
    if (!simulationActive) return;

    const baseLat = activeVehicle?.Lat || 12.1586;
    const baseLng = activeVehicle?.Lng || 105.1202;

    const interval = setInterval(() => {
      simStepRef.current += 1;
      const step = simStepRef.current;

      const deltaLat = step * 0.00045;
      const deltaLng = -(step * 0.00055);
      const newLat = baseLat + deltaLat;
      const newLng = baseLng + deltaLng;

      const simSpeed = 64 + Math.round(Math.sin(step / 2.5) * 14);
      const simAngle = 310 + Math.round(Math.cos(step / 4) * 12);

      setVehicles(prev =>
        prev.map(v => {
          if (v.Id === activeVehicle.Id) {
            return {
              ...v,
              Lat: newLat,
              Lng: newLng,
              Speed: simSpeed,
              Angle: simAngle,
              Key: true,
              ACOnOff: true,
              TripKm: Number(((v.TripKm || 223.9) + 0.12).toFixed(1)),
              IsStop: false,
              StopTime: '00:00:00',
              TimeUpdate: new Date().toLocaleTimeString('km-KH'),
              Address: 'ផ្លូវជាតិលេខ ៦ (NR6), ខេត្តកំពង់ធំ - សៀមរាប, កម្ពុជា'
            };
          }
          return v;
        })
      );

      setRouteTrail(prev => [
        ...prev,
        {
          lat: newLat,
          lng: newLng,
          speed: simSpeed,
          angle: simAngle,
          timestamp: new Date().toISOString()
        }
      ]);
    }, 1800);

    return () => clearInterval(interval);
  }, [simulationActive, activeVehicle?.Id]);

  const handleToggleLanguage = () => {
    const nextLang = lang === 'km' ? 'en' : 'km';
    setLang(nextLang);
    localStorage.setItem(STORAGE_LANG, nextLang);
  };

  const handleMapThemeChange = (newTheme: MapTheme) => {
    setMapTheme(newTheme);
    localStorage.setItem(STORAGE_THEME, newTheme);
  };

  const handleSpeedLimitChange = (lim: number) => {
    setSpeedLimit(lim);
    localStorage.setItem(STORAGE_SPEED_LIMIT, String(lim));
  };

  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Infotainment Status & Control Bar */}
      <HeaderBar
        activeVehicle={activeVehicle}
        allVehiclesCount={vehicles.length}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        onOpenFleetDrawer={() => setIsFleetDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReactNative={() => setIsRnModalOpen(true)}
        isLoading={isLoading}
        simulationActive={simulationActive}
        onToggleSimulation={() => {
          simStepRef.current = 0;
          setSimulationActive(prev => !prev);
        }}
      />

      {/* Main Full-Screen Bus Pad Workspace (អេក្រង់គោលតែមួយគត់) */}
      <main className="flex-1 p-3 sm:p-4 flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0 h-full">
          {/* Left Cockpit Wing (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3 min-h-0 lg:overflow-y-auto pr-0.5">
            {/* 1. Precision Speedometer Cluster */}
            <SpeedometerHUD
              vehicle={activeVehicle}
              speedLimit={speedLimit}
              lang={lang}
            />

            {/* 2. Route ETA & Captain Info */}
            <DriverCard
              vehicle={activeVehicle}
              lang={lang}
              targetStopId={targetStopId}
              onChangeTargetStopId={handleChangeTargetStop}
              onRouteCalculated={route => setPlannedRoute(route)}
            />

            {/* 3. Compact 3x2 Hardware Sensor Matrix */}
            <div className="cockpit-card rounded-2xl p-3 grid grid-cols-3 gap-2">
              <div className="cockpit-inset rounded-xl p-2 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 truncate">
                    {lang === 'km' ? 'អាគុយ' : 'Battery'}
                  </div>
                  <div className="text-xs font-bold font-mono text-white">
                    {(activeVehicle.InputPower || 24.7).toFixed(1)}V
                  </div>
                </div>
              </div>

              <div className="cockpit-inset rounded-xl p-2 flex items-center gap-2">
                <KeyRound className={`w-4 h-4 shrink-0 ${activeVehicle.Key ? 'text-sky-400' : 'text-slate-500'}`} />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 truncate">
                    {lang === 'km' ? 'សោ ACC' : 'Ignition'}
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {activeVehicle.Key ? 'ON' : 'OFF'}
                  </div>
                </div>
              </div>

              <div className="cockpit-inset rounded-xl p-2 flex items-center gap-2">
                <Wind className={`w-4 h-4 shrink-0 ${activeVehicle.ACOnOff ? 'text-cyan-400' : 'text-slate-500'}`} />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 truncate">
                    {lang === 'km' ? 'ម៉ាស៊ីនត្រជាក់' : 'A/C'}
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {activeVehicle.ACOnOff ? '22°C' : 'OFF'}
                  </div>
                </div>
              </div>

              <div className="cockpit-inset rounded-xl p-2 flex items-center gap-2">
                {activeVehicle.Door ? (
                  <DoorOpen className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <DoorClosed className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 truncate">
                    {lang === 'km' ? 'ទ្វារឡាន' : 'Door'}
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {activeVehicle.Door ? (lang === 'km' ? 'បើក' : 'Open') : (lang === 'km' ? 'បិទជិត' : 'Locked')}
                  </div>
                </div>
              </div>

              <div className="cockpit-inset rounded-xl p-2 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 truncate">
                    {lang === 'km' ? 'សេវា 4G' : 'Network'}
                  </div>
                  <div className="text-xs font-bold font-mono text-emerald-400">4G LTE</div>
                </div>
              </div>

              <div className="cockpit-inset rounded-xl p-2 flex items-center gap-2">
                <Satellite className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 truncate">
                    {lang === 'km' ? 'ផ្កាយរណប' : 'GPS Fix'}
                  </div>
                  <div className="text-xs font-bold font-mono text-sky-300">Locked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Full-Height Live Navigation Map (8 Columns) */}
          <div className="lg:col-span-8 h-[480px] lg:h-full min-h-0">
            <MapView
              activeVehicle={activeVehicle}
              allVehicles={vehicles}
              routeTrail={routeTrail}
              mapTheme={mapTheme}
              onChangeMapTheme={handleMapThemeChange}
              autoFollow={autoFollow}
              onToggleAutoFollow={() => setAutoFollow(prev => !prev)}
              onSelectVehicle={v => {
                setActiveVehicleId(v.Id);
                if (soundEnabled) playChime();
              }}
              showAllVehicles={true}
              lang={lang}
              targetStopId={targetStopId}
              plannedRoute={plannedRoute}
            />
          </div>
        </div>
      </main>

      {/* Slide-Over Fleet Drawer */}
      <FleetDrawer
        isOpen={isFleetDrawerOpen}
        onClose={() => setIsFleetDrawerOpen(false)}
        vehicles={vehicles}
        activeVehicleId={activeVehicle.Id}
        onSelectVehicle={v => {
          setActiveVehicleId(v.Id);
          if (soundEnabled) playChime();
        }}
        lang={lang}
      />

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={cfg => {
          setApiConfig(cfg);
          loadGpsData();
        }}
        refreshInterval={refreshInterval}
        onChangeRefreshInterval={setRefreshInterval}
        speedLimit={speedLimit}
        onChangeSpeedLimit={handleSpeedLimitChange}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        simulationActive={simulationActive}
        onToggleSimulation={() => {
          simStepRef.current = 0;
          setSimulationActive(prev => !prev);
        }}
        lang={lang}
      />

      {/* React Native Source Code Viewer Modal */}
      <ReactNativeModal
        isOpen={isRnModalOpen}
        onClose={() => setIsRnModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
