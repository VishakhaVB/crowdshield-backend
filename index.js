const express = require('express');
const cors = require('cors');
require('dotenv').config();

const simulationEngine = require('./services/simulationEngine');
const seedZones = require('./data/zones');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- SIMULATION LOOP ---
// Run every 3 seconds to update crowd values
setInterval(() => {
    simulationEngine.tick();
    // Log a concise dashboard summary so backend shows live readings
    try {
        const stats = simulationEngine.getDashboardStats();
        console.log(`Simulation Tick — totalCrowd=${stats.totalCrowd}, avgDensity=${stats.avgDensity}, activeAlerts=${stats.activeAlerts}, netFlow=${stats.netFlow}`);
    } catch (err) {
        console.error('Error while logging simulation stats', err);
    }
}, 3000);

// --- Routes ---

// 1. Root Route
app.get('/', (req, res) => {
    res.send('CrowdShield Authority Backend is Running with Simulation Engine');
});

// Mount API Routes
app.use('/api', apiRoutes);

// Start Server (bind to all interfaces and log actual address)
const server = app.listen(PORT, '0.0.0.0', () => {
    const addr = server.address();
    const host = (addr && (addr.address === '::' || addr.address === '0.0.0.0')) ? 'localhost' : (addr ? addr.address : 'localhost');
    const port = addr ? addr.port : PORT;
    console.log(`Server running on http://${host}:${port}`);
    console.log(`Simulation Engine Active: managing ${seedZones.length} zones.`);
});
