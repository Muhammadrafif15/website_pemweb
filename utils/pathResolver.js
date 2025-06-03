const path = require('path');
const fs = require('fs');

/**
 * Path resolver untuk menangani path file dengan struktur existing
 */

/**
 * Resolve file path berdasarkan request URL dan folder mapping
 */
function resolveFilePath(requestPath, routeInfo) {
    if (routeInfo) {
        // Untuk halaman utama, gunakan mapping dari routes

        if (routeInfo.isCustomPage) {
            return path.join(__dirname, '..', routeInfo.folder, routeInfo.file);
        }
        
        return path.join(__dirname, '..', routeInfo.folder, routeInfo.file);
    }
    
    // Untuk static files, cari di folder yang sesuai
    return resolveStaticFilePath(requestPath);
}

/**
 * Resolve path untuk static files (CSS, JS, JSON, images)
 */
function resolveStaticFilePath(requestPath) {
    // Remove leading slash
    const cleanPath = requestPath.startsWith('/') ? requestPath.slice(1) : requestPath;
    
    // Jika path sudah include folder, gunakan langsung
    if (cleanPath.includes('/')) {
        return path.join(__dirname, '..', cleanPath);
    }
    
    // Coba cari file di berbagai folder
    const possibleFolders = [
        'klasifikasi-page',
        'agrikultur_page', 
        'market_page',
        'finance_page',
        'marketing_page'
    ];
    
    for (const folder of possibleFolders) {
        const filePath = path.join(__dirname, '..', folder, cleanPath);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        
        // Coba cari di subfolder data
        const dataPath = path.join(__dirname, '..', folder, 'data', cleanPath);
        if (fs.existsSync(dataPath)) {
            return dataPath;
        }
        
        // Coba cari di subfolder model (untuk AI models)
        const modelPath = path.join(__dirname, '..', folder, 'model', cleanPath);
        if (fs.existsSync(modelPath)) {
            return modelPath;
        }
    }
    
    // Fallback: return path as is
    return path.join(__dirname, '..', cleanPath);
}

/**
 * Get MIME type untuk file
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
}

function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

function readFile(filePath, encoding = 'utf8') {
    try {
        return fs.readFileSync(filePath, encoding);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return null;
    }
}

module.exports = {
    resolveFilePath,
    resolveStaticFilePath,
    getMimeType,
    fileExists,
    readFile
};