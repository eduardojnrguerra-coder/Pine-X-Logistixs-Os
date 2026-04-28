export const LOCATIONS = [
  'Hermanus',
  'Kleinmond',
  'Onrus',
  'Sandbaai',
  'Cape Town',
  'Somerset West',
  'Stellenbosch',
  'Paarl',
  'Caledon',
  'Gansbaai',
];

export const CUSTOMERS = [
  {
    id: 'C001',
    companyName: 'HFC Construction',
    name: 'HFC Construction',
    contactPerson: 'Pieter Smith',
    contact: 'Pieter Smith',
    phone: '028 312 3456',
    email: 'pieter@hfc.co.za',
    billingAddress: '12 Harbour Road, Hermanus, 7200',
    type: 'Construction',
    status: 'Active',
    totalRevenue: 145820,
    outstandingBalance: 12650,
    activeJobs: 2,
    completedJobs: 18,
    riskLevel: 'Medium',
    notes: 'High-volume construction client with recurring route demand between Cape Town and Overstrand.',
  },
  {
    id: 'C002',
    companyName: 'Coastal Build (Pty) Ltd',
    name: 'Coastal Build (Pty) Ltd',
    contactPerson: 'Anna Meyer',
    contact: 'Anna Meyer',
    phone: '028 384 5678',
    email: 'anna@coastalbuild.co.za',
    billingAddress: '88 Main Street, Stellenbosch, 7600',
    type: 'Construction',
    status: 'Active',
    totalRevenue: 132440,
    outstandingBalance: 11155,
    activeJobs: 2,
    completedJobs: 14,
    riskLevel: 'High',
    notes: 'Growing account with strong volume but slower collections on project-based billing.',
  },
  {
    id: 'C003',
    companyName: 'Overstrand Municipality',
    name: 'Overstrand Municipality',
    contactPerson: 'Johan Nel',
    contact: 'Johan Nel',
    phone: '028 316 1234',
    email: 'jnel@overstrand.gov.za',
    billingAddress: '1 Magnolia Avenue, Hermanus, 7200',
    type: 'Government',
    status: 'Active',
    totalRevenue: 104300,
    outstandingBalance: 5925,
    activeJobs: 1,
    completedJobs: 10,
    riskLevel: 'Low',
    notes: 'Reliable municipal account with formal approval workflow and moderate payment cycles.',
  },
  {
    id: 'C004',
    companyName: 'Pine Avenue Civils',
    name: 'Pine Avenue Civils',
    contactPerson: 'Henk Roux',
    contact: 'Henk Roux',
    phone: '028 384 9012',
    email: 'henk@pineavenue.co.za',
    billingAddress: '45 Industrial Park, Paarl, 7646',
    type: 'Civil Engineering',
    status: 'At Risk',
    totalRevenue: 96240,
    outstandingBalance: 5520,
    activeJobs: 2,
    completedJobs: 9,
    riskLevel: 'High',
    notes: 'Operationally valuable client with a recent overdue invoice and growing deadline pressure.',
  },
  {
    id: 'C005',
    companyName: 'Greenfield Estate',
    name: 'Greenfield Estate',
    contactPerson: 'Maria van der Merwe',
    contact: 'Maria van der Merwe',
    phone: '021 555 6789',
    email: 'maria@greenfield.co.za',
    billingAddress: '22 Estate Drive, Somerset West, 7130',
    type: 'Property Development',
    status: 'Active',
    totalRevenue: 72850,
    outstandingBalance: 3680,
    activeJobs: 2,
    completedJobs: 8,
    riskLevel: 'Medium',
    notes: 'Project site schedules change often, so communication speed matters more than price alone.',
  },
  {
    id: 'C006',
    companyName: 'Gansbaai Lodge',
    name: 'Gansbaai Lodge',
    contactPerson: 'Klein Karoo',
    contact: 'Klein Karoo',
    phone: '028 388 4567',
    email: 'info@gansbaailodge.co.za',
    billingAddress: '7 Harbour View, Gansbaai, 7220',
    type: 'Hospitality',
    status: 'On Hold',
    totalRevenue: 48420,
    outstandingBalance: 0,
    activeJobs: 1,
    completedJobs: 6,
    riskLevel: 'Low',
    notes: 'Seasonal delivery account with intermittent activity and strong preference for client portal visibility.',
  },
  {
    id: 'C007',
    companyName: 'Kleinmond Build',
    name: 'Kleinmond Build',
    contactPerson: 'Gerhard Bronk',
    contact: 'Gerhard Bronk',
    phone: '028 327 8901',
    email: 'gerhard@kleinmondbuild.co.za',
    billingAddress: '16 Beach Road, Kleinmond, 7195',
    type: 'Construction',
    status: 'Active',
    totalRevenue: 68190,
    outstandingBalance: 8280,
    activeJobs: 2,
    completedJobs: 7,
    riskLevel: 'Medium',
    notes: 'Fast-moving local construction account where delivery reliability drives repeat bookings.',
  },
  {
    id: 'C008',
    companyName: 'Onrus Property Group',
    name: 'Onrus Property Group',
    contactPerson: 'Elize Smuts',
    contact: 'Elize Smuts',
    phone: '028 331 2345',
    email: 'elize@onrusprop.co.za',
    billingAddress: '9 Atlantic Crescent, Onrus, 7201',
    type: 'Property Management',
    status: 'Active',
    totalRevenue: 55760,
    outstandingBalance: 7130,
    activeJobs: 2,
    completedJobs: 5,
    riskLevel: 'Medium',
    notes: 'Likes regular ETA communication and invoice visibility for multiple site managers.',
  },
];

export const VEHICLE_TYPES = [
  'Semi-Bulk',
  'Flatbed',
  'Tautliner',
  'Refrigerated',
  'Drop Side',
  'Tipper',
  'Panel Van',
];

