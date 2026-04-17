export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'investigating' | 'identified' | 'fix_available' | 'resolved';

export interface KnownIssue {
  id: string;
  productId: string;
  productName: string;
  title: string;
  severity: IssueSeverity;
  status: IssueStatus;
  affectedFirmware: string[]; // firmware versions affected
  description: string;
  workaround?: string;
  fixVersion?: string;
  reportedAt: string;
  updatedAt: string;
}

export const knownIssues: KnownIssue[] = [
  {
    id: 'ISSUE-001',
    productId: 'PROD-002',
    productName: 'Feeder 3000',
    title: 'Duplicate feeding schedule entries created via app',
    severity: 'medium',
    status: 'fix_available',
    affectedFirmware: ['3.1.0', '3.1.1', '3.1.2'],
    description:
      'When editing a feeding schedule entry in the mobile app, the app may create a duplicate entry at the same time instead of updating the existing one. This causes the feeder to dispense multiple times at the scheduled time.',
    workaround:
      'Manually check the feeding schedule in device settings and delete duplicate entries. Use the web dashboard instead of the mobile app to edit schedules.',
    fixVersion: '3.2.0',
    reportedAt: '2026-02-10',
    updatedAt: '2026-03-20',
  },
  {
    id: 'ISSUE-002',
    productId: 'PROD-004',
    productName: 'FreshBowl',
    title: 'False filter replacement alerts after new filter install',
    severity: 'medium',
    status: 'identified',
    affectedFirmware: ['1.8.0', '1.8.1', '1.8.2', '1.8.3'],
    description:
      'The flow rate sensor may report falsely low readings after a filter replacement. The sensor recalibration function does not resolve the issue. Root cause: the sensor calibration routine runs before water fully circulates through the new filter, locking in a low baseline.',
    workaround:
      'After replacing the filter, ensure the housing is fully clicked into place. Then unplug the FreshBowl for 30 seconds and plug it back in. This forces a fresh sensor calibration with proper water flow.',
    fixVersion: '1.9.0',
    reportedAt: '2026-01-25',
    updatedAt: '2026-04-05',
  },
  {
    id: 'ISSUE-003',
    productId: 'PROD-001',
    productName: 'Collar Pro',
    title: 'GPS degradation after Bluetooth pairing on firmware 2.3.x',
    severity: 'high',
    status: 'fix_available',
    affectedFirmware: ['2.3.0', '2.3.1', '2.3.2', '2.3.3', '2.3.4', '2.3.5', '2.3.6', '2.3.7', '2.3.8'],
    description:
      'On firmware 2.3.x, the GPS module may enter a degraded state after Bluetooth pairing with a phone. This causes frequent satellite acquisition timeouts and GPS module restarts. The issue persists until firmware is updated.',
    workaround:
      'Update to firmware 2.4.0 or later. As a temporary measure, restarting the collar (hold button 10s) may temporarily restore GPS function for a few hours.',
    fixVersion: '2.4.0',
    reportedAt: '2025-12-15',
    updatedAt: '2026-02-28',
  },
  {
    id: 'ISSUE-004',
    productId: 'PROD-003',
    productName: 'CatCam',
    title: 'Wi-Fi reconnection failure after router reboot',
    severity: 'low',
    status: 'fix_available',
    affectedFirmware: ['2.0.0', '2.0.1', '2.0.2', '2.0.3', '2.0.4', '2.0.5'],
    description:
      'On firmware 2.0.x, the CatCam may fail to reconnect to Wi-Fi after the router reboots. The device shows as offline until manually power-cycled.',
    workaround: 'Power cycle the CatCam (unplug and replug) after router reboots.',
    fixVersion: '2.1.0',
    reportedAt: '2026-03-01',
    updatedAt: '2026-04-01',
  },
  {
    id: 'ISSUE-005',
    productId: 'PROD-001',
    productName: 'Collar Pro',
    title: 'Dashboard shows only one subscription per product type',
    severity: 'low',
    status: 'investigating',
    affectedFirmware: [],
    description:
      'Customers with multiple devices of the same product type (e.g., two Collar Pros) only see one subscription in their dashboard. All subscriptions are billing correctly, but the UI only displays the first one found. This is a frontend issue, not a billing issue.',
    workaround:
      'Customers can verify all active subscriptions by contacting support. The billing is correct even if only one subscription is visible.',
    reportedAt: '2026-03-15',
    updatedAt: '2026-04-10',
  },
];
