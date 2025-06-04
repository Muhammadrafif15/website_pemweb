const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Import modules
const { getRouteMapping, isStaticFile } = require('./routes');
const { injectNavigation, updatePageTitle } = require('./utils/templateHelper');
const { resolveFilePath, getMimeType, fileExists, readFile } = require('./utils/pathResolver');
const { preloadAllData } = require('./utils/dataLoader');
const ApiController = require('./controllers/ApiController');

const PORT = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const requestPath = parsedUrl.pathname;
    const method = req.method;
    
    console.log(`${req.method} ${requestPath}`);
    
    try {
        // Handle static files (CSS, JS, JSON, images)

        if (isApiRoute(requestPath)) {
            handleApiRequest(req, res, requestPath, method);
            return;
        }

        if (isStaticFile(requestPath)) {
            handleStaticFile(req, res, requestPath);
            return;
        }
        
        // Handle page routes
        handlePageRoute(req, res, requestPath);
        
    } catch (error) {
        console.error('Server error:', error);
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

async function handleApiRequest(req, res, requestPath, method) {
    if (method === 'GET') {
        await ApiController.handleApiRequest(req, res);
    } else if (method === 'POST') {
        await ApiController.handlePostRequest(req, res);
    } else {
        ApiController.sendError(res, 405, 'Method not allowed');
    }
}

function handleStaticFile(req, res, requestPath) {
    const filePath = resolveFilePath(requestPath);
    
    if (!fileExists(filePath)) {
        console.log(`Static file not found: ${filePath}`);
        sendErrorResponse(res, 404, 'File not found');
        return;
    }
    
    const mimeType = getMimeType(filePath);
    const content = readFile(filePath, mimeType.startsWith('text/') ? 'utf8' : null);
    
    if (content === null) {
        sendErrorResponse(res, 500, 'Error reading file');
        return;
    }
    
    res.writeHead(200, {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600' // Cache static files for 1 hour
    });
    
    res.end(content);
}

function handlePageRoute(req, res, requestPath) {
    const routeInfo = getRouteMapping(requestPath);
    
    if (!routeInfo) {
        sendErrorResponse(res, 404, 'Page not found');
        return;
    }
    
    const filePath = resolveFilePath(requestPath, routeInfo);
    
    if (!fileExists(filePath)) {
        console.log(`Page file not found: ${filePath}`);
        sendErrorResponse(res, 404, 'Page not found');
        return;
    }
    
    let htmlContent = updatePageTitle(htmlContent, routeInfo.title);
    
    if (htmlContent === null) {
        sendErrorResponse(res, 500, 'Error reading page');
        return;
    }
    
    // Phase 1: Basic processing
    htmlContent = updatePageTitle(htmlContent, routeInfo.title);
    htmlContent = injectNavigation(htmlContent, requestPath);
    
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache' // Don't cache HTML pages
    });
    
    res.end(htmlContent);
}

function sendErrorResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error ${statusCode} - AgriSmart</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px;
                    background: #f5f5f5;
                }
                .error-container {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    max-width: 500px;
                    margin: 0 auto;
                }
                h1 { color: #5D8736; }
                .back-link { 
                    color: #5D8736; 
                    text-decoration: none; 
                    margin-top: 20px; 
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>🌾 AgriSmart</h1>
                <h2>Error ${statusCode}</h2>
                <p>${message}</p>
                <a href="/" class="back-link">← Kembali ke Beranda</a>
            </div>
        </body>
        </html>
    `);
}

// Start server
server.listen(PORT, () => {
    console.log(' AgriSmart Server Started!');
    console.log(` Server running on: http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('   • http://localhost:3000/ (Default)');
    console.log('   • http://localhost:3000/klasifikasi');
    console.log('   • http://localhost:3000/alat-pertanian');
    console.log('   • http://localhost:3000/harga-pasar');
    console.log('   • http://localhost:3000/permodalan'); 
    console.log('   • http://localhost:3000/pemasaran');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n Shutting down server...');
    server.close(() => {
        console.log(' Server closed gracefully');
    });
});

process.on('SIGINT', () => {
    console.log('\n Shutting down server...');
    server.close(() => {
        console.log(' Server closed gracefully');
    });
});