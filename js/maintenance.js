/**
 * maintenance.js
 * Logic for Alarm, Condition & Maintenance Monitoring Module
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initAlarms();
    initCharts();
    initSchedule();

    // Simulate real-time updates
    setInterval(updateCharts, 2000);
});

/* ================= CLOCK ================= */
function initClock() {
    const updateTime = () => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB', { hour12: false });
    };
    updateTime();
    setInterval(updateTime, 1000);
}

/* ================= ALARMS ================= */
const MOCK_ALARMS = [
    { id: 'ALM-1024', severity: 'critical', msg: 'Hydraulic Pressure Low', time: '10:42:15', active: true },
    { id: 'ALM-1022', severity: 'warning', msg: 'Spindle Temp Deviation', time: '09:15:00', active: true },
    { id: 'ALM-1015', severity: 'info', msg: 'Coolant Level Check', time: '08:00:00', active: false },
    { id: 'ALM-1001', severity: 'info', msg: 'Shift Start Sequence', time: '07:00:00', active: false },
    { id: 'ALM-0998', severity: 'warning', msg: 'Network Latency High', time: '06:45:22', active: false }
];

function initAlarms() {
    renderAlarms(MOCK_ALARMS);
}

function renderAlarms(alarms) {
    const list = document.getElementById('alarm-list');
    list.innerHTML = '';

    alarms.forEach(alm => {
        const card = document.createElement('div');
        card.className = `alarm-card ${alm.severity} ${alm.active ? 'active' : 'history'}`;

        card.innerHTML = `
            <div class="alm-icon">
                <span class="material-symbols-outlined">
                    ${alm.severity === 'critical' ? 'error' : alm.severity === 'warning' ? 'warning' : 'info'}
                </span>
            </div>
            <div class="alm-content">
                <div class="alm-header">
                    <span class="alm-id">${alm.id}</span>
                    <span class="alm-time">${alm.time}</span>
                </div>
                <div class="alm-msg">${alm.msg}</div>
            </div>
            <div class="alm-action">
                ${alm.active ? '<button class="btn-ack" onclick="ackAlarm(this)">ACK</button>' : '<span class="status-done">RESOLVED</span>'}
            </div>
        `;
        list.appendChild(card);
    });
}

// Global scope for onclick
window.ackAlarm = function (btn) {
    const card = btn.closest('.alarm-card');
    card.classList.remove('active');
    card.classList.add('history');
    btn.parentNode.innerHTML = '<span class="status-done">ACKNOWLEDGED</span>';
};

/* ================= CHARTS ================= */
let vibChart, tempChart;

function initCharts() {
    // Vibration Chart
    const ctxVib = document.getElementById('vibChart').getContext('2d');
    vibChart = new Chart(ctxVib, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'Vibration (mm/s)',
                data: generateRandomData(20, 0.5, 2.5),
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: getChartOptions()
    });

    // Temperature Chart
    const ctxTemp = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'Temp (°C)',
                data: generateRandomData(20, 45, 65),
                borderColor: '#ffcc00',
                backgroundColor: 'rgba(255, 204, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: getChartOptions()
    });
}

function updateCharts() {
    // Scroll Data
    updateChartData(vibChart, getRandom(0.5, 3.0));
    updateChartData(tempChart, getRandom(45, 70));

    // Mock AI Analysis Update randomly
    if (Math.random() > 0.7) {
        const msgs = [
            "AI Analysis: Vibration patterns within nominal range.",
            "AI Analysis: Slight thermal drift detected (Zone 2).",
            "AI Analysis: Optimal operating conditions confirmed.",
            "AI Analysis: Predictive model indicates stable health."
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        document.getElementById('ai-condition-msg').innerText = msg;
    }
}

function updateChartData(chart, newVal) {
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(newVal);
    chart.update('none'); // Perf opt
}

function generateRandomData(count, min, max) {
    return Array.from({ length: count }, () => getRandom(min, max));
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: {
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#8b9bb4', font: { family: 'Orbitron', size: 10 } }
            }
        },
        animation: false
    };
}

/* ================= SCHEDULE ================= */
const SCHEDULE_TASKS = [
    { task: 'Hydraulic Seal Replacement', due: 'Today, 14:00', priority: 'high' },
    { task: 'Spindle Lubrication', due: 'Tomorrow, 08:00', priority: 'med' },
    { task: 'Filter Cleaning (Unit A)', due: '22 Jan, 09:00', priority: 'low' },
    { task: 'Axis Calibration (X/Y)', due: '25 Jan, 07:00', priority: 'med' }
];

function initSchedule() {
    const list = document.getElementById('schedule-list');
    list.innerHTML = '';

    SCHEDULE_TASKS.forEach(job => {
        const item = document.createElement('div');
        item.className = 'sched-item';
        item.innerHTML = `
            <div class="sched-marker ${job.priority}"></div>
            <div class="sched-info">
                <div class="sched-task">${job.task}</div>
                <div class="sched-due">${job.due}</div>
            </div>
            <div class="sched-action">
                <span class="material-symbols-outlined">chevron_right</span>
            </div>
        `;
        list.appendChild(item);
    });
}
