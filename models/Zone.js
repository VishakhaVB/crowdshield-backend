const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
    zoneId: { type: String, required: true, unique: true }, // e.g., 'Zone A'
    zoneName: { type: String, required: true }, // e.g., 'Ramkund Ghat'
    layer: { type: String, enum: ['L1', 'L2', 'L3'], required: true },
    areaInSqMeters: { type: Number, required: true },
    currentPeople: { type: Number, default: 0 },
    maxCapacity: { type: Number, required: true },
    density: { type: Number, default: 0 }, // People / Sq Meter
    entryRatePerMin: { type: Number, default: 0 },
    exitRatePerMin: { type: Number, default: 0 },
    netFlowPerMin: { type: Number, default: 0 },
    riskLevel: {
        type: String,
        enum: ['SAFE', 'MODERATE', 'BUSY', 'AVOID'],
        default: 'SAFE'
    },
    lastUpdated: { type: Date, default: Date.now }
});

// Middleware to calculate density and risk before saving
ZoneSchema.pre('save', function (next) {
    this.density = parseFloat((this.currentPeople / this.areaInSqMeters).toFixed(2));

    // STRICT RISK LOGIC (STAMPEDE-RISK BASED)
    if (this.density < 1.5) this.riskLevel = 'SAFE';
    else if (this.density < 2.5) this.riskLevel = 'MODERATE';
    else if (this.density < 3.5) this.riskLevel = 'BUSY';
    else this.riskLevel = 'AVOID'; // > 3.5

    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('Zone', ZoneSchema);