export const JOB_STATUSES = [
  'Draft',
  'Quoted',
  'Approved',
  'Scheduled',
  'Dispatched',
  'On Route',
  'At Pickup',
  'Loaded',
  'At Dropoff',
  'Delivered',
  'Delayed',
  'Cancelled',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical', 'Urgent'];
export const DRIVER_STATUSES = ['Available', 'On Duty', 'Off Duty', 'On Leave'];
export const VEHICLE_STATUSES = ['Active', 'Idle', 'Maintenance', 'Offline'];
export const QUOTE_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Converted'];
export const INVOICE_STATUSES = ['Draft', 'Sent', 'Part Paid', 'Paid', 'Overdue', 'Cancelled'];
export const MAINTENANCE_STATUSES = ['Open', 'Scheduled', 'In Progress', 'Completed', 'Overdue'];
export const MAINTENANCE_TYPES = ['Service', 'Tyres', 'Brakes', 'Engine', 'Electrical', 'Licence', 'Tracker', 'Breakdown', 'Inspection'];
export const ALERT_SEVERITIES = ['Info', 'Warning', 'Critical'];
export const ALERT_TYPES = ['Service Due', 'Licence Expiring', 'Tracker Offline', 'Fault Reported', 'High Idle Time', 'Fuel Concern', 'Breakdown Risk'];
export const ALERT_STATUSES = ['New', 'Acknowledged', 'Resolved'];
export const REPORT_TYPES = [
  'Executive Summary',
  'Revenue by Customer',
  'Profit per Job',
  'Driver Performance',
  'Vehicle Profitability',
  'On-Time Delivery Rate',
  'Delay Reasons',
  'Fuel Efficiency',
  'Maintenance Cost',
  'Outstanding Invoices',
  'Fleet Utilization',
  'Money Leakage',
];
export const CUSTOMER_STATUSES = ['Active', 'At Risk', 'On Hold'];
export const CUSTOMER_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
export const CUSTOMER_TYPES = [
  'Construction',
  'Civil Engineering',
  'Government',
  'Property Development',
  'Property Management',
  'Hospitality',
];
export const SETTINGS_USER_ROLES = [
  'Owner/Admin',
  'Operations Manager',
  'Dispatcher',
  'Driver',
  'Finance',
  'Maintenance Manager',
];

export const VEHICLES = [
  {
    id: 'V001',
    registration: 'PX 12345 GP',
    name: 'Mercedes Axor',
    type: 'Semi-Bulk',
    status: 'Active',
    driverId: 'D001',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-001',
    odometer: 245890,
    fuelLevel: 78,
    serviceDueKm: 5000,
    licenceExpiry: '2026-08-15',
    currentLocation: 'Hermanus',
    currentJobId: 'JOB-001',
  },
  {
    id: 'V002',
    registration: 'PX 23456 GP',
    name: 'Isuzu NPR',
    type: 'Flatbed',
    status: 'Active',
    driverId: 'D002',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-002',
    odometer: 178234,
    fuelLevel: 65,
    serviceDueKm: 8200,
    licenceExpiry: '2026-05-20',
    currentLocation: 'Cape Town',
    currentJobId: 'JOB-002',
  },
  {
    id: 'V003',
    registration: 'PX 34567 GP',
    name: 'Fuso Canter',
    type: 'Tautliner',
    status: 'Active',
    driverId: 'D003',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-003',
    odometer: 312456,
    fuelLevel: 82,
    serviceDueKm: 12300,
    licenceExpiry: '2026-11-30',
    currentLocation: 'Somerset West',
    currentJobId: 'JOB-003',
  },
  {
    id: 'V004',
    registration: 'PX 45678 GP',
    name: 'Mercedes Sprinter',
    type: 'Refrigerated',
    status: 'Active',
    driverId: 'D004',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-004',
    odometer: 156789,
    fuelLevel: 55,
    serviceDueKm: 4500,
    licenceExpiry: '2026-03-10',
    currentLocation: 'Stellenbosch',
    currentJobId: 'JOB-004',
  },
  {
    id: 'V005',
    registration: 'PX 56789 GP',
    name: 'Ford Cargo',
    type: 'Drop Side',
    status: 'Idle',
    driverId: 'D005',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-005',
    odometer: 98765,
    fuelLevel: 92,
    serviceDueKm: 15000,
    licenceExpiry: '2026-09-25',
    currentLocation: 'Hermanus',
    currentJobId: null,
  },
  {
    id: 'V006',
    registration: 'PX 67890 GP',
    name: 'Hino 148',
    type: 'Tipper',
    status: 'Active',
    driverId: 'D006',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-006',
    odometer: 234567,
    fuelLevel: 70,
    serviceDueKm: 6700,
    licenceExpiry: '2026-07-18',
    currentLocation: 'Gansbaai',
    currentJobId: 'JOB-005',
  },
  {
    id: 'V007',
    registration: 'PX 78901 GP',
    name: 'Iveco Daily',
    type: 'Panel Van',
    status: 'Maintenance',
    driverId: null,
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-007',
    odometer: 345678,
    fuelLevel: 45,
    serviceDueKm: 2000,
    licenceExpiry: '2026-12-05',
    currentLocation: 'Workshop',
    currentJobId: null,
  },
  {
    id: 'V008',
    registration: 'PX 89012 GP',
    name: 'Nissan UD',
    type: 'Semi-Bulk',
    status: 'Active',
    driverId: 'D007',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-008',
    odometer: 198765,
    fuelLevel: 88,
    serviceDueKm: 9800,
    licenceExpiry: '2026-04-22',
    currentLocation: 'Paarl',
    currentJobId: 'JOB-006',
  },
  {
    id: 'V009',
    registration: 'PX 90123 GP',
    name: 'Mitsubishi Fuso',
    type: 'Flatbed',
    status: 'Idle',
    driverId: 'D008',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-009',
    odometer: 87654,
    fuelLevel: 95,
    serviceDueKm: 18000,
    licenceExpiry: '2026-06-30',
    currentLocation: 'Caledon',
    currentJobId: null,
  },
  {
    id: 'V010',
    registration: 'PX 01234 GP',
    name: 'Renault Master',
    type: 'Panel Van',
    status: 'Offline',
    driverId: null,
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-010',
    odometer: 123456,
    fuelLevel: 20,
    serviceDueKm: 11000,
    licenceExpiry: '2026-10-15',
    currentLocation: 'Unknown',
    currentJobId: null,
  },
  {
    id: 'V011',
    registration: 'PX 11223 GP',
    name: 'DAF LF',
    type: 'Refrigerated',
    status: 'Active',
    driverId: 'D009',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-011',
    odometer: 287654,
    fuelLevel: 62,
    serviceDueKm: 7500,
    licenceExpiry: '2026-02-28',
    currentLocation: 'Kleinmond',
    currentJobId: 'JOB-007',
  },
  {
    id: 'V012',
    registration: 'PX 22334 GP',
    name: 'Volvo FL',
    type: 'Tautliner',
    status: 'Idle',
    driverId: 'D010',
    trackerProvider: 'Demo',
    trackerDeviceId: 'DEMO-012',
    odometer: 165432,
    fuelLevel: 90,
    serviceDueKm: 13500,
    licenceExpiry: '2026-08-10',
    currentLocation: 'Onrus',
    currentJobId: null,
  },
];

export const DRIVERS = [
  {
    id: 'D001',
    name: 'Pieter Smith',
    phone: '082 456 7890',
    licenceCode: 'CE',
    status: 'On Duty',
    assignedVehicleId: 'V001',
    currentJobId: 'JOB-001',
    onTimeRate: 94,
    completedJobs: 156,
    delayCount: 8,
  },
  {
    id: 'D002',
    name: 'Anna Meyer',
    phone: '083 567 8901',
    licenceCode: 'CE',
    status: 'On Duty',
    assignedVehicleId: 'V002',
    currentJobId: 'JOB-002',
    onTimeRate: 91,
    completedJobs: 142,
    delayCount: 12,
  },
  {
    id: 'D003',
    name: 'Johan Nel',
    phone: '082 678 9012',
    licenceCode: 'C1',
    status: 'On Duty',
    assignedVehicleId: 'V003',
    currentJobId: 'JOB-003',
    onTimeRate: 88,
    completedJobs: 98,
    delayCount: 15,
  },
  {
    id: 'D004',
    name: 'Maria van der Merwe',
    phone: '083 789 0123',
    licenceCode: 'EB',
    status: 'On Duty',
    assignedVehicleId: 'V004',
    currentJobId: 'JOB-004',
    onTimeRate: 96,
    completedJobs: 201,
    delayCount: 6,
  },
  {
    id: 'D005',
    name: 'Gerhard Bronk',
    phone: '082 890 1234',
    licenceCode: 'CE',
    status: 'Available',
    assignedVehicleId: 'V005',
    currentJobId: null,
    onTimeRate: 89,
    completedJobs: 134,
    delayCount: 18,
  },
  {
    id: 'D006',
    name: 'Klein Karoo',
    phone: '083 901 2345',
    licenceCode: 'CE',
    status: 'On Duty',
    assignedVehicleId: 'V006',
    currentJobId: 'JOB-005',
    onTimeRate: 85,
    completedJobs: 87,
    delayCount: 22,
  },
  {
    id: 'D007',
    name: 'Elize Smuts',
    phone: '082 012 3456',
    licenceCode: 'C1',
    status: 'On Duty',
    assignedVehicleId: 'V008',
    currentJobId: 'JOB-006',
    onTimeRate: 92,
    completedJobs: 167,
    delayCount: 10,
  },
  {
    id: 'D008',
    name: 'Henk Roux',
    phone: '083 123 4567',
    licenceCode: 'CE',
    status: 'Available',
    assignedVehicleId: 'V009',
    currentJobId: null,
    onTimeRate: 87,
    completedJobs: 112,
    delayCount: 14,
  },
  {
    id: 'D009',
    name: 'Lize de Villiers',
    phone: '082 234 5678',
    licenceCode: 'EB',
    status: 'On Duty',
    assignedVehicleId: 'V011',
    currentJobId: 'JOB-007',
    onTimeRate: 93,
    completedJobs: 189,
    delayCount: 9,
  },
  {
    id: 'D010',
    name: 'Freek Kotze',
    phone: '083 345 6789',
    licenceCode: 'C1',
    status: 'Available',
    assignedVehicleId: 'V012',
    currentJobId: null,
    onTimeRate: 90,
    completedJobs: 145,
    delayCount: 11,
  },
];

export const JOBS = [
  {
    id: 'JOB-001',
    jobNumber: 'PX0001',
    customerId: 'C001',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Hermanus',
    cargo: 'Steel Beams',
    quantity: '12 tons',
    vehicleTypeRequired: 'Semi-Bulk',
    assignedVehicleId: 'V001',
    assignedDriverId: 'D001',
    pickupTime: '2026-04-24T08:00',
    deliveryDeadline: '2026-04-24T11:00',
    status: 'On Route',
    priority: 'High',
    price: 8500,
    estimatedCost: 6200,
    notes: 'Handle with care - premium steel',
  },
  {
    id: 'JOB-002',
    jobNumber: 'PX0002',
    customerId: 'C002',
    pickupLocation: 'Stellenbosch',
    dropoffLocation: 'Somerset West',
    cargo: 'Cement Bags',
    quantity: '8 tons',
    vehicleTypeRequired: 'Tautliner',
    assignedVehicleId: 'V002',
    assignedDriverId: 'D002',
    pickupTime: '2026-04-24T09:00',
    deliveryDeadline: '2026-04-24T12:00',
    status: 'At Pickup',
    priority: 'Medium',
    price: 5200,
    estimatedCost: 3800,
    notes: 'Keep dry',
  },
  {
    id: 'JOB-003',
    jobNumber: 'PX0003',
    customerId: 'C003',
    pickupLocation: 'Caledon',
    dropoffLocation: 'Gansbaai',
    cargo: 'Road Base Material',
    quantity: '25 tons',
    vehicleTypeRequired: 'Tipper',
    assignedVehicleId: 'V006',
    assignedDriverId: 'D006',
    pickupTime: '2026-04-24T07:00',
    deliveryDeadline: '2026-04-24T10:30',
    status: 'Loaded',
    priority: 'High',
    price: 9500,
    estimatedCost: 7100,
    notes: 'Municipal project',
  },
  {
    id: 'JOB-004',
    jobNumber: 'PX0004',
    customerId: 'C004',
    pickupLocation: 'Paarl',
    dropoffLocation: 'Kleinmond',
    cargo: 'Lumber',
    quantity: '5 tons',
    vehicleTypeRequired: 'Flatbed',
    assignedVehicleId: 'V004',
    assignedDriverId: 'D004',
    pickupTime: '2026-04-24T10:00',
    deliveryDeadline: '2026-04-24T14:00',
    status: 'Dispatched',
    priority: 'Medium',
    price: 4800,
    estimatedCost: 3400,
    notes: 'Treated pine',
  },
  {
    id: 'JOB-005',
    jobNumber: 'PX0005',
    customerId: 'C005',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Onrus',
    cargo: 'Kitchen Units',
    quantity: '2 units',
    vehicleTypeRequired: 'Panel Van',
    assignedVehicleId: 'V008',
    assignedDriverId: 'D007',
    pickupTime: '2026-04-24T11:00',
    deliveryDeadline: '2026-04-24T15:00',
    status: 'Scheduled',
    priority: 'Low',
    price: 3200,
    estimatedCost: 2100,
    notes: 'Fragile - glass tops',
  },
  {
    id: 'JOB-006',
    jobNumber: 'PX0006',
    customerId: 'C006',
    pickupLocation: 'Hermanus',
    dropoffLocation: 'Sandbaai',
    cargo: 'Groceries',
    quantity: '3 tons',
    vehicleTypeRequired: 'Refrigerated',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-24T14:00',
    deliveryDeadline: '2026-04-24T16:00',
    status: 'Quoted',
    priority: 'High',
    price: 2800,
    estimatedCost: 1900,
    notes: 'Cold chain required',
  },
  {
    id: 'JOB-007',
    jobNumber: 'PX0007',
    customerId: 'C007',
    pickupLocation: 'Somerset West',
    dropoffLocation: 'Hermanus',
    cargo: 'Building Sand',
    quantity: '20 tons',
    vehicleTypeRequired: 'Tipper',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-25T08:00',
    deliveryDeadline: '2026-04-25T12:00',
    status: 'Approved',
    priority: 'Medium',
    price: 7200,
    estimatedCost: 5100,
    notes: '',
  },
  {
    id: 'JOB-008',
    jobNumber: 'PX0008',
    customerId: 'C008',
    pickupLocation: 'Gansbaai',
    dropoffLocation: 'Cape Town',
    cargo: 'Furniture',
    quantity: '4 tons',
    vehicleTypeRequired: 'Tautliner',
    assignedVehicleId: 'V003',
    assignedDriverId: 'D003',
    pickupTime: '2026-04-24T13:00',
    deliveryDeadline: '2026-04-24T17:00',
    status: 'On Route',
    priority: 'Medium',
    price: 6200,
    estimatedCost: 4400,
    notes: 'Office furniture',
  },
  {
    id: 'JOB-009',
    jobNumber: 'PX0009',
    customerId: 'C001',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Paarl',
    cargo: 'Concrete Blocks',
    quantity: '15 tons',
    vehicleTypeRequired: 'Flatbed',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-25T09:00',
    deliveryDeadline: '2026-04-25T13:00',
    status: 'Draft',
    priority: 'Low',
    price: 5800,
    estimatedCost: 4100,
    notes: '',
  },
  {
    id: 'JOB-010',
    jobNumber: 'PX0010',
    customerId: 'C002',
    pickupLocation: 'Stellenbosch',
    dropoffLocation: 'Hermanus',
    cargo: 'Palletized Goods',
    quantity: '6 tons',
    vehicleTypeRequired: 'Tautliner',
    assignedVehicleId: 'V011',
    assignedDriverId: 'D009',
    pickupTime: '2026-04-24T08:30',
    deliveryDeadline: '2026-04-24T12:30',
    status: 'Delayed',
    priority: 'High',
    price: 7200,
    estimatedCost: 5200,
    notes: 'Traffic delay on N2',
  },
  {
    id: 'JOB-011',
    jobNumber: 'PX0011',
    customerId: 'C003',
    pickupLocation: 'Kleinmond',
    dropoffLocation: 'Caledon',
    cargo: 'Park Equipment',
    quantity: '800 kg',
    vehicleTypeRequired: 'Panel Van',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-26T08:00',
    deliveryDeadline: '2026-04-26T11:00',
    status: 'Scheduled',
    priority: 'Medium',
    price: 2400,
    estimatedCost: 1600,
    notes: 'Playground equipment',
  },
  {
    id: 'JOB-012',
    jobNumber: 'PX0012',
    customerId: 'C004',
    pickupLocation: 'Hermanus',
    dropoffLocation: 'Onrus',
    cargo: 'Tiles',
    quantity: '3 tons',
    vehicleTypeRequired: 'Panel Van',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-26T10:00',
    deliveryDeadline: '2026-04-26T13:00',
    status: 'Quoted',
    priority: 'Low',
    price: 1800,
    estimatedCost: 1200,
    notes: 'Ceramic tiles',
  },
  {
    id: 'JOB-013',
    jobNumber: 'PX0013',
    customerId: 'C005',
    pickupLocation: 'Paarl',
    dropoffLocation: 'Gansbaai',
    cargo: 'Steel Piping',
    quantity: '10 tons',
    vehicleTypeRequired: 'Flatbed',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-27T07:00',
    deliveryDeadline: '2026-04-27T12:00',
    status: 'Approved',
    priority: 'High',
    price: 9200,
    estimatedCost: 6800,
    notes: 'Industrial piping',
  },
  {
    id: 'JOB-014',
    jobNumber: 'PX0014',
    customerId: 'C006',
    pickupLocation: 'Sandbaai',
    dropoffLocation: 'Hermanus',
    cargo: 'Bedroom Furniture',
    quantity: '1.5 tons',
    vehicleTypeRequired: 'Panel Van',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-27T11:00',
    deliveryDeadline: '2026-04-27T14:00',
    status: 'Draft',
    priority: 'Medium',
    price: 2200,
    estimatedCost: 1400,
    notes: 'Beds and wardrobes',
  },
  {
    id: 'JOB-015',
    jobNumber: 'PX0015',
    customerId: 'C007',
    pickupLocation: 'Somerset West',
    dropoffLocation: 'Stellenbosch',
    cargo: 'Paint & Materials',
    quantity: '2 tons',
    vehicleTypeRequired: 'Panel Van',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-28T09:00',
    deliveryDeadline: '2026-04-28T12:00',
    status: 'Quoted',
    priority: 'Low',
    price: 1900,
    estimatedCost: 1200,
    notes: 'Architectural paints',
  },
  {
    id: 'JOB-016',
    jobNumber: 'PX0016',
    customerId: 'C008',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Hermanus',
    cargo: 'Appliances',
    quantity: '4 units',
    vehicleTypeRequired: 'Panel Van',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-24T15:00',
    deliveryDeadline: '2026-04-24T18:00',
    status: 'Scheduled',
    priority: 'Urgent',
    price: 4500,
    estimatedCost: 3100,
    notes: 'Urgent delivery - white goods',
  },
  {
    id: 'JOB-017',
    jobNumber: 'PX0017',
    customerId: 'C001',
    pickupLocation: 'Gansbaai',
    dropoffLocation: 'Caledon',
    cargo: 'Gravel',
    quantity: '30 tons',
    vehicleTypeRequired: 'Tipper',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-28T08:00',
    deliveryDeadline: '2026-04-28T11:30',
    status: 'Approved',
    priority: 'High',
    price: 8500,
    estimatedCost: 6200,
    notes: 'Landscaping gravel',
  },
  {
    id: 'JOB-018',
    jobNumber: 'PX0018',
    customerId: 'C002',
    pickupLocation: 'Onrus',
    dropoffLocation: 'Kleinmond',
    cargo: 'Plywood Sheets',
    quantity: '2.5 tons',
    vehicleTypeRequired: 'Flatbed',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-29T10:00',
    deliveryDeadline: '2026-04-29T13:00',
    status: 'Draft',
    priority: 'Low',
    price: 2800,
    estimatedCost: 1900,
    notes: 'Construction plywood',
  },
  {
    id: 'JOB-019',
    jobNumber: 'PX0019',
    customerId: 'C003',
    pickupLocation: 'Hermanus',
    dropoffLocation: 'Paarl',
    cargo: 'Prefabricated Walls',
    quantity: '8 units',
    vehicleTypeRequired: 'Flatbed',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-29T07:00',
    deliveryDeadline: '2026-04-29T11:00',
    status: 'Quoted',
    priority: 'Medium',
    price: 6800,
    estimatedCost: 4800,
    notes: 'Modular wall panels',
  },
  {
    id: 'JOB-020',
    jobNumber: 'PX0020',
    customerId: 'C004',
    pickupLocation: 'Stellenbosch',
    dropoffLocation: 'Hermanus',
    cargo: 'Insulation Material',
    quantity: '4 tons',
    vehicleTypeRequired: 'Tautliner',
    assignedVehicleId: null,
    assignedDriverId: null,
    pickupTime: '2026-04-30T08:00',
    deliveryDeadline: '2026-04-30T12:00',
    status: 'Draft',
    priority: 'Low',
    price: 5200,
    estimatedCost: 3600,
    notes: 'Thermal insulation',
  },
];

export const getCustomerById = (id) => CUSTOMERS.find((c) => c.id === id);
export const getDriverById = (id) => DRIVERS.find((d) => d.id === id);
export const getVehicleById = (id) => VEHICLES.find((v) => v.id === id);
export const getJobById = (id) => JOBS.find((j) => j.id === id);
export const getQuoteById = (id) => QUOTES.find((q) => q.id === id);
export const getInvoiceById = (id) => INVOICES.find((i) => i.id === id);
export const getCustomerJobs = (customerId, jobs = JOBS) =>
  jobs.filter((job) => job.customerId === customerId);
export const getCustomerQuotes = (customerId, quotes = QUOTES) =>
  quotes.filter((quote) => quote.customerId === customerId);
export const getCustomerInvoices = (customerId, invoices = INVOICES) =>
  invoices.filter((invoice) => invoice.customerId === customerId);
export const getCustomerMessages = (customerId, messages = CUSTOMER_MESSAGES) =>
  messages
    .filter((message) => message.customerId === customerId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
export const getCustomerRequests = (customerId, requests = CUSTOMER_REQUESTS) =>
  requests.filter((request) => request.customerId === customerId);
export const getCustomerLatestDelivery = (customerId, jobs = JOBS) =>
  jobs
    .filter((job) => job.customerId === customerId)
    .sort((a, b) => new Date(b.pickupTime) - new Date(a.pickupTime))[0];
export const getCustomerActiveDeliveries = (customerId, jobs = JOBS) =>
  jobs.filter(
    (job) =>
      job.customerId === customerId &&
      ['Approved', 'Scheduled', 'Dispatched', 'At Pickup', 'Loaded', 'On Route', 'At Dropoff', 'Delayed'].includes(job.status)
  );
export const getCustomersWithOverdueInvoices = (
  customers = CUSTOMERS,
  invoices = INVOICES
) =>
  customers
    .map((customer) => ({
      customer,
      overdue: invoices
        .filter((invoice) => invoice.customerId === customer.id && invoice.status === 'Overdue')
        .reduce((sum, invoice) => sum + invoice.balance, 0),
      count: invoices.filter(
        (invoice) => invoice.customerId === customer.id && invoice.status === 'Overdue'
      ).length,
    }))
    .filter((item) => item.overdue > 0)
    .sort((a, b) => b.overdue - a.overdue);
export const getRecentCustomerMessages = (messages = CUSTOMER_MESSAGES) =>
  [...messages]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);
export const getMaintenanceById = (id) => MAINTENANCE.find((m) => m.id === id);
export const getAlertById = (id) => ALERTS.find((a) => a.id === id);
export const getMaintenanceByVehicleId = (vehicleId, maintenance = MAINTENANCE) =>
  maintenance.filter((item) => item.vehicleId === vehicleId);
export const getOpenMaintenanceByVehicleId = (vehicleId, maintenance = MAINTENANCE) =>
  maintenance.filter((item) => item.vehicleId === vehicleId && item.status !== 'Completed');
export const getAlertsByVehicleId = (vehicleId, alerts = ALERTS) =>
  alerts.filter((alert) => alert.vehicleId === vehicleId);
export const getCriticalAlerts = (alerts = ALERTS) =>
  alerts.filter((alert) => alert.severity === 'Critical' && alert.status !== 'Resolved');

export const MAINTENANCE = [
  {
    id: 'M001',
    vehicleId: 'V001',
    type: 'Service',
    title: 'Scheduled Service',
    description: '10,000km service interval due',
    status: 'Open',
    priority: 'Medium',
    reportedDate: '2026-04-20',
    dueDate: '2026-04-30',
    completedDate: null,
    cost: 4500,
    odometer: 245890,
    downtimeDays: 0,
    assignedWorkshop: 'Pine X Workshop',
    notes: 'Standard service - oil, filters, inspection',
  },
  {
    id: 'M002',
    vehicleId: 'V005',
    type: 'Tyres',
    title: 'Front Tyre Wear',
    description: 'Front tyres showing excessive wear',
    status: 'Scheduled',
    priority: 'High',
    reportedDate: '2026-04-18',
    dueDate: '2026-04-25',
    completedDate: null,
    cost: 8500,
    odometer: 98765,
    downtimeDays: 0,
    assignedWorkshop: 'Tiger Wheel Centre',
    notes: 'Replace front axle tyres',
  },
  {
    id: 'M003',
    vehicleId: 'V007',
    type: 'Breakdown',
    title: 'Engine Not Starting',
    description: 'Vehicle will not start - battery or starter issue',
    status: 'In Progress',
    priority: 'Critical',
    reportedDate: '2026-04-23',
    dueDate: '2026-04-24',
    completedDate: null,
    cost: null,
    odometer: 345678,
    downtimeDays: 1,
    assignedWorkshop: 'Mercedes Dealer Hermanus',
    notes: 'Waiting for diagnostic',
  },
  {
    id: 'M004',
    vehicleId: 'V010',
    type: 'Licence',
    title: 'Licence Disk Expired',
    description: 'Roadworthy certificate needs renewal',
    status: 'Overdue',
    priority: 'High',
    reportedDate: '2026-04-10',
    dueDate: '2026-04-15',
    completedDate: null,
    cost: 850,
    odometer: 123456,
    downtimeDays: 9,
    assignedWorkshop: 'Licensing Dept',
    notes: 'Awaiting inspection booking',
  },
  {
    id: 'M005',
    vehicleId: 'V003',
    type: 'Brakes',
    title: 'Brake Pads Replacement',
    description: 'Rear brake pads at minimum thickness',
    status: 'Open',
    priority: 'High',
    reportedDate: '2026-04-22',
    dueDate: '2026-04-28',
    completedDate: null,
    cost: 3200,
    odometer: 312456,
    downtimeDays: 0,
    assignedWorkshop: 'Pine X Workshop',
    notes: 'Schedule for next week',
  },
  {
    id: 'M006',
    vehicleId: 'V002',
    type: 'Service',
    title: '15,000km Service',
    description: 'Full service due',
    status: 'Completed',
    priority: 'Medium',
    reportedDate: '2026-04-15',
    dueDate: '2026-04-20',
    completedDate: '2026-04-19',
    cost: 5200,
    odometer: 178234,
    downtimeDays: 0,
    assignedWorkshop: 'Pine X Workshop',
    notes: 'Completed - all fluids changed',
  },
  {
    id: 'M007',
    vehicleId: 'V006',
    type: 'Tracker',
    title: 'Tracker Device Fault',
    description: 'Tracker not responding',
    status: 'Open',
    priority: 'Medium',
    reportedDate: '2026-04-22',
    dueDate: '2026-04-27',
    completedDate: null,
    cost: 1200,
    odometer: 234567,
    downtimeDays: 0,
    assignedWorkshop: 'Demo Tracking',
    notes: 'Device needs replacement',
  },
  {
    id: 'M008',
    vehicleId: 'V009',
    type: 'Electrical',
    title: 'Headlight Fault',
    description: 'Right headlight not working',
    status: 'Scheduled',
    priority: 'Low',
    reportedDate: '2026-04-21',
    dueDate: '2026-04-30',
    completedDate: null,
    cost: 450,
    odometer: 87654,
    downtimeDays: 0,
    assignedWorkshop: 'Auto Electrics CT',
    notes: 'Bulb replacement',
  },
];

export const ALERTS = [
  {
    id: 'A001',
    vehicleId: 'V001',
    type: 'Service Due',
    title: 'Service Due Soon',
    message: 'Only 5,000km remaining until scheduled service',
    severity: 'Warning',
    createdAt: '2026-04-24',
    status: 'New',
  },
  {
    id: 'A002',
    vehicleId: 'V010',
    type: 'Licence Expiring',
    title: 'Licence Expiring',
    message: 'Roadworthy certificate expired on 2026-04-15',
    severity: 'Critical',
    createdAt: '2026-04-16',
    status: 'New',
  },
  {
    id: 'A003',
    vehicleId: 'V007',
    type: 'Breakdown Risk',
    title: 'Breakdown - Not Starting',
    message: 'Vehicle reported not starting - in workshop',
    severity: 'Critical',
    createdAt: '2026-04-23',
    status: 'Acknowledged',
  },
  {
    id: 'A004',
    vehicleId: 'V007',
    type: 'Tracker Offline',
    title: 'Tracker Offline',
    message: 'DEMO-007 device not responding',
    severity: 'Warning',
    createdAt: '2026-04-23',
    status: 'New',
  },
  {
    id: 'A005',
    vehicleId: 'V003',
    type: 'Fuel Concern',
    title: 'Low Fuel Level',
    message: 'Fuel level at 45% - recommend refuel before long trip',
    severity: 'Info',
    createdAt: '2026-04-24',
    status: 'New',
  },
  {
    id: 'A006',
    vehicleId: 'V010',
    type: 'Tracker Offline',
    title: 'Tracker Offline',
    message: 'DEMO-010 device has not reported in 24+ hours',
    severity: 'Critical',
    createdAt: '2026-04-23',
    status: 'New',
  },
  {
    id: 'A007',
    vehicleId: 'V005',
    type: 'Service Due',
    title: 'Service Overdue',
    message: 'Service was due 15,000km ago',
    severity: 'Critical',
    createdAt: '2026-04-20',
    status: 'Acknowledged',
  },
  {
    id: 'A008',
    vehicleId: 'V002',
    type: 'High Idle Time',
    title: 'High Idle Time Detected',
    message: 'Vehicle has been idle for extended periods this week',
    severity: 'Warning',
    createdAt: '2026-04-24',
    status: 'New',
  },
];

export const QUOTES = [
  {
    id: 'Q001',
    quoteNumber: 'QT-0001',
    customerId: 'C001',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Hermanus',
    cargo: 'Steel Beams',
    quantity: '12 tons',
    vehicleTypeRequired: 'Semi-Bulk',
    price: 8500,
    vat: 1275,
    total: 9775,
    validUntil: '2026-05-01',
    status: 'Accepted',
    createdAt: '2026-04-20',
    notes: 'Handle with care - premium steel',
  },
  {
    id: 'Q002',
    quoteNumber: 'QT-0002',
    customerId: 'C002',
    pickupLocation: 'Stellenbosch',
    dropoffLocation: 'Somerset West',
    cargo: 'Cement Bags',
    quantity: '8 tons',
    vehicleTypeRequired: 'Tautliner',
    price: 5200,
    vat: 780,
    total: 5980,
    validUntil: '2026-05-05',
    status: 'Sent',
    createdAt: '2026-04-21',
    notes: 'Keep dry',
  },
  {
    id: 'Q003',
    quoteNumber: 'QT-0003',
    customerId: 'C003',
    pickupLocation: 'Caledon',
    dropoffLocation: 'Gansbaai',
    cargo: 'Road Base Material',
    quantity: '25 tons',
    vehicleTypeRequired: 'Tipper',
    price: 9500,
    vat: 1425,
    total: 10925,
    validUntil: '2026-04-28',
    status: 'Draft',
    createdAt: '2026-04-22',
    notes: 'Municipal project',
  },
  {
    id: 'Q004',
    quoteNumber: 'QT-0004',
    customerId: 'C004',
    pickupLocation: 'Paarl',
    dropoffLocation: 'Kleinmond',
    cargo: 'Lumber',
    quantity: '5 tons',
    vehicleTypeRequired: 'Flatbed',
    price: 4800,
    vat: 720,
    total: 5520,
    validUntil: '2026-04-30',
    status: 'Rejected',
    createdAt: '2026-04-18',
    notes: 'Treated pine',
  },
  {
    id: 'Q005',
    quoteNumber: 'QT-0005',
    customerId: 'C005',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Onrus',
    cargo: 'Kitchen Units',
    quantity: '2 units',
    vehicleTypeRequired: 'Panel Van',
    price: 3200,
    vat: 480,
    total: 3680,
    validUntil: '2026-05-10',
    status: 'Accepted',
    createdAt: '2026-04-23',
    notes: 'Fragile - glass tops',
  },
  {
    id: 'Q006',
    quoteNumber: 'QT-0006',
    customerId: 'C006',
    pickupLocation: 'Hermanus',
    dropoffLocation: 'Sandbaai',
    cargo: 'Groceries',
    quantity: '3 tons',
    vehicleTypeRequired: 'Refrigerated',
    price: 2800,
    vat: 420,
    total: 3220,
    validUntil: '2026-04-25',
    status: 'Converted',
    createdAt: '2026-04-19',
    notes: 'Cold chain required',
  },
  {
    id: 'Q007',
    quoteNumber: 'QT-0007',
    customerId: 'C007',
    pickupLocation: 'Somerset West',
    dropoffLocation: 'Hermanus',
    cargo: 'Building Sand',
    quantity: '20 tons',
    vehicleTypeRequired: 'Tipper',
    price: 7200,
    vat: 1080,
    total: 8280,
    validUntil: '2026-05-15',
    status: 'Sent',
    createdAt: '2026-04-24',
    notes: '',
  },
  {
    id: 'Q008',
    quoteNumber: 'QT-0008',
    customerId: 'C008',
    pickupLocation: 'Gansbaai',
    dropoffLocation: 'Cape Town',
    cargo: 'Furniture',
    quantity: '4 tons',
    vehicleTypeRequired: 'Tautliner',
    price: 6200,
    vat: 930,
    total: 7130,
    validUntil: '2026-04-26',
    status: 'Expired',
    createdAt: '2026-04-10',
    notes: 'Office furniture',
  },
  {
    id: 'Q009',
    quoteNumber: 'QT-0009',
    customerId: 'C001',
    pickupLocation: 'Cape Town',
    dropoffLocation: 'Paarl',
    cargo: 'Concrete Blocks',
    quantity: '15 tons',
    vehicleTypeRequired: 'Flatbed',
    price: 5800,
    vat: 870,
    total: 6670,
    validUntil: '2026-05-20',
    status: 'Draft',
    createdAt: '2026-04-24',
    notes: '',
  },
  {
    id: 'Q010',
    quoteNumber: 'QT-0010',
    customerId: 'C002',
    pickupLocation: 'Stellenbosch',
    dropoffLocation: 'Hermanus',
    cargo: 'Palletized Goods',
    quantity: '6 tons',
    vehicleTypeRequired: 'Tautliner',
    price: 7200,
    vat: 1080,
    total: 8280,
    validUntil: '2026-05-25',
    status: 'Sent',
    createdAt: '2026-04-23',
    notes: '',
  },
];

export const INVOICES = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-0001',
    customerId: 'C001',
    jobId: 'JOB-001',
    issueDate: '2026-04-20',
    dueDate: '2026-05-20',
    subtotal: 8500,
    vat: 1275,
    total: 9775,
    paidAmount: 9775,
    balance: 0,
    status: 'Paid',
    notes: 'Steel beams delivery',
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-0002',
    customerId: 'C002',
    jobId: 'JOB-002',
    issueDate: '2026-04-21',
    dueDate: '2026-05-21',
    subtotal: 5200,
    vat: 780,
    total: 5980,
    paidAmount: 0,
    balance: 5980,
    status: 'Sent',
    notes: 'Cement delivery',
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV-0003',
    customerId: 'C003',
    jobId: 'JOB-003',
    issueDate: '2026-04-18',
    dueDate: '2026-05-18',
    subtotal: 9500,
    vat: 1425,
    total: 10925,
    paidAmount: 5000,
    balance: 5925,
    status: 'Part Paid',
    notes: 'Road base - partial payment received',
  },
  {
    id: 'INV004',
    invoiceNumber: 'INV-0004',
    customerId: 'C004',
    jobId: 'JOB-004',
    issueDate: '2026-04-15',
    dueDate: '2026-05-15',
    subtotal: 4800,
    vat: 720,
    total: 5520,
    paidAmount: 0,
    balance: 5520,
    status: 'Overdue',
    notes: 'Lumber delivery - OVERDUE',
  },
  {
    id: 'INV005',
    invoiceNumber: 'INV-0005',
    customerId: 'C005',
    jobId: 'JOB-005',
    issueDate: '2026-04-22',
    dueDate: '2026-05-22',
    subtotal: 3200,
    vat: 480,
    total: 3680,
    paidAmount: 0,
    balance: 3680,
    status: 'Sent',
    notes: 'Kitchen units',
  },
  {
    id: 'INV006',
    invoiceNumber: 'INV-0006',
    customerId: 'C006',
    jobId: 'JOB-006',
    issueDate: '2026-04-19',
    dueDate: '2026-05-19',
    subtotal: 2800,
    vat: 420,
    total: 3220,
    paidAmount: 3220,
    balance: 0,
    status: 'Paid',
    notes: 'Groceries cold chain',
  },
  {
    id: 'INV007',
    invoiceNumber: 'INV-0007',
    customerId: 'C007',
    jobId: 'JOB-007',
    issueDate: '2026-04-23',
    dueDate: '2026-05-23',
    subtotal: 7200,
    vat: 1080,
    total: 8280,
    paidAmount: 0,
    balance: 8280,
    status: 'Sent',
    notes: 'Building sand',
  },
  {
    id: 'INV008',
    invoiceNumber: 'INV-0008',
    customerId: 'C008',
    jobId: 'JOB-008',
    issueDate: '2026-04-24',
    dueDate: '2026-05-24',
    subtotal: 6200,
    vat: 930,
    total: 7130,
    paidAmount: 0,
    balance: 7130,
    status: 'Draft',
    notes: 'Furniture delivery',
  },
  {
    id: 'INV009',
    invoiceNumber: 'INV-0009',
    customerId: 'C001',
    jobId: 'JOB-009',
    issueDate: '2026-04-10',
    dueDate: '2026-05-10',
    subtotal: 5800,
    vat: 870,
    total: 6670,
    paidAmount: 6670,
    balance: 0,
    status: 'Paid',
    notes: 'Concrete blocks - paid in full',
  },
  {
    id: 'INV010',
    invoiceNumber: 'INV-0010',
    customerId: 'C002',
    jobId: null,
    issueDate: '2026-04-25',
    dueDate: '2026-05-25',
    subtotal: 4500,
    vat: 675,
    total: 5175,
    paidAmount: 0,
    balance: 5175,
    status: 'Draft',
    notes: 'Monthly retainer - not yet linked to job',
  },
];

