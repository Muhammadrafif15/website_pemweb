

const routeMapping = {
    // Homepage - default route
    '/': {
        folder: 'views', 
        file: 'homepage.html',
        title: 'AgriSmart - Smart Agriculture Platform',
        isCustomPage : true
    },
    
    // Klasifikasi Penyakit
    '/klasifikasi': {
        folder: 'klasifikasi-page',
        file: 'index.html',
        title: 'Klasifikasi Penyakit - AgriSmart'
    },
    '/klasifikasi/detail': {
        folder: 'klasifikasi-page',
        file: 'disease-detail.html',
        title: 'Detail Penyakit - AgriSmart'
    },
    
    // Alat Pertanian
    '/alat-pertanian': {
        folder: 'agrikultur_page',
        file: 'index.html',
        title: 'Katalog Alat Pertanian - AgriSmart'
    },
    
    // Harga Pasar
    '/harga-pasar': {
        folder: 'market_page',
        file: 'index.html',
        title: 'Informasi Harga Pasar - AgriSmart'
    },
    
    // Permodalan
    '/permodalan': {
        folder: 'finance_page',
        file: 'index.html',
        title: 'Akses Permodalan - AgriSmart'
    },
    
    // Pemasaran
    '/pemasaran': {
        folder: 'marketing_page',
        file: 'index.html',
        title: 'Strategi Pemasaran - AgriSmart'
    }
};

function getRouteMapping(requestPath) {
    // Remove query parameters and trailing slash
    const cleanPath = requestPath.split('?')[0].replace(/\/$/, '') || '/';
    
    return routeMapping[cleanPath] || null;
}

function isStaticFile(requestPath) {
    const staticExtensions = ['.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
    const ext = requestPath.substring(requestPath.lastIndexOf('.'));
    return staticExtensions.includes(ext.toLowerCase());
}


function getAllRoutes() {
    return Object.keys(routeMapping).filter(route => route !== '/');
}

module.exports = {
    getRouteMapping,
    isStaticFile,
    getAllRoutes,
    routeMapping
};