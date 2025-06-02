// Load data from JSON files
let categoriesData = {};
let toolsData = {};
let tutorialsData = {};
let currentCategory = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load all data
        await loadData();
        
        // Render all sections
        renderCategories();
        renderTools();
        renderTutorials();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('Agricultural Tools page initialized');
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Load data from JSON files
async function loadData() {
    try {
        const responses = await Promise.all([
            fetch('data/tools_categories.json'),
            fetch('data/tools_catalog.json'),
            fetch('data/tools_tutorials.json')
        ]);
        
        categoriesData = await responses[0].json();
        toolsData = await responses[1].json();
        tutorialsData = await responses[2].json();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to inline data if JSON files are not available
        loadFallbackData();
    }
}

// Fallback data if JSON files are not available
function loadFallbackData() {
    categoriesData = {
        categories: [
            {
                id: 'all',
                icon: '🔧',
                name: 'Semua Alat',
                count: 124
            },
            {
                id: 'hand-tools',
                icon: '✋',
                name: 'Alat Tangan',
                count: 45
            },
            {
                id: 'machinery',
                icon: '⚙️',
                name: 'Mesin Pertanian',
                count: 28
            },
            {
                id: 'irrigation',
                icon: '💧',
                name: 'Irigasi',
                count: 31
            },
            {
                id: 'harvest',
                icon: '🌾',
                name: 'Panen',
                count: 20
            }
        ]
    };

    toolsData = {
        tools: [
            {
                id: 'cangkul',
                name: 'Cangkul Tradisional',
                category: 'hand-tools',
                icon: '🪓',
                badge: 'Populer',
                description: 'Alat pertanian dasar untuk menggemburkan tanah dan membuat alur tanam. Tersedia berbagai ukuran sesuai kebutuhan.',
                specs: {
                    'Material': 'Besi + Kayu',
                    'Berat': '1.2 - 1.8 kg',
                    'Lebar Mata': '15 - 20 cm',
                    'Panjang Gagang': '80 - 120 cm'
                },
                priceRange: 'Rp 45.000 - 85.000',
                priceMin: 45000,
                priceMax: 85000,
                crops: ['padi', 'jagung', 'sayuran'],
                detailedSpecs: {
                    'Material Mata': 'Besi Carbon Steel',
                    'Material Gagang': 'Kayu Jati/Sono',
                    'Berat Total': '1.2 - 1.8 kg',
                    'Lebar Mata': '15 - 20 cm',
                    'Panjang Gagang': '80 - 120 cm',
                    'Ketebalan Mata': '3 - 4 mm'
                },
                brands: [
                    { name: 'Kapak Garuda', price: 'Rp 45.000', rating: '4.5/5' },
                    { name: 'Zebra Tools', price: 'Rp 55.000', rating: '4.3/5' },
                    { name: 'Krisbow', price: 'Rp 65.000', rating: '4.2/5' },
                    { name: 'Tekiro', price: 'Rp 75.000', rating: '4.4/5' }
                ],
                usage: [
                    'Gemburkan tanah sebelum tanam',
                    'Buat alur atau lubang tanam',
                    'Pembersihan gulma di sekitar tanaman',
                    'Pembuatan saluran drainase kecil'
                ],
                maintenance: [
                    'Bersihkan dari tanah setelah digunakan',
                    'Keringkan sebelum disimpan',
                    'Asah mata cangkul secara berkala',
                    'Oleskan minyak tipis untuk mencegah karat'
                ]
            },
            {
                id: 'traktor',
                name: 'Traktor Mini',
                category: 'machinery',
                icon: '🚜',
                badge: 'Premium',
                description: 'Traktor kompak untuk lahan sempit, ideal untuk petani kecil. Dilengkapi berbagai attachment untuk berbagai keperluan.',
                specs: {
                    'Tenaga': '15 - 25 HP',
                    'Transmisi': 'Manual/HST',
                    'Lebar Kerja': '120 - 150 cm',
                    'Konsumsi BBM': '2-3 L/jam'
                },
                priceRange: 'Rp 45.000.000 - 85.000.000',
                priceMin: 45000000,
                priceMax: 85000000,
                crops: ['padi', 'jagung', 'kedelai'],
                detailedSpecs: {
                    'Tenaga Mesin': '15 - 25 HP',
                    'Jenis Mesin': '4-stroke Diesel',
                    'Transmisi': 'Manual 8+2 / HST',
                    'PTO Speed': '540 RPM',
                    'Lebar Kerja': '120 - 150 cm',
                    'Ground Clearance': '25 cm'
                },
                brands: [
                    { name: 'Kubota', price: 'Rp 75.000.000', rating: '4.8/5' },
                    { name: 'Yanmar', price: 'Rp 65.000.000', rating: '4.6/5' },
                    { name: 'Iseki', price: 'Rp 55.000.000', rating: '4.4/5' },
                    { name: 'Quick', price: 'Rp 45.000.000', rating: '4.2/5' }
                ],
                usage: [
                    'Pengolahan tanah dengan rotary',
                    'Penanaman dengan seeder',
                    'Penyemprotan dengan boom sprayer',
                    'Pengangkutan hasil panen'
                ],
                maintenance: [
                    'Service rutin setiap 50 jam operasi',
                    'Ganti oli mesin dan transmisi berkala',
                    'Cek tekanan ban dan alignment',
                    'Bersihkan filter udara dan bahan bakar'
                ]
            },
            {
                id: 'pompa-air',
                name: 'Pompa Air Centrifugal',
                category: 'irrigation',
                icon: '💧',
                badge: 'Hemat Energi',
                description: 'Pompa air untuk sistem irigasi dengan daya hisap tinggi. Cocok untuk lahan dengan sumber air terbatas.',
                specs: {
                    'Daya': '3 - 7.5 HP',
                    'Debit': '500-1500 L/min',
                    'Head Max': '25 - 40 m',
                    'Inlet/Outlet': '3-4 inch'
                },
                priceRange: 'Rp 2.500.000 - 8.500.000',
                priceMin: 2500000,
                priceMax: 8500000,
                crops: ['padi', 'sayuran']
            },
            {
                id: 'mesin-panen',
                name: 'Combine Harvester Mini',
                category: 'harvest',
                icon: '🌾',
                badge: 'Efisien',
                description: 'Mesin panen serbaguna untuk padi dan jagung. Dapat memotong, merontokkan, dan membersihkan hasil panen dalam satu proses.',
                specs: {
                    'Lebar Potong': '120 cm',
                    'Kapasitas': '0.5-1 ha/jam',
                    'Engine': '35 HP Diesel',
                    'Tangki Biji': '500 kg'
                },
                priceRange: 'Rp 125.000.000 - 185.000.000',
                priceMin: 125000000,
                priceMax: 185000000,
                crops: ['padi', 'jagung']
            },
            {
                id: 'sabit',
                name: 'Sabit Bergerigi',
                category: 'hand-tools',
                icon: '🔪',
                badge: 'Tradisional',
                description: 'Alat pemanen tradisional dengan mata bergerigi untuk memotong rumput dan tanaman kecil dengan lebih efisien.',
                specs: {
                    'Panjang Mata': '25 - 35 cm',
                    'Material': 'Carbon Steel',
                    'Gagang': 'Kayu Keras',
                    'Berat': '0.5 - 0.8 kg'
                },
                priceRange: 'Rp 25.000 - 65.000',
                priceMin: 25000,
                priceMax: 65000,
                crops: ['padi', 'sayuran']
            },
            {
                id: 'sprayer',
                name: 'Power Sprayer',
                category: 'machinery',
                icon: '🧴',
                badge: 'Modern',
                description: 'Alat semprot bertenaga untuk aplikasi pestisida dan pupuk cair. Dilengkapi dengan tangki dan selang panjang.',
                specs: {
                    'Kapasitas Tangki': '16 - 25 Liter',
                    'Tekanan': '20 - 40 bar',
                    'Jangkauan': '8 - 12 m',
                    'Engine': '2-stroke 26cc'
                },
                priceRange: 'Rp 1.200.000 - 3.500.000',
                priceMin: 1200000,
                priceMax: 3500000,
                crops: ['padi', 'jagung', 'sayuran']
            }
        ]
    };

    tutorialsData = {
        tutorials: [
            {
                title: 'Perawatan Alat Tangan',
                description: 'Tips membersihkan dan merawat cangkul, sabit, dan alat tangan lainnya agar tahan lama dan selalu tajam.'
            },
            {
                title: 'Operasi Traktor yang Aman',
                description: 'Panduan keselamatan kerja saat mengoperasikan traktor dan mesin pertanian lainnya di lahan.'
            },
            {
                title: 'Pemasangan Sistem Irigasi',
                description: 'Langkah-langkah instalasi pompa air dan sistem irigasi tetes untuk efisiensi penggunaan air.'
            },
            {
                title: 'Kalibrasi Mesin Semprot',
                description: 'Cara mengatur dosis dan pola semprot yang tepat untuk aplikasi pestisida dan pupuk cair.'
            }
        ]
    };
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;

    container.innerHTML = categoriesData.categories.map((category, index) => `
        <div class="category-card ${index === 0 ? 'active' : ''}" onclick="filterByCategory('${category.id}')">
            <span class="category-icon">${category.icon}</span>
            <div class="category-name">${category.name}</div>
            <div class="category-count">${category.count} item</div>
        </div>
    `).join('');
}