export const CUSTOMER_MESSAGES = [
  {
    id: 'MSG001',
    customerId: 'C001',
    author: 'System',
    type: 'system',
    content: 'Job PX0001 was dispatched from Cape Town at 08:05.',
    timestamp: '2026-04-24T08:05:00',
  },
  {
    id: 'MSG002',
    customerId: 'C001',
    author: 'Pieter Smith',
    type: 'customer',
    content: 'Please confirm the site ETA before 10:30 so our crew can prepare offloading.',
    timestamp: '2026-04-24T08:19:00',
  },
  {
    id: 'MSG003',
    customerId: 'C001',
    author: 'Operations Desk',
    type: 'operations',
    content: 'Driver Pieter is on route and the latest ETA is 10:05.',
    timestamp: '2026-04-24T08:24:00',
  },
  {
    id: 'MSG004',
    customerId: 'C002',
    author: 'System',
    type: 'system',
    content: 'Driver arrived at pickup for job PX0002.',
    timestamp: '2026-04-24T09:18:00',
  },
  {
    id: 'MSG005',
    customerId: 'C002',
    author: 'Anna Meyer',
    type: 'customer',
    content: 'Client store access opens at 11:45. Please keep us posted if there is any delay.',
    timestamp: '2026-04-24T09:26:00',
  },
  {
    id: 'MSG006',
    customerId: 'C004',
    author: 'System',
    type: 'system',
    content: 'Invoice INV-0004 was sent for job PX0004.',
    timestamp: '2026-04-15T14:10:00',
  },
  {
    id: 'MSG007',
    customerId: 'C005',
    author: 'Operations Desk',
    type: 'operations',
    content: 'The vehicle is scheduled and we will send driver details once loading begins.',
    timestamp: '2026-04-24T10:15:00',
  },
  {
    id: 'MSG008',
    customerId: 'C007',
    author: 'System',
    type: 'system',
    content: 'POD uploaded for job PX0007.',
    timestamp: '2026-04-25T12:28:00',
  },
  {
    id: 'MSG009',
    customerId: 'C008',
    author: 'Elize Smuts',
    type: 'customer',
    content: 'Can we get invoice visibility per site once delivery is complete?',
    timestamp: '2026-04-24T13:42:00',
  },
  {
    id: 'MSG010',
    customerId: 'C008',
    author: 'Operations Desk',
    type: 'operations',
    content: 'Yes, invoices linked to completed jobs will appear in the customer portal automatically.',
    timestamp: '2026-04-24T13:48:00',
  },
];

