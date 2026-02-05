# 🛡️ NIV-SENTINEL: National Bio-Defense Grid

![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-brightgreen)
![Stack](https://img.shields.io/badge/MERN-FullStack-blue)
![RealTime](https://img.shields.io/badge/Socket.io-Live-red)

**NIV-SENTINEL** is a Real-Time IoT Medical Dashboard designed for rapid monitoring of high-risk patients during viral outbreaks (simulating a Nipah Virus scenario). It bridges low-level hardware telemetry with a high-level command center visualization.

## 🔗 Live Demo
- **Command Center (Frontend):** [https://niv-sentinel.vercel.app/](https://niv-sentinel.vercel.app/)
- **Sentinel Core (Backend):** [https://niv-sentinel.onrender.com](https://niv-sentinel.onrender.com)

---

## 🏗️ System Architecture

[Hardware Sensors] --(HTTP/UDP)--> [Node.js Backend] --(Socket.io)--> [React Dashboard]
                                          |
                                     [MongoDB Atlas]
                                  (Geospatial Data)
🌟 Key Features
Real-Time Telemetry: Sub-second updates of SpO2 (Oxygen) and Heart Rate using Socket.io.

Critical Alert System: Visual alarms (Red Flash) when vitals drop below threshold (SpO2 < 90%).

Geospatial Tracking: MongoDB $near queries to map infection spread and identifying contacts within 5km.

Dual-Protocol Support: Supports both UDP (for local hardware) and HTTP (for cloud deployment) data ingress.

Resilient Architecture: Handles connectivity drops and process restarts automatically.

🛠️ Tech Stack
Frontend: React.js, CSS3 (Animations), Socket.io-client.

Backend: Node.js, Express.js, Socket.io (WebSockets).

Database: MongoDB Atlas (Geospatial Indexing 2dsphere).

Simulation: Custom Node.js scripts for LoRaWAN hardware emulation.

DevOps: Render (Backend), Vercel (Frontend), GitHub.

🚀 Getting Started (Local Setup)
1. Prerequisites
Node.js (v18+)

MongoDB Atlas URI

2. Clone the Repository
Bash
git clone https://github.com/YOUR_USERNAME/NIV_SENTINEL.git
cd NIV_SENTINEL
3. Install Dependencies
Backend:

Bash
npm install
Frontend:

Bash
cd client/client
npm install
4. Configuration (.env)
Create a .env file in the root directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
5. Run the System
You need three terminal windows:

Terminal 1 (Backend):

Bash
npm run dev
Terminal 2 (Frontend):

Bash
cd client/client
npm start
Terminal 3 (Hardware Simulator):

Bash
# Simulates a patient sensor sending data
npm run hardware
📡 API Documentation
Ingress Point (Hardware -> Cloud)
POST /api/vitals Used by sensors to push telemetry to the cloud dashboard.

Body:

JSON
{
  "patientId": "NIV-ZERO-001",
  "spo2": 88,
  "bpm": 110
}
Geospatial Query
GET /api/zone/risk-map Finds citizens within a specific radius of an outbreak.

Query Params: lat, lng, radius (meters)