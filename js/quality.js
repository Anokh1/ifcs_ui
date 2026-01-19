/**
 * QUALITY MODULE SCRIPT
 * Handles SPC Charts, Pareto logic, and AI Insights.
 */

const CONFIG = {
    updateInterval: 2000,
    targetVal: 10.00,
    tolerance: 0.05
};

// State
let spcData = [];
let labels = [];
let defectcounts = { 'Scratch': 12, 'Dim. Error': 8, 'Surface': 5, 'Crack': 1 };
let chartSPC, chartPareto;

// DOM
const UI = {
    clock: document.getElementById('clock'),
    spcStatus: document.getElementById('spc-status'),
    defectLog: document.getElementById('defect-log'),
    aiContent: document.getElementById('ai-insight-content')
};

// ================= INIT =================
function init() {
    updateClock();
    setInterval(updateClock, 1000);

    initSPCData();
    initCharts();
    renderDefectLog(); // Mock initial logs
    renderAI();

    setInterval(simulationTick, CONFIG.updateInterval);
}

// ================= DATA LOGIC =================
function initSPCData() {
    // Generate initial 20 points
    for (let i = 0; i < 20; i++) {
        addSPCPoint(false);
    }
}

function addSPCPoint(updateChart = true) {
    // Generate normal dist around 10.00 +/- 0.03
    // Occasional outlier
    let val = CONFIG.targetVal + (Math.random() - 0.5) * 0.06;

    // Simulate drift occasionally
    if (Math.random() > 0.95) val += 0.04; // Spike

    const timeLabel = new Date().toLocaleTimeString('en-GB', { hour12: false, minute: '2-digit', second: '2-digit' });

    if (spcData.length > 30) {
        spcData.shift();
        labels.shift();
    }
    spcData.push(val);
    labels.push(timeLabel);

    if (updateChart && chartSPC) {
        chartSPC.update();
        checkSPCStatus();
    }
}

function checkSPCStatus() {
    // Simple rule: if last point > limit
    const last = spcData[spcData.length - 1];
    const upper = CONFIG.targetVal + CONFIG.tolerance;
    const lower = CONFIG.targetVal - CONFIG.tolerance;

    if (last > upper || last < lower) {
        UI.spcStatus.innerText = "OUT OF SPEC";
        UI.spcStatus.className = "header-badge warning";
        UI.spcStatus.classList.add('pulse-text');
    } else {
        UI.spcStatus.innerText = "STABLE";
        UI.spcStatus.className = "header-badge";
        UI.spcStatus.classList.remove('pulse-text');
    }
}

function simulationTick() {
    addSPCPoint(true);

    // Random defect occasionally
    if (Math.random() > 0.9) {
        logRandomDefect();
    }
}

// ================= CHARTS =================
function initCharts() {
    // MAIN SPC CHART
    const ctxSPC = document.getElementById('spcChart').getContext('2d');

    // Gradient fill
    const gradient = ctxSPC.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 243, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');

    chartSPC = new Chart(ctxSPC, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Diameter (mm)',
                data: spcData,
                borderColor: '#00f3ff',
                backgroundColor: gradient,
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#fff',
                fill: true,
                tension: 0.4
            }, {
                label: 'UCL',
                data: Array(30).fill(CONFIG.targetVal + CONFIG.tolerance),
                borderColor: '#ff3366',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }, {
                label: 'LCL',
                data: Array(30).fill(CONFIG.targetVal - CONFIG.tolerance),
                borderColor: '#ff3366',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    min: 9.90,
                    max: 10.10,
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    display: false // Hide clutter
                }
            }
        }
    });

    // PARETO CHART
    const ctxPar = document.getElementById('paretoChart').getContext('2d');
    chartPareto = new Chart(ctxPar, {
        type: 'bar',
        data: {
            labels: Object.keys(defectcounts),
            datasets: [{
                label: 'Count',
                data: Object.values(defectcounts),
                backgroundColor: [
                    'rgba(255, 51, 102, 0.6)',
                    'rgba(255, 204, 0, 0.6)',
                    'rgba(0, 243, 255, 0.6)',
                    '#555'
                ],
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: '#8b9bb4', font: { size: 10 } } }
            }
        }
    });
}

// ================= DEFECTS =================
function renderDefectLog() {
    const logs = [
        { time: '10:05', type: 'Dim. Error', val: '10.08mm', status: 'SCRAP' },
        { time: '09:45', type: 'Scratch', val: 'Surface-A', status: 'REWORK' },
        { time: '09:12', type: 'Surface', val: 'Roughness', status: 'QA-REV' }
    ];

    UI.defectLog.innerHTML = logs.map(l => `
        <div class="log-item">
            <span class="log-time">${l.time}</span>
            <span class="log-type">${l.type}</span>
            <span class="log-val">${l.val}</span>
            <span class="log-status stat-${l.status.toLowerCase()}">${l.status}</span>
        </div>
    `).join('');
}

function logRandomDefect() {
    // Just visual effect: flash count or add to log
    // For this simple mock, we won't infinitely grow the log DOM
}

function renderAI() {
    UI.aiContent.innerHTML = `
        <div class="ai-insight-box">
            <div class="aib-head">
                <span class="material-symbols-outlined">trending_up</span> 
                DRIFT DETECTED
            </div>
            <div class="aib-body">
                Consistent upward drift in Diameter A since 09:30.
                Correlation: 85% match with Tool Wear pattern.
            </div>
            <div class="aib-act">Suggestion: Offset Cutter -0.02mm</div>
        </div>
        <div class="ai-insight-box">
            <div class="aib-head">
                <span class="material-symbols-outlined">dataset</span> 
                BATCH ANALYSIS
            </div>
            <div class="aib-body">
                Batch B-993 showing 5% higher yield than B-992.
                Parameter difference: High injection pressure(+5bar).
            </div>
        </div>
    `;
}

// ================= UTILS =================
function updateClock() {
    const now = new Date();
    UI.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
}

window.addEventListener('DOMContentLoaded', init);