export const CUSTOMER_REQUESTS = [
  {
    id: 'REQ001',
    customerId: 'C001',
    title: 'Urgent aggregate delivery',
    description: 'Need a same-day tipper slot for a municipal support site.',
    status: 'New',
    createdAt: '2026-04-24T07:52:00',
  },
  {
    id: 'REQ002',
    customerId: 'C008',
    title: 'Invoice copy request',
    description: 'Requesting combined invoice pack for April property maintenance jobs.',
    status: 'Acknowledged',
    createdAt: '2026-04-24T10:31:00',
  },
  {
    id: 'REQ003',
    customerId: 'C005',
    title: 'New delivery quote',
    description: 'Quote required for steel piping run from Paarl to Gansbaai.',
    status: 'New',
    createdAt: '2026-04-24T11:45:00',
  },
];

export const SETTINGS_COMPANY_PROFILE = {
  companyName: 'Pine X Logistics (Pty) Ltd',
  registrationNumber: '2021/458921/07',
  vatNumber: '4120286751',
  phone: '021 555 0188',
  email: 'ops@pinexlogistics.co.za',
  address: '18 Industrial Crescent, Hermanus, 7200',
  logoPlaceholder: 'PX Logistics',
};

export const SETTINGS_DEMO_USERS = [
  { id: 'U001', name: 'Eduard Smith', email: 'owner@pinexlogistics.co.za', role: 'Owner/Admin', active: true },
  { id: 'U002', name: 'Nadine Jacobs', email: 'ops@pinexlogistics.co.za', role: 'Operations Manager', active: true },
  { id: 'U003', name: 'Kurt Adams', email: 'dispatch@pinexlogistics.co.za', role: 'Dispatcher', active: true },
  { id: 'U004', name: 'Pieter Smith', email: 'driver01@pinexlogistics.co.za', role: 'Driver', active: true },
  { id: 'U005', name: 'Leanne Brown', email: 'finance@pinexlogistics.co.za', role: 'Finance', active: true },
  { id: 'U006', name: 'Gerhard Bronk', email: 'maintenance@pinexlogistics.co.za', role: 'Maintenance Manager', active: false },
];