// Render tools
function renderTools() {
    const container = document.getElementById('toolsGrid');
    if (!container) return;

    const filteredTools = currentCategory === 'all' 
        ? toolsData.tools 
        : toolsData.tools.filter(tool => tool.category === currentCategory);

    container.innerHTML = filteredTools.map(tool => `
        <div class="tool-card" data-category="${tool.category}" onclick="showToolModal('${tool.id}')">
            <div class="tool-image">
                ${tool.icon}
                <div class="tool-badge">${tool.badge}</div>
            </div>
            <div class="tool-content">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
                <div class="tool-specs">
                    ${Object.entries(tool.specs).map(([key, value]) => `
                        <div class="spec-item">
                            <div class="spec-label">${key}:</div>
                            <div>${value}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="tool-price">
                    <div class="price-range">${tool.priceRange}</div>
                    <button class="view-details">Detail</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render tutorials
function renderTutorials() {
    const container = document.getElementById('tutorialGrid');
    if (!container) return;

    container.innerHTML = tutorialsData.tutorials.map(tutorial => `
        <div class="tutorial-card">
            <h4>${tutorial.title}</h4>
            <p>${tutorial.description}</p>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }

    // Modal close event
    const modal = document.getElementById('toolModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'toolModal') {
                closeModal();
            }
        });
    }
}

// Filter by category
function filterByCategory(category) {
    // Update active category
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.category-card').classList.add('active');

    currentCategory = category;
    renderTools();
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const cropFilter = document.getElementById('cropFilter')?.value || '';
    const priceFilter = document.getElementById('priceFilter')?.value || '';
    
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const toolName = card.querySelector('.tool-name')?.textContent.toLowerCase() || '';
        const toolDescription = card.querySelector('.tool-description')?.textContent.toLowerCase() || '';
        const priceText = card.querySelector('.price-range')?.textContent || '';
        
        // Get tool data for more detailed filtering
        const toolId = card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        const tool = toolsData.tools.find(t => t.id === toolId);
        
        let showCard = true;
        
        // Search filter
        if (searchTerm && !toolName.includes(searchTerm) && !toolDescription.includes(searchTerm)) {
            showCard = false;
        }
        
        // Crop filter
        if (cropFilter && tool && tool.crops && !tool.crops.includes(cropFilter)) {
            showCard = false;
        }
        
        // Price filter
        if (priceFilter && tool) {
            const [minStr, maxStr] = priceFilter.split('-');
            const filterMin = parseInt(minStr) || 0;
            const filterMax = maxStr === '+' ? Infinity : parseInt(maxStr) || Infinity;
            
            if (tool.priceMin > filterMax || tool.priceMax < filterMin) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

// Show tool modal
function showToolModal(toolId) {
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const tool = toolsData.tools.find(t => t.id === toolId);

    if (!modal || !modalTitle || !modalBody || !tool) return;

    modalTitle.textContent = tool.name;
    
    let specsHtml = '';
    if (tool.detailedSpecs) {
        specsHtml = `
            <table class="spec-table">
                ${Object.entries(tool.detailedSpecs).map(([key, value]) => `
                    <tr>
                        <th>${key}</th>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    }

    let brandsHtml = '';
    if (tool.brands) {
        brandsHtml = `
            <div class="brand-comparison">
                ${tool.brands.map(brand => `
                    <div class="brand-item">
                        <div class="brand-name">${brand.name}</div>
                        <div class="brand-price">${brand.price}</div>
                        <div class="brand-rating">⭐ ${brand.rating}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let usageHtml = '';
    if (tool.usage) {
        usageHtml = `
            <ul>
                ${tool.usage.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    let maintenanceHtml = '';
    if (tool.maintenance) {
        maintenanceHtml = `
            <ul>
                ${tool.maintenance.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    modalBody.innerHTML = `
        <div class="modal-image">${tool.icon}</div>
        
        <p style="margin-bottom: 25px; line-height: 1.6;">${tool.description}</p>
        
        <div class="detail-grid">
            <div class="detail-section">
                <h4>Spesifikasi Teknis</h4>
                ${specsHtml}
            </div>
            
            <div class="detail-section">
                <h4>Perbandingan Merek</h4>
                ${brandsHtml}
            </div>
        </div>
        
        <div class="detail-grid">
            <div class="detail-section">
                <h4>Cara Penggunaan</h4>
                ${usageHtml}
            </div>
            
            <div class="detail-section">
                <h4>Tips Perawatan</h4>
                ${maintenanceHtml}
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('toolModal');
    if (modal) {
        modal.classList.remove('show');
    }
}