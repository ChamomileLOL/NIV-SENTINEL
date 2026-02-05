const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// CONFIG
const SERVER_PORT = 6000;
const SERVER_HOST = 'localhost';
const PATIENT_ID = 'NIV-ZERO-001';

console.log("[HARDWARE] Sensor Activated. Attaching to Patient...");

// Simulate Vitals Stream
setInterval(() => {
    // Randomize vitals to simulate struggle
    // TRAP: SpO2 drops randomly to test your alert logic
    const spo2 = Math.floor(Math.random() * (99 - 85 + 1) + 85); 
    const bpm = Math.floor(Math.random() * (120 - 60 + 1) + 60);

    const payload = `${PATIENT_ID}:${spo2}:${bpm}`;
    const message = Buffer.from(payload);

    client.send(message, SERVER_PORT, SERVER_HOST, (err) => {
        if (err) {
            console.error('[HARDWARE FAILURE] Transmission failed.');
            client.close();
        } else {
            console.log(`[TX] Sent Packet: ${payload}`);
        }
    });

}, 2000); // Send data every 2 seconds