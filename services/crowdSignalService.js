class CrowdSignalService {
    constructor() {
        this.noiseFloor = 50; // Base random noise
        this.eventSpikes = {}; // Store temporary events like "Train Arrival"
    }

    // Simulate External Data Feeds
    getZoneSignals(zoneId) {
        // 1. Mobile Tower Signal (Aggregated) - Varies by time
        const mobileSignal = this.simulateMobileDensity(zoneId);

        // 2. Transport Feed (e.g. Bus/Train arrivals impacting perimeter zones)
        const transportSignal = this.simulateTransportFeed(zoneId);

        // 3. Gate Counters (Camera/Turnstile)
        const gateEntry = this.simulateGateCounter(zoneId);

        return {
            mobileDensity: mobileSignal,
            transportInflux: transportSignal,
            gateCount: gateEntry,
            totalSignalWeight: (mobileSignal * 0.4) + (transportSignal * 0.4) + (gateEntry * 0.2)
        };
    }

    simulateMobileDensity(zoneId) {
        // Base random fluctuating signal
        return Math.floor(Math.random() * 200) + this.noiseFloor;
    }

    simulateTransportFeed(zoneId) {
        // Only outer zones (L3) like Parking/Naka get huge transport spikes
        if (zoneId === 'Zone G' || zoneId === 'Zone H') {
            // Random chance of "Bus Convoy" arrival
            if (Math.random() > 0.9) return 500; // Spike!
        }
        return 0;
    }

    simulateGateCounter(zoneId) {
        // Core zones have fast turnstiles
        if (zoneId === 'Zone A') return Math.floor(Math.random() * 50) + 10;
        return 0;
    }

    // Weighted Fusion Logic
    // Returns a factor (-0.1 to +0.2) to adjust the main simulation engine's numbers
    getAdjustmentFactor(zoneId) {
        const signals = this.getZoneSignals(zoneId);

        // If transport spike is huge, we need to drastically increase count
        if (signals.transportInflux > 200) return 0.25; // +25% boost

        // If signals are low, maybe simulation is too high?
        if (signals.totalSignalWeight < 50) return -0.05; // -5% dampener

        return 0.0; // Neutral
    }

    getRecentSignalContext(zoneId) {
        const signals = this.getZoneSignals(zoneId);
        if (signals.transportInflux > 100) return 'Mass Transit Arrival';
        if (signals.gateCount > 40) return 'Rapid Gate Entry';
        return 'Normal Signal Baseline';
    }
}

module.exports = new CrowdSignalService();
