// Load data from JSON files
let distributionData = {};
let buyerData = {};
let priceData = {};
let tipsData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load all data
        await loadData();
        
        // Render all sections
        renderDistributionCards();
        renderBuyerCards();
        renderPriceTable();
        renderTips();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('Marketing Strategy page initialized');
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Load data from JSON files
async function loadData() {
    try {
        const responses = await Promise.all([
            fetch('data/distribution.json'),
            fetch('data/buyers.json'),
            fetch('data/prices.json'),
            fetch('data/tips.json')
        ]);
        
        distributionData = await responses[0].json();
        buyerData = await responses[1].json();
        priceData = await responses[2].json();
        tipsData = await responses[3].json();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to inline data if JSON files are not available
        loadFallbackData();
    }
}

// Fallback data if JSON files are not available
function loadFallbackData() {
    distributionData = {
        channels: [
            {
                id: 'tengkulak',
                icon: '🤝',
                title: 'Melalui Tengkulak',
                subtitle: 'Penjualan langsung ke pengepul lokal',
                pros: [
                    'Pembayaran langsung tunai',
                    'Tidak perlu sortir kualitas',
                    'Pickup di lokasi panen',
                    'Proses cepat dan mudah'
                ],
                cons: [
                    'Harga relatif lebih rendah',
                    'Tergantung pada tengkulak',
                    'Margin keuntungan kecil',
                    'Kualitas kurang dihargai'
                ],
                requirements: [
                    'Hasil panen siap jual',
                    'Akses jalan untuk kendaraan',
                    'Komunikasi dengan tengkulak lokal'
                ]
            },
            {
                id: 'koperasi',
                icon: '🏢',
                title: 'Melalui Koperasi',
                subtitle: 'Penjualan kolektif melalui koperasi tani',
                pros: [
                    'Harga lebih stabil',
                    'Kualitas dihargai',
                    'Pendampingan tersedia',
                    'Akses ke pasar yang lebih luas'
                ],
                cons: [
                    'Pembayaran tidak langsung',
                    'Harus memenuhi standar',
                    'Proses lebih panjang',
                    'Perlu menjadi anggota'
                ],
                requirements: [
                    'Menjadi anggota koperasi',
                    'Memenuhi standar kualitas',
                    'Komitmen supply reguler',
                    'Dokumentasi hasil panen'
                ]
            },
            {
                id: 'pasar',
                icon: '🏪',
                title: 'Langsung ke Pasar',
                subtitle: 'Jual langsung ke konsumen atau retailer',
                pros: [
                    'Margin keuntungan tinggi',
                    'Kontrol harga penuh',
                    'Hubungan langsung konsumen',
                    'Feedback produk langsung'
                ],
                cons: [
                    'Butuh modal transportasi',
                    'Risiko tidak terjual',
                    'Waktu dan tenaga ekstra',
                    'Perlu kemampuan marketing'
                ],
                requirements: [
                    'Kendaraan transportasi',
                    'Kemasan yang menarik',
                    'Surat izin dagang',
                    'Strategi pemasaran'
                ]
            }
        ]
    };
}

// Render distribution cards
function renderDistributionCards() {
    const container = document.getElementById('distributionGrid');
    if (!container) return;

    container.innerHTML = distributionData.channels.map(channel => `
        <div class="distribution-card">
            <div class="card-header">
                <span class="card-icon">${channel.icon}</span>
                <div class="card-title">${channel.title}</div>
                <div class="card-subtitle">${channel.subtitle}</div>
            </div>
            <div class="card-content">
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Keuntungan</h4>
                        <ul>
                            ${channel.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Kekurangan</h4>
                        <ul>
                            ${channel.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="requirements">
                    <h4>Persyaratan Minimal</h4>
                    <ul>
                        ${channel.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <button class="action-button" onclick="showChannelDetail('${channel.id}')">Pelajari Selengkapnya</button>
            </div>
        </div>
    `).join('');
}

