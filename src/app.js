const express = require('express');
const http = require('http'); // REQUIRED FOR SOCKET.IO
const { Server } = require("socket.io");
const dgram = require('dgram');
const cors = require('cors'); // ALLOW FRONTEND CONNECTION
const connectDB = require('./config/db');
const zoneRoutes = require('./routes/zoneRoutes'); // YOUR GEOSPATIAL ROUTES
require('dotenv').config();

const app = express();
const server = http.createServer(app); // WRAP EXPRESS
const PORT = process.env.PORT || 5000;
const UDP_PORT = 6000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE
connectDB();

// ROUTES
app.use('/api/zone', zoneRoutes);

// --- THE REAL-TIME BRIDGE (SOCKET.IO) ---
const io = new Server(server, {
    cors: {
        origin: "*", // ALLOW ALL CLIENTS (FOR EMERGENCY)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`[WEBSOCKET] Doctor connected: ${socket.id}`);
});
// ----------------------------------------

// --- THE TELECOM RECEIVER (UDP) ---
const udpSocket = dgram.createSocket('udp4');

udpSocket.on('error', (err) => {
    console.log(`[RADIO SILENCE] Server error:\n${err.stack}`);
    udpSocket.close();
});

udpSocket.on('message', (msg, rinfo) => {
    const dataString = msg.toString();
    // Parse: "PATIENT_ID:SPO2:BPM"
    const [patientId, spo2, bpm] = dataString.split(':');
    
    // 1. LOG TO CONSOLE (BACKUP)
    console.log(`[SIGNAL] ${patientId} | SpO2: ${spo2}% | BPM: ${bpm}`);

    // 2. BROADCAST TO FRONTEND (THE BRIDGE)
    // We send a JSON object that React can understand
    io.emit('vital-update', {
        patientId,
        spo2: parseInt(spo2),
        bpm: parseInt(bpm),
        timestamp: new Date()
    });

    // 3. CRITICAL ALERT LOGIC
    if (parseInt(spo2) < 90) {
        io.emit('critical-alert', {
            message: `CRITICAL HYPOXIA: PATIENT ${patientId}`,
            level: 'RED'
        });
    }
});

udpSocket.bind(UDP_PORT, () => {
    console.log(`[ANTENNA DEPLOYED] UDP Server listening on port ${UDP_PORT}`);
});

// NOTE: WE LISTEN ON 'server', NOT 'app'
server.listen(PORT, () => {
    console.log(`[COMMAND CENTER] HTTP + SOCKET Server running on port ${PORT}`);
});