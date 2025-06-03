// Load data from JSON files
let marketData = {};
let quickStatsData = {};
let analysisData = {};
let alertsData = {};
let regionalData = {};

let currentTimeframe = '1M';
let currentCommodity = 'corn';

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load all data
        await loadData();
        
        // Render all sections
        renderQuickStats();
        renderTimeFilter();
        renderCommoditySelector();
        renderPriceSidebar();
        renderAnalysis();
        renderAlerts();
        renderRegionalPrices();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('Market Price page initialized');
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Load data from JSON files
async function loadData() {
    try {
        const responses = await Promise.all([
            fetch('data/market_data.json'),
            fetch('data/market_quick_stats.json'),
            fetch('data/market_analysis.json'),
            fetch('data/market_alerts.json'),
            fetch('data/market_regional.json')
        ]);
        
        marketData = await responses[0].json();
        quickStatsData = await responses[1].json();
        analysisData = await responses[2].json();
        alertsData = await responses[3].json();
        regionalData = await responses[4].json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}
function renderQuickStats() {
    const container = document.getElementById('quickStats');
    if (!container) return;

    container.innerHTML = quickStatsData.stats.map(stat => `
        <div class="stat-card">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
            <div class="stat-change stat-${stat.change.type}">${stat.change.text}</div>
        </div>
    `).join('');
}

// Render time filter
function renderTimeFilter() {
    const container = document.getElementById('timeFilter');
    if (!container) return;

    container.innerHTML = marketData.timeframes.map(timeframe => `
        <button class="time-btn ${timeframe.id === currentTimeframe ? 'active' : ''}" 
                onclick="changeTimeframe('${timeframe.id}')">
            ${timeframe.label}
        </button>
    `).join('');
}

// Render commodity selector
function renderCommoditySelector() {
    const container = document.getElementById('commoditySelector');
    if (!container) return;

    container.innerHTML = marketData.commodities.map((commodity, index) => `
        <button class="commodity-btn ${commodity.id === currentCommodity ? 'active' : ''}" 
                onclick="selectCommodity('${commodity.id}')">
            ${commodity.label}
        </button>
    `).join('');
}

// Render price sidebar
function renderPriceSidebar() {
    const container = document.getElementById('priceSidebar');
    if (!container) return;

    container.innerHTML = marketData.priceCards.map(card => `
        <div class="price-card">
            <h3>${card.title}</h3>
            ${card.items.map(item => `
                <div class="price-item">
                    <div class="price-name">${item.name}</div>
                    <div class="price-details">
                        <div class="price-value">${item.value}</div>
                        <div class="price-change price-${item.change.type}">${item.change.text}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Render analysis
function renderAnalysis() {
    const container = document.getElementById('analysisGrid');
    if (!container) return;

    container.innerHTML = analysisData.analyses.map(analysis => `
        <div class="analysis-card">
            <h4>${analysis.title}</h4>
            <p>${analysis.description}</p>
            <span class="trend-indicator trend-${analysis.trend.type}">${analysis.trend.label}</span>
        </div>
    `).join('');
}

// Render alerts
function renderAlerts() {
    const container = document.getElementById('alertsList');
    if (!container) return;

    container.innerHTML = alertsData.alerts.map(alert => `
        <div class="alert-item">
            <div class="alert-info">
                <div class="alert-commodity">${alert.commodity}</div>
                <div class="alert-condition">${alert.condition}</div>
            </div>
            <div class="alert-actions">
                <button class="alert-btn edit-btn" onclick="editAlert(${alert.id})">Edit</button>
                <button class="alert-btn delete-btn" onclick="deleteAlert(${alert.id})">Hapus</button>
            </div>
        </div>
    `).join('');
}

// Render regional prices
function renderRegionalPrices() {
    const container = document.getElementById('regionalGrid');
    if (!container) return;

    container.innerHTML = regionalData.regions.map(region => `
        <div class="region-card">
            <div class="region-name">${region.name}</div>
            ${region.commodities.map(commodity => `
                <div class="region-commodity">
                    <span>${commodity.name}:</span>
                    <span>${commodity.price}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Modal close event
    const modal = document.getElementById('addAlertModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'addAlertModal') {
                closeModal();
            }
        });
    }

    // Alert form submission
    const alertForm = document.getElementById('alertForm');
    if (alertForm) {
        alertForm.addEventListener('submit', handleAlertSubmit);
    }

    // Populate commodity options in alert form
    populateAlertCommodities();
}

// Change timeframe
function changeTimeframe(timeframe) {
    currentTimeframe = timeframe;
    
    // Update active button
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update chart (placeholder)
    updateChart();
}

// Select commodity
function selectCommodity(commodity) {
    currentCommodity = commodity;
    
    // Update active button
    document.querySelectorAll('.commodity-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update chart (placeholder)
    updateChart();
}

// Update chart (placeholder function)
function updateChart() {
    const chartContainer = document.getElementById('priceChart');
    if (chartContainer) {
        chartContainer.innerHTML = `📈 Grafik ${getCurrentCommodityName()} - ${currentTimeframe}`;
    }
}

// Get current commodity name
function getCurrentCommodityName() {
    const commodity = marketData.commodities.find(c => c.id === currentCommodity);
    return commodity ? commodity.label : 'Komoditas';
}

// Show add alert modal
function showAddAlert() {
    const modal = document.getElementById('addAlertModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('addAlertModal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset form
        const form = document.getElementById('alertForm');
        if (form) {
            form.reset();
        }
    }
}

// Populate alert commodities
function populateAlertCommodities() {
    const select = document.getElementById('alertCommodity');
    if (!select) return;

    // Combine all commodities from price cards
    const allCommodities = [];
    marketData.priceCards.forEach(card => {
        card.items.forEach(item => {
            allCommodities.push(item.name);
        });
    });

    select.innerHTML = '<option value="">Pilih Komoditas</option>' +
        allCommodities.map(commodity => `
            <option value="${commodity}">${commodity}</option>
        `).join('');
}

// Handle alert form submission
function handleAlertSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const commodity = document.getElementById('alertCommodity').value;
    const condition = document.getElementById('alertCondition').value;
    const value = document.getElementById('alertValue').value;
    
    if (!commodity || !condition || !value) {
        alert('Mohon lengkapi semua field');
        return;
    }
    
    // Create new alert
    const newAlert = {
        id: Date.now(), // Simple ID generation
        commodity: commodity,
        condition: generateConditionText(condition, value),
        type: condition,
        value: parseFloat(value)
    };
    
    // Add to alerts data
    alertsData.alerts.push(newAlert);
    
    // Re-render alerts
    renderAlerts();
    
    // Close modal
    closeModal();
    
    // Show success message
    alert('Alert berhasil ditambahkan!');
}

// Generate condition text
function generateConditionText(condition, value) {
    switch (condition) {
        case 'above':
            return `Alert ketika harga > Rp ${parseInt(value).toLocaleString()}/kg`;
        case 'below':
            return `Alert ketika harga < Rp ${parseInt(value).toLocaleString()}/kg`;
        case 'change':
            return `Alert ketika perubahan > ${value}%`;
        default:
            return `Alert untuk ${value}`;
    }
}

// Edit alert
function editAlert(alertId) {
    const alert = alertsData.alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    // Populate form with existing data
    document.getElementById('alertCommodity').value = alert.commodity;
    document.getElementById('alertCondition').value = alert.type;
    document.getElementById('alertValue').value = alert.value;
    
    // Show modal
    showAddAlert();
    
    // Remove old alert when form is submitted
    const form = document.getElementById('alertForm');
    const originalHandler = form.onsubmit;
    form.onsubmit = function(e) {
        deleteAlert(alertId);
        if (originalHandler) originalHandler.call(this, e);
    };
}

// Delete alert
function deleteAlert(alertId) {
    if (confirm('Yakin ingin menghapus alert ini?')) {
        alertsData.alerts = alertsData.alerts.filter(alert => alert.id !== alertId);
        renderAlerts();
    }
}

// Simulate real-time price updates (for demo)
function simulatePriceUpdates() {
    setInterval(() => {
        // Update random price changes
        quickStatsData.stats.forEach(stat => {
            const randomChange = (Math.random() - 0.5) * 0.1;
            const changeTypes = ['up', 'down', 'stable'];
            stat.change.type = changeTypes[Math.floor(Math.random() * changeTypes.length)];
        });
        
        renderQuickStats();
    }, 30000); // Update every 30 seconds
}