export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: 'collar' | 'feeder' | 'camera' | 'fountain' | 'climate';
  description: string;
  variants?: { id: string; label: string; sku: string }[];
  subscriptionRequired?: boolean;
  subscriptionPrice?: number;
  replacementParts?: { id: string; name: string; price: number; intervalMonths?: number }[];
}

export const products: Product[] = [
  {
    id: 'PROD-001',
    name: 'Collar Pro',
    slug: 'collar-pro',
    price: 149.0,
    category: 'collar',
    description: 'GPS smart collar with real-time tracking, activity monitoring, and geofencing.',
    variants: [
      { id: 'VAR-CP-S', label: 'Small', sku: 'CP-S' },
      { id: 'VAR-CP-M', label: 'Medium', sku: 'CP-M' },
      { id: 'VAR-CP-L', label: 'Large', sku: 'CP-L' },
    ],
    subscriptionRequired: true,
    subscriptionPrice: 9.99,
  },
  {
    id: 'PROD-002',
    name: 'Feeder 3000',
    slug: 'feeder-3000',
    price: 249.0,
    category: 'feeder',
    description: 'Smart auto-feeder with HD camera, portion control, and scheduling.',
  },
  {
    id: 'PROD-003',
    name: 'CatCam',
    slug: 'catcam',
    price: 99.0,
    category: 'camera',
    description: 'Pet camera with treat dispenser, laser pointer, and two-way audio.',
  },
  {
    id: 'PROD-004',
    name: 'FreshBowl',
    slug: 'freshbowl',
    price: 59.0,
    category: 'fountain',
    description: 'Self-cleaning water fountain with triple filtration and water level alerts.',
    replacementParts: [{ id: 'PART-FB-FILTER', name: 'Replacement Filter (3-pack)', price: 14.99, intervalMonths: 3 }],
  },
  {
    id: 'PROD-005',
    name: 'BarkBox',
    slug: 'barkbox',
    price: 199.0,
    category: 'climate',
    description: 'Outdoor doghouse climate controller with fan, heater, and temperature sensor.',
  },
];
