/**
 * IFCS DASHBOARD - KEY SCRIPT
 * Handles mock data generation, simulation loops, and UI updates.
 */

// ================= CONSTANTS & CONFIG =================
const CONFIG = {
    updateInterval: 2000, // ms
    timelineHours: 8,
    initialRisk: 15, // %
    anomalyChance: 0.1
};

// ================= MOCK DATA STATE =================
const SYSTEM_STATE = {
    oee: 85,
    yield: 92.4,
    cycleTime: 45, // seconds
    riskScore: CONFIG.initialRisk,
    anomalies: [],
    timeline: [], // Future predictions
    insights: [],
    activeModel: 'helmet' // Track which 3D model is showing
};

// ================= DOM ELEMENTS =================
const UI = {
    clock: document.getElementById('clock'),
    kpiOEE: document.getElementById('kpi-oee'),
    kpiYield: document.getElementById('kpi-yield'),
    kpiCycle: document.getElementById('kpi-cycle'),
    kpiRisk: document.getElementById('kpi-risk'),
    anomalyContainer: document.getElementById('anomaly-container'),
    insightsContainer: document.getElementById('insights-container'),
    timelineVis: document.getElementById('timeline-vis'),
    twinOverlay: document.getElementById('twin-overlay'),
    viewer: document.getElementById('main-viewer')
};

// ================= INITIALIZATION =================
function init() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initial Data Seed
    generateTimeline();
    generateInsights();
    render(); // Initial render

    // Start Simulation Loop
    setInterval(simulationTick, CONFIG.updateInterval);
}

// ================= SIMULATION LOGIC =================
function simulationTick() {
    // 1. Randomize KPIs slightly
    SYSTEM_STATE.oee = clamp(SYSTEM_STATE.oee + (Math.random() - 0.5) * 2, 60, 99);
    SYSTEM_STATE.yield = clamp(SYSTEM_STATE.yield + (Math.random() - 0.5) * 1.5, 70, 100);
    SYSTEM_STATE.cycleTime = clamp(SYSTEM_STATE.cycleTime + (Math.random() - 0.5) * 0.5, 40, 50);
    
    // 2. Anomaly Injection
    if (Math.random() < CONFIG.anomalyChance) {
        injectAnomaly();
    }

    // 3. Update Risk based on anomalies
    const activeAnomalies = SYSTEM_STATE.anomalies.length;
    SYSTEM_STATE.riskScore = clamp(15 + (activeAnomalies * 20) + (Math.random() * 5), 0, 100);

    // 4. Update Charts/UI
    render();
}

function injectAnomaly() {
    const modules = ['Motor A', 'Hydraulics', 'Sensor Array', 'Conveyor Belt'];
    const types = ['Vibration High', 'Temp Warning', 'Pressure Loss', 'Voltage Spike'];
    
    const newAnomaly = {
        id: Date.now(),
        module: modules[Math.floor(Math.random() * modules.length)],
        type: types[Math.floor(Math.random() * types.length)],
        score: Math.floor(Math.random() * 50) + 50, // 50-100 severity
        timestamp: new Date()
    };
    
    // Keep max 5 recent anomalies
    SYSTEM_STATE.anomalies.unshift(newAnomaly);
    if (SYSTEM_STATE.anomalies.length > 5) SYSTEM_STATE.anomalies.pop();

    // Trigger insight update
    generateInsights();
}

function generateTimeline() {
    // Generate 8h prediction blocks (every 30 mins = 16 blocks)
    SYSTEM_STATE.timeline = [];
    for (let i = 0; i < 16; i++) {
        let status = 'ok';
        if (i > 10 && Math.random() > 0.7) status = 'warn';
        if (i > 14 && Math.random() > 0.8) status = 'crit';
        SYSTEM_STATE.timeline.push(status);
    }
}