export const SETTINGS_NOTIFICATION_DEFAULTS = {
  delayedDelivery: true,
  trackerOffline: true,
  maintenanceDue: true,
  licenceExpiring: true,
  invoiceOverdue: true,
  podUploaded: true,
  driverReportedIssue: true,
  quoteAccepted: false,
};

export const SETTINGS_INVOICE_DEFAULTS = {
  vatRate: 15,
  defaultInvoiceTerms: 'Payment due within 30 days from invoice date.',
  paymentDueDays: 30,
  invoicePrefix: 'INV',
  quotePrefix: 'QT',
};

export const getOverdueMaintenance = (maintenance = MAINTENANCE) =>
  maintenance.filter((item) => item.status === 'Overdue');

export const getVehicleHealthScore = (
  vehicleId,
  maintenance = MAINTENANCE,
  alerts = ALERTS,
  vehicles = VEHICLES
) => {
  const vehicle = vehicles.find((item) => item.id === vehicleId);

  if (!vehicle) {
    return {
      score: 0,
      status: 'critical',
      label: 'Unknown',
      explanation: 'Vehicle data is unavailable.',
      recommendedAction: 'Verify vehicle setup in the fleet register.',
      openMaintenanceCount: 0,
      overdueMaintenanceCount: 0,
      criticalAlertCount: 0,
      trackerOffline: false,
      daysUntilLicenceExpiry: 0,
    };
  }

  const vehicleMaintenance = getMaintenanceByVehicleId(vehicleId, maintenance);
  const openMaintenance = vehicleMaintenance.filter((item) => item.status !== 'Completed');
  const overdueMaintenance = vehicleMaintenance.filter((item) => item.status === 'Overdue');
  const vehicleAlerts = getAlertsByVehicleId(vehicleId, alerts).filter(
    (alert) => alert.status !== 'Resolved'
  );
  const trackerOffline = vehicleAlerts.some((alert) => alert.type === 'Tracker Offline');
  const criticalAlerts = vehicleAlerts.filter((alert) => alert.severity === 'Critical');

  const licenceExpiryDate = new Date(vehicle.licenceExpiry);
  const daysUntilLicenceExpiry = Math.floor(
    (licenceExpiryDate - new Date()) / (1000 * 60 * 60 * 24)
  );

  let score = 100;

  if (vehicle.serviceDueKm <= 0) score -= 30;
  else if (vehicle.serviceDueKm < 3000) score -= 22;
  else if (vehicle.serviceDueKm < 5000) score -= 14;
  else if (vehicle.serviceDueKm < 8000) score -= 6;

  score -= openMaintenance.length * 8;
  score -= overdueMaintenance.length * 14;

  if (daysUntilLicenceExpiry < 0) score -= 28;
  else if (daysUntilLicenceExpiry < 30) score -= 20;
  else if (daysUntilLicenceExpiry < 60) score -= 10;

  if (vehicle.fuelLevel < 25) score -= 14;
  else if (vehicle.fuelLevel < 40) score -= 7;

  if (trackerOffline) score -= 16;

  score -= criticalAlerts.length * 10;
  score = Math.max(0, Math.min(100, score));

  const status = score >= 80 ? 'healthy' : score >= 50 ? 'watch' : 'critical';
  const label = status === 'healthy' ? 'Healthy' : status === 'watch' ? 'Watch' : 'Critical';
  const explanation =
    status === 'healthy'
      ? 'Service timing, licence status, and fleet alerts are under control.'
      : status === 'watch'
        ? 'Maintenance signals need attention before they turn into downtime.'
        : 'Breakdown or compliance risk is elevated and action is urgent.';

  const recommendedAction =
    overdueMaintenance.length > 0
      ? 'Prioritise overdue workshop work and protect dispatch capacity.'
      : trackerOffline
        ? 'Restore tracker visibility and verify the last known vehicle condition.'
        : daysUntilLicenceExpiry < 30
          ? 'Book licence and roadworthy follow-up immediately.'
          : openMaintenance.length > 0
            ? 'Schedule open maintenance before the next major assignment.'
            : 'Keep the vehicle on the active preventive maintenance cycle.';

  return {
    score,
    status,
    label,
    explanation,
    recommendedAction,
    openMaintenanceCount: openMaintenance.length,
    overdueMaintenanceCount: overdueMaintenance.length,
    criticalAlertCount: criticalAlerts.length,
    trackerOffline,
    daysUntilLicenceExpiry,
  };
};

