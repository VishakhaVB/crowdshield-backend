const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    alertId: { type: String, required: true, unique: true },
    zoneId: { type: String, required: true, ref: 'Zone' },
    severity: { type: String, enum: ['HIGH', 'CRITICAL'], required: true },
    cause: { type: String, required: true }, // e.g., 'Overcrowding', 'Rapid Inflow'
    suggestedAction: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'ACKNOWLEDGED'], default: 'ACTIVE' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
