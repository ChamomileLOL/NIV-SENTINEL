const Citizen = require('../models/Citizen');

// TRAP: Recursive depth limit. If you go too deep, the stack blows up.
// Real-world: We use BFS (Breadth-First Search) for layer-by-layer tracing.

async function traceInfection(patientId) {
    console.log(`[TRACING] Starting Ring Protocol for Patient: ${patientId}`);
    
    // 1. Mark Patient Zero
    await Citizen.findByIdAndUpdate(patientId, { status: 'INFECTED' });

    // 2. Fetch Graph Neighbors (Direct Contacts)
    const patient = await Citizen.findById(patientId).populate('contacts.citizenId');
    
    if (!patient) return;

    // QUEUE for BFS
    let queue = [];
    
    // Add direct contacts to queue
    patient.contacts.forEach(c => {
        queue.push({ id: c.citizenId._id, risk: c.riskFactor, depth: 1 });
    });

    // PROCESS THE RING
    while(queue.length > 0) {
        const current = queue.shift();
        
        // If Risk > 0.5 (High Risk), we Mark as SUSPECTED
        if (current.risk > 0.5) {
            console.log(`[ALERT] Contact ${current.id} is HIGH RISK. Quarantine ordered.`);
            await Citizen.findByIdAndUpdate(current.id, { status: 'SUSPECTED' });
        }

        // TRAP: In a real graph, you need a "Visited" set to avoid infinite loops 
        // if A met B and B met A. 
        // YOUR TASK: IMPLEMENT THE 'VISITED' LOGIC OR THE SERVER CRASHES.
    }
}

module.exports = { traceInfection };