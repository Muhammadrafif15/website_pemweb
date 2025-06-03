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
    }
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