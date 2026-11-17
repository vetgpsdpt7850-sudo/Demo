import { GpsVehicle, GpsApiResponse, RouteBreadcrumb } from '../types/gps';

// Realistic fallback snapshot from Adsun GPS system in Cambodia
export const FALLBACK_VEHICLES: GpsVehicle[] = [
  {
    Id: "A49  (3G-8311)",
    Plate: "A49  (3G-8311)",
    GroupId: 13992,
    GroupName: "Group AIRBUS",
    Lat: 12.1586866,
    Lng: 105.120224,
    Speed: 64.0,
    Km: 227.15,
    Gsm: true,
    Gps: true,
    Key: true,
    Door: true,
    Temper: "",
    Temper2: "",
    Fuel: 0.0,
    DriverName: "SIN VOEUN",
    Liciense: "D2KCHH00001460",
    TimeUpdate: "2026/11/12 17:25:57",
    Address: "NR6, Kampong Cham / Kampong Thom border, Cambodia.",
    InputPower: 27.1,
    TripKm: 223.9,
    IsStop: false,
    StopTime: "00:00:00",
    StopCounter: 12,
    Angle: 208,
    ACOnOff: true,
    IsOverSpeed: false,
    OverSpeedCount: 0,
    BeginStop: "2000-01-01T00:00:00",
    DayDrivingTime: 236,
    DrivingTime: 100,
    Over10h: 0,
    Over4h: 0,
    VehicleType: "Bus Airbus 45 Seats",
    SheeatsOrTons: "45G",
    HongNgoai: false,
    Serial: "250310942"
  },
  {
    Id: "32",
    Plate: "A32(3G-7708)",
    GroupId: 13992,
    GroupName: "Group AIRBUS",
    Lat: 11.5847588,
    Lng: 104.9161,
    Speed: 25.0,
    Km: 498.02,
    Gsm: true,
    Gps: true,
    Key: true,
    Door: true,
    Temper: "",
    Temper2: "",
    Fuel: 0.0,
    DriverName: "MORN VANNA",
    Liciense: "D2TKH0003366",
    TimeUpdate: "2026/11/12 17:26:09",
    Address: "Old Stadium Roundabout Bus Stop, រង្វង់មូលជ្រោយចង្វារខាងលិច, Phnom Penh, Cambodia.",
    InputPower: 27.2,
    TripKm: 495.6,
    IsStop: false,
    StopTime: "00:00:00",
    StopCounter: 10,
    Angle: 138,
    ACOnOff: true,
    IsOverSpeed: false,
    OverSpeedCount: 0,
    BeginStop: "2000-01-01T00:00:00",
    DayDrivingTime: 180,
    DrivingTime: 45,
    Over10h: 0,
    Over4h: 0,
    VehicleType: "Bus Airbus 45 Seats",
    SheeatsOrTons: "45G",
    HongNgoai: false,
    Serial: "250412982"
  },
  {
    Id: "66",
    Plate: "VIP66(3F-5804)",
    GroupId: 14706,
    GroupName: "Group VIP VAN",
    Lat: 13.34226,
    Lng: 103.883934,
    Speed: 42.0,
    Km: 544.998,
    Gsm: true,
    Gps: true,
    Key: true,
    Door: true,
    Temper: "",
    Temper2: "",
    Fuel: 0.0,
    DriverName: "THOEURN SAM AT",
    Liciense: "D2TKH00008849",
    TimeUpdate: "2026/11/12 17:25:43",
    Address: "Chea Sim Street, Chreav, Siem Reap, Cambodia.",
    InputPower: 13.2,
    TripKm: 130.6,
    IsStop: false,
    StopTime: "00:00:00",
    StopCounter: 14,
    Angle: 114,
    ACOnOff: true,
    IsOverSpeed: false,
    OverSpeedCount: 0,
    BeginStop: "2000-01-01T00:00:00",
    DayDrivingTime: 476,
    DrivingTime: 112,
    Over10h: 0,
    Over4h: 1,
    VehicleType: "Minivan 15 Seats",
    SheeatsOrTons: "15G",
    HongNgoai: false,
    Serial: "840617164"
  },
  {
    Id: "2BO-7638",
    Plate: "VIP59 (2BO-7638)",
    GroupId: 14706,
    GroupName: "Group VIP VAN",
    Lat: 11.3177271,
    Lng: 104.124924,
    Speed: 52.0,
    Km: 47.582,
    Gsm: true,
    Gps: true,
    Key: true,
    Door: true,
    Temper: "",
    Temper2: "",
    Fuel: 0.0,
    DriverName: "HENG VICHET",
    Liciense: "D2SR00009812",
    TimeUpdate: "2026/11/12 17:24:53",
    Address: "Street 46, Chambak, Phnum Sruoch, Kampong Speu, Cambodia.",
    InputPower: 14.3,
    TripKm: 11.4,
    IsStop: false,
    StopTime: "00:00:00",
    StopCounter: 16,
    Angle: 295,
    ACOnOff: true,
    IsOverSpeed: false,
    OverSpeedCount: 0,
    BeginStop: "2000-01-01T00:00:00",
    DayDrivingTime: 64,
    DrivingTime: 13,
    Over10h: 0,
    Over4h: 0,
    VehicleType: "Minivan 15 Seats",
    SheeatsOrTons: "15G",
    HongNgoai: false,
    Serial: "651190583"
  },
  {
    Id: "L47",
    Plate: "L47 (3G-6500)",
    GroupId: 13994,
    GroupName: "Group BUS L",
    Lat: 10.65108,
    Lng: 103.535156,
    Speed: 0.0,
    Km: 422.842,
    Gsm: true,
    Gps: true,
    Key: false,
    Door: true,
    Temper: "",
    Temper2: "",
    Fuel: 0.0,
    DriverName: "PHON SOPHEAB",
    Liciense: "D2PP00007373",
    TimeUpdate: "2026/11/12 17:17:04",
    Address: "ព្រះសីហនុ, Sihanoukville, កម្ពុជា.",
    InputPower: 24.7,
    TripKm: 0.0,
    IsStop: true,
    StopTime: "09:39:00",
    StopCounter: 4,
    Angle: 180,
    ACOnOff: false,
    IsOverSpeed: false,
    OverSpeedCount: 1,
    BeginStop: "2026-11-12T07:46:58",
    DayDrivingTime: 211,
    DrivingTime: 0,
    Over10h: 0,
    Over4h: 0,
    VehicleType: "Bus Airbus",
    SheeatsOrTons: "45G",
    HongNgoai: false,
    Serial: "251201901"
  },
  {
    Id: "VIP177",
    Plate: "VIP177(2AA-3472)",
    GroupId: 14706,
    GroupName: "Group VIP VAN",
    Lat: 13.09689,
    Lng: 103.207771,
    Speed: 0.0,
    Km: 288.749,
    Gsm: true,
    Gps: true,
    Key: true,
    Door: true,
    Temper: "",
    Temper2: "",
    Fuel: 0.0,
    DriverName: "CHEA VANNA",
    Liciense: "D2KD00004349",
    TimeUpdate: "2026/11/12 17:21:51",
    Address: "AH1, 021403 Battambang, Cambodia",
    InputPower: 13.0,
    TripKm: 0.1,
    IsStop: true,
    StopTime: "00:14:00",
    StopCounter: 20,
    Angle: 158,
    ACOnOff: false,
    IsOverSpeed: false,
    OverSpeedCount: 0,
    BeginStop: "2026-11-12T17:11:45",
    DayDrivingTime: 236,
    DrivingTime: 0,
    Over10h: 0,
    Over4h: 0,
    VehicleType: "Minivan 15 Seats",
    SheeatsOrTons: "15G",
    HongNgoai: false,
    Serial: "639875999"
  }
];