export const getVehiclesNeedingAttention = (
  vehicles = VEHICLES,
  maintenance = MAINTENANCE,
  alerts = ALERTS
) =>
  vehicles
    .map((vehicle) => ({
      vehicle,
      ...getVehicleHealthScore(vehicle.id, maintenance, alerts, vehicles),
      alerts: getAlertsByVehicleId(vehicle.id, alerts).filter((alert) => alert.status !== 'Resolved'),
      maintenance: getOpenMaintenanceByVehicleId(vehicle.id, maintenance),
    }))
    .filter(
      (item) =>
        item.score < 80 ||
        item.openMaintenanceCount > 0 ||
        item.criticalAlertCount > 0 ||
        item.daysUntilLicenceExpiry < 60
    )
    .sort((a, b) => a.score - b.score);

export const getMaintenanceCostThisMonth = (
  maintenance = MAINTENANCE,
  referenceDate = new Date()
) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  return maintenance
    .filter((item) => item.cost && item.completedDate)
    .filter((item) => {
      const completed = new Date(item.completedDate);
      return completed.getFullYear() === year && completed.getMonth() === month;
    })
    .reduce((sum, item) => sum + item.cost, 0);
};

export const getFleetHealthSummary = (
  vehicles = VEHICLES,
  maintenance = MAINTENANCE,
  alerts = ALERTS
) => {
  const vehicleScores = vehicles.map((vehicle) => ({
    vehicle,
    ...getVehicleHealthScore(vehicle.id, maintenance, alerts, vehicles),
  }));

  const unresolvedAlerts = alerts.filter((alert) => alert.status !== 'Resolved');
  const openMaintenance = maintenance.filter((item) => item.status !== 'Completed');
  const overdueMaintenance = getOverdueMaintenance(maintenance);
  const vehiclesNeedingAttention = getVehiclesNeedingAttention(vehicles, maintenance, alerts);
  const estimatedDowntimeCost = openMaintenance.reduce(
    (sum, item) => sum + item.downtimeDays * 1500,
    0
  );
  const licenceExpiringSoon = vehicleScores.filter(
    (item) => item.daysUntilLicenceExpiry < 60
  ).length;
  const trackerOfflineWarnings = unresolvedAlerts.filter(
    (alert) => alert.type === 'Tracker Offline'
  ).length;
  const vehiclesInWorkshop = vehicles.filter((vehicle) =>
    ['Maintenance', 'Offline'].includes(vehicle.status)
  ).length;

  return {
    averageScore:
      vehicleScores.length > 0
        ? Math.round(
            vehicleScores.reduce((sum, item) => sum + item.score, 0) / vehicleScores.length
          )
        : 0,
    healthyVehicles: vehicleScores.filter((item) => item.status === 'healthy').length,
    watchVehicles: vehicleScores.filter((item) => item.status === 'watch').length,
    criticalVehicles: vehicleScores.filter((item) => item.status === 'critical').length,
    openMaintenance: openMaintenance.length,
    overdueMaintenance: overdueMaintenance.length,
    vehiclesInWorkshop,
    criticalAlerts: getCriticalAlerts(unresolvedAlerts).length,
    licenceExpiringSoon,
    trackerOfflineWarnings,
    vehiclesNeedingAttention: vehiclesNeedingAttention.length,
    maintenanceCostThisMonth: getMaintenanceCostThisMonth(maintenance),
    estimatedDowntimeCost,
  };
};

export const getDateRangeStart = (dateRange = '30d', now = new Date()) => {
  if (dateRange === 'all') return null;

  const start = new Date(now);
  const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30;
  start.setDate(start.getDate() - days);
  return start;
};

export const isDateInRange = (dateValue, dateRange = '30d', now = new Date()) => {
  if (dateRange === 'all') return true;
  if (!dateValue) return false;

  const target = new Date(dateValue);
  const start = getDateRangeStart(dateRange, now);
  return target >= start && target <= now;
};

export const getDeliveredJobs = (jobs = JOBS) =>
  jobs.filter((job) => job.status === 'Delivered');

export const getRevenueThisMonth = (jobs = JOBS) =>
  jobs
    .filter((job) => ['Delivered', 'On Route', 'At Pickup', 'Loaded', 'At Dropoff', 'Dispatched'].includes(job.status))
    .reduce((sum, job) => sum + job.price, 0);

export const getOutstandingInvoices = (invoices = INVOICES) =>
  invoices.filter((invoice) => invoice.status !== 'Paid' && invoice.status !== 'Cancelled');

export const getFleetUtilizationRate = (vehicles = VEHICLES) => {
  if (vehicles.length === 0) return 0;
  const utilizedVehicles = vehicles.filter((vehicle) => ['Active', 'Maintenance'].includes(vehicle.status)).length;
  return Math.round((utilizedVehicles / vehicles.length) * 100);
};

export const getOnTimeDeliveryRate = (drivers = DRIVERS) => {
  if (drivers.length === 0) return 0;
  return Math.round(
    drivers.reduce((sum, driver) => sum + driver.onTimeRate, 0) / drivers.length
  );
};

export const getDelayReasonLabel = (job) => {
  const note = (job.notes || '').toLowerCase();

  if (note.includes('traffic')) return 'Traffic congestion';
  if (note.includes('cold chain')) return 'Cold-chain handling';
  if (note.includes('urgent')) return 'Last-minute booking';
  if (note.includes('fragile')) return 'Load handling delay';
  if (job.status === 'Delayed') return 'Route execution issue';
  return 'Scheduling or dispatch delay';
};

