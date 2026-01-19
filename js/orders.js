/**
 * ORDERS MANAGEMENT SCRIPT
 * Handles Work Orders (WO) and Service Orders (SO) logic.
 * Mocks AI prioritisation and E-Sign workflows.
 */

const CONFIG = {
    updateInterval: 3000
};

// ================= MOCK DATA =================
const WORK_ORDERS = [
    { id: 'WO-8821', sku: 'PN-1044-A', qty: 500, step: 'CNC-Milling', status: 'queued', priority: 90, risk: 'low', note: 'Due Today' },
    { id: 'WO-9912', sku: 'PN-2200-X', qty: 1200, step: 'Assembly', status: 'active', priority: 50, risk: 'med', note: 'Standard Run' },
    { id: 'WO-9945', sku: 'PN-3301-B', qty: 50, step: 'Packaging', status: 'active', priority: 60, risk: 'low', note: '' },
    { id: 'WO-8855', sku: 'PN-9900-Z', qty: 250, step: 'QA-Check', status: 'hold', priority: 95, risk: 'high', note: 'Dim. Deviation' },
    { id: 'WO-8900', sku: 'PN-1044-B', qty: 500, step: 'CNC-Milling', status: 'queued', priority: 40, risk: 'low', note: 'Stock Build' },
    { id: 'WO-9999', sku: 'PROTO-X', qty: 5, step: 'Printing', status: 'queued', priority: 99, risk: 'high', note: 'URGENT PROTOTYPE' }
];

const SERVICE_ORDERS = [
    { id: 'SO-101', machine: 'CNC-01', issue: 'Spindle Temp High', severity: 'crit', status: 'open', triage: 'AI: Likely bearing wear. Assign Senior Tech.' },
    { id: 'SO-105', machine: 'Pack-Line', issue: 'Label Feeder Jam', severity: 'med', status: 'open', triage: 'AI: Standard clear procedure.' }
];

let globalActionTarget = null; // Store which ID is being acted upon

// ================= DOM ELEMENTS =================
const UI = {
    clock: document.getElementById('clock'),
    queueList: document.getElementById('queue-list'),
    activeList: document.getElementById('active-list'),
    holdList: document.getElementById('hold-list'),
    soList: document.getElementById('so-list'),
    woCount: document.getElementById('wo-count'),
    soCount: document.getElementById('so-count'),
    modal: document.getElementById('esign-modal')
};

// ================= INIT =================
function init() {
    updateClock();
    setInterval(updateClock, 1000);
    render();

    // Auto-simulation: randomly change SO severity or add new WO
    setInterval(simTick, 5000);
}

function simTick() {
    // Random visual updates to simulate "Live" priorities
    WORK_ORDERS.forEach(wo => {
        if (wo.status === 'queued') {
            wo.priority = Math.min(100, Math.max(0, wo.priority + (Math.random() * 10 - 4)));
        }
    });
    render();
}

// ================= RENDER =================
function render() {
    renderWOs();
    renderSOs();
    updateCounts();
}

function renderWOs() {
    // Sort Queue by Priority
    const queued = WORK_ORDERS.filter(w => w.status === 'queued').sort((a, b) => b.priority - a.priority);
    const active = WORK_ORDERS.filter(w => w.status === 'active');
    const hold = WORK_ORDERS.filter(w => w.status === 'hold');

    UI.queueList.innerHTML = queued.map(wo => createWOCard(wo)).join('');
    UI.activeList.innerHTML = active.map(wo => createWOCard(wo)).join('');
    UI.holdList.innerHTML = hold.map(wo => createWOCard(wo)).join('');
}

function createWOCard(wo) {
    let actions = '';
    let badgeClass = 'badge-norm';
    if (wo.priority > 80) badgeClass = 'badge-high';

    if (wo.status === 'queued') {
        actions = `<button class="btn-action start" onclick="moveWO('${wo.id}', 'active')">START</button>`;
    } else if (wo.status === 'active') {
        actions = `<button class="btn-action finish" onclick="moveWO('${wo.id}', 'hold')">COMPLETE</button>`;
    } else if (wo.status === 'hold') {
        actions = `<button class="btn-action sign" onclick="openSignModal('${wo.id}')">E-SIGN RELEASE</button>`;
    }

    // AI Recommendation
    let aiRec = '';
    if (wo.status === 'queued' && wo.priority > 90) aiRec = `<div class="ai-rec">AI: Prioritize (Customer commit)</div>`;
    if (wo.status === 'hold') aiRec = `<div class="ai-rec warn">AI: Risk High. Supervisor Check Req.</div>`;

    return `
    <div class="order-card priority-${Math.floor(wo.priority / 10)}">
        <div class="oc-header">
            <span class="oc-id">${wo.id}</span>
            <span class="oc-badge ${badgeClass}">${wo.priority.toFixed(0)} PRI</span>
        </div>
        <div class="oc-body">
            <div class="oc-info"><strong>${wo.qty}</strong> units &middot; ${wo.sku}</div>
            <div class="oc-step">${wo.step}</div>
            ${wo.note ? `<div class="oc-note">${wo.note}</div>` : ''}
            ${aiRec}
        </div>
        <div class="oc-footer">
            ${actions}
        </div>
    </div>
    `;
}

function renderSOs() {
    UI.soList.innerHTML = SERVICE_ORDERS.map(so => `
        <div class="so-row ${so.severity}">
            <div class="so-icon">
                <span class="material-symbols-outlined">${so.severity === 'crit' ? 'error' : 'build'}</span>
            </div>
            <div class="so-details">
                <div class="so-title">${so.machine} - ${so.issue}</div>
                <div class="so-triage">${so.triage}</div>
            </div>
            <div class="so-action">
                <button class="btn-flat" onclick="resolveSO('${so.id}')">RESOLVE</button>
            </div>
        </div>
    `).join('');
}

function updateCounts() {
    UI.woCount.innerText = WORK_ORDERS.filter(w => w.status === 'active').length + ' ACTIVE';
    UI.soCount.innerText = SERVICE_ORDERS.length + ' OPEN';

    if (SERVICE_ORDERS.some(s => s.severity === 'crit')) {
        UI.soCount.classList.add('pulse-text');
    } else {
        UI.soCount.classList.remove('pulse-text');
    }
}

// ================= ACTIONS =================
window.moveWO = function (id, status) {
    const wo = WORK_ORDERS.find(w => w.id === id);
    if (wo) {
        wo.status = status;
        render();
    }
};

window.resolveSO = function (id) {
    const idx = SERVICE_ORDERS.findIndex(s => s.id === id);
    if (idx > -1) {
        SERVICE_ORDERS.splice(idx, 1);
        render();
    }
}

// E-SIGN MODAL
window.openSignModal = function (id) {
    globalActionTarget = id;
    UI.modal.classList.remove('hidden');
};

window.closeModal = function () {
    UI.modal.classList.add('hidden');
    globalActionTarget = null;
};

window.confirmSign = function () {
    if (globalActionTarget) {
        const wo = WORK_ORDERS.find(w => w.id === globalActionTarget);
        if (wo) {
            // "Release" means moving it out of list (Done) for this demo
            // Or maybe just back to queued loop
            wo.status = 'queued'; // Loop back for demo
            wo.step = 'Next-Process';
            wo.priority = 50;
        }
        closeModal();
        render();
    }
};

function updateClock() {
    const now = new Date();
    UI.clock.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
}

window.addEventListener('DOMContentLoaded', init);
