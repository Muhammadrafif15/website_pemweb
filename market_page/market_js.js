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
        // Fallback to inline data if JSON files are not available
        loadFallbackData();
    }
}

// Fallback data if JSON files are not available
function loadFallbackData() {
    quickStatsData = {
        stats: [
            {
                id: 'corn',
                value: 'Rp 7,200',
                label: 'Jagung Pipil/kg',
                change: {
                    type: 'up',
                    value: '+3.2%',
                    text: '↗ +3.2%'
                }
            },
            {
                id: 'rice',
                value: 'Rp 12,500',
                label: 'Beras Premium/kg',
                change: {
                    type: 'down',
                    value: '-1.8%',
                    text: '↘ -1.8%'
                }
            },
            {
                id: 'fertilizer',
                value: 'Rp 2,800',
                label: 'Pupuk Urea/kg',
                change: {
                    type: 'up',
                    value: '+5.1%',
                    text: '↗ +5.1%'
                }
            },
            {
                id: 'seeds',
                value: 'Rp 45,000',
                label: 'Bibit Jagung/kg',
                change: {
                    type: 'stable',
                    value: '0.0%',
                    text: '→ 0.0%'
                }
            }
        ]
    };

    marketData = {
        timeframes: [
            { id: '1H', label: '1H' },
            { id: '1M', label: '1M' },
            { id: '3M', label: '3M' },
            { id: '6M', label: '6M' },
            { id: '1Y', label: '1T' }
        ],
        commodities: [
            { id: 'corn', label: 'Jagung' },
            { id: 'rice', label: 'Beras' },
            { id: 'soybean', label: 'Kedelai' },
            { id: 'peanut', label: 'Kacang Tanah' },
            { id: 'chili', label: 'Cabai' }
        ],
        priceCards: [
            {
                title: '🌾 Harga Komoditas Hari Ini',
                items: [
                    {
                        name: 'Jagung Pipil',
                        value: 'Rp 7,200/kg',
                        change: {
                            type: 'up',
                            text: '↗ +Rp 220 (3.2%)'
                        }
                    },
                    {
                        name: 'Beras Premium',
                        value: 'Rp 12,500/kg',
                        change: {
                            type: 'down',
                            text: '↘ -Rp 230 (1.8%)'
                        }
                    },
                    {
                        name: 'Kedelai Kering',
                        value: 'Rp 9,800/kg',
                        change: {
                            type: 'up',
                            text: '↗ +Rp 150 (1.6%)'
                        }
                    },
                    {
                        name: 'Kacang Tanah',
                        value: 'Rp 18,500/kg',
                        change: {
                            type: 'down',
                            text: '↘ -Rp 300 (1.6%)'
                        }
                    }
                ]
            },
            {
                title: '🧪 Harga Pupuk & Input',
                items: [
                    {
                        name: 'Pupuk Urea',
                        value: 'Rp 2,800/kg',
                        change: {
                            type: 'up',
                            text: '↗ +Rp 135 (5.1%)'
                        }
                    },
                    {
                        name: 'NPK Phonska',
                        value: 'Rp 3,200/kg',
                        change: {
                            type: 'up',
                            text: '↗ +Rp 100 (3.2%)'
                        }
                    },
                    {
                        name: 'Pupuk TSP',
                        value: 'Rp 4,100/kg',
                        change: {
                            type: 'stable',
                            text: '→ +Rp 0 (0.0%)'
                        }
                    }
                ]
            },
            {
                title: '🌱 Harga Bibit',
                items: [
                    {
                        name: 'Bibit Jagung Hibrida',
                        value: 'Rp 45,000/kg',
                        change: {
                            type: 'stable',
                            text: '→ +Rp 0 (0.0%)'
                        }
                    },
                    {
                        name: 'Benih Padi IR64',
                        value: 'Rp 12,000/kg',
                        change: {
                            type: 'down',
                            text: '↘ -Rp 500 (4.0%)'
                        }
                    }
                ]
            }
        ]
    };

    analysisData = {
        analyses: [
            {
                title: 'Jagung - Outlook Positif',
                description: 'Permintaan jagung meningkat untuk pakan ternak menjelang Idul Adha. Cuaca yang mendukung juga meningkatkan kualitas hasil panen.',
                trend: {
                    type: 'bullish',
                    label: '📈 BULLISH'
                }
            },
            {
                title: 'Beras - Tekanan Harga',
                description: 'Panen raya di beberapa daerah menyebabkan oversupply sementara. Namun, kualitas beras tetap terjaga dengan kadar air optimal.',
                trend: {
                    type: 'bearish',
                    label: '📉 BEARISH'
                }
            },
            {
                title: 'Pupuk - Kenaikan Musiman',
                description: 'Memasuki musim tanam, permintaan pupuk meningkat. Distribusi pupuk bersubsidi masih terkendala di beberapa wilayah.',
                trend: {
                    type: 'bullish',
                    label: '📈 BULLISH'
                }
            },
            {
                title: 'Kedelai - Stabil',
                description: 'Harga kedelai relatif stabil dengan pasokan dari petani lokal yang cukup memadai untuk memenuhi kebutuhan industri kecil.',
                trend: {
                    type: 'stable',
                    label: '→ STABIL'
                }
            }
        ]
    };

    alertsData = {
        alerts: [
            {
                id: 1,
                commodity: 'Jagung Pipil',
                condition: 'Alert ketika harga > Rp 7,500/kg',
                type: 'above',
                value: 7500
            },
            {
                id: 2,
                commodity: 'Pupuk Urea',
                condition: 'Alert ketika harga < Rp 2,500/kg',
                type: 'below',
                value: 2500
            },
            {
                id: 3,
                commodity: 'Beras Premium',
                condition: 'Alert ketika perubahan > 5%',
                type: 'change',
                value: 5
            }
        ]
    };

    regionalData = {
        regions: [
            {
                name: 'Jawa Barat',
                commodities: [
                    { name: 'Jagung', price: 'Rp 7,100/kg' },
                    { name: 'Beras', price: 'Rp 12,300/kg' },
                    { name: 'Kedelai', price: 'R