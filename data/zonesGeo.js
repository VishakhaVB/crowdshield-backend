// GEO-SPATIAL CONFIGURATION - NASHIK CITY
// Maps real coordinates to our 10 Strategic Zones

const zonesGeo = [
    // --- L1 (CORE) ---
    {
        zoneId: 'Z01', // Ramkund
        center: { lat: 20.0059, lng: 73.7947 },
        radiusInMeters: 120, // Tight circle
        adjacentZones: ['Z02', 'Z03', 'Z06']
    },
    {
        zoneId: 'Z02', // Kalaram
        center: { lat: 20.0035, lng: 73.7965 },
        radiusInMeters: 100,
        adjacentZones: ['Z01', 'Z03']
    },
    {
        zoneId: 'Z03', // Sita Gufa
        center: { lat: 20.0020, lng: 73.7940 },
        radiusInMeters: 80,
        adjacentZones: ['Z01', 'Z02']
    },
    {
        zoneId: 'Z04', // Kapaleshwar
        center: { lat: 20.0070, lng: 73.7955 },
        radiusInMeters: 100,
        adjacentZones: ['Z01', 'Z06']
    },

    // --- L2 (BUFFER) ---
    {
        zoneId: 'Z05', // Sadhugram (Tapovan)
        center: { lat: 20.0150, lng: 73.8050 },
        radiusInMeters: 400,
        adjacentZones: ['Z07']
    },
    {
        zoneId: 'Z06', // Panchavati Market
        center: { lat: 20.0080, lng: 73.7980 },
        radiusInMeters: 250,
        adjacentZones: ['Z01', 'Z04', 'Z07']
    },
    {
        zoneId: 'Z07', // Goda Park
        center: { lat: 20.0120, lng: 73.8000 },
        radiusInMeters: 300,
        adjacentZones: ['Z05', 'Z06']
    },

    // --- L3 (OUTER) ---
    {
        zoneId: 'Z08', // Dwarka Circle
        center: { lat: 19.9980, lng: 73.7750 },
        radiusInMeters: 500,
        adjacentZones: ['Z09']
    },
    {
        zoneId: 'Z09', // CBS
        center: { lat: 20.0050, lng: 73.7800 },
        radiusInMeters: 400,
        adjacentZones: ['Z08']
    },
    {
        zoneId: 'Z10', // Nashik Road (South)
        center: { lat: 19.9550, lng: 73.8300 }, // A bit far, but critical
        radiusInMeters: 600,
        adjacentZones: ['Z08']
    }
];

module.exports = zonesGeo;
