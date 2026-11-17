import React, { useState } from 'react';
import { Language } from '../types/gps';
import { X, Copy, Check, Smartphone, Terminal } from 'lucide-react';

interface ReactNativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const REACT_NATIVE_CODE = `// App.tsx - React Native (Expo / CLI) Bus Pad Live GPS Tracker
// Install: npx expo install react-native-maps lucide-react-native react-native-svg
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const API_URL = 'https://shareapi.adsun.vn/Vehicle/GpsInfos?pageIds=6208&username=vetadmin&pwd=12345';

export default function BusPadApp() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState('A49  (3G-8311)');
  const [trail, setTrail] = useState([]);
  const mapRef = useRef(null);

  const fetchGps = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json?.Data?.length) {
        setVehicles(json.Data);
        const active = json.Data.find(v => v.Id === selectedId) || json.Data[0];
        if (active?.Lat && active?.Lng) {
          const coord = { latitude: active.Lat, longitude: active.Lng };
          setTrail(prev => [...prev.slice(-80), coord]);
          mapRef.current?.animateCamera({
            center: coord,
            heading: active.Angle || 0,
            pitch: 45,
            zoom: 15,
          }, { duration: 1000 });
        }
      }
    } catch (err) {
      console.warn('GPS Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchGps();
    const timer = setInterval(fetchGps, 5000);
    return () => clearInterval(timer);
  }, [selectedId]);

  const activeBus = vehicles.find(v => v.Id === selectedId) || vehicles[0] || {
    Plate: 'A49 (3G-8311)', Speed: 64, Lat: 12.1586, Lng: 105.1202,
    Angle: 208, DriverName: 'SIN VOEUN', Address: 'NR6, Cambodia', InputPower: 27.1, ACOnOff: true
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />
      <View style={styles.mainLayout}>
        {/* Left Cockpit Panel (Bus Pad Tablet) */}
        <View style={styles.leftPanel}>
          <Text style={styles.plateTitle}>{activeBus.Plate}</Text>
          <Text style={styles.driverSub}>អ្នកបើកបរ: {activeBus.DriverName}</Text>

          <View style={styles.speedCircle}>
            <Text style={styles.speedNumber}>{Math.round(activeBus.Speed || 0)}</Text>
            <Text style={styles.speedUnit}>គ.ម/ម៉ោង (KM/H)</Text>
          </View>

          <View style={styles.telemetryGrid}>
            <View style={styles.sensorBox}>
              <Text style={styles.sensorLabel}>អាគុយ (Battery)</Text>
              <Text style={styles.sensorValue}>{activeBus.InputPower} V</Text>
            </View>
            <View style={styles.sensorBox}>
              <Text style={styles.sensorLabel}>ម៉ាស៊ីនត្រជាក់</Text>
              <Text style={styles.sensorValue}>{activeBus.ACOnOff ? 'ON' : 'OFF'}</Text>
            </View>
          </View>
        </View>

        {/* Right Full-Screen Live Map */}
        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: activeBus.Lat || 12.1586,
              longitude: activeBus.Lng || 105.1202,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
          >
            {trail.length > 1 && (
              <Polyline coordinates={trail} strokeColor="#0ea5e9" strokeWidth={5} />
            )}
            <Marker
              coordinate={{ latitude: activeBus.Lat || 12.1586, longitude: activeBus.Lng || 105.1202 }}
              rotation={activeBus.Angle || 0}
              title={activeBus.Plate}
              description={activeBus.Address}
            />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070b14' },
  mainLayout: { flex: 1, flexDirection: 'row', padding: 12, gap: 12 },
  leftPanel: { width: 340, backgroundColor: '#0f172a', borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  plateTitle: { color: '#38bdf8', fontSize: 22, fontWeight: '800' },
  driverSub: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  speedCircle: { alignSelf: 'center', width: 200, height: 200, borderRadius: 100, borderWidth: 8, borderColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  speedNumber: { color: '#ffffff', fontSize: 64, fontWeight: '900' },
  speedUnit: { color: '#38bdf8', fontSize: 12, fontWeight: '700', marginTop: 4 },
  telemetryGrid: { flexDirection: 'row', gap: 10 },
  sensorBox: { flex: 1, backgroundColor: '#070b14', padding: 12, borderRadius: 16 },
  sensorLabel: { color: '#64748b', fontSize: 11 },
  sensorValue: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginTop: 4 },
  mapWrap: { flex: 1, borderRadius: 24, overflow: 'hidden' }
});`;

export const ReactNativeModal: React.FC<ReactNativeModalProps> = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(REACT_NATIVE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-3xl pad-surface rounded-3xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'km' ? 'កូដ React Native សម្រាប់ដាក់លើ Bus Pad Tablet' : 'React Native (Expo) Source Code'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'km'
                  ? 'ភ្ជាប់ស្រាប់ជាមួយ API Adsun GPS & react-native-maps សម្រាប់ Android / iOS Tablet'
                  : 'Ready-to-run React Native code with react-native-maps and Adsun GPS API'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === 'km' ? 'បានចម្លង!' : 'Copied!') : (lang === 'km' ? 'ចម្លងកូដ' : 'Copy Code')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/90 border-b border-white/10 flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Terminal className="w-4 h-4 shrink-0" />
          <span>npx create-expo-app BusPadTracker && npx expo install react-native-maps</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-[#05080f]">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto select-text">
            <code>{REACT_NATIVE_CODE}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
