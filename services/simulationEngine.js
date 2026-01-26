const seedZones = require('../data/zones');
const geoZones = require('../data/zonesGeo');
const crowdSignalService = require('./crowdSignalService');
const { v4: uuidv4 } = require('uuid');

class SimulationEngine {
    constructor() {
        console.log("Initializing Simulation Engine (Government Admin Mode)...");

        // Deep copy initial state
        this.zones = JSON.parse(JSON.stringify(seedZones));
        this.alerts = [];
        this.decisions = [];
        this.lastValidState = null;

        // Active Scenario Flags
        this.activeScenarios = {
            SHAHI_SNAN: false,     // Holy Dip Surge
            RAILWAY_SURGE: false,  // Train Arrival
            EVACUATION: false      // Emergency
        };

        // Initialize Mock Cameras
        this.cameras = [
            { id: 'CAM-001', zoneName: 'Ramkund Main Ghat', layer: 'L1', status: 'Online', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-002', zoneName: 'Kalaram Temple', layer: 'L1', status: 'Online', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-003', zoneName: 'Sita Gufa', layer: 'L1', status: 'Maintenance', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-004', zoneName: 'Sadhugram (Tapovan)', layer: 'L2', status: 'Online', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-005', zoneName: 'Panchavati Market', layer: 'L2', status: 'Offline', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-006', zoneName: 'Goda Park Riverfront', layer: 'L2', status: 'Online', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-007', zoneName: 'Nashik Road Station', layer: 'L3', status: 'Online', lastUpdated: new Date().toLocaleTimeString() },
            { id: 'CAM-008', zoneName: 'Dwarka Circle Hub', layer: 'L3', status: 'Online', lastUpdated: new Date().toLocaleTimeString() }
        ];

        // 1. MERGE GEO DATA & SEED HISTORICAL RANDOMNESS
        this.zones.forEach(z => {
            const geo = geoZones.find(g => g.zoneId === z.zoneId);

            // SECURITY: Ensure Max Capacity is set
            z.maxCapacity = Number(z.maxCapacity) || 10000;
            z.areaInSqMeters = Math.max(100, Number(z.areaInSqMeters) || 1000);

            // SEED RANDOM CROWD (30% - 60% of Max Capacity)
            const randomFactor = 0.3 + Math.random() * 0.3;
            z.currentPeople = Math.floor(z.maxCapacity * randomFactor);

            z.baseEntryRate = Number(z.baseEntryRate) || 0;
            z.baseExitRate = Number(z.baseExitRate) || 0;

            if (geo) {
                z.center = geo.center;
                z.radiusInMeters = geo.radiusInMeters;
                z.adjacentZones = geo.adjacentZones || [];
                z.distanceTo = (otherZone) => {
                    if (!otherZone || !otherZone.center || !z.center) return 999999;
                    const R = 6371e3;
                    const phi1 = z.center.lat * Math.PI / 180;
                    const phi2 = otherZone.center.lat * Math.PI / 180;
                    const dPhi = (otherZone.center.lat - z.center.lat) * Math.PI / 180;
                    const dLambda = (otherZone.center.lng - z.center.lng) * Math.PI / 180;
                    const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
                        Math.cos(phi1) * Math.cos(phi2) *
                        Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                };
            }
        });

        this.recalculateAllMetrics();
    }

    calculateRisk(density) {
        // STRICT USER-DEFINED THRESHOLDS
        if (density < 2.0) return 'SAFE';
        if (density < 4.0) return 'MODERATE';
        if (density < 6.0) return 'BUSY';
        return 'AVOID';
    }

