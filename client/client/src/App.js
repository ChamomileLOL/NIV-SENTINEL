import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// TRAP: You must point to the Backend Port (5000), not the React Port (3000)
const socket = io('http://localhost:5000');

function App() {
  const [vitals, setVitals] = useState({ patientId: 'WAITING...', spo2: 100, bpm: 0 });
  const [alert, setAlert] = useState(null);
  const [status, setStatus] = useState('STABLE');

  useEffect(() => {
    // 1. LISTEN FOR VITALS
    socket.on('vital-update', (data) => {
      setVitals(data);
      
      // Local Logic for visual feedback
      if (data.spo2 < 90) {
        setStatus('CRITICAL');
      } else {
        setStatus('STABLE');
        setAlert(null);
      }
    });

    // 2. LISTEN FOR CRITICAL ALERTS (From Backend Triage)
    socket.on('critical-alert', (data) => {
      setAlert(data.message);
    });

    // Cleanup on unmount
    return () => socket.off('vital-update');
  }, []);

  return (
    <div className={`dashboard ${status === 'CRITICAL' ? 'flash-red' : ''}`}>
      <header className="header">
        <h1>NIV-SENTINEL /// BIO-SHIELD</h1>
        <div className="status-indicator">SYSTEM: ONLINE</div>
      </header>

      <main className="monitor-grid">
        {/* PATIENT CARD */}
        <div className="card">
          <h2>LIVE TELEMETRY</h2>
          <div className="patient-id">{vitals.patientId}</div>
          
          <div className="vital-row">
            <div className="vital-box">
              <span className="label">SpO2 (Oxygen)</span>
              <span className={`value ${vitals.spo2 < 90 ? 'danger' : ''}`}>
                {vitals.spo2}%
              </span>
            </div>
            
            <div className="vital-box">
              <span className="label">HEART RATE</span>
              <span className="value">{vitals.bpm} <small>BPM</small></span>
            </div>
          </div>
        </div>

        {/* ALERT BOX */}
        {alert && (
          <div className="alert-box">
             ⚠ {alert} ⚠
          </div>
        )}
      </main>
    </div>
  );
}

export default App;