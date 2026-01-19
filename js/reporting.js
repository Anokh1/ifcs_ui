/**
 * Module 7: Reporting & Analytics Logic
 * - Mock Dashboard Charts (Chart.js)
 * - Shift Report Generation & List
 * - AI Copilot Interaction
 * - Export Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCharts();
    renderReports();
    initCopilot();
});

function initClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
}

// 1. DASHBOARD CHARTS
function initCharts() {
    // OEE Trend Chart
    const oeeCtx = document.getElementById('oeeTrendChart').getContext('2d');
    new Chart(oeeCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Global OEE %',
                data: [82, 85, 84, 88, 87, 91, 89],
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#00f3ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
                }
            }
        }
    });

    // Yield Trend Chart
    const yieldCtx = document.getElementById('yieldTrendChart').getContext('2d');
    new Chart(yieldCtx, {
        type: 'bar',
        data: {
            labels: ['Shift 1', 'Shift 2', 'Shift 3'],
            datasets: [{
                label: 'Yield Rate',
                data: [98.2, 97.8, 99.1],
                backgroundColor: 'rgba(51, 255, 153, 0.4)',
                borderColor: '#33ff99',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    min: 95,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
                }
            }
        }
    });
}

// 2. SHIFT REPORTS
const mockReports = [
    { id: 'R-29184', date: '2024-01-19', shift: 'Morning', author: 'S. Connor', status: 'Finalized' },
    { id: 'R-29183', date: '2024-01-18', shift: 'Night', author: 'M. Rossi', status: 'Finalized' },
    { id: 'R-29182', date: '2024-01-18', shift: 'Afternoon', author: 'J. Doe', status: 'Finalized' },
    { id: 'R-29181', date: '2024-01-18', shift: 'Morning', author: 'S. Connor', status: 'Finalized' },
    { id: 'R-29180', date: '2024-01-17', shift: 'Night', author: 'M. Rossi', status: 'Archived' }
];

function renderReports() {
    const list = document.getElementById('reports-list');
    list.innerHTML = mockReports.map(report => `
        <div class="report-item">
            <div class="report-main">
                <span class="report-id">${report.id}</span>
                <span class="report-meta">${report.date} | ${report.shift}</span>
            </div>
            <div class="report-author">${report.author}</div>
            <div class="report-badge ${report.status.toLowerCase()}">${report.status}</div>
            <div class="report-actions">
                <button onclick="simulateExport('${report.id}')" title="View/Download">
                    <span class="material-symbols-outlined">visibility</span>
                </button>
            </div>
        </div>
    `).join('');
}

function simulateExport(id) {
    const btn = event.currentTarget;
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined rotating">sync</span>';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalIcon;
        btn.disabled = false;
        alert(`Report ${id} exported successfully.`);
    }, 1500);
}

// 3. AI COPILOT
function initCopilot() {
    const input = document.getElementById('copilot-input');
    const btn = document.getElementById('btn-ask');
    const history = document.getElementById('chat-history');

    function askCopilot() {
        const query = input.value.trim();
        if (!query) return;

        // User Message
        appendMessage('user', query);
        input.value = '';

        // Typing indicator
        const typing = appendMessage('system', 'Analyzing factory data...', true);

        setTimeout(() => {
            typing.remove();
            const response = getMockResponse(query);
            appendMessage('system', response);
        }, 1000);
    }

    btn.onclick = askCopilot;
    input.onkeypress = (e) => { if (e.key === 'Enter') askCopilot(); };

    function appendMessage(role, text, isTyping = false) {
        const div = document.createElement('div');
        div.className = `chat-msg ${role}`;
        div.textContent = text;
        history.appendChild(div);
        history.scrollTop = history.scrollHeight;
        return div;
    }

    function getMockResponse(q) {
        q = q.toLowerCase();
        if (q.includes('oee')) return "Current Shift OEE is 88.5%. Line A-01 is performing 2% above baseline, but Line B-02 shows potential micro-stops.";
        if (q.includes('downtime') || q.includes('loss')) return "Top loss factor for the last 24h is 'Material Change' on Station 4. Total impact: 14 mins.";
        if (q.includes('yield') || q.includes('defect')) return "Yield rate is stable at 98.4%. Scrap levels are minimal, mostly due to startup parameters.";
        return "I can help with OEE trends, downtime analysis, or shift yield summaries. What would you like to know?";
    }
}
