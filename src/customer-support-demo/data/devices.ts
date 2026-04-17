export type DeviceStatus = 'online' | 'offline' | 'intermittent';

export interface DeviceLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface FeedingScheduleEntry {
  time: string; // HH:mm
  portionSize: 'small' | 'medium' | 'large';
  enabled: boolean;
}

export interface Device {
  id: string;
  customerId: string;
  productId: string;
  orderId: string;
  name: string;
  firmwareVersion: string;
  lastOnline: string;
  status: DeviceStatus;
  registeredAt: string;
  config: Record<string, unknown>;
  recentLogs: DeviceLogEntry[];
  notes?: string;
}

export const devices: Device[] = [
  // CUST-001 (A1) — Collar Pro
  {
    id: 'DEV-4001',
    customerId: 'CUST-001',
    productId: 'PROD-001',
    orderId: 'ORD-1001',
    name: "Buddy's Collar",
    firmwareVersion: '2.4.1',
    lastOnline: '2026-03-18T14:22:00Z',
    status: 'offline',
    registeredAt: '2025-08-15',
    config: { gpsInterval: 300, geofenceRadius: 500, activityTracking: true },
    recentLogs: [
      {
        timestamp: '2026-03-18T14:22:00Z',
        level: 'info',
        message: 'Subscription service disconnected — plan cancelled',
      },
      { timestamp: '2026-03-18T14:20:00Z', level: 'info', message: 'GPS tracking stopped' },
    ],
  },

  // CUST-002 (A2) — Two Collar Pros
  {
    id: 'DEV-4002',
    customerId: 'CUST-002',
    productId: 'PROD-001',
    orderId: 'ORD-1002',
    name: "Max's Collar",
    firmwareVersion: '2.4.1',
    lastOnline: '2026-04-17T08:00:00Z',
    status: 'online',
    registeredAt: '2025-04-05',
    config: { gpsInterval: 120, geofenceRadius: 1000, activityTracking: true },
    recentLogs: [{ timestamp: '2026-04-17T08:00:00Z', level: 'info', message: 'GPS fix acquired' }],
  },
  {
    id: 'DEV-4003',
    customerId: 'CUST-002',
    productId: 'PROD-001',
    orderId: 'ORD-1003',
    name: "Penny's Collar",
    firmwareVersion: '2.4.1',
    lastOnline: '2026-04-17T08:05:00Z',
    status: 'online',
    registeredAt: '2025-10-19',
    config: { gpsInterval: 120, geofenceRadius: 800, activityTracking: true },
    recentLogs: [{ timestamp: '2026-04-17T08:05:00Z', level: 'info', message: 'GPS fix acquired' }],
  },

  // CUST-003 (A3) — Collar Pro
  {
    id: 'DEV-4004',
    customerId: 'CUST-003',
    productId: 'PROD-001',
    orderId: 'ORD-1004',
    name: "Luna's Collar",
    firmwareVersion: '2.4.1',
    lastOnline: '2026-04-17T07:30:00Z',
    status: 'online',
    registeredAt: '2025-10-04',
    config: { gpsInterval: 300, geofenceRadius: 500, activityTracking: true },
    recentLogs: [{ timestamp: '2026-04-17T07:30:00Z', level: 'info', message: 'GPS fix acquired' }],
  },

  // CUST-006 (B3) — BarkBox (3 months old, temp sensor issue)
  {
    id: 'DEV-4005',
    customerId: 'CUST-006',
    productId: 'PROD-005',
    orderId: 'ORD-1007',
    name: "Duke's BarkBox",
    firmwareVersion: '1.2.0',
    lastOnline: '2026-04-17T06:00:00Z',
    status: 'online',
    registeredAt: '2026-01-14',
    config: { targetTemp: 72, mode: 'auto', fanSpeed: 'medium', heaterEnabled: true },
    recentLogs: [
      {
        timestamp: '2026-04-17T06:00:00Z',
        level: 'error',
        message: 'Temperature sensor reading: 145°F — value out of expected range (possible sensor malfunction)',
      },
      {
        timestamp: '2026-04-17T05:55:00Z',
        level: 'warn',
        message: 'Heater disabled due to anomalous temperature reading',
      },
      {
        timestamp: '2026-04-16T18:00:00Z',
        level: 'error',
        message: 'Temperature sensor reading: 138°F — value out of expected range',
      },
      { timestamp: '2026-04-16T06:00:00Z', level: 'info', message: 'Temperature sensor reading: 68°F — normal' },
    ],
  },
  // CUST-006 (B3) — Collar Pro (1 week old, GPS sync issue)
  {
    id: 'DEV-4006',
    customerId: 'CUST-006',
    productId: 'PROD-001',
    orderId: 'ORD-1008',
    name: "Duke's Collar",
    firmwareVersion: '2.3.8',
    lastOnline: '2026-04-17T07:00:00Z',
    status: 'intermittent',
    registeredAt: '2026-04-10',
    config: { gpsInterval: 300, geofenceRadius: 500, activityTracking: true },
    recentLogs: [
      { timestamp: '2026-04-17T07:00:00Z', level: 'warn', message: 'GPS sync failed — satellite acquisition timeout' },
      { timestamp: '2026-04-16T19:00:00Z', level: 'warn', message: 'GPS sync failed — satellite acquisition timeout' },
      { timestamp: '2026-04-16T12:00:00Z', level: 'info', message: 'GPS fix acquired (took 45s, expected <10s)' },
      {
        timestamp: '2026-04-15T08:00:00Z',
        level: 'error',
        message: 'GPS module restart triggered after 3 consecutive sync failures',
      },
    ],
  },

  // CUST-007 (C1) — Feeder 3000 (triple dispense bug)
  {
    id: 'DEV-4007',
    customerId: 'CUST-007',
    productId: 'PROD-002',
    orderId: 'ORD-1009',
    name: "Whiskers' Feeder",
    firmwareVersion: '3.1.2',
    lastOnline: '2026-04-17T07:00:00Z',
    status: 'online',
    registeredAt: '2025-12-19',
    config: {
      feedingSchedule: [
        { time: '07:00', portionSize: 'medium', enabled: true },
        { time: '07:00', portionSize: 'medium', enabled: true },
        { time: '07:00', portionSize: 'medium', enabled: true },
        { time: '18:00', portionSize: 'medium', enabled: true },
      ] satisfies FeedingScheduleEntry[],
      cameraEnabled: true,
      motionAlerts: false,
    },
    recentLogs: [
      { timestamp: '2026-04-17T07:00:30Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 3/4)' },
      { timestamp: '2026-04-17T07:00:20Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 2/4)' },
      { timestamp: '2026-04-17T07:00:10Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 1/4)' },
      { timestamp: '2026-04-16T18:00:10Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 4/4)' },
      { timestamp: '2026-04-16T07:00:30Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 3/4)' },
      { timestamp: '2026-04-16T07:00:20Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 2/4)' },
      { timestamp: '2026-04-16T07:00:10Z', level: 'info', message: 'Dispensing: medium portion (schedule entry 1/4)' },
    ],
    notes:
      'Customer likely duplicated the 07:00 schedule entry via the app. Firmware 3.1.2 has a known bug where duplicate schedule times are not deduplicated. Fixed in 3.2.0.',
  },

  // CUST-008 (C2) — FreshBowl (filter sensor false positive)
  {
    id: 'DEV-4008',
    customerId: 'CUST-008',
    productId: 'PROD-004',
    orderId: 'ORD-1010',
    name: "Milo's FreshBowl",
    firmwareVersion: '1.8.3',
    lastOnline: '2026-04-17T06:30:00Z',
    status: 'online',
    registeredAt: '2025-09-04',
    config: { filterAlertEnabled: true, waterLevelAlert: true, cleaningReminder: 'weekly' },
    recentLogs: [
      {
        timestamp: '2026-04-17T06:30:00Z',
        level: 'warn',
        message: 'Filter replacement needed — flow rate below threshold (measured: 0.3 L/min, threshold: 0.5 L/min)',
      },
      { timestamp: '2026-04-10T10:00:00Z', level: 'info', message: 'Filter reset acknowledged — new filter detected' },
      { timestamp: '2026-04-10T09:55:00Z', level: 'info', message: 'Filter sensor recalibrated' },
      {
        timestamp: '2026-04-03T12:00:00Z',
        level: 'info',
        message: 'Filter replacement reminder — filter age: 6 months',
      },
    ],
    notes:
      'Firmware 1.8.3 has a known issue where the flow rate sensor can give false low readings after filter replacement if the filter housing is not fully seated. Sensor recalibration does not fix the root cause.',
  },

  // CUST-009 (C3) — CatCam (offline every evening at 7pm)
  {
    id: 'DEV-4009',
    customerId: 'CUST-009',
    productId: 'PROD-003',
    orderId: 'ORD-1012',
    name: 'Mittens Cam',
    firmwareVersion: '2.0.5',
    lastOnline: '2026-04-17T06:45:00Z',
    status: 'online',
    registeredAt: '2026-03-04',
    config: {
      resolution: '1080p',
      nightVision: true,
      treatDispenser: true,
      laserPointer: true,
      powerSaving: { enabled: true, schedule: { start: '19:00', end: '07:00' } },
    },
    recentLogs: [
      { timestamp: '2026-04-17T06:45:00Z', level: 'info', message: 'Device online — power saving mode ended' },
      {
        timestamp: '2026-04-16T19:00:00Z',
        level: 'info',
        message: 'Entering power saving mode — camera and Wi-Fi disabled',
      },
      { timestamp: '2026-04-16T06:45:00Z', level: 'info', message: 'Device online — power saving mode ended' },
      {
        timestamp: '2026-04-15T19:00:00Z',
        level: 'info',
        message: 'Entering power saving mode — camera and Wi-Fi disabled',
      },
      { timestamp: '2026-04-15T06:45:00Z', level: 'info', message: 'Device online — power saving mode ended' },
      {
        timestamp: '2026-04-14T19:00:00Z',
        level: 'info',
        message: 'Entering power saving mode — camera and Wi-Fi disabled',
      },
    ],
  },

  // CUST-012 (D3) — Feeder 3000 in Airbnb (still online, being used by guests)
  {
    id: 'DEV-4010-FEEDER',
    customerId: 'CUST-012',
    productId: 'PROD-002',
    orderId: 'ORD-1013',
    name: 'Travel Feeder',
    firmwareVersion: '3.2.0',
    lastOnline: '2026-04-17T08:00:00Z',
    status: 'online',
    registeredAt: '2025-11-24',
    config: {
      feedingSchedule: [
        { time: '08:00', portionSize: 'large', enabled: true },
        { time: '18:00', portionSize: 'large', enabled: true },
      ] satisfies FeedingScheduleEntry[],
      cameraEnabled: true,
      motionAlerts: true,
    },
    recentLogs: [
      { timestamp: '2026-04-17T08:00:10Z', level: 'info', message: 'Dispensing: large portion' },
      { timestamp: '2026-04-16T18:00:10Z', level: 'info', message: 'Dispensing: large portion' },
      { timestamp: '2026-04-16T08:00:10Z', level: 'info', message: 'Dispensing: large portion' },
      { timestamp: '2026-04-15T20:30:00Z', level: 'info', message: 'Manual dispense triggered via app' },
    ],
    notes: "Device is still actively being used. Last manual dispense was not from the account owner's known IP.",
  },
  // CUST-012 — Collar Pro at home (red herring for D3)
  {
    id: 'DEV-4010',
    customerId: 'CUST-012',
    productId: 'PROD-001',
    orderId: 'ORD-1013',
    name: "Rocky's Collar",
    firmwareVersion: '2.4.1',
    lastOnline: '2026-04-17T07:45:00Z',
    status: 'online',
    registeredAt: '2025-08-20',
    config: { gpsInterval: 300, geofenceRadius: 500, activityTracking: true },
    recentLogs: [{ timestamp: '2026-04-17T07:45:00Z', level: 'info', message: 'GPS fix acquired' }],
  },
];
