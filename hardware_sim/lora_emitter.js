// NEW HARDWARE SIMULATOR (HTTP VERSION)
// Node 18+ has native 'fetch', no need for axios.

const SERVER_URL = 'https://niv-sentinel.onrender.com/api/vitals'; // TARGET THE CLOUD
const PATIENT_ID = 'NIV-ZERO-001';

console.log(`[HARDWARE] Sensor Activated. Targeting: ${SERVER_URL}`);

async function sendVitals() {
    // Randomize vitals
    const spo2 = Math.floor(Math.random() * (99 - 85 + 1) + 85); 
    const bpm = Math.floor(Math.random() * (120 - 60 + 1) + 60);

    const payload = {
        patientId: PATIENT_ID,
        spo2: spo2,
        bpm: bpm
    };

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`[TX SUCCESS] ${PATIENT_ID} -> SpO2: ${spo2} | BPM: ${bpm}`);
        } else {
            console.log(`[TX FAILED] Server Error: ${response.status}`);
        }
    } catch (error) {
        console.log(`[TX ERROR] Connection Failed: Is the Server Awake?`);
    }
}

// Send every 2 seconds
setInterval(sendVitals, 2000);