    recalculateAllMetrics() {
        this.zones.forEach(z => {
            z.density = parseFloat((z.currentPeople / z.areaInSqMeters).toFixed(2));
            z.riskLevel = this.calculateRisk(z.density);

            // GOVERNMENT REASONING ENGINE
            if (this.activeScenarios.EVACUATION) {
                z.reason = "EMERGENCY PROTOCOL ACTIVE: EVACUATION IN PROGRESS";
            } else if (this.activeScenarios.SHAHI_SNAN && z.layer === 'L1') {
                z.reason = "Shahi Snan Peak Hours - Maximum Alert Protocol";
            } else if (this.activeScenarios.RAILWAY_SURGE && (z.zoneId === 'Z10' || z.zoneId === 'Z08')) {
                z.reason = "Special Train Arrival - Inflow Surge Detected";
            } else if (z.riskLevel === 'AVOID') {
                z.reason = "Critical Density Threshold Exceeded - Inflow Restricted";
            } else if (z.riskLevel === 'BUSY') {
                z.reason = "High Pedestrian Flow - Monitoring Active";
            } else {
                z.reason = "Flow within Nominal Limits";
            }

            z.lastUpdated = new Date();
            // GOVERNMENT AUDIT COMPLIANCE
            z.dataSource = "Historical Pattern Simulation";
        });
    }

    triggerScenario(type, zoneId) {
        // Toggle Global Scenarios
        if (type === 'SHAHI_SNAN') {
            this.activeScenarios.SHAHI_SNAN = !this.activeScenarios.SHAHI_SNAN;
            // Immediate Effect
            if (this.activeScenarios.SHAHI_SNAN) {
                this.zones.forEach(z => {
                    if (z.layer === 'L1') z.currentPeople = Math.min(z.maxCapacity * 1.1, z.currentPeople + 5000);
                });
                this.createSmartAlert({ zoneId: 'Z01', zoneName: 'Ramkund Core', riskLevel: 'AVOID', density: 6.5 }, true);
                return { success: true, message: 'SCENARIO ACTIVE: Shahi Snan Surge' };
            }
            return { success: true, message: 'SCENARIO DEACTIVATED: Shahi Snan' };
        }

        if (type === 'RAILWAY_SURGE') {
            this.activeScenarios.RAILWAY_SURGE = !this.activeScenarios.RAILWAY_SURGE;
            if (this.activeScenarios.RAILWAY_SURGE) {
                const stn = this.zones.find(z => z.zoneId === 'Z10');
                if (stn) stn.currentPeople += 6000;
                this.createSmartAlert(stn, true);
                return { success: true, message: 'SCENARIO ACTIVE: Railway Station Surge' };
            }
            return { success: true, message: 'SCENARIO DEACTIVATED: Railway Surge' };
        }

        // Targeted Triggers (Legacy/Specific)
        const zone = this.zones.find(z => z.zoneId === zoneId || z.zoneName === zoneId);
        if (zone) {
            if (type === 'SPIKE') {
                zone.currentPeople += 3000;
                this.recalculateAllMetrics();
                this.createSmartAlert(zone);
                return { success: true, message: `Manual Surge Triggered in ${zone.zoneName}` };
            }
        }

        return { success: false, message: 'Unknown Scenario or Zone' };
    }

