export interface GpsVehicle {
  Id: string;
  Plate: string;
  GroupId: number;
  GroupName: string;
  Lat: number;
  Lng: number;
  Speed: number;
  Km: number;
  Gsm: boolean;
  Gps: boolean;
  Key: boolean;
  Door: boolean;
  Temper: string;
  Temper2: string;
  Fuel: number;
  DriverName: string;
  Liciense: string;
  TimeUpdate: string;
  Address: string;
  InputPower: number;
  TripKm: number;
  IsStop: boolean;
  StopTime: string;
  StopCounter: number;
  Angle: number;
  ACOnOff: boolean;
  IsOverSpeed: boolean;
  OverSpeedCount: number;
  BeginStop: string;
  DayDrivingTime: number; // minutes
  DrivingTime: number; // minutes
  Over10h: number;
  Over4h: number;
  VehicleType: string;
  SheeatsOrTons: string;
  HongNgoai: boolean;
  Serial: string;
}

export interface GpsApiResponse {
  Data: GpsVehicle[];
  Status?: number;
  Message?: string;
}

export type ViewMode = 'bus_pad' | 'passenger_pids' | 'driver_hud' | 'fleet_overview';

export type MapTheme = 'dark' | 'streets' | 'satellite';

export type Language = 'km' | 'en';

export interface RouteBreadcrumb {
  lat: number;
  lng: number;
  speed: number;
  angle: number;
  timestamp: string;
}

export interface CambodiaStop {
  id: string;
  nameKm: string;
  nameEn: string;
  provinceKm: string;
  provinceEn: string;
  lat: number;
  lng: number;
}