// Render buyer cards
function renderBuyerCards() {
    const container = document.getElementById('buyerGrid');
    if (!container) return;

    container.innerHTML = buyerData.buyers.map(buyer => {
        const commodityTags = buyer.commodities.map(commodity => 
            `<span class="commodity-tag">${commodity.charAt(0).toUpperCase() + commodity.slice(1)}</span>`
        ).join('');

        const stars = '⭐'.repeat(Math.floor(buyer.rating));

        return `
            <div class="buyer-card" data-type="${buyer.type}" data-commodity="${buyer.commodities[0]}" data-region="${buyer.region}">
                <div class="buyer-header">
                    <div>
                        <div class="buyer-name">${buyer.name}</div>
                    </div>
                    <div class="buyer-type">${buyer.type.charAt(0).toUpperCase() + buyer.type.slice(1)}</div>
                </div>
                <div class="buyer-details">
                    <div class="buyer-detail">
                        <span class="detail-label">Kapasitas:</span> ${buyer.capacity}
                    </div>
                    <div class="buyer-detail">
                        <span class="detail-label">Wilayah:</span> ${getRegionName(buyer.region)}
                    </div>
                    <div class="buyer-detail">
                        <span class="detail-label">Sistem Bayar:</span> ${buyer.paymentSystem}
                    </div>
                    <div class="buyer-detail">
                        <span class="detail-label">Info:</span> ${buyer.pickup}
                    </div>
                </div>
                <div class="buyer-commodities">
                    <div class="commodity-tags">
                        ${commodityTags}
                    </div>
                </div>
                <div class="buyer-rating">
                    <div class="rating-stars">${stars}</div>
                    <div class="rating-text">${buyer.rating}/5 (${buyer.reviewCount} review)</div>
                </div>
                <div class="buyer-contact">
                    <button class="contact-btn contact-primary" onclick="showBuyerDetail('${buyer.id}')">Detail</button>
                    <button class="contact-btn contact-secondary">Kontak</button>
                </div>
            </div>
        `;
    }).join('');
}

// Render price table
function renderPriceTable() {
    const tbody = document.getElementById('priceTableBody');
    if (!tbody) return;

    tbody.innerHTML = priceData.prices.map(item => `
        <tr>
            <td><strong>${item.commodity}</strong></td>
            <td class="${item.tengkulak.class}">${item.tengkulak.price}</td>
            <td class="${item.koperasi.class}">${item.koperasi.price}</td>
            <td class="${item.pasar.class}">${item.pasar.price}</td>
            <td class="${item.industri.class}">${item.industri.price}</td>
            <td>${item.recommendation}</td>
        </tr>
    `).join('');
}

