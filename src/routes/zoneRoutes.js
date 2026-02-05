const express = require('express');
const router = express.Router();
const Citizen = require('../models/Citizen');

// GET /api/zone/risk-map?lat=11.2588&lng=75.7804&radius=5000
router.get('/risk-map', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        // TRAP: Coordinates come as strings from URL. Convert to Numbers or Query Fails.
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const distanceInMeters = parseInt(radius);

        const citizens = await Citizen.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude] // Note: MongoDB uses [Lng, Lat] order!
                    },
                    $maxDistance: distanceInMeters
                }
            }
        });

        res.json({
            count: citizens.length,
            zone: 'RED',
            citizens: citizens
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;