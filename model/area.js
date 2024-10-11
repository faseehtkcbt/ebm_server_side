const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Area', areaSchema);
