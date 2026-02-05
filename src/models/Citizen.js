const mongoose = require('mongoose');

const CitizenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [Longitude, Latitude]
    },
    status: { 
        type: String, 
        enum: ['HEALTHY', 'SUSPECTED', 'INFECTED', 'DECEASED'], 
        default: 'HEALTHY' 
    },
    // ADJACENCY LIST (Graph Theory)
    contacts: [{ 
        citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen' },
        riskFactor: Number // 0.1 to 1.0
    }]
});

// GEOSPATIAL INDEXING (Crucial for "Ring" queries)
CitizenSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Citizen', CitizenSchema);