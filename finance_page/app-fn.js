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
        // Fallback to inline data if JSON files are not available
        loadFallbackData();
    }
}

// Fallback data if JSON files are not available
function loadFallbackData() {
    institutionData = {
        institutions: [
            {
                id: 'bri',
                name: 'Bank Rakyat Indonesia (BRI)',
                type: 'bank',
                region: 'jabar',
                creditTypes: 'KUR, KUPEDES',
                plafon: 'Rp 25 juta - 500 juta',
                bunga: '6% - 12% per tahun',
                jangkaWaktu: '1 - 5 tahun',
                description: 'Bank terbesar di Indonesia yang fokus pada sektor UMKM dan pertanian dengan jaringan cabang terluas.',
                products: [
                    {
                        name: 'KUR Mikro',
                        plafon: 'Rp 25 juta',
                        bunga: '6% per tahun',
                        jangka: '3 tahun',
                        syarat: 'Usaha min. 6 bulan, tidak sedang menerima kredit'
                    },
                    {
                        name: 'KUR Kecil',
                        plafon: 'Rp 500 juta',
                        bunga: '6% per tahun',
                        jangka: '5 tahun',
                        syarat: 'Usaha min. 1 tahun, memiliki izin usaha'
                    },
                    {
                        name: 'KUPEDES',
                        plafon: 'Rp 100 - 500 juta',
                        bunga: '12-18% per tahun',
                        jangka: '1-5 tahun',
                        syarat: 'Memiliki agunan, riwayat kredit baik'
                    }
                ],
                contact: {
                    phone: '14017 / 1500017',
                    website: 'www.bri.co.id',
                    address: 'Kantor Pusat: Jl. Jend. Sudirman Kav. 44-46, Jakarta'
                },
                advantages: [
                    'Jaringan cabang terluas di Indonesia',
                    'Proses persetujuan relatif cepat',
                    'Berpengalaman dalam kredit pertanian',
                    'Bunga kompetitif untuk KUR'
                ]
            },
            {
                id: 'koperasi',
                name: 'Koperasi Tani Maju Bersama',
                type: 'koperasi',
                region: 'jateng',
                creditTypes: 'Modal Kerja, Investasi',
                plafon: 'Rp 5 juta - 100 juta',
                bunga: '8% - 15% per tahun',
                jangkaWaktu: '6 bulan - 3 tahun',
                description: 'Koperasi yang khusus melayani kebutuhan permodalan petani dengan pendekatan yang lebih personal.',
                products: [
                    {
                        name: 'Kredit Modal Kerja',
                        plafon: 'Rp 5-50 juta',
                        bunga: '8-12% per tahun',
                        jangka: '6-24 bulan',
                        syarat: 'Anggota koperasi, memiliki usaha tani'
                    },
                    {
                        name: 'Kredit Investasi',
                        plafon: 'Rp 25-100 juta',
                        bunga: '10-15% per tahun',
                        jangka: '1-3 tahun',
                        syarat: 'Anggota aktif, rencana investasi jelas'
                    }
                ],
                contact: {
                    phone: '0271-123456',
                    website: 'www.koperasitani.co.id',
                    address: 'Jl. Pertanian No. 123, Solo, Jawa Tengah'
                },
                advantages: [
                    'Proses lebih fleksibel dan personal',
                    'Memahami kondisi petani lokal',
                    'Pendampingan usaha tersedia',
                    'Syarat relatif mudah untuk anggota'
                ]
            },
            {
                id: 'tanifund',
                name: 'TaniFund Digital',
                type: 'fintech',
                region: 'jabar',
                creditTypes: 'Pinjaman Online',
                plafon: 'Rp 1 juta - 50 juta',
                bunga: '12% - 24% per tahun',
                jangkaWaktu: '3 - 24 bulan',
                description: 'Platform fintech yang menyediakan pinjaman digital khusus untuk petani dengan proses cepat dan mudah.'
            },
            {
                id: 'kur-program',
                name: 'Program Kredit Usaha Rakyat (KUR)',
                type: 'pemerintah',
                region: 'jatim',
                creditTypes: 'KUR Mikro, Kecil, TKI',
                plafon: 'Rp 25 juta - 500 juta',
                bunga: '6% per tahun',
                jangkaWaktu: '1 - 5 tahun',
                description: 'Program pemerintah untuk mendukung UMKM dan pertanian dengan bunga subsidi.'
            }
        ]
    };

    quickActionsData = {
        actions: [
            {
                icon: '🏦',
                title: 'Cari Lembaga Keuangan',
                description: 'Browse direktori bank, koperasi, dan lembaga pembiayaan yang menyediakan kredit pertanian',
                action: 'scrollToSection',
                target: 'institutions'
            },
            {
                icon: '📋',
                title: 'Panduan Aplikasi',
                description: 'Pelajari langkah-langkah mengajukan pinjaman modal usaha tani',
                action: 'scrollToSection',
                target: 'guide'
            },
            {
                icon: '🧮',
                title: 'Kalkulator Kredit',
                description: 'Hitung estimasi cicilan dan bunga untuk berbagai skema pinjaman',
                action: 'showCalculator'
            },
            {
                icon: '🛡️',
                title: 'Tips Anti Penipuan',
                description: 'Kenali ciri-ciri penipuan kredit dan cara menghindarinya',
                action: 'scrollToSection',
                target: 'warnings'
            }
        ]
    };

    sidebarData = {
        cards: [
            {
                icon: '📄',
                title: 'Dokumen yang Diperlukan',
                type: 'requirement-list',
                items: [
                    'KTP dan Kartu Keluarga',
                    'Surat Keterangan Usaha',
                    'Laporan Keuangan Sederhana',
                    'Sertifikat/Bukti Kepemilikan Lahan',
                    'NPWP (jika ada)',
                    'Foto Usaha Tani',
                    'Rencana Anggaran Biaya (RAB)'
                ]
            },
            {
                icon: '💡',
                title: 'Tips Sukses Mengajukan Kredit',
                type: 'tips-list',
                items: [
                    'Siapkan dokumen lengkap dan asli sebelum mengajukan',
                    'Buat rencana usaha yang realistis dan detail',
                    'Pastikan memiliki riwayat keuangan yang baik',
                    'Pilih jenis kredit yang sesuai dengan kebutuhan',
                    'Konsultasikan dengan petugas bank sebelum mengajukan'
                ]
            },
            {
                icon: '📞',
                title: 'Bantuan & Konsultasi',
                type: 'help-center',
                content: {
                    icon: '🎧',
                    title: 'Call Center',
                    schedule: 'Senin-Jumat: 08:00-17:00',
                    buttonText: 'Hubungi Sekarang'
                }
            }
        ]
    };

    stepsData = {
        steps: [
            {
                number: 1,
                icon: '🔍',
                title: 'Riset & Pilih Lembaga',
                description: 'Bandingkan suku bunga, syarat, dan ketentuan dari berbagai lembaga keuangan'
            },
            {
                number: 2,
                icon: '📄',
                title: 'Siapkan Dokumen',
                description: 'Kumpulkan semua dokumen yang diperlukan dalam bentuk asli dan fotokopi'
            },
            {
                number: 3,
                icon: '📝',
                title: 'Isi Formulir Aplikasi',
                description: 'Lengkapi formulir dengan data yang akurat dan jujur'
            },
            {
                number: 4,
                icon: '🏦',
                title: 'Submit ke Bank/Lembaga',
                description: 'Serahkan dokumen dan formulir ke cabang terdekat'
            },
            {
                number: 5,
                icon: '⏳',
                title: 'Menunggu Verifikasi',
                description: 'Proses analisa kredit biasanya memakan waktu 7-14 hari kerja'
            },
            {
                number: 6,
                icon: '✅',
                title: 'Pencairan Dana',
                description: 'Jika disetujui, dana akan dicairkan sesuai dengan perjanjian'
            }
        ]
    };

    warningsData = {
        warnings: [
            'Hati-hati dengan tawaran kredit tanpa agunan dengan bunga sangat rendah',
            'Jangan pernah memberikan uang muka atau biaya admin di awal',
            'Pastikan lembaga terdaftar dan memiliki izin dari OJK',
            'Waspada penipuan melalui SMS, telepon, atau media sosial',
            'Selalu datang langsung ke kantor resmi untuk mengajukan kredit',
            'Jangan mudah tergiur dengan proses yang terlalu cepat dan mudah',
            'Baca dan pahami kontrak sebelum menandatangani'
        ]
    };
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