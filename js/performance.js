/**
 * PERFORMANCE MODULE SCRIPT
 * Handles OEE calculation, Downtime logging, and Simulation.
 */

const CONFIG = {
    baseAvail: 85,
    basePerf: 90,
    baseQual: 98,
    updateInterval: 3000
};

// State
let dtCounts = { 'Jam': 15, 'Tool': 12, 'Material': 8, 'No Operator': 5, 'Other': 3 };
let chartDT;
let currentOEE = 0;

// DOM
const UI = {
    clock: document.getElementById('clock'),
    oeeMain: document.getElementById('oee-main'),
    valAvail: document.getElementById('val-avail'),
    barAvail: document.getElementById('bar-avail'),
    valPerf: document.getElementById('val-perf'),
    barPerf: document.getElementById('bar-perf'),
    valQual: document.getElementById('val-qual'),
    barQual: document.getElementById('bar-qual'),
    gantt: document.getElementById('gantt-chart'),
    simSlider: document.getElementById('sim-slider'),
    simVal: document.getElementById('sim-val'),
    simOutput: document.getElementById('sim-output'),
    simInsight: document.getElementById('sim-insight'),
    aiBadge: document.getElementById('ai-sim-badge')
};

// ================= INIT =================
function init() {
    updateClock();
    setInterval(updateClock, 1000);

    initChart();
    renderGantt();
    calcOEE();

    // Initial Sim
    updateSim();

    setInterval(simulationTick, CONFIG.updateInterval);
}

// ================= LOGIC =================
function calcOEE() {
    // Random fluctuation
    const a = CONFIG.baseAvail + (Math.random() - 0.5) * 2;
    const p = CONFIG.basePerf + (Math.random() - 0.5) * 3;
    const q = CONFIG.baseQual + (Math.random() - 0.5) * 1;

    const oee = (a * p * q) / 10000;
    currentOEE = oee;

    UI.oeeMain.innerText = oee.toFixed(1) + '%';

    updateBar(UI.valAvail, UI.barAvail, a);
    updateBar(UI.valPerf, UI.barPerf, p);
    updateBar(UI.valQual, UI.barQual, q);
}

function updateBar(elVal, elBar, val) {
    elVal.innerText = val.toFixed(1) + '%';
    elBar.style.width = val + '%';

    // Color logic
    elBar.style.backgroundColor = val > 80 ? 'var(--accent-green)' : (val > 60 ? 'var(--accent-amber)' : 'var(--accent-red)');
}

function simulationTick() {
    calcOEE();

    // Randomly add a micro-stop to Gantt
    if (Math.random() > 0.8) {
        addGanttBlock('micro');
    } else {
        addGanttBlock('run');
    }
}

// ================= CHART =================
function initChart() {
    const ctx = document.getElementById('dtChart').getContext('2d');
    chartDT = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dtCounts),
            datasets: [{
                data: Object.values(dtCounts),
                backgroundColor: [
                    'rgba(255, 0, 85, 0.8)',  /* Neon Pink (Jam) */
                    'rgba(255, 170, 0, 0.8)', /* Neon Amber (Tool) */
                    'rgba(0, 243, 255, 0.8)', /* Neon Cyan (Material) */
                    'rgba(157, 0, 255, 0.8)', /* Neon Purple (No Operator) */
                    'rgba(51, 255, 153, 0.8)' /* Neon Green (Other) */
                ],
                borderColor: 'rgba(18, 20, 30, 0.8)',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: '#8b9bb4',
                        font: { size: 10, family: 'Orbitron' },
                        boxWidth: 10,
                        padding: 15
                    }
                }
            },
            cutout: '70%',
            layout: {
                padding: { top: 10, bottom: 20 }
            },
            borderColor: 'transparent',
            offset: 5
        }
    });
}

window.logDowntime = function (type) {
    if (dtCounts[type]) dtCounts[type]++;
    else dtCounts[type] = 1;

    // Update Chart
    chartDT.data.datasets[0].data = Object.values(dtCounts);
    chartDT.update();

    // Visual feedback (flash Gantt)
    addGanttBlock('down');
};

// ================= GANTT =================
function renderGantt() {
    // Fill initial
    for (let i = 0; i < 60; i++) {
        addGanttBlock(Math.random() > 0.9 ? 'micro' : 'run', false);
    }
}

function addGanttBlock(type, animate = true) {
    const block = document.createElement('div');
    block.className = `g-block ${type}`;
    UI.gantt.appendChild(block);

    if (UI.gantt.children.length > 100) {
        UI.gantt.removeChild(UI.gantt.firstChild);
    }
}

// ================= SIMULATION =================
window.updateSim = function () {
    const improvePct = parseInt(UI.simSlider.value);
    UI.simVal.innerText = improvePct + '%';

    // Logic: improvement adds to Performance & Availability
    const gain = improvePct * 0.15; // 0-15% gain
    const simulatedOEE = (currentOEE + gain);

    UI.simOutput.innerText = Math.min(100, simulatedOEE).toFixed(1) + '%';

    if (improvePct > 50) {
        UI.simOutput.style.color = 'var(--accent-green)';
        UI.simOutput.style.textShadow = '0 0 10px var(--accent-green)';
        UI.aiBadge.classList.remove('hidden');
        UI.simInsight.innerHTML = "<span class='material-symbols-outlined' style='font-size:12px'>check_circle</span> Eliminating micro-stops boosts throughput.";
    } else {
        UI.simOutput.style.color = 'var(--accent-cyan)';
        UI.simOutput.style.textShadow = 'none';
        UI.aiBadge.classList.add('hidden');
        UI.simInsight.innerText = "Increase reduction factor to see potential gains.";
    }
};


// ================= UTILS =================
function updateClock() {
    const now = new Date();
    UI.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
}

window.addEventListener('DOMContentLoaded', init);