    tick() {
        try {
            this.zones.forEach(zone => {
                // BASE FLUCTUATION
                let delta = Math.floor(Math.random() * 500) - 200;

                // SCENARIO MODIFIERS
                if (this.activeScenarios.SHAHI_SNAN && zone.layer === 'L1') {
                    delta += 300; // Constant filling
                }
                if (this.activeScenarios.RAILWAY_SURGE && zone.layer === 'L3') {
                    delta += 200; // Outer filling
                }
                if (this.activeScenarios.EVACUATION) {
                    delta = -500; // Draining
                }

                // Apply update
                let newPeople = zone.currentPeople + delta;

                // Clamp
                if (newPeople < 0) newPeople = 0;
                if (newPeople > zone.maxCapacity * 1.2) newPeople = zone.maxCapacity * 1.2; // Allow slight overflow

                zone.currentPeople = newPeople;

                // Update density & risk
                zone.density = parseFloat((zone.currentPeople / zone.areaInSqMeters).toFixed(2));
                const oldRisk = zone.riskLevel;
                zone.riskLevel = this.calculateRisk(zone.density);

                // Update Reasoning (calling shared logic)
                this.recalculateAllMetrics();

                // Auto-Alert Generation
                if (zone.riskLevel === 'AVOID' && oldRisk !== 'AVOID') {
                    this.createSmartAlert(zone);
                }

                // Keep flow rates for UI compatibility
                zone.netFlowPerMin = delta * 20;
                zone.entryRatePerMin = delta > 0 ? delta * 20 : 0;
                zone.exitRatePerMin = delta < 0 ? Math.abs(delta) * 20 : 0;
                zone.lastUpdated = new Date();
            });

            // Randomly update a camera time occasionally
            if (Math.random() > 0.7) {
                const randCam = this.cameras[Math.floor(Math.random() * this.cameras.length)];
                randCam.lastUpdated = new Date().toLocaleTimeString();
            }

            // Checkpoint valid state
            this.lastValidState = JSON.parse(JSON.stringify(this.zones));

        } catch (error) {
            console.error("CRITICAL: Simulation Tick Failed.", error);
            if (this.lastValidState) {
                this.zones = this.lastValidState;
            }
        }
    }

    createSmartAlert(zone, force = false) {
        const existing = this.alerts.find(a => a.zoneId === zone.zoneId && !a.acknowledged);
        if (existing && !force) return;

        const alert = {
            id: uuidv4(),
            zoneId: zone.zoneId,
            zoneName: zone.zoneName,
            severity: zone.riskLevel === 'AVOID' ? 'CRITICAL' : 'HIGH',
            cause: this.activeScenarios.SHAHI_SNAN ? 'Shahi Snan Surge' : 'Crowd Density Exceeded',
            suggestedAction: 'Deploy Quick Response Teams (QRT)',
            explanationText: zone.reason + " [System Auto-Flag]",
            riskLevel: zone.riskLevel || 'AVOID',
            timestamp: new Date().toLocaleTimeString(),
            acknowledged: false
        };

        this.alerts.unshift(alert);
        if (this.alerts.length > 20) this.alerts.pop();
    }

    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            return true;
        }
        return false;
    }

    updateCameraStatus(cameraId) {
        const cam = this.cameras.find(c => c.id === cameraId);
        if (cam) {
            // Toggle Logic for demo
            if (cam.status === 'Online') cam.status = 'Offline';
            else if (cam.status === 'Offline') cam.status = 'Online';
            // If maintenance, switch to Online
            else if (cam.status === 'Maintenance') cam.status = 'Online';

            cam.lastUpdated = new Date().toLocaleTimeString();
            return { success: true, message: `Camera ${cameraId} status updated to ${cam.status}`, newStatus: cam.status };
        }
        return { success: false, message: 'Camera not found' };
    }

    addCamera(cameraData) {
        this.cameras.push({
            ...cameraData,
            lastUpdated: new Date().toLocaleTimeString()
        });
        return { success: true, message: 'Camera added' };
    }

    getDashboardStats() {
        const totalCrowd = this.zones.reduce((sum, z) => sum + z.currentPeople, 0);
        const totalArea = this.zones.reduce((sum, z) => sum + z.areaInSqMeters, 0);
        const avgDensity = totalArea > 0 ? parseFloat((totalCrowd / totalArea).toFixed(2)) : 0;
        const netFlow = this.zones.reduce((sum, z) => sum + z.netFlowPerMin, 0);
        const activeAlerts = this.alerts.filter(a => !a.acknowledged).length;

        // System status
        const highRiskZones = this.zones.filter(z => z.riskLevel === 'AVOID').length;
        const systemStatus = this.activeScenarios.SHAHI_SNAN ? 'EVENT PEAK' : (highRiskZones > 0 ? 'CRITICAL' : 'NORMAL');

        return {
            totalCrowd,
            avgDensity,
            netFlow,
            activeAlerts,
            systemStatus,
            lastUpdated: new Date()
        };
    }
}

module.exports = new SimulationEngine();
