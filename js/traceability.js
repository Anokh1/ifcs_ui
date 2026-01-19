
// Mock Database
const MOCK_DB = {
    'LOT-2024-001': {
        status: 'RELEASED',
        units: 842,
        risk: 12,
        riskText: 'LOW',
        materials: [
            { name: 'Raw Resin A', batch: 'RM-552', qty: '500kg', status: 'OK' },
            { name: 'Hardener B', batch: 'RM-998', qty: '50kg', status: 'OK' },
            { name: 'Pigment Blue', batch: 'P-102', qty: '5kg', status: 'OK' }
        ],
        params: [220, 221, 219, 220, 222, 221, 220, 219, 220, 221],
        tree: {
            id: 'LOT-2024-001',
            type: 'finish',
            children: [
                { id: 'SUB-A1', type: 'sub' },
                { id: 'SUB-A2', type: 'sub' },
                { id: 'SUB-A3', type: 'sub' }
            ]
        }
    },
    'LOT-2024-002': {
        status: 'QUARANTINE', // Bad lot
        units: 150,
        risk: 88,
        riskText: 'HIGH',
        materials: [
            { name: 'Raw Resin A', batch: 'RM-552', qty: '100kg', status: 'OK' },
            { name: 'Hardener B', batch: 'RM-BAD', qty: '10kg', status: 'EXPIRED' }
        ],
        params: [220, 245, 250, 255, 260, 255, 250, 240, 230, 220], // Spike
        tree: {
            id: 'LOT-2024-002',
            type: 'finish',
            children: [
                { id: 'SUB-B1', type: 'sub' },
                { id: 'SUB-B2', type: 'sub' }
            ]
        }
    }
};

// UI Refs
const UI = {
    search: document.getElementById('lot-search'),
    units: document.getElementById('tm-units'),
    risk: document.getElementById('tm-risk'),
    status: document.getElementById('tm-status'),
    tree: document.getElementById('tree-container'),
    matBody: document.getElementById('mat-body'),
    riskCircle: document.getElementById('risk-circle'),
    riskVal: document.getElementById('risk-val'),
    riskAdvice: document.getElementById('risk-advice'),
    clock: document.getElementById('clock')
};

let paramChart = null;

function init() {
    updateClock();
    setInterval(updateClock, 1000);
    initChart();
    runTrace(); // Load default
}

function runTrace() {
    const query = UI.search.value.trim();
    const data = MOCK_DB[query] || MOCK_DB['LOT-2024-001']; // Fallback

    // Update Metrics
    UI.units.innerText = data.units;
    UI.risk.innerText = data.riskText;
    UI.status.innerText = data.status;

    UI.status.className = 'tm-val ' + (data.status === 'RELEASED' ? 'text-green' : 'text-red');
    UI.risk.className = 'tm-val ' + (data.risk > 50 ? 'text-red' : 'text-green');

    // Update Material Table
    renderMaterials(data.materials);

    // Update Tree
    renderTree(data.tree);

    // Update Chart
    updateChart(data.params);

    // Update AI Risk
    updateRisk(data.risk);
}

function renderMaterials(mats) {
    UI.matBody.innerHTML = '';
    mats.forEach(m => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${m.name}</td>
            <td class="mono">${m.batch}</td>
            <td>${m.qty}</td>
            <td><span class="badge ${m.status === 'OK' ? 'ok' : 'bad'}">${m.status}</span></td>
        `;
        UI.matBody.appendChild(row);
    });
}

function renderTree(node) {
    UI.tree.innerHTML = '';

    // Simple vertical hierarchical visual
    // Parent
    const root = createNode(node.id, 'parent');
    UI.tree.appendChild(root);

    // Link
    const link = document.createElement('div');
    link.className = 'tree-link-vert';
    UI.tree.appendChild(link);

    // Children Container
    const childCont = document.createElement('div');
    childCont.className = 'tree-children';

    node.children.forEach(child => {
        const cNode = createNode(child.id, 'child');
        childCont.appendChild(cNode);
    });

    UI.tree.appendChild(childCont);
}

function createNode(text, type) {
    const el = document.createElement('div');
    el.className = `tree-node ${type}`;
    el.innerHTML = `
        <span class="material-symbols-outlined icon-node">inventory_2</span>
        <span class="node-id">${text}</span>
    `;
    return el;
}

function updateRisk(score) {
    UI.riskVal.innerText = score + '%';
    UI.riskCircle.className = `risk-circle ${score > 50 ? 'high' : 'low'}`;

    if (score > 50) {
        UI.riskAdvice.innerHTML = "<span class='warning'>⚠ CONTAINMENT ADVISED</span><br>Expired material detected in batch RM-998. Quarantine SUB-B1, SUB-B2.";
    } else {
        UI.riskAdvice.innerText = "Analysis indicates normal process conditions. No containment required.";
    }
}

function initChart() {
    const ctx = document.getElementById('paramChart').getContext('2d');
    paramChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(10).fill(''),
            datasets: [{
                label: 'Temp (°C)',
                data: [],
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function updateChart(data) {
    paramChart.data.datasets[0].data = data;
    paramChart.update();
}

function updateClock() {
    const now = new Date();
    UI.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
}

window.addEventListener('DOMContentLoaded', init);
