const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // TRAP: You must use a connection string that handles high availability
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are now default in newer Mongoose, but the INTENT matters.
            // We need a heartbeat.
            serverSelectionTimeoutMS: 5000, // Fail fast if the DB dies.
        });

        console.log(`[SECURE CONNECTION] MongoDB Connected: ${conn.connection.host}`);
        console.log(`[STATUS] BIOSHIELD ACTIVE.`);
    } catch (error) {
        console.error(`[FATAL ERROR] DATABASE RUPTURED: ${error.message}`);
        // If DB fails, the node process MUST die. No zombie processes allowed.
        process.exit(1); 
    }
};

module.exports = connectDB;