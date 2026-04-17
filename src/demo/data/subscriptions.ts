export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'paused';
export type BillingInterval = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  customerId: string;
  productId: string;
  deviceId?: string;
  status: SubscriptionStatus;
  plan: BillingInterval;
  pricePerInterval: number;
  billingCycleDay: number; // day of month billing recurs
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  cancelEffectiveDate?: string;
  upgradedFrom?: { plan: BillingInterval; pricePerInterval: number; proratedCredit: number };
  notes?: string;
}

export const subscriptions: Subscription[] = [
  // CUST-001 (A1) — Cancelled on March 18, but billing cycle renews on the 15th.
  // Cancellation was submitted AFTER the March 15 billing cycle started,
  // so the March charge is technically legitimate per policy (cancel cutoff is 48h before cycle).
  // But customer thinks they cancelled "last month" so shouldn't be charged.
  {
    id: 'SUB-3001',
    customerId: 'CUST-001',
    productId: 'PROD-001',
    deviceId: 'DEV-4001',
    status: 'cancelled',
    plan: 'monthly',
    pricePerInterval: 9.99,
    billingCycleDay: 15,
    startDate: '2025-08-15',
    currentPeriodStart: '2026-03-15',
    currentPeriodEnd: '2026-04-15',
    cancelledAt: '2026-03-18',
    cancelEffectiveDate: '2026-04-15',
    notes:
      'Customer requested cancellation via support chat on March 18. Cancellation processed same day. Billing cycle had already renewed on March 15.',
  },

  // CUST-002 (A2) — First collar subscription (visible, active)
  {
    id: 'SUB-3002',
    customerId: 'CUST-002',
    productId: 'PROD-001',
    deviceId: 'DEV-4002',
    status: 'active',
    plan: 'monthly',
    pricePerInterval: 9.99,
    billingCycleDay: 1,
    startDate: '2025-04-01',
    currentPeriodStart: '2026-04-01',
    currentPeriodEnd: '2026-05-01',
  },
  // CUST-002 (A2) — Second collar subscription. Created with different billing day.
  // This one is "invisible" because of a UI bug that only shows the first subscription
  // per product type. But it's active and billing correctly.
  {
    id: 'SUB-3003',
    customerId: 'CUST-002',
    productId: 'PROD-001',
    deviceId: 'DEV-4003',
    status: 'active',
    plan: 'monthly',
    pricePerInterval: 9.99,
    billingCycleDay: 15,
    startDate: '2025-10-15',
    currentPeriodStart: '2026-04-15',
    currentPeriodEnd: '2026-05-15',
    notes:
      'Second Collar Pro subscription for Beagle. Customer may not see this in their dashboard due to known UI limitation showing only first subscription per product.',
  },

  // CUST-003 (A3) — Upgraded from monthly ($9.99) to annual ($99.99/yr = $8.33/mo effective).
  // But the displayed charge was $92.49 because of prorated credit for unused days in the
  // monthly cycle. Customer expected $99.99 flat or the advertised "$7.99/mo billed annually" rate.
  // The $7.99/mo rate ($95.88/yr) was a promotional price that expired.
  {
    id: 'SUB-3004',
    customerId: 'CUST-003',
    productId: 'PROD-001',
    deviceId: 'DEV-4004',
    status: 'active',
    plan: 'annual',
    pricePerInterval: 99.99,
    billingCycleDay: 1,
    startDate: '2025-10-01',
    currentPeriodStart: '2026-03-25',
    currentPeriodEnd: '2027-03-25',
    upgradedFrom: {
      plan: 'monthly',
      pricePerInterval: 9.99,
      proratedCredit: 7.5,
    },
    notes:
      'Upgraded from monthly to annual on March 25, 2026. Prorated credit of $7.50 applied for 23 unused days of monthly cycle. Charged $92.49 ($99.99 - $7.50). Promotional annual rate of $95.88 ($7.99/mo) expired Jan 2026.',
  },

  // CUST-006 (B3) — Collar Pro subscription (1 week old)
  {
    id: 'SUB-3005',
    customerId: 'CUST-006',
    productId: 'PROD-001',
    deviceId: 'DEV-4006',
    status: 'active',
    plan: 'monthly',
    pricePerInterval: 9.99,
    billingCycleDay: 10,
    startDate: '2026-04-10',
    currentPeriodStart: '2026-04-10',
    currentPeriodEnd: '2026-05-10',
  },

  // CUST-012 (D3) — Feeder doesn't have subscription, but this customer has a
  // Collar Pro subscription on a device at home (separate from the Airbnb feeder issue)
  // This is a red herring that might confuse the agent
  {
    id: 'SUB-3006',
    customerId: 'CUST-012',
    productId: 'PROD-001',
    deviceId: 'DEV-4010',
    status: 'active',
    plan: 'monthly',
    pricePerInterval: 9.99,
    billingCycleDay: 20,
    startDate: '2025-08-20',
    currentPeriodStart: '2026-04-20',
    currentPeriodEnd: '2026-05-20',
  },
];