export const getMoneyLeakageReport = (
  jobs = JOBS,
  invoices = INVOICES,
  maintenance = MAINTENANCE,
  alerts = ALERTS,
  vehicles = VEHICLES
) => {
  const outstandingInvoices = getOutstandingInvoices(invoices);
  const overdueInvoices = outstandingInvoices.filter((invoice) => invoice.status === 'Overdue');
  const delayedJobs = jobs.filter((job) => job.status === 'Delayed');
  const draftJobs = jobs.filter((job) => ['Draft', 'Quoted'].includes(job.status));
  const idleVehicles = vehicles.filter((vehicle) => vehicle.status === 'Idle');
  const trackerOfflineAlerts = alerts.filter(
    (alert) => alert.type === 'Tracker Offline' && alert.status !== 'Resolved'
  );
  const highIdleAlerts = alerts.filter(
    (alert) => alert.type === 'High Idle Time' && alert.status !== 'Resolved'
  );
  const openMaintenance = maintenance.filter((item) => item.status !== 'Completed');

  const leakageItems = [
    {
      id: 'idle-time',
      title: 'Idle time',
      amount: idleVehicles.length * 6400 + highIdleAlerts.length * 1800,
      reason: `${idleVehicles.length} vehicles are sitting idle and ${highIdleAlerts.length} alerts point to excess engine-on time.`,
      impact: 'Dispatch capacity is under-used while fuel, payroll, and asset finance keep running.',
      recommendedAction: 'Rebalance dispatch planning and set idle-time alerts by driver and vehicle.',
    },
    {
      id: 'late-deliveries',
      title: 'Late deliveries',
      amount: delayedJobs.reduce((sum, job) => sum + Math.round(job.price * 0.18), 0),
      reason: `${delayedJobs.length} jobs are delayed, increasing client service risk and overtime exposure.`,
      impact: 'Late jobs create penalty risk, rework, and weaker customer retention.',
      recommendedAction: 'Use live dispatch boards and route exceptions to recover at-risk deliveries earlier.',
    },
    {
      id: 'empty-return-trips',
      title: 'Empty return trips',
      amount: jobs.filter((job) => ['Approved', 'Quoted', 'Draft'].includes(job.status)).length * 2100,
      reason: 'Approved and quoted loads indicate route demand that is not being paired with return capacity.',
      impact: 'Vehicles burn kilometres without revenue, lowering route profitability.',
      recommendedAction: 'Match quoting and dispatch to return-leg availability before trucks leave the region.',
    },
    {
      id: 'fuel-waste',
      title: 'Fuel waste',
      amount: highIdleAlerts.length * 2200 + trackerOfflineAlerts.length * 1300,
      reason: 'High idle and tracker visibility gaps make fuel loss harder to control.',
      impact: 'Fuel cost creeps up without a clear operational explanation.',
      recommendedAction: 'Watch idle patterns daily and enforce tracker uptime across the full fleet.',
    },
    {
      id: 'vehicle-downtime',
      title: 'Vehicle downtime',
      amount: openMaintenance.reduce((sum, item) => sum + item.downtimeDays * 1500, 0),
      reason: `${openMaintenance.length} maintenance items are absorbing workshop time and delivery capacity.`,
      impact: 'Downtime forces rescheduling, subcontracting, or missed service commitments.',
      recommendedAction: 'Move overdue and in-progress work into tighter maintenance planning windows.',
    },
    {
      id: 'overdue-invoices',
      title: 'Overdue invoices',
      amount: overdueInvoices.reduce((sum, invoice) => sum + invoice.balance, 0),
      reason: `${overdueInvoices.length} overdue invoices are tying up working capital that should fund operations.`,
      impact: 'Cash flow pressure makes it harder to fuel, maintain, and scale the fleet.',
      recommendedAction: 'Escalate collections based on invoice age and customer exposure.',
    },
    {
      id: 'missed-billing',
      title: 'Missed billing opportunities',
      amount: draftJobs.reduce((sum, job) => sum + Math.round(job.price * 0.35), 0),
      reason: `${draftJobs.length} draft or quoted jobs show work demand that has not yet converted cleanly into billing.`,
      impact: 'Revenue slips through while the team is busy but margin does not land in the bank.',
      recommendedAction: 'Link quotes, jobs, and invoicing so every fulfilled movement becomes a tracked billable event.',
    },
  ];

  return leakageItems.map((item) => ({
    ...item,
    severity:
      item.amount >= 12000 ? 'critical' : item.amount >= 6000 ? 'warning' : 'info',
  }));
};

