const mongoose = require('mongoose');

const ZoneGeoSchema = new mongoose.Schema({
    zoneId: { type: String, required: true, unique: true },
    zoneName: { type: String, required: true },
    layer: { type: String, enum: ['L1', 'L2', 'L3'], required: true },
    center: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    radiusInMeters: { type: Number, required: true }, // Visual/Geofence radius
    capacityPerSqm: { type: Number, default: 4 }, // Crowd density limit
    adjacentZones: [{ type: String }] // List of zoneIds that are physically connected
});

// Calculate distance method
ZoneGeoSchema.methods.distanceTo = function (otherZone) {
    if (!otherZone || !otherZone.center) return 999999;

    const R = 6371e3; // Earth radius in meters
    const phi1 = this.center.lat * Math.PI / 180;
    const phi2 = otherZone.center.lat * Math.PI / 180;
    const dPhi = (otherZone.center.lat - this.center.lat) * Math.PI / 180;
    const dLambda = (otherZone.center.lng - this.center.lng) * Math.PI / 180;

    const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

module.exports = mongoose.model('ZoneGeo', ZoneGeoSchema);
