export interface ExpectedOutcome {
  /** Key facts the response must contain */
  requiredFacts: string[];
  /** The correct resolution or action */
  expectedResolution: string;
  /** Tools the agent should have called (in any order) */
  expectedTools: string[];
  /** Common mistakes an agent might make */
  pitfalls: string[];
}

export interface TestTicket {
  id: string;
  category: 'A' | 'B' | 'C' | 'D';
  title: string;
  name: string;
  email: string;
  message: string;
  expected: ExpectedOutcome;
}

export const testTickets: TestTicket[] = [
  // ── Category A: Subscription Billing Disputes ──

  {
    id: 'A1',
    category: 'A',
    title: 'Cancelled subscription but still charged',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    message: `Hi, I cancelled my Collar Pro subscription last month but I just got charged $9.99 again on March 15th. I want a refund — I already cancelled this! My account shouldn't be getting charged anymore. Please fix this.`,
    expected: {
      requiredFacts: [
        'Cancellation was submitted on March 18, 2026',
        'Billing cycle renews on the 15th of each month',
        'Cancellation must be submitted 48 hours before billing cycle date',
        'The March 15 charge occurred before the March 18 cancellation',
        'Service remains active until April 15 (end of paid period)',
      ],
      expectedResolution:
        'Explain that the charge is legitimate per cancellation policy — cancellation was submitted 3 days after the billing cycle renewed. Service continues until April 15. No refund is owed per policy, but optionally offer goodwill gesture.',
      expectedTools: ['customerLookup', 'subscriptionLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        'Issuing a refund without checking cancellation vs billing dates',
        'Saying the charge is an error when it is legitimate',
        'Not explaining the 48-hour cutoff policy',
      ],
    },
  },

  {
    id: 'A2',
    category: 'A',
    title: 'Two collars but only one subscription visible',
    name: 'James Chen',
    email: 'james.chen@email.com',
    message: `I have two Collar Pros — one for my Golden Retriever Max and one for my Beagle Penny. But when I look at my account, I only see one subscription. Am I being charged for both? I want to make sure I'm not missing anything or getting double charged without knowing.`,
    expected: {
      requiredFacts: [
        'Customer has two active subscriptions: SUB-3002 and SUB-3003',
        'SUB-3002 bills on the 1st, SUB-3003 bills on the 15th',
        'Both are $9.99/month each ($19.98 total)',
        'The dashboard only showing one is a known UI issue (ISSUE-005)',
        'Both subscriptions are billing correctly',
      ],
      expectedResolution:
        'Confirm both subscriptions exist and are billing correctly at $9.99 each. Explain the dashboard limitation is a known issue being investigated. Provide both subscription IDs for reference.',
      expectedTools: ['customerLookup', 'subscriptionLookup', 'knownIssuesLookup', 'orderLookup'],
      pitfalls: [
        'Only finding one subscription and confirming the customer is only being charged once',
        'Not checking known issues to explain why only one is visible',
        'Creating a duplicate subscription instead of finding the existing second one',
      ],
    },
  },

  {
    id: 'A3',
    category: 'A',
    title: 'Annual upgrade price seems wrong',
    name: 'Maria Gonzalez',
    email: 'maria.gonzalez@email.com',
    message: `I just upgraded my Collar Pro subscription from monthly to annual. Your website says the annual plan is $7.99/month but I was charged $92.49 which works out to way more than that. I think there's been a billing error. Can you look into this?`,
    expected: {
      requiredFacts: [
        'Annual plan is $99.99/year ($8.33/month effective)',
        'The $7.99/month ($95.88/year) was a promotional rate that expired January 2026',
        'Customer was charged $92.49 = $99.99 minus $7.50 prorated credit',
        'The $7.50 credit was for 23 unused days of the monthly billing cycle',
        'Upgrade happened on March 25, 2026',
      ],
      expectedResolution:
        'Explain the breakdown: $99.99 annual price minus $7.50 prorated credit = $92.49. The $7.99/month rate was promotional and expired. Current annual rate is $99.99/year. No billing error occurred.',
      expectedTools: ['customerLookup', 'subscriptionLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        'Agreeing there is a billing error and issuing a price adjustment',
        'Not explaining the expired promotional rate',
        'Not explaining the prorated credit calculation',
      ],
    },
  },

  // ── Category B: Multi-Product / Multi-Order Issues ──

  {
    id: 'B1',
    category: 'B',
    title: 'Ordered two products, only one arrived, tracking shows both delivered',
    name: 'David Park',
    email: 'david.park@email.com',
    message: `I ordered a Feeder 3000 and a FreshBowl together (order ORD-1005). The FreshBowl arrived fine but the Feeder 3000 never showed up. The tracking number says delivered but I definitely don't have it. I need the feeder — that's the main thing I ordered!`,
    expected: {
      requiredFacts: [
        'Order was split into two shipments from different warehouses',
        'SHIP-2005A (FreshBowl) was delivered March 24',
        'SHIP-2005B (Feeder 3000) tracking shows delivered March 26 but customer says not received',
        'Each shipment has its own tracking number',
        'Policy: initiate carrier investigation when tracking shows delivered but customer did not receive',
      ],
      expectedResolution:
        'Acknowledge the split shipment. Initiate a carrier investigation for SHIP-2005B (UPS tracking 1Z999AA10123456791). Investigation takes 5-10 business days. Offer replacement or refund if investigation confirms loss.',
      expectedTools: ['customerLookup', 'orderLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        'Not realizing the order was split into two shipments',
        'Telling the customer both items were in one package',
        'Not initiating a carrier investigation per policy',
      ],
    },
  },

  {
    id: 'B2',
    category: 'B',
    title: 'Return CatCam and apply refund toward Feeder 3000',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    message: `I bought a CatCam about two weeks ago but honestly it's not what I expected. I'd rather get a Feeder 3000 instead. Can I return the CatCam and just pay the price difference for the Feeder? That would be way easier than doing a separate return and new order.`,
    expected: {
      requiredFacts: [
        'CatCam ordered April 2, delivered April 5 — within 30-day return window',
        'CatCam price: $99, Feeder 3000 price: $249',
        'Price difference: $150',
        'Exchange policy allows exchanges within 30 days with price difference charged/refunded',
        'Exchange shipping is free in both directions',
      ],
      expectedResolution:
        'Confirm the CatCam is eligible for exchange (within 30 days). Process as an exchange: customer returns CatCam ($99), receives Feeder 3000 ($249), pays $150 difference. Free shipping both ways.',
      expectedTools: ['customerLookup', 'orderLookup', 'productLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        'Telling the customer they need to do a separate return and new purchase',
        'Not checking the return window eligibility',
        'Getting the price difference wrong',
      ],
    },
  },

  {
    id: 'B3',
    category: 'B',
    title: 'Two unrelated product issues in one ticket',
    name: 'Robert Williams',
    email: 'robert.williams@email.com',
    message: `I have two issues. First, my BarkBox has been showing crazy temperature readings — like 140°F when it's clearly not that hot outside. The heater won't turn on anymore either. Second, the Collar Pro I got last week for my dog Duke won't sync GPS properly — it keeps dropping the location. Both products are not working as expected.`,
    expected: {
      requiredFacts: [
        'BarkBox (DEV-4005): temperature sensor reading 145°F, heater auto-disabled as safety measure, ordered Jan 10 (within warranty)',
        'Collar Pro (DEV-4006): firmware 2.3.8 has known GPS degradation bug (ISSUE-003), fix available in 2.4.0',
        'BarkBox temp sensor is likely defective — covered under 1-year warranty',
        'Collar Pro GPS issue is a known firmware bug, not hardware',
      ],
      expectedResolution:
        'Two separate resolutions: (1) BarkBox — defective temperature sensor, offer warranty replacement. (2) Collar Pro — known firmware bug on 2.3.x, recommend updating to firmware 2.4.0 which fixes the GPS degradation.',
      expectedTools: ['customerLookup', 'orderLookup', 'deviceStatus', 'knownIssuesLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        'Only addressing one of the two issues',
        'Treating the Collar Pro GPS issue as hardware when it is a firmware bug',
        'Not checking known issues for either product',
        'Not checking warranty eligibility for the BarkBox',
      ],
    },
  },

  // ── Category C: Product Diagnosis Issues ──

  {
    id: 'C1',
    category: 'C',
    title: 'Feeder 3000 dispensing three times instead of once',
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    message: `My Feeder 3000 has been dispensing food three times every morning at 7am instead of once. My cat Whiskers is getting way too much food! I have it set to feed twice a day — 7am and 6pm. The evening feeding works fine, just once. What's going on?`,
    expected: {
      requiredFacts: [
        'Device config shows three duplicate 07:00 schedule entries plus one 18:00 entry',
        'Firmware 3.1.2 has known bug (ISSUE-001) where app creates duplicate schedule entries',
        'Fix is available in firmware 3.2.0',
        'Workaround: delete duplicate entries via web dashboard',
      ],
      expectedResolution:
        'Explain the duplicate schedule entries in the device config (three 07:00 entries). This is caused by a known firmware bug in 3.1.x. Recommend: (1) delete duplicate entries via web dashboard as immediate fix, (2) update firmware to 3.2.0 to prevent recurrence.',
      expectedTools: ['customerLookup', 'deviceStatus', 'knownIssuesLookup'],
      pitfalls: [
        'Suggesting a hardware defect or motor issue',
        'Not checking the feeding schedule config for duplicates',
        'Not checking known issues for the firmware version',
        'Recommending a replacement instead of a config fix',
      ],
    },
  },

  {
    id: 'C2',
    category: 'C',
    title: 'FreshBowl says filter needs replacing but just replaced it',
    name: 'Alex Kumar',
    email: 'alex.kumar@email.com',
    message: `My FreshBowl keeps telling me to replace the filter but I literally just replaced it two weeks ago! I even bought the official PawPal replacement filters. I tried recalibrating the sensor through the app but it still says the flow rate is too low. This is really frustrating.`,
    expected: {
      requiredFacts: [
        'Customer purchased replacement filters on April 1 (ORD-1011), delivered April 3',
        'Device logs show filter reset on April 10, sensor recalibration same day',
        'Flow rate reading: 0.3 L/min (threshold 0.5 L/min)',
        'Firmware 1.8.3 has known issue (ISSUE-002): false low readings after filter replacement',
        'Root cause: filter housing may not be fully seated, or sensor calibration locked in low baseline',
        'Workaround: unplug for 30 seconds and replug to force fresh calibration',
      ],
      expectedResolution:
        "Acknowledge the frustration. Explain this is a known issue with firmware 1.8.x. Recommend: (1) check filter housing is fully clicked into place, (2) unplug FreshBowl for 30 seconds and replug to force fresh sensor calibration. If that doesn't work, sensor may be defective — offer warranty replacement.",
      expectedTools: ['customerLookup', 'orderLookup', 'deviceStatus', 'knownIssuesLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        'Telling customer to buy a new filter when they just bought one',
        "Recommending sensor recalibration via app (already tried, doesn't fix it)",
        'Not verifying the filter purchase in order history',
        'Not checking known issues for firmware 1.8.3',
      ],
    },
  },

  {
    id: 'C3',
    category: 'C',
    title: 'CatCam goes offline every evening at 7pm',
    name: 'Jennifer Wright',
    email: 'jennifer.wright@email.com',
    message: `My CatCam keeps going offline every single evening around 7pm and doesn't come back on until the next morning. I want to check on my cat Mittens in the evening but the camera is always offline! Is this a Wi-Fi issue? My internet works fine on all other devices.`,
    expected: {
      requiredFacts: [
        'Device config has power saving mode enabled with schedule 19:00–07:00',
        'Power saving mode disables camera and Wi-Fi during scheduled hours',
        'Device logs confirm: entering power saving mode at 19:00, coming online at ~06:45',
        'This is not a Wi-Fi or hardware issue — it is a configuration setting',
      ],
      expectedResolution:
        'The CatCam has power saving mode enabled, scheduled from 7pm to 7am. This disables the camera and Wi-Fi during those hours. To fix: disable power saving mode or adjust the schedule in the app settings.',
      expectedTools: ['customerLookup', 'deviceStatus'],
      pitfalls: [
        'Suggesting Wi-Fi troubleshooting when the issue is power saving mode',
        'Recommending a firmware update when the issue is a config setting',
        'Not checking the device config and logs',
        'Blaming the router or ISP',
      ],
    },
  },

  // ── Category D: Edge Cases — Must Stay Agentic ──

  {
    id: 'D1',
    category: 'D',
    title: 'Breeder wants bulk order with custom engraving',
    name: 'Mark Johnson',
    email: 'mark.johnson@puppypaws-breeding.com',
    message: `Hi there, I run PuppyPaws Breeding and I'd like to order 15 Collar Pros with custom engraving of our kennel logo for each one. I'll need a mix of sizes — 5 Small, 5 Medium, 5 Large. Is there a bulk discount available? Also, do I need separate subscriptions for each collar?`,
    expected: {
      requiredFacts: [
        'Bulk orders of 10+ units qualify for bulk pricing — must be handled by sales team',
        'Custom engraving available for Collar Pro, minimum 5 units, +$15 per unit',
        'Bulk orders cannot be processed through standard support — must escalate to sales@pawpal.com',
        'Each device requires its own subscription, no multi-device discount',
        'Business customers should register at business.pawpal.com for net-30 terms',
      ],
      expectedResolution:
        'Escalate to sales team. Provide the customer with sales@pawpal.com and business.pawpal.com. Confirm engraving is available at +$15/unit. Note that each collar will need its own $9.99/month subscription. Standard support cannot negotiate pricing or process bulk orders.',
      expectedTools: ['customerLookup', 'knowledgeBaseSearch', 'productLookup'],
      pitfalls: [
        'Trying to process the bulk order through standard support',
        'Quoting a bulk discount without authorization',
        'Not mentioning that each collar needs a separate subscription',
      ],
    },
  },

  {
    id: 'D2',
    category: 'D',
    title: 'Neighbor complaint about camera privacy',
    name: 'Karen Miller',
    email: 'karen.miller@email.com',
    message: `I'm not a PawPal customer but my neighbor has one of your CatCam cameras and it's clearly pointed at my backyard. I find this incredibly invasive and a violation of my privacy. I need you to either disable that camera remotely or give me their account information so I can address this directly. This is unacceptable.`,
    expected: {
      requiredFacts: [
        'PawPal cannot confirm or deny whether an address has a device',
        "PawPal cannot remotely disable or adjust a customer's camera",
        'PawPal cannot share customer information with third parties',
        'Complainant should contact local authorities for privacy concerns',
        'Can forward concern to legal@pawpal.com but cannot take immediate action',
      ],
      expectedResolution:
        'Express understanding of the concern. Explain that PawPal cannot share customer information, confirm/deny devices at an address, or remotely control customer devices. Advise contacting local authorities. Offer to forward the concern to legal@pawpal.com.',
      expectedTools: ['customerLookup', 'knowledgeBaseSearch'],
      pitfalls: [
        "Sharing any information about the neighbor's account",
        'Promising to disable the camera',
        'Looking up devices at the address and sharing details',
        'Not advising to contact local authorities',
      ],
    },
  },

  {
    id: 'D3',
    category: 'D',
    title: 'Feeder left in Airbnb, wants to remotely disable',
    name: 'Tom Baker',
    email: 'tom.baker@email.com',
    message: `This is embarrassing but I left my Feeder 3000 at an Airbnb I stayed at last week. I can see in the app that someone is still using it — they're feeding a pet with it! I want to remotely disable it or factory reset it so they can't use my device anymore. Can you help me do this?`,
    expected: {
      requiredFacts: [
        'Device DEV-4010-FEEDER is online and actively being used (dispensing daily)',
        'Last manual dispense was from unknown IP (not the owner)',
        'Owner can remotely factory reset via the app',
        'Factory reset wipes settings and disconnects Wi-Fi',
        'Device can then be set up fresh by anyone with physical access',
        'Customer also has a Collar Pro (DEV-4010) — unrelated to this issue',
      ],
      expectedResolution:
        'Guide the customer to remotely factory reset the device via the app. This will wipe settings, disconnect Wi-Fi, and prevent further use until physically set up again. Note: this does not help retrieve the device. If they want it back, they need to contact the Airbnb host.',
      expectedTools: ['customerLookup', 'deviceStatus', 'knowledgeBaseSearch'],
      pitfalls: [
        'Confusing the Feeder device with the Collar Pro device',
        'Saying remote disable is not possible (it is — factory reset via app)',
        'Not mentioning that factory reset only stops remote use, not physical access',
      ],
    },
  },
];
