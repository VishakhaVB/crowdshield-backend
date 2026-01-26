// NASHIK MAHA KUMBH MELA - GOVERNMENT ZONE CONFIGURATION
// 10 Strategic Locations for District Control Room Simulation

const zones = [
    // --- 🔴 HIGH DENSITY (CORE RELIGIOUS ZONES) ---
    {
        zoneId: 'Z01',
        zoneName: 'Ramkund Main Ghat',
        densityCategory: 'HIGH',
        layer: 'L1',
        center: [20.0083, 73.7952],
        radiusInMeters: 50,
        areaInSqMeters: 8000,
        maxCapacity: 25000,
        currentPeople: 12000,
        baseEntryRate: 400,
        baseExitRate: 350,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z02',
        zoneName: 'Kalaram Temple',
        densityCategory: 'HIGH',
        layer: 'L1',
        center: [20.0053, 73.7962],
        radiusInMeters: 45,
        areaInSqMeters: 6000,
        maxCapacity: 15000,
        currentPeople: 5000,
        baseEntryRate: 150,
        baseExitRate: 140,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z03',
        zoneName: 'Sita Gufa',
        densityCategory: 'HIGH',
        layer: 'L1',
        center: [20.0043, 73.7930],
        radiusInMeters: 40,
        areaInSqMeters: 4000,
        maxCapacity: 10000,
        currentPeople: 3000,
        baseEntryRate: 100,
        baseExitRate: 90,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z04',
        zoneName: 'Kapaleshwar Temple',
        densityCategory: 'HIGH',
        layer: 'L1',
        center: [20.0090, 73.7965],
        radiusInMeters: 40,
        areaInSqMeters: 5000,
        maxCapacity: 12000,
        currentPeople: 4500,
        baseEntryRate: 120,
        baseExitRate: 110,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },

    // --- 🟡 MEDIUM DENSITY (BUFFER & PROCESSION) ---
    {
        zoneId: 'Z05',
        zoneName: 'Sadhugram (Tapovan)',
        densityCategory: 'MEDIUM',
        layer: 'L2',
        center: [19.9980, 73.8050],
        radiusInMeters: 150,
        areaInSqMeters: 60000, // Large Camp
        maxCapacity: 150000,
        currentPeople: 45000,
        baseEntryRate: 300,
        baseExitRate: 280,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z06',
        zoneName: 'Panchavati Market',
        densityCategory: 'MEDIUM',
        layer: 'L2',
        center: [20.0120, 73.7980],
        radiusInMeters: 60,
        areaInSqMeters: 20000,
        maxCapacity: 50000,
        currentPeople: 15000,
        baseEntryRate: 200,
        baseExitRate: 190,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z07',
        zoneName: 'Goda Park Riverfront',
        densityCategory: 'MEDIUM',
        layer: 'L2',
        center: [20.0200, 73.7850],
        radiusInMeters: 80,
        areaInSqMeters: 30000,
        maxCapacity: 60000,
        currentPeople: 18000,
        baseEntryRate: 220,
        baseExitRate: 210,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },

    // --- 🟢 LOW DENSITY (TRANSIT & OUTER) ---
    {
        zoneId: 'Z08',
        zoneName: 'Dwarka Circle Hub',
        densityCategory: 'LOW',
        layer: 'L3',
        center: [19.9900, 73.7850],
        radiusInMeters: 100,
        areaInSqMeters: 45000,
        maxCapacity: 100000,
        currentPeople: 30000,
        baseEntryRate: 500, // Traffic
        baseExitRate: 480,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z09',
        zoneName: 'CBS Bus Stand',
        densityCategory: 'LOW',
        layer: 'L3',
        center: [19.9970, 73.7750],
        radiusInMeters: 80,
        areaInSqMeters: 25000,
        maxCapacity: 80000,
        currentPeople: 22000,
        baseEntryRate: 350,
        baseExitRate: 300,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    },
    {
        zoneId: 'Z10',
        zoneName: 'Nashik Road Station',
        densityCategory: 'LOW',
        layer: 'L3',
        center: [19.9550, 73.8500],
        radiusInMeters: 90,
        areaInSqMeters: 35000,
        maxCapacity: 90000,
        currentPeople: 28000,
        baseEntryRate: 400,
        baseExitRate: 380,
        dataSource: "Live Crowd Simulation (Hist. Pattern)"
    }
];

module.exports = zones;