// Render tips
function renderTips() {
    const container = document.getElementById('tipsSection');
    if (!container) return;

    container.innerHTML = tipsData.tips.map(tip => `
        <div class="tip-card">
            <span class="tip-icon">${tip.icon}</span>
            <div class="tip-title">${tip.title}</div>
            <div class="tip-content">
                ${tip.content}
                <ul class="tip-list">
                    ${tip.list.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    const typeFilter = document.getElementById('buyerTypeFilter');
    const commodityFilter = document.getElementById('commodityFilter');
    const regionFilter = document.getElementById('regionFilter');
    const searchInput = document.getElementById('buyerSearch');

    if (typeFilter) typeFilter.addEventListener('change', filterBuyers);
    if (commodityFilter) commodityFilter.addEventListener('change', filterBuyers);
    if (regionFilter) regionFilter.addEventListener('change', filterBuyers);
    if (searchInput) searchInput.addEventListener('input', filterBuyers);

    // Modal close event
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') {
                closeModal();
            }
        });
    }
}

// Filter buyers
function filterBuyers() {
    const typeFilter = document.getElementById('buyerTypeFilter')?.value || '';
    const commodityFilter = document.getElementById('commodityFilter')?.value || '';
    const regionFilter = document.getElementById('regionFilter')?.value || '';
    const searchTerm = document.getElementById('buyerSearch')?.value.toLowerCase() || '';
    
    const buyerCards = document.querySelectorAll('.buyer-card');
    
    buyerCards.forEach(card => {
        const type = card.dataset.type;
        const commodity = card.dataset.commodity;
        const region = card.dataset.region;
        const name = card.querySelector('.buyer-name')?.textContent.toLowerCase() || '';
        
        let show = true;
        
        if (typeFilter && type !== typeFilter) show = false;
        if (commodityFilter && commodity !== commodityFilter) show = false;
        if (regionFilter && region !== regionFilter) show = false;
        if (searchTerm && !name.includes(searchTerm)) show = false;
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Show channel detail modal
function showChannelDetail(channelId) {
    const modal = document.getElementById('detailModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    let content = '';
    
    switch(channelId) {
        case 'tengkulak':
            content = `
                <h3>Penjualan Melalui Tengkulak</h3>
                <h4>Langkah-langkah:</h4>
                <ol>
                    <li>Cari tengkulak terpercaya di daerah Anda</li>
                    <li>Negosiasikan harga berdasarkan kualitas</li>
                    <li>Tentukan jadwal panen dan pickup</li>
                    <li>Siapkan hasil panen di lokasi yang mudah diakses</li>
                    <li>Lakukan penimbangan bersama</li>
                    <li>Terima pembayaran tunai</li>
                </ol>
                <h4>Tips Negosiasi:</h4>
                <ul>
                    <li>Bandingkan harga dari beberapa tengkulak</li>
                    <li>Jual dalam jumlah besar untuk harga lebih baik</li>
                    <li>Pilih waktu yang tepat (hindari panen raya)</li>
                </ul>
            `;
            break;
        case 'koperasi':
            content = `
                <h3>Penjualan Melalui Koperasi</h3>
                <h4>Langkah-langkah:</h4>
                <ol>
                    <li>Daftarkan diri sebagai anggota koperasi</li>
                    <li>Ikuti standar kualitas yang ditetapkan</li>
                    <li>Koordinasi jadwal pengumpulan hasil</li>
                    <li>Sortir dan kemas sesuai standar</li>
                    <li>Serahkan ke gudang koperasi</li>
                    <li>Tunggu proses pembayaran (7-14 hari)</li>
                </ol>
                <h4>Keunggulan:</h4>
                <ul>
                    <li>Harga lebih stabil dan transparan</li>
                    <li>Akses ke program pelatihan</li>
                    <li>Bantuan teknis budidaya</li>
                    <li>Akses ke input pertanian</li>
                </ul>
            `;
            break;
        case 'pasar':
            content = `
                <h3>Penjualan Langsung ke Pasar</h3>
                <h4>Langkah-langkah:</h4>
                <ol>
                    <li>Survei pasar target (tradisional/modern)</li>
                    <li>Siapkan kemasan yang menarik</li>
                    <li>Urus izin dagang jika diperlukan</li>
                    <li>Tentukan strategi harga</li>
                    <li>Bangun hubungan dengan pedagang</li>
                    <li>Monitor kompetitor dan adjustasi</li>
                </ol>
                <h4>Modal yang Diperlukan:</h4>
                <ul>
                    <li>Kendaraan transportasi</li>
                    <li>Kemasan dan label</li>
                    <li>Modal operasional harian</li>
                    <li>Alat timbang portable</li>
                </ul>
            `;
            break;
    }
    
    modalContent.innerHTML = content;
    modal.classList.add('show');
}

// Show buyer detail modal
function showBuyerDetail(buyerId) {
    const modal = document.getElementById('detailModal');
    const modalContent = document.getElementById('modalContent');
    const buyer = buyerData.buyers.find(b => b.id === buyerId);
    
    if (!modal || !modalContent || !buyer) return;
    
    if (buyer.details && buyer.contact && buyer.advantages) {
        modalContent.innerHTML = `
            <h3>${buyer.name}</h3>
            <p style="color: #666; margin-bottom: 20px;">${buyer.description}</p>
            
            <h4 style="color: #5D8736; margin-bottom: 15px;">Detail Informasi:</h4>
            <div style="background: #F4FFC3; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                ${Object.entries(buyer.details).map(([key, value]) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        <span>${value}</span>
                    </div>
                `).join('')}
            </div>
            
            <h4 style="color: #5D8736; margin-bottom: 15px;">Kontak:</h4>
            <div style="background: #F4FFC3; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                ${Object.entries(buyer.contact).map(([key, value]) => `
                    <div style="margin-bottom: 8px;">
                        <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}
                    </div>
                `).join('')}
            </div>
            
            <h4 style="color: #5D8736; margin-bottom: 15px;">Keunggulan:</h4>
            <ul>
                ${buyer.advantages.map(advantage => `<li>${advantage}</li>`).join('')}
            </ul>
        `;
    } else {
        modalContent.innerHTML = `
            <h3>${buyer.name}</h3>
            <p style="color: #666; margin-bottom: 20px;">Informasi detail akan segera tersedia.</p>
            <div style="background: #F4FFC3; padding: 15px; border-radius: 8px;">
                <div><strong>Tipe:</strong> ${buyer.type}</div>
                <div><strong>Kapasitas:</strong> ${buyer.capacity}</div>
                <div><strong>Rating:</strong> ${buyer.rating}/5 (${buyer.reviewCount} review)</div>
            </div>
        `;
    }
    
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Helper function to get region name
function getRegionName(region) {
    const regions = {
        'jabar': 'Jawa Barat',
        'jateng': 'Jawa Tengah',
        'jatim': 'Jawa Timur'
    };
    return regions[region] || region;
}