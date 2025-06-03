// Load data from JSON files
let institutionData = {};
let quickActionsData = {};
let sidebarData = {};
let stepsData = {};
let warningsData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load all data
        await loadData();
        
        // Render all sections
        renderQuickActions();
        renderInstitutions();
        renderSidebar();
        renderSteps();
        renderWarnings();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('Financing Access page initialized');
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Load data from JSON files
async function loadData() {
    try {
        const responses = await Promise.all([
            fetch('data/financing_institutions.json'),
            fetch('data/financing_quick_actions.json'),
            fetch('data/financing_sidebar.json'),
            fetch('data/financing_steps.json'),
            fetch('data/financing_warnings.json')
        ]);
        
        institutionData = await responses[0].json();
        quickActionsData = await responses[1].json();
        sidebarData = await responses[2].json();
        stepsData = await responses[3].json();
        warningsData = await responses[4].json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render quick actions
function renderQuickActions() {
    const container = document.getElementById('quickActions');
    if (!container) return;

    container.innerHTML = quickActionsData.actions.map(action => `
        <div class="action-card" onclick="handleActionClick('${action.action}', '${action.target || ''}')">
            <span class="action-icon">${action.icon}</span>
            <div class="action-title">${action.title}</div>
            <div class="action-description">${action.description}</div>
        </div>
    `).join('');
}

// Render institutions
function renderInstitutions() {
    const container = document.getElementById('institutionList');
    if (!container) return;

    container.innerHTML = institutionData.institutions.map(institution => `
        <div class="institution-card" data-type="${institution.type}" data-region="${institution.region}">
            <div class="institution-header">
                <div>
                    <div class="institution-name">${institution.name}</div>
                </div>
                <div class="institution-type">${getTypeDisplayName(institution.type)}</div>
            </div>
            <div class="institution-details">
                <div class="detail-item">
                    <span class="detail-label">Jenis Kredit:</span> ${institution.creditTypes}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Plafon:</span> ${institution.plafon}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bunga:</span> ${institution.bunga}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Jangka Waktu:</span> ${institution.jangkaWaktu}
                </div>
            </div>
            <div class="institution-contact">
                <button class="contact-btn" onclick="showInstitutionDetail('${institution.id}')">Detail Lengkap</button>
                <button class="contact-btn secondary">Hubungi</button>
            </div>
        </div>
    `).join('');
}

// Render sidebar
function renderSidebar() {
    const container = document.getElementById('sidebar');
    if (!container) return;

    container.innerHTML = sidebarData.cards.map(card => {
        let content = '';
        
        if (card.type === 'requirement-list') {
            content = `
                <ul class="requirement-list">
                    ${card.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        } else if (card.type === 'tips-list') {
            content = `
                <ul class="tips-list">
                    ${card.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        } else if (card.type === 'help-center') {
            content = `
                <div class="help-center">
                    <div class="help-icon">${card.content.icon}</div>
                    <div class="help-title">${card.content.title}</div>
                    <div class="help-schedule">${card.content.schedule}</div>
                    <button class="contact-btn">${card.content.buttonText}</button>
                </div>
            `;
        }

        return `
            <div class="info-card">
                <h3>${card.icon} ${card.title}</h3>
                ${content}
            </div>
        `;
    }).join('');
}

// Render steps
function renderSteps() {
    const container = document.getElementById('stepsContainer');
    if (!container) return;

    container.innerHTML = stepsData.steps.map(step => `
        <div class="step-card">
            <div class="step-number">${step.number}</div>
            <div class="step-icon">${step.icon}</div>
            <div class="step-title">${step.title}</div>
            <div class="step-description">${step.description}</div>
        </div>
    `).join('');
}

// Render warnings
function renderWarnings() {
    const container = document.getElementById('warningList');
    if (!container) return;

    container.innerHTML = warningsData.warnings.map(warning => `
        <li>${warning}</li>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    const typeFilter = document.getElementById('typeFilter');
    const regionFilter = document.getElementById('regionFilter');
    const searchInput = document.getElementById('searchInput');

    if (typeFilter) typeFilter.addEventListener('change', filterInstitutions);
    if (regionFilter) regionFilter.addEventListener('change', filterInstitutions);
    if (searchInput) searchInput.addEventListener('input', filterInstitutions);

    // Modal close event
    const modal = document.getElementById('institutionModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'institutionModal') {
                closeModal();
            }
        });
    }
}

// Handle action card clicks
function handleActionClick(action, target) {
    switch (action) {
        case 'scrollToSection':
            scrollToSection(target);
            break;
        case 'showCalculator':
            showCalculator();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Filter institutions
function filterInstitutions() {
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const regionFilter = document.getElementById('regionFilter')?.value || '';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const institutions = document.querySelectorAll('.institution-card');
    
    institutions.forEach(institution => {
        const type = institution.dataset.type;
        const region = institution.dataset.region;
        const name = institution.querySelector('.institution-name')?.textContent.toLowerCase() || '';
        
        let show = true;
        
        if (typeFilter && type !== typeFilter) show = false;
        if (regionFilter && region !== regionFilter) show = false;
        if (searchTerm && !name.includes(searchTerm)) show = false;
        
        institution.style.display = show ? 'block' : 'none';
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Show institution detail modal
function showInstitutionDetail(institutionId) {
    const modal = document.getElementById('institutionModal');
    const modalContent = document.getElementById('modalContent');
    const institution = institutionData.institutions.find(inst => inst.id === institutionId);

    if (!modal || !modalContent || !institution) return;

    let productsHtml = '';
    if (institution.products) {
        productsHtml = `
            <h4 style="color: #5D8736; margin-bottom: 15px;">Produk Kredit:</h4>
            ${institution.products.map(product => `
                <div style="background: #F4FFC3; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                    <h5 style="color: #5D8736; margin-bottom: 8px;">${product.name}</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                        <div><strong>Plafon:</strong> ${product.plafon}</div>
                        <div><strong>Bunga:</strong> ${product.bunga}</div>
                        <div><strong>Jangka Waktu:</strong> ${product.jangka}</div>
                        <div><strong>Syarat:</strong> ${product.syarat}</div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    let contactHtml = '';
    if (institution.contact) {
        contactHtml = `
            <div class="contact-info">
                <h4>Informasi Kontak</h4>
                <div class="contact-detail"><strong>Telepon:</strong> ${institution.contact.phone}</div>
                <div class="contact-detail"><strong>Website:</strong> ${institution.contact.website}</div>
                <div class="contact-detail"><strong>Alamat:</strong> ${institution.contact.address}</div>
            </div>
        `;
    }

    let advantagesHtml = '';
    if (institution.advantages) {
        advantagesHtml = `
            <h4 style="color: #5D8736; margin: 20px 0 10px 0;">Keunggulan:</h4>
            <ul>
                ${institution.advantages.map(advantage => `<li>${advantage}</li>`).join('')}
            </ul>
        `;
    }

    modalContent.innerHTML = `
        <h3>${institution.name}</h3>
        <p style="color: #666; margin-bottom: 20px;">${institution.description}</p>
        ${productsHtml}
        ${contactHtml}
        ${advantagesHtml}
    `;
    
    modal.classList.add('show');
}

// Show calculator (simplified)
function showCalculator() {
    alert('Kalkulator Kredit akan segera tersedia!\n\nFitur yang akan hadir:\n• Simulasi cicilan bulanan\n• Perhitungan total bunga\n• Perbandingan berbagai skema\n• Analisis kemampuan bayar');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('institutionModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Helper function to get type display name
function getTypeDisplayName(type) {
    const typeNames = {
        'bank': 'Bank',
        'koperasi': 'Koperasi',
        'fintech': 'Fintech',
        'pemerintah': 'Pemerintah'
    };
    return typeNames[type] || type;
}