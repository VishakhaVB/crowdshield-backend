const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const simulationEngine = require('../services/simulationEngine');
// const seedZones = require('../data/zones'); // Not used in routes specifically, but available if needed

const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_123';

// 2. Login API (Preserved)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Mock Auth logic
    if ((email === 'admin@kumbh.gov.in' && password === 'admin') ||
        (email === 'demo@kumbh.gov.in' && password === 'demo')) {
        const token = jwt.sign({ email, role: 'authority' }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { name: 'Authority Officer', email, role: 'authority' }
        });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// 3. DASHBOARD SUMMARY API
router.get('/dashboard/summary', (req, res) => {
    const stats = simulationEngine.getDashboardStats();
    res.json({
        success: true,
        data: stats
    });
});

// 4. LIVE ZONES API
router.get('/zones/live', (req, res) => {
    res.json({
        success: true,
        data: simulationEngine.zones
    });
});

// 5. ALERTS API
router.get('/alerts/active', (req, res) => {
    res.json({
        success: true,
        data: simulationEngine.alerts
    });
});

// 6. GEO API (NEW)
router.get('/zones/geo', (req, res) => {
    // Return the merged zone data which includes geo info
    const geoData = simulationEngine.zones.map(z => ({
        zoneId: z.zoneId,
        center: z.center,
        radius: z.radiusInMeters,
        layer: z.layer,
        risk: z.riskLevel
    }));
    res.json({
        success: true,
        data: geoData
    });
});

// 7. DECISION LOG API (NEW)
router.get('/decisions/recent', (req, res) => {
    res.json({
        success: true,
        data: simulationEngine.decisions
    });
});

// 8. ACKNOWLEDGE ALERT API
router.post('/alerts/acknowledge', (req, res) => {
    const { alertId } = req.body;
    const result = simulationEngine.acknowledgeAlert(alertId);
    if (result) {
        res.json({ success: true, message: 'Alert acknowledged' });
    } else {
        res.status(404).json({ success: false, message: 'Alert not found' });
    }
});

// 9. SYSTEM HEALTH & METADATA (JUDGE INFO)
router.get('/system/health', (req, res) => {
    res.json({
        success: true,
        status: 'OPERATIONAL',
        dataSource: 'Synthetic Risk Simulation (Privacy-Safe)',
        compliance: 'Level 4 (No PII)',
        uptime: process.uptime()
    });
});

// 10. DEMO TRIGGER API (FOR JUDGES)
router.post('/simulation/trigger', (req, res) => {
    const { type, zoneId } = req.body;
    // type: 'SPIKE' | 'GATE_CLOSE' | 'RESET'
    const result = simulationEngine.triggerScenario(type, zoneId);
    res.json(result);
});

// 11. CAMERAS API (NEW)
router.get('/cameras', (req, res) => {
    res.json({
        success: true,
        data: simulationEngine.cameras
    });
});

// 12. MANUAL CONTROL: TRIGGER ALERT
router.post('/control/alert', (req, res) => {
    const { zoneId, message } = req.body;
    const result = simulationEngine.triggerManualAlert(zoneId, message);
    res.json(result);
});

// 13. MANUAL CONTROL: ALT ROUTE
router.post('/control/alt-route', (req, res) => {
    const { zoneId } = req.body;
    const result = simulationEngine.activateAltRoute(zoneId);
    res.json(result);
});

// 14. MANUAL CONTROL: CAMERA TOGGLE
router.post('/control/camera', (req, res) => {
    const { cameraId } = req.body;
    const result = simulationEngine.updateCameraStatus(cameraId);
    res.json(result);
});

module.exports = router;
