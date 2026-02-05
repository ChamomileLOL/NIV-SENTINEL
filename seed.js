const mongoose = require('mongoose');
const Citizen = require('./src/models/Citizen');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[SEEDER] Connected to Database.');

        // 1. PURGE EXISTING POPULATION (Clean Slate)
        await Citizen.deleteMany({});
        console.log('[SEEDER] Old population purged.');

        // 2. CREATE PATIENT ZERO (The Source)
        // Location: Kozhikode, Kerala (11.2588, 75.7804)
        const patientZero = await Citizen.create({
            name: "Patient Zero",
            location: { type: 'Point', coordinates: [75.7804, 11.2588] },
            status: 'INFECTED'
        });

        // 3. CREATE VILLAGERS (The Risk Zone)
        // Creating people within 2km - 10km radius
        const villagers = await Citizen.insertMany([
            {
                name: "Villager A (Close)",
                location: { type: 'Point', coordinates: [75.7810, 11.2590] }, // ~100m away
                status: 'HEALTHY'
            },
            {
                name: "Villager B (Far)",
                location: { type: 'Point', coordinates: [75.8500, 11.3000] }, // ~10km away
                status: 'HEALTHY'
            },
            {
                name: "Nurse Lini (Contact)",
                location: { type: 'Point', coordinates: [75.7805, 11.2589] }, // Very close
                status: 'HEALTHY'
            }
        ]);

        // 4. LINK THE GRAPH (Create the "Contact Ring")
        // Patient Zero came in contact with Villager A and Nurse Lini
        patientZero.contacts.push({ citizenId: villagers[0]._id, riskFactor: 0.9 }); // High Risk
        patientZero.contacts.push({ citizenId: villagers[2]._id, riskFactor: 1.0 }); // Critical
        await patientZero.save();

        console.log('[SEEDER] Infection simulated. Patient Zero and Contacts created.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();