export const getOperationalReportCards = (
  jobs = JOBS,
  invoices = INVOICES,
  drivers = DRIVERS,
  vehicles = VEHICLES,
  maintenance = MAINTENANCE
) => {
  const revenueByCustomer = CUSTOMERS.map((customer) => {
    const customerJobs = jobs.filter((job) => job.customerId === customer.id);
    const revenue = customerJobs.reduce((sum, job) => sum + job.price, 0);
    return { label: customer.name, value: revenue };
  })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const profitPerJob = jobs
    .map((job) => ({
      label: job.jobNumber,
      value: job.price - job.estimatedCost,
      subtitle: `${getCustomerById(job.customerId)?.name || 'Unknown customer'}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const driverPerformance = drivers
    .map((driver) => ({
      label: driver.name,
      value: driver.onTimeRate,
      subtitle: `${driver.completedJobs} completed jobs`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const vehicleProfitability = vehicles
    .map((vehicle) => {
      const vehicleJobs = jobs.filter((job) => job.assignedVehicleId === vehicle.id);
      return {
        label: vehicle.registration,
        value: vehicleJobs.reduce((sum, job) => sum + (job.price - job.estimatedCost), 0),
        subtitle: vehicle.name,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const delayReasons = jobs
    .filter((job) => job.status === 'Delayed')
    .reduce((acc, job) => {
      const reason = getDelayReasonLabel(job);
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

  const fuelEfficiency = vehicles
    .map((vehicle) => ({
      label: vehicle.registration,
      value: Math.max(2.8, Number((32 - vehicle.fuelLevel / 5 - vehicle.serviceDueKm / 5000).toFixed(1))),
      subtitle: `${vehicle.type}`,
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 5);

  const maintenanceCost = maintenance
    .filter((item) => item.cost)
    .reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + item.cost;
      return acc;
    }, {});

  const outstandingByCustomer = outstandingInvoices =>
    CUSTOMERS.map((customer) => ({
      label: customer.name,
      value: outstandingInvoices
        .filter((invoice) => invoice.customerId === customer.id)
        .reduce((sum, invoice) => sum + invoice.balance, 0),
    }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

  const outstandingInvoices = getOutstandingInvoices(invoices);
  const fleetUtilization = [
    { label: 'Utilized', value: getFleetUtilizationRate(vehicles) },
    { label: 'Available', value: 100 - getFleetUtilizationRate(vehicles) },
  ];

  return [
    {
      id: 'revenue-by-customer',
      type: 'Revenue by Customer',
      title: 'Revenue by customer',
      value: `R${revenueByCustomer.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      subtitle: 'Top contributing accounts this period',
      rows: revenueByCustomer,
      format: 'currency',
    },
    {
      id: 'profit-per-job',
      type: 'Profit per Job',
      title: 'Profit per job',
      value: `R${profitPerJob.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      subtitle: 'Highest margin movements',
      rows: profitPerJob,
      format: 'currency',
    },
    {
      id: 'driver-performance',
      type: 'Driver Performance',
      title: 'Driver performance',
      value: `${getOnTimeDeliveryRate(drivers)}%`,
      subtitle: 'Average on-time score across drivers',
      rows: driverPerformance,
      format: 'percentage',
    },
    {
      id: 'vehicle-profitability',
      type: 'Vehicle Profitability',
      title: 'Vehicle profitability',
      value: `R${vehicleProfitability.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      subtitle: 'Best performing fleet assets',
      rows: vehicleProfitability,
      format: 'currency',
    },
    {
      id: 'on-time-delivery-rate',
      type: 'On-Time Delivery Rate',
      title: 'On-time delivery rate',
      value: `${getOnTimeDeliveryRate(drivers)}%`,
      subtitle: 'Driver performance trend this month',
      rows: driverPerformance.slice(0, 3),
      format: 'percentage',
    },
    {
      id: 'delay-reasons',
      type: 'Delay Reasons',
      title: 'Delay reasons',
      value: `${Object.values(delayReasons).reduce((sum, count) => sum + count, 0)} jobs`,
      subtitle: 'Most common causes of delayed delivery',
      rows: Object.entries(delayReasons).map(([label, value]) => ({ label, value })),
      format: 'count',
    },
    {
      id: 'fuel-efficiency',
      type: 'Fuel Efficiency',
      title: 'Fuel efficiency',
      value: `${fuelEfficiency[0]?.value || 0} L/100km`,
      subtitle: 'Lower is better',
      rows: fuelEfficiency,
      format: 'ratio',
    },
    {
      id: 'maintenance-cost',
      type: 'Maintenance Cost',
      title: 'Maintenance cost',
      value: `R${getMaintenanceCostThisMonth(maintenance).toLocaleString()}`,
      subtitle: 'Spend by maintenance category',
      rows: Object.entries(maintenanceCost).map(([label, value]) => ({ label, value })),
      format: 'currency',
    },
    {
      id: 'outstanding-invoices',
      type: 'Outstanding Invoices',
      title: 'Outstanding invoices',
      value: `R${outstandingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0).toLocaleString()}`,
      subtitle: 'Accounts requiring follow-up',
      rows: outstandingByCustomer(outstandingInvoices),
      format: 'currency',
    },
    {
      id: 'fleet-utilization',
      type: 'Fleet Utilization',
      title: 'Fleet utilization',
      value: `${getFleetUtilizationRate(vehicles)}%`,
      subtitle: 'Share of fleet currently earning or engaged',
      rows: fleetUtilization,
      format: 'percentage',
    },
  ];
};

export const getAiInsights = (
  jobs = JOBS,
  invoices = INVOICES,
  drivers = DRIVERS,
  vehicles = VEHICLES,
  maintenance = MAINTENANCE,
  alerts = ALERTS
) => {
  const highIdleAlert = alerts.find((alert) => alert.type === 'High Idle Time');
  const highIdleVehicle = highIdleAlert ? getVehicleById(highIdleAlert.vehicleId) : vehicles[0];
  const topDebtor = CUSTOMERS.map((customer) => ({
    customer,
    total: invoices
      .filter((invoice) => invoice.customerId === customer.id && invoice.status !== 'Paid')
      .reduce((sum, invoice) => sum + invoice.balance, 0),
    count: invoices.filter((invoice) => invoice.customerId === customer.id && invoice.status !== 'Paid').length,
  }))
    .sort((a, b) => b.total - a.total)[0];
  const kleinmondJobs = jobs.filter(
    (job) =>
      [job.pickupLocation, job.dropoffLocation].some((location) => location === 'Kleinmond')
  );
  const delayedKleinmondJobs = kleinmondJobs.filter((job) => job.status === 'Delayed').length;
  const serviceDueVehicle = [...vehicles].sort((a, b) => a.serviceDueKm - b.serviceDueKm)[0];
  const topDriver = [...drivers].sort((a, b) => b.onTimeRate - a.onTimeRate)[0];
  const maintenanceExposure = maintenance.filter((item) => item.status !== 'Completed').length;

  return [
    {
      id: 'idle-insight',
      title: `${highIdleVehicle?.registration || 'Truck 04'} is showing 18% higher idle time than the fleet average.`,
      body: 'Idle time is inflating fuel cost and reducing vehicle productivity during active dispatch hours.',
      tone: 'warning',
      meta: 'Idle time leakage',
    },
    {
      id: 'debtor-insight',
      title: `${topDebtor?.customer.name || 'HFC Construction'} owes R${(topDebtor?.total || 0).toLocaleString()} across ${topDebtor?.count || 0} invoices.`,
      body: 'Collections risk is rising faster than new cash receipts from completed jobs.',
      tone: 'critical',
      meta: 'Receivables exposure',
    },
    {
      id: 'route-insight',
      title: `Kleinmond route delays rose to ${delayedKleinmondJobs} active exceptions this cycle.`,
      body: 'The corridor is creating repeat timing pressure that should be reviewed in dispatch planning.',
      tone: 'warning',
      meta: 'Route pressure',
    },
    {
      id: 'service-insight',
      title: `Vehicle ${serviceDueVehicle?.registration || 'CF123456'} is due for service within ${serviceDueVehicle?.serviceDueKm || 0} km.`,
      body: 'Preventive maintenance can still happen before the unit becomes a dispatch risk.',
      tone: 'info',
      meta: 'Maintenance timing',
    },
    {
      id: 'driver-insight',
      title: `Driver ${topDriver?.name || 'J. Williams'} has the best on-time delivery rate this month at ${topDriver?.onTimeRate || 0}%.`,
      body: 'This gives operations a benchmark for route discipline and customer communication.',
      tone: 'success',
      meta: 'Driver benchmark',
    },
    {
      id: 'maintenance-insight',
      title: `${maintenanceExposure} open maintenance items are still competing with revenue-generating fleet time.`,
      body: 'Unresolved workshop demand is now visible in both downtime cost and dispatch flexibility.',
      tone: 'warning',
      meta: 'Workshop exposure',
    },
  ];
};

export const TRACKING_DEMO_LOCATIONS = {
  'Cape Town': { latitude: -33.9249, longitude: 18.4241, mapX: 12, mapY: 18 },
  'Somerset West': { latitude: -34.0797, longitude: 18.8565, mapX: 33, mapY: 27 },
  Hermanus: { latitude: -34.4187, longitude: 19.2345, mapX: 59, mapY: 53 },
  Onrus: { latitude: -34.4231, longitude: 19.1761, mapX: 54, mapY: 54 },
  Sandbaai: { latitude: -34.4265, longitude: 19.1524, mapX: 52, mapY: 56 },
  Kleinmond: { latitude: -34.3388, longitude: 19.0248, mapX: 46, mapY: 48 },
  "Betty's Bay": { latitude: -34.3597, longitude: 18.9084, mapX: 39, mapY: 51 },
  Gansbaai: { latitude: -34.5806, longitude: 19.3519, mapX: 71, mapY: 66 },
  Caledon: { latitude: -34.2299, longitude: 19.4265, mapX: 70, mapY: 37 },
};

export const TRACKING_DEMO_ROUTES = [
  ['Cape Town', 'Somerset West', "Betty's Bay", 'Kleinmond', 'Onrus', 'Hermanus'],
  ['Cape Town', 'Caledon', 'Hermanus', 'Gansbaai'],
  ['Somerset West', 'Kleinmond', 'Hermanus'],
  ['Hermanus', 'Onrus', 'Sandbaai'],
  ['Caledon', 'Hermanus', 'Gansbaai'],
];

export const VEHICLE_COMPLIANCE = [
  { vehicleId: 'V001', roadworthyDate: '2026-11-20', insuranceExpiry: '2026-12-31', permitExpiry: '2026-10-15' },
  { vehicleId: 'V002', roadworthyDate: '2026-09-18', insuranceExpiry: '2026-08-31', permitExpiry: '2026-07-20' },
  { vehicleId: 'V003', roadworthyDate: '2026-10-05', insuranceExpiry: '2026-11-30', permitExpiry: '2026-09-12' },
  { vehicleId: 'V004', roadworthyDate: '2026-06-14', insuranceExpiry: '2026-07-31', permitExpiry: '2026-05-30' },
  { vehicleId: 'V005', roadworthyDate: '2026-12-01', insuranceExpiry: '2026-12-20', permitExpiry: '2026-10-28' },
  { vehicleId: 'V006', roadworthyDate: '2026-08-19', insuranceExpiry: '2026-09-30', permitExpiry: '2026-09-01' },
  { vehicleId: 'V007', roadworthyDate: '2026-05-28', insuranceExpiry: '2026-06-30', permitExpiry: '2026-05-18' },
  { vehicleId: 'V008', roadworthyDate: '2026-07-12', insuranceExpiry: '2026-08-31', permitExpiry: '2026-08-14' },
  { vehicleId: 'V009', roadworthyDate: '2026-10-21', insuranceExpiry: '2026-11-15', permitExpiry: '2026-10-02' },
  { vehicleId: 'V010', roadworthyDate: '2026-09-30', insuranceExpiry: '2026-12-10', permitExpiry: '2026-11-08' },
  { vehicleId: 'V011', roadworthyDate: '2026-04-30', insuranceExpiry: '2026-06-12', permitExpiry: '2026-05-22' },
  { vehicleId: 'V012', roadworthyDate: '2026-08-27', insuranceExpiry: '2026-10-19', permitExpiry: '2026-09-25' },
];

export const CUSTOMER_DISPUTES = [
  {
    id: 'DSP001',
    customerId: 'C002',
    jobId: 'JOB-010',
    reason: 'Late delivery',
    description: 'Requested credit review after delayed offloading window.',
    evidenceName: 'delay-photo.jpg',
    status: 'In Review',
    createdAt: '2026-04-24T14:35:00',
  },
];

export const CUSTOMER_PORTAL_DOCUMENTS = [
  { id: 'DOC001', customerId: 'C001', jobId: 'JOB-001', type: 'Proof of Delivery', fileName: 'pod-job-001.pdf', status: 'Available' },
  { id: 'DOC002', customerId: 'C002', jobId: 'JOB-010', type: 'Purchase Order', fileName: 'po-kleinmond-route.pdf', status: 'Available' },
  { id: 'DOC003', customerId: 'C005', jobId: 'JOB-005', type: 'Site Access', fileName: 'site-access-greenfield.pdf', status: 'Available' },
];

export const CUSTOMER_SERVICE_HISTORY = [
  { customerId: 'C001', complaints: 1, disputes: 0, averagePaymentDelay: 8, routePerformance: 92, delayExposure: 1, costToServe: 48200 },
  { customerId: 'C002', complaints: 3, disputes: 1, averagePaymentDelay: 24, routePerformance: 74, delayExposure: 4, costToServe: 71300 },
  { customerId: 'C003', complaints: 0, disputes: 0, averagePaymentDelay: 6, routePerformance: 95, delayExposure: 1, costToServe: 40100 },
  { customerId: 'C004', complaints: 2, disputes: 0, averagePaymentDelay: 19, routePerformance: 81, delayExposure: 3, costToServe: 58800 },
  { customerId: 'C005', complaints: 1, disputes: 0, averagePaymentDelay: 11, routePerformance: 89, delayExposure: 2, costToServe: 36500 },
  { customerId: 'C006', complaints: 0, disputes: 0, averagePaymentDelay: 4, routePerformance: 93, delayExposure: 1, costToServe: 22800 },
  { customerId: 'C007', complaints: 1, disputes: 0, averagePaymentDelay: 16, routePerformance: 84, delayExposure: 2, costToServe: 35200 },
  { customerId: 'C008', complaints: 2, disputes: 1, averagePaymentDelay: 21, routePerformance: 78, delayExposure: 3, costToServe: 33300 },
];

export const getVehicleComplianceById = (vehicleId, compliance = VEHICLE_COMPLIANCE) =>
  compliance.find((item) => item.vehicleId === vehicleId);

export const getCustomerServiceHistory = (
  customerId,
  history = CUSTOMER_SERVICE_HISTORY
) => history.find((item) => item.customerId === customerId);

export const getCustomerDisputes = (
  customerId,
  disputes = CUSTOMER_DISPUTES
) => disputes.filter((item) => item.customerId === customerId);

export const getCustomerPortalDocuments = (
  customerId,
  documents = CUSTOMER_PORTAL_DOCUMENTS
) => documents.filter((item) => item.customerId === customerId);
