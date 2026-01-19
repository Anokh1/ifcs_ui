/**
 * PRODUCTION MONITORING SCRIPT
 * Handles machine states, job progress, and timeline simulations.
 */

const CONFIG = {
    updateInterval: 1000,
    machineCount: 4
};

const MACHINES = [
    { id: 'M-101', name: 'CNC-01', state: 'RUN', job: 'J-4821', progress: 45, target: 120, speed: 0.5 },
    { id: 'M-102', name: 'CNC-02', state: 'IDLE', job: 'Waiting', progress: 0, target: 0, speed: 0 },
    { id: 'M-201', name: 'ASSEMBLY-A', state: 'RUN', job: 'J-4800', progress: 88, target: 500, speed: 2.5 },
    { id: 'M-305', name: 'PACKAGING', state: 'SETUP', job: 'J-4999', progress: 0, target: 200, speed: 0 }
];

// Mock Timeline for Gantt (Last 8 hours)
// Each machine has an array of blocks { state, duration }
const TIMELINE_DATA = {};

// ================= DOM ELEMENTS =================
const UI = {
    clock: document.getElementById('clock'),
    machineContainer: document.getElementById('machine-container'),
    sumLines: document.getElementById('sum-lines'),
    sumJobs: document.getElementById('sum-jobs'),
    sumOee: document.getElementById('sum-oee'),
    aiContent: document.getElementById('ai-monitor-content')
};

// ================= INIT =================
function init() {
    initTimelines();
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(simulationTick, CONFIG.updateInterval);
    render();
}

// ================= LOGIC =================
function initTimelines() {
    MACHINES.forEach(m => {
        TIMELINE_DATA[m.id] = generateMockHistory();
    });
}

function generateMockHistory() {
    const blocks = [];
    let timeLeft = 480; // 8 hours in minutes
    while (timeLeft > 0) {
        const duration = Math.min(Math.floor(Math.random() * 60) + 15, timeLeft);
        const rand = Math.random();
        let state = 'RUN';
        if (rand > 0.7) state = 'IDLE';
        if (rand > 0.9) state = 'ALARM';
        if (rand > 0.95) state = 'SETUP';
        
        blocks.push({ state, duration });
        timeLeft -= duration;
    }
    return blocks;
}

function simulationTick() {
    // Simulate Progress
    MACHINES.forEach(m => {
        if (m.state === 'RUN') {
            m.progress += m.speed * (Math.random() * 0.5 + 0.8);
            if (m.progress >= 100) {
                m.progress = 0;
                m.state = Math.random() > 0.5 ? 'SETUP' : 'IDLE';
                m.job = 'DONE';
            }
        } else if (m.state === 'SETUP') {
             if (Math.random() > 0.9) {
                 m.state = 'RUN';
                 m.job = 'J-' + Math.floor(Math.random() * 9000 + 1000);
                 m.progress = 0;
             }
        } else if (m.state === 'IDLE') {
            if (Math.random() > 0.95) {
                m.state = 'RUN';
                m.progress = 0;
                m.job = 'J-' + Math.floor(Math.random() * 9000 + 1000);
            }
        }
        
        // Random Alarm
        if (m.state === 'RUN' && Math.random() < 0.01) {
            m.state = 'ALARM';
        }
        // Clear Alarm
        if (m.state === 'ALARM' && Math.random() < 0.05) {
            m.state = 'RUN';
        }
    });

    render();
}

// ================= RENDER =================
function render() {
    // 1. Summary
    const running = MACHINES.filter(m => m.state === 'RUN').length;
    UI.sumLines.innerText = `${running}/${MACHINES.length}`;
    
    // 2. Machine List
    UI.machineContainer.innerHTML = MACHINES.map(m => createMachineCard(m)).join('');

    // 3. AI Insights
    renderAI();
}

function createMachineCard(m) {
    const statusClass = getStatusClass(m.state);
    const progressVal = Math.min(Math.round(m.progress), 100);
    
    return `
    <div class="machine-card">
        <div class="mc-header">
            <div class="mc-title">
                <span class="mc-name">${m.name}</span>
                <span class="mc-job">${m.job}</span>
            </div>
            <div class="mc-state ${statusClass}">${m.state}</div>
        </div>
        
        <div class="mc-body">
            <div class="progress-bar-container">
                <div class="progress-fill ${statusClass}" style="width: ${progressVal}%"></div>
            </div>
            <div class="mc-stats">
                <span>PROG: ${progressVal}%</span>
                <span>TGT: ${m.target}</span>
            </div>
        </div>

        <div class="mc-timeline">
            ${TIMELINE_DATA[m.id].map(b => 
                `<div class="tl-block ${getStatusClass(b.state)}" style="flex: ${b.duration} 0 0"></div>`
            ).join('')}
        </div>
    </div>
    `;
}

function renderAI() {
    // Generate context-based AI messages
    const bottlenecks = MACHINES.filter(m => m.state === 'ALARM').length;
    
    let html = '';
    
    if (bottlenecks > 0) {
        html += `
        <div class="ai-card critical">
            <div class="ai-head"><span class="material-symbols-outlined">warning</span> BOTTLENECK DETECTED</div>
            <div class="ai-body">
                Production halted on ${bottlenecks} line(s). 
                Recommended Action: Dispatch maintenance team to investigate ALARM states immediately.
            </div>
        </div>`;
    }

    // Prediction
    html += `
    <div class="ai-card">
        <div class="ai-head"><span class="material-symbols-outlined">insights</span> PREDICTION</div>
        <div class="ai-body">
            Shift target completion estimated at 104% based on current velocity.
            Trend is stable.
        </div>
    </div>`;

    UI.aiContent.innerHTML = html;
}

function getStatusClass(state) {
    switch(state) {
        case 'RUN': return 'status-run';
        case 'IDLE': return 'status-idle';
        case 'ALARM': return 'status-alarm';
        case 'SETUP': return 'status-setup';
        default: return '';
    }
}

function updateClock() {
    const now = new Date();
    UI.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
}

window.addEventListener('DOMContentLoaded', init);
