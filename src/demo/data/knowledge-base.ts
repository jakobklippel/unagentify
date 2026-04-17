export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: 'policy' | 'troubleshooting' | 'faq' | 'product-guide';
  tags: string[];
  content: string;
  lastUpdated: string;
}

export const knowledgeBase: KnowledgeBaseArticle[] = [
  // Policies
  {
    id: 'KB-001',
    title: 'Return & Refund Policy',
    category: 'policy',
    tags: ['return', 'refund', 'exchange', 'warranty'],
    content: `Return Policy:
- All products can be returned within 30 days of delivery for a full refund.
- Products must be in original packaging and undamaged condition.
- Return shipping is free for defective products; customer pays return shipping for change-of-mind returns.
- Refunds are processed within 5-7 business days after receiving the return.

Exchange Policy:
- Exchanges are allowed within 30 days of delivery.
- Price differences are charged or refunded accordingly.
- Exchange shipping is free in both directions.

Warranty:
- All products come with a 1-year limited warranty covering manufacturing defects.
- Warranty does not cover physical damage, water damage (except rated products), or normal wear.
- Warranty claims require proof of purchase (order ID).`,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'KB-002',
    title: 'Subscription Cancellation Policy',
    category: 'policy',
    tags: ['subscription', 'cancellation', 'billing', 'collar pro'],
    content: `Subscription Cancellation:
- Customers can cancel their subscription at any time.
- Cancellation must be submitted at least 48 hours before the next billing cycle date to avoid being charged for the next period.
- If cancellation is submitted less than 48 hours before the billing date, the charge for the upcoming period is non-refundable but service continues until the end of that period.
- Billing cycle date is based on the original subscription start date (day of month).
- After cancellation, GPS tracking and premium features remain active until the end of the current paid period.

Prorated Refunds:
- Mid-cycle cancellations do NOT receive prorated refunds for the current period.
- Exception: if a billing error is confirmed (duplicate charge, system error), a full refund for the erroneous charge is issued.`,
    lastUpdated: '2026-02-01',
  },
  {
    id: 'KB-003',
    title: 'Subscription Upgrade & Downgrade Policy',
    category: 'policy',
    tags: ['subscription', 'upgrade', 'downgrade', 'annual', 'monthly', 'pricing'],
    content: `Plan Changes:
- Monthly to Annual: prorated credit for unused days in current monthly cycle is applied to annual price.
- Annual to Monthly: no refund for remaining annual period; monthly billing starts after annual period ends.
- Price changes take effect immediately upon upgrade.

Pricing:
- Monthly plan: $9.99/month per device.
- Annual plan: $99.99/year per device ($8.33/month effective).
- Promotional pricing: $95.88/year ($7.99/month) was available through January 31, 2026. This promotion has ended and cannot be honored for new upgrades.

Multiple Devices:
- Each device requires its own subscription.
- No multi-device discount is currently available.`,
    lastUpdated: '2026-02-15',
  },
  {
    id: 'KB-004',
    title: 'Shipping Policy',
    category: 'policy',
    tags: ['shipping', 'delivery', 'tracking', 'lost package'],
    content: `Shipping:
- Standard shipping: 3-5 business days (free on orders over $100).
- Express shipping: 1-2 business days ($12.99).
- Orders may be split into multiple shipments if items ship from different warehouses.
- Each shipment has its own tracking number.

Lost/Missing Packages:
- If tracking shows "delivered" but customer did not receive the package, initiate a carrier investigation.
- Carrier investigation takes 5-10 business days.
- If the investigation confirms the package is lost, issue a full refund or free replacement (customer's choice).
- For split shipments, verify each shipment's tracking independently — one may be delivered while another is still in transit.`,
    lastUpdated: '2026-01-20',
  },
  {
    id: 'KB-005',
    title: 'Bulk & Business Orders',
    category: 'policy',
    tags: ['bulk', 'business', 'wholesale', 'custom', 'engraving'],
    content: `Bulk Orders:
- Orders of 10+ units qualify for bulk pricing (contact sales@pawpal.com).
- Bulk orders are NOT handled through standard support — escalate to the sales team.
- Custom engraving is available for Collar Pro only, minimum order 5 units, +$15 per unit.
- Bulk orders typically ship within 10-15 business days.
- No returns on custom/engraved items.

Business Accounts:
- Business customers should register at business.pawpal.com for net-30 payment terms.
- Standard support agents cannot create business accounts or negotiate pricing.`,
    lastUpdated: '2025-12-01',
  },

  // Troubleshooting
  {
    id: 'KB-101',
    title: 'Collar Pro — GPS Not Syncing',
    category: 'troubleshooting',
    tags: ['collar pro', 'gps', 'sync', 'location', 'tracking'],
    content: `Troubleshooting GPS Sync Issues:

1. Check firmware version — GPS improvements were made in v2.4.0+. If below 2.4.0, recommend firmware update.
2. Check if the collar has clear sky visibility. GPS does not work well indoors or under dense tree cover.
3. Restart the collar: hold the button for 10 seconds until the LED flashes red, then release.
4. Check subscription status — GPS requires an active subscription.
5. If firmware is current and subscription is active, check device logs for "satellite acquisition timeout" errors.
   - Occasional timeouts (1-2 per day) are normal in urban areas.
   - Frequent timeouts (3+ per day) or "GPS module restart" events indicate a hardware issue.
6. For hardware GPS issues: offer warranty replacement if within 1 year of purchase.

Known Issue: Firmware 2.3.x has a bug where GPS module may enter a degraded state after Bluetooth pairing. Fixed in 2.4.0. Recommend update.`,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'KB-102',
    title: 'Feeder 3000 — Dispensing Issues',
    category: 'troubleshooting',
    tags: ['feeder 3000', 'dispensing', 'schedule', 'portion', 'feeding'],
    content: `Troubleshooting Dispensing Issues:

Multiple Dispensing:
1. Check feeding schedule in device config — duplicate time entries will each trigger a separate dispense.
2. Firmware 3.1.x has a known bug where the app may create duplicate schedule entries when editing. Check for duplicate entries at the same time. Fixed in firmware 3.2.0.
3. If schedule looks correct but device is still multi-dispensing, check for "Dispensing" log entries to confirm the exact count and timing.

No Dispensing:
1. Check if food hopper is empty or jammed.
2. Verify schedule entries are "enabled: true".
3. Check device is online and connected to Wi-Fi.
4. Try a manual dispense via the app to test the motor.

Wrong Portion Size:
1. Portion sizes are calibrated for standard dry kibble. Larger kibble or wet food may result in different actual amounts.
2. Recalibrate by running 3 test dispenses and weighing the output.`,
    lastUpdated: '2026-03-15',
  },
  {
    id: 'KB-103',
    title: 'FreshBowl — Filter Sensor Issues',
    category: 'troubleshooting',
    tags: ['freshbowl', 'filter', 'sensor', 'replacement', 'flow rate'],
    content: `Troubleshooting Filter Sensor:

"Filter Replacement Needed" After New Filter:
1. Verify customer actually purchased and installed a genuine PawPal replacement filter (check order history).
2. Check if filter was properly seated — the housing must click into place. A partially seated filter restricts flow and triggers the sensor.
3. Firmware 1.8.x known issue: flow rate sensor can give false low readings after filter replacement if housing is not fully seated. Sensor recalibration via the app does not fix this — the filter must be physically reseated.
4. If filter is confirmed seated and sensor still reads low: possible defective flow rate sensor. Offer warranty replacement.

Filter Replacement Interval:
- Recommended every 3 months for single-pet households.
- Every 2 months for multi-pet households.
- "Filter age" alerts are based on time since last reset, not actual flow measurement.`,
    lastUpdated: '2026-03-10',
  },
  {
    id: 'KB-104',
    title: 'CatCam — Connectivity Issues',
    category: 'troubleshooting',
    tags: ['catcam', 'offline', 'wifi', 'connection', 'power saving'],
    content: `Troubleshooting CatCam Going Offline:

Scheduled Offline (Power Saving Mode):
1. Check device config for power saving settings. When enabled, the camera and Wi-Fi are disabled during the configured schedule.
2. Many customers enable power saving without realizing it disables the camera entirely during those hours.
3. To check: look at device config > powerSaving > schedule. If the offline times match the power saving schedule, this is the cause.
4. Resolution: disable power saving mode or adjust the schedule to the customer's preference.

Random Disconnections:
1. Check Wi-Fi signal strength — CatCam requires stable 2.4GHz connection.
2. Check for firmware updates (current latest: 2.1.0).
3. Check router settings — some routers drop idle connections. Enable "always on" for the CatCam's MAC address.
4. If on firmware 2.0.x, known issue with Wi-Fi reconnection after router reboot. Fixed in 2.1.0.`,
    lastUpdated: '2026-04-01',
  },
  {
    id: 'KB-105',
    title: 'BarkBox — Temperature Sensor Issues',
    category: 'troubleshooting',
    tags: ['barkbox', 'temperature', 'sensor', 'heater', 'climate'],
    content: `Troubleshooting Temperature Sensor:

Anomalous Readings (>120°F or <-10°F):
1. These are almost certainly sensor malfunctions, not actual temperatures.
2. Check device logs for pattern — if anomalous readings only occur at certain times, could be heat buildup from direct sunlight on the sensor.
3. If readings are consistently wrong: defective temperature sensor. Covered under warranty.
4. Safety feature: heater automatically disables when sensor reads >100°F to prevent overheating. This means if the sensor is faulty, the heater may not work.

Firmware 1.2.x:
- No known firmware issues affecting temperature readings.
- Latest firmware is 1.3.0 — includes improved sensor averaging (reads every 30s instead of every 5min). Recommend update.`,
    lastUpdated: '2026-02-20',
  },
  {
    id: 'KB-106',
    title: 'Privacy & Camera Complaints',
    category: 'policy',
    tags: ['privacy', 'camera', 'complaint', 'neighbor', 'catcam'],
    content: `Camera Privacy Policy:
- PawPal cameras are designed for indoor pet monitoring only.
- PawPal is not responsible for how customers position their cameras.
- If a non-customer complains about a camera pointed at their property, we cannot:
  - Confirm or deny whether the address has a PawPal device.
  - Remotely disable or adjust a customer's camera.
  - Share customer information with the complainant.
- Advise the complainant to contact their local authorities if they believe their privacy is being violated.
- If the complainant insists, offer to forward their concern to our legal team (legal@pawpal.com) but set clear expectations that we cannot take immediate action.`,
    lastUpdated: '2025-11-15',
  },

  // FAQs
  {
    id: 'KB-201',
    title: 'How to Transfer Device Ownership',
    category: 'faq',
    tags: ['transfer', 'ownership', 'device', 'account'],
    content: `Device Ownership Transfer:
- The current owner must initiate the transfer from their account settings.
- A transfer request is sent to the new owner's email.
- Once accepted, all device data, settings, and warranty transfer to the new account.
- Subscriptions do NOT transfer — the new owner must set up their own subscription.
- If the original owner cannot be reached (e.g., purchased secondhand), contact support with proof of purchase for manual transfer. This requires manager approval and takes 3-5 business days.

Remote Disable:
- Account owners can remotely factory reset their devices via the app.
- This wipes all settings and disconnects the device from Wi-Fi.
- The device can then be set up fresh by anyone with physical access.`,
    lastUpdated: '2026-01-10',
  },
];