export interface ApiConfig {
  pageIds: string;
  username: string;
  pwd: string;
}

const DEFAULT_CONFIG: ApiConfig = {
  pageIds: '6208',
  username: 'vetadmin',
  pwd: '12345'
};

const BREADCRUMBS_STORAGE_KEY = 'buspad_breadcrumbs_';

// Save breadcrumbs for a vehicle
export function saveBreadcrumbs(vehicleId: string, trail: RouteBreadcrumb[]) {
  try {
    const limited = trail.slice(-100); // keep last 100 coordinates
    localStorage.setItem(BREADCRUMBS_STORAGE_KEY + vehicleId, JSON.stringify(limited));
  } catch {
    // ignore
  }
}

// Load saved breadcrumbs
export function loadBreadcrumbs(vehicleId: string): RouteBreadcrumb[] {
  try {
    const data = localStorage.getItem(BREADCRUMBS_STORAGE_KEY + vehicleId);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Fetch live GPS tracking data
 */
export async function fetchLiveGpsData(config: ApiConfig = DEFAULT_CONFIG): Promise<{ vehicles: GpsVehicle[]; isFallback: boolean; error?: string }> {
  const query = `pageIds=${encodeURIComponent(config.pageIds)}&username=${encodeURIComponent(config.username)}&pwd=${encodeURIComponent(config.pwd)}`;

  // First try the local proxy route (/api/gps)
  try {
    const response = await fetch(`/api/gps?${query}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data: GpsApiResponse = await response.json();
      if (Array.isArray(data.Data) && data.Data.length > 0) {
        return { vehicles: data.Data, isFallback: false };
      }
    }
  } catch (proxyErr) {
    console.warn('Proxy fetch failed, trying direct external URL...', proxyErr);
  }

  // Next try direct external endpoint
  try {
    const directUrl = `https://shareapi.adsun.vn/Vehicle/GpsInfos?${query}`;
    const directRes = await fetch(directUrl);
    if (directRes.ok) {
      const data: GpsApiResponse = await directRes.json();
      if (Array.isArray(data.Data) && data.Data.length > 0) {
        return { vehicles: data.Data, isFallback: false };
      }
    }
  } catch (directErr) {
    console.warn('Direct fetch failed due to CORS or network:', directErr);
  }

  // Graceful fallback to real snapshot
  return {
    vehicles: FALLBACK_VEHICLES,
    isFallback: true,
    error: 'Using real cached GPS snapshot (offline or API network restricted)'
  };
}
