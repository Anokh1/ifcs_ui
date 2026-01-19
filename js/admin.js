/**
 * Module 8: System Administration Logic
 * - Mock Plant Hierarchy, Users, and Master Data
 * - Tab Navigation
 * - AI Linting & Data Quality Simulations
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initTabs();
    renderContent('plant'); // Default tab
});

function initClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
}

// 1. TAB NAVIGATION
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderContent(tab.dataset.tab);
        });
    });
}

// 2. MOCK DATA
const mockAdminData = {
    plant: [
        {
            id: 'P-01', name: 'Munich North', areas: [
                { id: 'A-01', name: 'Assembly', lines: ['LINE-A1', 'LINE-A2'] },
                { id: 'A-02', name: 'Packaging', lines: ['LINE-P1'] }
            ]
        },
        {
            id: 'P-02', name: 'Berlin East', areas: [
                { id: 'A-03', name: 'Logistics', lines: ['WH-01'] }
            ]
        }
    ],
    users: [
        { id: 'U-001', name: 'Sarah Connor', role: 'System Admin', dept: 'IT', status: 'Active' },
        { id: 'U-002', name: 'John Doe', role: 'Shift Lead', dept: 'Ops', status: 'Active' },
        { id: 'U-003', name: 'Miles Dyson', role: 'Developer', dept: 'R&D', status: 'Restricted' }
    ],
    master: {
        routes: [
            { code: 'RT-882', steps: ['In-Mold', 'Cooling', 'Visual QC'], machines: ['MOLD-04', 'COOL-01'] },
            { code: 'RT-883', steps: ['Stamping', 'Heat Treatment'], machines: ['STAMP-02'] }
        ],
        reasons: ['No Material', 'Tooling Wear', 'Power Loss', 'E-Stop']
    },
    integrations: [
        { name: 'SAP ERP Connector', status: 'Healthy', latency: '12ms' },
        { name: 'Ignition Edge Gateway', status: 'Warning', latency: '450ms' }
    ]
};

// 3. UI RENDERING
function renderContent(tabType) {
    const container = document.getElementById('admin-content');
    let html = '';

    switch (tabType) {
        case 'plant':
            html = `<div class="admin-table-container">
                        <table>
                            <thead>
                                <tr><th>ID</th><th>PLANT NAME</th><th>AREAS</th><th>ACTION</th></tr>
                            </thead>
                            <tbody>
                                ${mockAdminData.plant.map(p => `
                                    <tr>
                                        <td>${p.id}</td>
                                        <td>${p.name}</td>
                                        <td>${p.areas.length} Areas</td>
                                        <td><button class="btn-sm"><span class="material-symbols-outlined">edit</span></button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`;
            break;
        case 'users':
            html = `<div class="admin-table-container">
                        <table>
                            <thead>
                                <tr><th>USER</th><th>ROLE</th><th>DEPARTMENT</th><th>STATUS</th></tr>
                            </thead>
                            <tbody>
                                ${mockAdminData.users.map(u => `
                                    <tr>
                                        <td><strong>${u.name}</strong><br><small>${u.id}</small></td>
                                        <td>${u.role}</td>
                                        <td>${u.dept}</td>
                                        <td><span class="badge ${u.status.toLowerCase()}">${u.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`;
            break;
        case 'master':
            html = `<div class="master-data-grid">
                        <div class="master-section">
                            <h4>PRODUCTION ROUTES</h4>
                            ${mockAdminData.master.routes.map(r => `
                                <div class="master-item">
                                    <span class="m-code">${r.code}</span>
                                    <span class="m-steps">${r.steps.join(' → ')}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="master-section">
                            <h4>REASON CODES</h4>
                            <div class="tag-cloud">
                                ${mockAdminData.master.reasons.map(reason => `<span class="tag">${reason}</span>`).join('')}
                            </div>
                        </div>
                    </div>`;
            break;
        case 'integrations':
            html = `<div class="integrations-list">
                        ${mockAdminData.integrations.map(i => `
                            <div class="int-item ${i.status.toLowerCase()}">
                                <div class="int-info">
                                    <span class="int-name">${i.name}</span>
                                    <span class="int-status">${i.status}</span>
                                </div>
                                <div class="int-val">${i.latency}</div>
                            </div>
                        `).join('')}
                    </div>`;
            break;
    }

    container.innerHTML = html;
}
