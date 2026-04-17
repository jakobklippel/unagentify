export type CustomerTier = 'basic' | 'plus' | 'premium';

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  tier: CustomerTier;
  accountCreated: string; // ISO date
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
}

export const customers: Customer[] = [
  // A1 — cancelled Collar Pro sub but charged again
  {
    id: 'CUST-001',
    email: 'sarah.mitchell@email.com',
    name: 'Sarah Mitchell',
    phone: '+1-555-0101',
    tier: 'plus',
    accountCreated: '2025-06-15',
    address: { street: '142 Oak Lane', city: 'Portland', state: 'OR', zip: '97201', country: 'US' },
  },
  // A2 — two Collar Pros, only one subscription visible
  {
    id: 'CUST-002',
    email: 'james.chen@email.com',
    name: 'James Chen',
    phone: '+1-555-0102',
    tier: 'premium',
    accountCreated: '2025-03-10',
    address: { street: '88 Maple Ave', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' },
    notes: 'VIP customer — two dogs (Golden Retriever + Beagle)',
  },
  // A3 — upgraded monthly to annual, price seems wrong
  {
    id: 'CUST-003',
    email: 'maria.gonzalez@email.com',
    name: 'Maria Gonzalez',
    phone: '+1-555-0103',
    tier: 'basic',
    accountCreated: '2025-09-22',
    address: { street: '305 Birch St', city: 'Austin', state: 'TX', zip: '73301', country: 'US' },
  },
  // B1 — ordered Feeder 3000 + FreshBowl, split shipment
  {
    id: 'CUST-004',
    email: 'david.park@email.com',
    name: 'David Park',
    phone: '+1-555-0104',
    tier: 'basic',
    accountCreated: '2026-01-05',
    address: { street: '19 Elm Court', city: 'Denver', state: 'CO', zip: '80201', country: 'US' },
  },
  // B2 — return CatCam, upgrade to Feeder 3000
  {
    id: 'CUST-005',
    email: 'lisa.thompson@email.com',
    name: 'Lisa Thompson',
    phone: '+1-555-0105',
    tier: 'plus',
    accountCreated: '2025-11-18',
    address: { street: '77 Pine Ridge Dr', city: 'Nashville', state: 'TN', zip: '37201', country: 'US' },
  },
  // B3 — BarkBox temp sensor + Collar Pro GPS issues
  {
    id: 'CUST-006',
    email: 'robert.williams@email.com',
    name: 'Robert Williams',
    phone: '+1-555-0106',
    tier: 'premium',
    accountCreated: '2025-04-30',
    address: { street: '510 Cedar Blvd', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
  },
  // C1 — Feeder 3000 triple dispense
  {
    id: 'CUST-007',
    email: 'emma.davis@email.com',
    name: 'Emma Davis',
    phone: '+1-555-0107',
    tier: 'basic',
    accountCreated: '2025-12-01',
    address: { street: '203 Walnut Way', city: 'San Diego', state: 'CA', zip: '92101', country: 'US' },
  },
  // C2 — FreshBowl filter sensor false positive
  {
    id: 'CUST-008',
    email: 'alex.kumar@email.com',
    name: 'Alex Kumar',
    phone: '+1-555-0108',
    tier: 'plus',
    accountCreated: '2025-08-14',
    address: { street: '412 Spruce Ct', city: 'Boston', state: 'MA', zip: '02101', country: 'US' },
  },
  // C3 — CatCam offline every evening at 7pm
  {
    id: 'CUST-009',
    email: 'jennifer.wright@email.com',
    name: 'Jennifer Wright',
    phone: '+1-555-0109',
    tier: 'basic',
    accountCreated: '2026-02-20',
    address: { street: '65 Aspen Trail', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'US' },
  },
  // D1 — breeder bulk order
  {
    id: 'CUST-010',
    email: 'mark.johnson@puppypaws-breeding.com',
    name: 'Mark Johnson',
    phone: '+1-555-0110',
    tier: 'basic',
    accountCreated: '2026-03-28',
    address: { street: '1200 Ranch Rd', city: 'Dallas', state: 'TX', zip: '75201', country: 'US' },
    notes: 'Business account — PuppyPaws Breeding LLC',
  },
  // D2 — non-customer neighbor (no orders, no devices)
  {
    id: 'CUST-011',
    email: 'karen.miller@email.com',
    name: 'Karen Miller',
    phone: '+1-555-0111',
    tier: 'basic',
    accountCreated: '2026-04-10',
    address: { street: '63 Aspen Trail', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'US' },
    notes: 'Not a PawPal customer — created account to submit complaint',
  },
  // D3 — Feeder 3000 left in Airbnb
  {
    id: 'CUST-012',
    email: 'tom.baker@email.com',
    name: 'Tom Baker',
    phone: '+1-555-0112',
    tier: 'plus',
    accountCreated: '2025-07-09',
    address: { street: '880 Lakeview Dr', city: 'Miami', state: 'FL', zip: '33101', country: 'US' },
  },
];