function generateInsights() {
    const rootCauses = [
        "Bearing wear detected in Motor A (Confidence: 92%)",
        "Hydraulic pressure fluctuation correlated with cycle drift",
        "Voltage instability pattern matching known failure mode F-22"
    ];

    SYSTEM_STATE.insights = [];
    
    if (SYSTEM_STATE.anomalies.length > 0) {
        // Generate context-aware insights
        const latest = SYSTEM_STATE.anomalies[0];
        SYSTEM_STATE.insights.push({
            title: "ROOT CAUSE ANALYSIS",
            items: [
                `Correlated with ${latest.type} in ${latest.module}`,
                rootCauses[Math.floor(Math.random() * rootCauses.length)],
                "Probability of cascading failure: 45%"
            ]
        });
        
        // Add specific maintenance action
        SYSTEM_STATE.insights.push({
            title: "MAINTENANCE SUGGESTION",
            items: [
                `Immediate: Inspect ${latest.module} housing for debris`,
                `Schedule: Calibration for ${latest.module} in next break`,
                "Part req: Seal-Kit-X9 (Check inventory)"
            ]
        });
    } else {
        SYSTEM_STATE.insights.push({
            title: "SYSTEM OPTIMIZATION",
            items: [
                "Process parameters are stable.",
                "Energy consumption 2% below baseline.",
                "Predictive model shows low risk for next 8h."
            ]
        });
        
        SYSTEM_STATE.insights.push({
            title: "UPCOMING MAINTENANCE",
            items: [
                "Routine Filter Change: Due in 48h",
                "Weekly Lubrication: Completed",
                "Firmware Update: Scheduled for Sunday"
            ]
        });
    }
}

// ================= RENDERING =================
function render() {
    // KPI
    UI.kpiOEE.innerText = SYSTEM_STATE.oee.toFixed(1) + '%';
    UI.kpiYield.innerText = SYSTEM_STATE.yield.toFixed(1) + '%';
    UI.kpiCycle.innerText = SYSTEM_STATE.cycleTime.toFixed(1) + 's';
    
    const riskVal = Math.round(SYSTEM_STATE.riskScore);
    UI.kpiRisk.innerText = riskVal;
    UI.kpiRisk.className = 'kpi-value ' + (riskVal > 50 ? 'warning' : '');

    // ANOMALIES
    if (SYSTEM_STATE.anomalies.length === 0) {
        UI.anomalyContainer.innerHTML = `
            <div class="loading-state">
                <div class="scanner-line" style="background:var(--accent-green); box-shadow:0 0 10px var(--accent-green);"></div>
                <span style="color:var(--accent-green)">System Normal. Monitoring...</span>
            </div>`;
    } else {
        UI.anomalyContainer.innerHTML = SYSTEM_STATE.anomalies.map(a => `
            <div class="anomaly-card ${a.score > 80 ? 'critical' : 'medium'}">
                <div class="anomaly-header">
                    <span>${formatTime(a.timestamp)}</span>
                    <span>ID: ${a.id.toString().slice(-4)}</span>
                </div>
                <div class="anomaly-title">${a.module}: ${a.type}</div>
                <div class="anomaly-score">Severity Score: ${a.score}</div>
            </div>
        `).join('');
    }

    // INSIGHTS
    UI.insightsContainer.innerHTML = SYSTEM_STATE.insights.map(insight => `
        <div class="insight-item">
            <span class="insight-title">${insight.title}</span>
            <ul class="insight-list">
                ${insight.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    // TIMELINE
    UI.timelineVis.innerHTML = SYSTEM_STATE.timeline.map(status => `
        <div class="timeline-segment ${status}"></div>
    `).join('');
    
    // UPDATE TWIN OVERLAY
    const vibrationStatus = SYSTEM_STATE.riskScore > 40 ? 'VIBRATION ALERT' : 'Vibration OK';
    const vibrationClass = SYSTEM_STATE.riskScore > 40 ? 'warning' : '';
    
    UI.twinOverlay.innerHTML = `
        <div class="overlay-tag" style="top: 20%; left: 20%;">Sensor A</div>
        <div class="overlay-tag ${vibrationClass}" style="top: 50%; right: 10%;">${vibrationStatus}</div>
    `;
}

// ================= UTILS =================
function updateClock() {
    const now = new Date();
    UI.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-GB', { hour12: false });
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

// ================= BOOTSTRAP =================
window.addEventListener('DOMContentLoaded', init);
