export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  sku: string;
}

export interface Shipment {
  shipmentId: string;
  carrier: string;
  trackingNumber: string;
  status: 'in_transit' | 'delivered' | 'exception';
  items: string[]; // product IDs in this shipment
  shippedDate: string;
  deliveredDate?: string;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shipments: Shipment[];
  total: number;
  notes?: string;
}

export const orders: Order[] = [
  // CUST-001 (A1) — Collar Pro purchase
  {
    id: 'ORD-1001',
    customerId: 'CUST-001',
    status: 'delivered',
    createdAt: '2025-08-10',
    updatedAt: '2025-08-15',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Collar Pro',
        variantId: 'VAR-CP-M',
        variantLabel: 'Medium',
        quantity: 1,
        unitPrice: 149.0,
        sku: 'CP-M',
      },
    ],
    shipments: [
      {
        shipmentId: 'SHIP-2001',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456784',
        status: 'delivered',
        items: ['PROD-001'],
        shippedDate: '2025-08-11',
        deliveredDate: '2025-08-15',
      },
    ],
    total: 149.0,
  },

  // CUST-002 (A2) — First Collar Pro (Golden Retriever)
  {
    id: 'ORD-1002',
    customerId: 'CUST-002',
    status: 'delivered',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-05',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Collar Pro',
        variantId: 'VAR-CP-L',
        variantLabel: 'Large',
        quantity: 1,
        unitPrice: 149.0,
        sku: 'CP-L',
      },
    ],
    shipments: [
      {
        shipmentId: 'SHIP-2002',
        carrier: 'FedEx',
        trackingNumber: 'FX7894561230',
        status: 'delivered',
        items: ['PROD-001'],
        shippedDate: '2025-04-02',
        deliveredDate: '2025-04-05',
      },
    ],
    total: 149.0,
  },
  // CUST-002 (A2) — Second Collar Pro (Beagle), ordered months later
  {
    id: 'ORD-1003',
    customerId: 'CUST-002',
    status: 'delivered',
    createdAt: '2025-10-15',
    updatedAt: '2025-10-19',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Collar Pro',
        variantId: 'VAR-CP-S',
        variantLabel: 'Small',
        quantity: 1,
        unitPrice: 149.0,
        sku: 'CP-S',
      },
    ],
    shipments: [
      {
        shipmentId: 'SHIP-2003',
        carrier: 'FedEx',
        trackingNumber: 'FX7894561231',
        status: 'delivered',
        items: ['PROD-001'],
        shippedDate: '2025-10-16',
        deliveredDate: '2025-10-19',
      },
    ],
    total: 149.0,
  },

  // CUST-003 (A3) — Collar Pro
  {
    id: 'ORD-1004',
    customerId: 'CUST-003',
    status: 'delivered',
    createdAt: '2025-10-01',
    updatedAt: '2025-10-04',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Collar Pro',
        variantId: 'VAR-CP-M',
        variantLabel: 'Medium',
        quantity: 1,
        unitPrice: 149.0,
        sku: 'CP-M',
      },
    ],
    shipments: [
      {
        shipmentId: 'SHIP-2004',
        carrier: 'USPS',
        trackingNumber: '9400111899223100001',
        status: 'delivered',
        items: ['PROD-001'],
        shippedDate: '2025-10-02',
        deliveredDate: '2025-10-04',
      },
    ],
    total: 149.0,
  },

  // CUST-004 (B1) — Feeder 3000 + FreshBowl, split shipment, tracking says both delivered but only FreshBowl arrived
  {
    id: 'ORD-1005',
    customerId: 'CUST-004',
    status: 'shipped',
    createdAt: '2026-03-20',
    updatedAt: '2026-03-26',
    items: [
      { productId: 'PROD-002', productName: 'Feeder 3000', quantity: 1, unitPrice: 249.0, sku: 'FD-3000' },
      { productId: 'PROD-004', productName: 'FreshBowl', quantity: 1, unitPrice: 59.0, sku: 'FB-STD' },
    ],
    shipments: [
      // FreshBowl shipped separately — actually delivered
      {
        shipmentId: 'SHIP-2005A',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456790',
        status: 'delivered',
        items: ['PROD-004'],
        shippedDate: '2026-03-21',
        deliveredDate: '2026-03-24',
      },
      // Feeder 3000 — tracking says delivered but customer never received it
      {
        shipmentId: 'SHIP-2005B',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456791',
        status: 'delivered',
        items: ['PROD-002'],
        shippedDate: '2026-03-21',
        deliveredDate: '2026-03-26',
      },
    ],
    total: 308.0,
    notes: 'Warehouse split into two shipments due to Feeder 3000 stock in different facility',
  },

  // CUST-005 (B2) — CatCam purchase (10 days ago, within return window)
  {
    id: 'ORD-1006',
    customerId: 'CUST-005',
    status: 'delivered',
    createdAt: '2026-04-02',
    updatedAt: '2026-04-05',
    items: [{ productId: 'PROD-003', productName: 'CatCam', quantity: 1, unitPrice: 99.0, sku: 'CC-STD' }],
    shipments: [
      {
        shipmentId: 'SHIP-2006',
        carrier: 'FedEx',
        trackingNumber: 'FX7894561235',
        status: 'delivered',
        items: ['PROD-003'],
        shippedDate: '2026-04-03',
        deliveredDate: '2026-04-05',
      },
    ],
    total: 99.0,
  },

  // CUST-006 (B3) — BarkBox (3 months old) + Collar Pro (1 week old)
  {
    id: 'ORD-1007',
    customerId: 'CUST-006',
    status: 'delivered',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-14',
    items: [{ productId: 'PROD-005', productName: 'BarkBox', quantity: 1, unitPrice: 199.0, sku: 'BB-STD' }],
    shipments: [
      {
        shipmentId: 'SHIP-2007',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456795',
        status: 'delivered',
        items: ['PROD-005'],
        shippedDate: '2026-01-11',
        deliveredDate: '2026-01-14',
      },
    ],
    total: 199.0,
  },
  {
    id: 'ORD-1008',
    customerId: 'CUST-006',
    status: 'delivered',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-10',
    items: [
      {
        productId: 'PROD-001',
        productName: 'Collar Pro',
        variantId: 'VAR-CP-L',
        variantLabel: 'Large',
        quantity: 1,
        unitPrice: 149.0,
        sku: 'CP-L',
      },
    ],
    shipments: [
      {
        shipmentId: 'SHIP-2008',
        carrier: 'FedEx',
        trackingNumber: 'FX7894561240',
        status: 'delivered',
        items: ['PROD-001'],
        shippedDate: '2026-04-09',
        deliveredDate: '2026-04-10',
      },
    ],
    total: 149.0,
  },

  // CUST-007 (C1) — Feeder 3000
  {
    id: 'ORD-1009',
    customerId: 'CUST-007',
    status: 'delivered',
    createdAt: '2025-12-15',
    updatedAt: '2025-12-19',
    items: [{ productId: 'PROD-002', productName: 'Feeder 3000', quantity: 1, unitPrice: 249.0, sku: 'FD-3000' }],
    shipments: [
      {
        shipmentId: 'SHIP-2009',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456800',
        status: 'delivered',
        items: ['PROD-002'],
        shippedDate: '2025-12-16',
        deliveredDate: '2025-12-19',
      },
    ],
    total: 249.0,
  },

  // CUST-008 (C2) — FreshBowl + replacement filter purchase
  {
    id: 'ORD-1010',
    customerId: 'CUST-008',
    status: 'delivered',
    createdAt: '2025-09-01',
    updatedAt: '2025-09-04',
    items: [{ productId: 'PROD-004', productName: 'FreshBowl', quantity: 1, unitPrice: 59.0, sku: 'FB-STD' }],
    shipments: [
      {
        shipmentId: 'SHIP-2010',
        carrier: 'USPS',
        trackingNumber: '9400111899223100010',
        status: 'delivered',
        items: ['PROD-004'],
        shippedDate: '2025-09-02',
        deliveredDate: '2025-09-04',
      },
    ],
    total: 59.0,
  },
  // CUST-008 — filter replacement purchase (2 weeks ago)
  {
    id: 'ORD-1011',
    customerId: 'CUST-008',
    status: 'delivered',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-03',
    items: [
      {
        productId: 'PART-FB-FILTER',
        productName: 'Replacement Filter (3-pack)',
        quantity: 1,
        unitPrice: 14.99,
        sku: 'FB-FILTER-3PK',
      },
    ],
    shipments: [
      {
        shipmentId: 'SHIP-2011',
        carrier: 'USPS',
        trackingNumber: '9400111899223100011',
        status: 'delivered',
        items: ['PART-FB-FILTER'],
        shippedDate: '2026-04-02',
        deliveredDate: '2026-04-03',
      },
    ],
    total: 14.99,
  },

  // CUST-009 (C3) — CatCam
  {
    id: 'ORD-1012',
    customerId: 'CUST-009',
    status: 'delivered',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-04',
    items: [{ productId: 'PROD-003', productName: 'CatCam', quantity: 1, unitPrice: 99.0, sku: 'CC-STD' }],
    shipments: [
      {
        shipmentId: 'SHIP-2012',
        carrier: 'FedEx',
        trackingNumber: 'FX7894561250',
        status: 'delivered',
        items: ['PROD-003'],
        shippedDate: '2026-03-02',
        deliveredDate: '2026-03-04',
      },
    ],
    total: 99.0,
  },

  // CUST-012 (D3) — Feeder 3000 (left in Airbnb)
  {
    id: 'ORD-1013',
    customerId: 'CUST-012',
    status: 'delivered',
    createdAt: '2025-11-20',
    updatedAt: '2025-11-24',
    items: [{ productId: 'PROD-002', productName: 'Feeder 3000', quantity: 1, unitPrice: 249.0, sku: 'FD-3000' }],
    shipments: [
      {
        shipmentId: 'SHIP-2013',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456810',
        status: 'delivered',
        items: ['PROD-002'],
        shippedDate: '2025-11-21',
        deliveredDate: '2025-11-24',
      },
    ],
    total: 249.0,
  },
];
