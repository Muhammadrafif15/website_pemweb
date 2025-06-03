
function injectNavigation(htmlContent, currentPath) {
    try {
        // Load navigation template
        const navPath = path.join(__dirname, '..', 'views', 'navigation.html');
        const navigationHTML = fs.readFileSync(navPath, 'utf8');
        
        // Find and replace existing header or inject after <body>
        let modifiedHTML = htmlContent;
        
        // Method 1: Replace existing header
        const headerRegex = /<header[^>]*class="header"[^>]*>[\s\S]*?<\/header>/i;
        if (headerRegex.test(modifiedHTML)) {
            modifiedHTML = modifiedHTML.replace(headerRegex, navigationHTML);
        } else {
            // Method 2: Inject after <body> tag
            const bodyRegex = /(<body[^>]*>)/i;
            if (bodyRegex.test(modifiedHTML)) {
                modifiedHTML = modifiedHTML.replace(bodyRegex, `$1\n${navigationHTML}`);
            }
        }
        
        return modifiedHTML;
            
    } catch (error) {
        console.error('Error injecting navigation:', error);
        return htmlContent; // Return original if error
    }
}

function updatePageTitle(htmlContent, newTitle) {
    if (!newTitle) return htmlContent;
    
    return htmlContent.replace(
        /<title>.*?<\/title>/i,
        `<title>${newTitle}</title>`
    );
}

function updateActiveNavigation(htmlContent, currentPath) {
    return htmlContent;
}

function cleanupHTML(htmlContent) {
    return htmlContent.replace(/\s+/g, ' ').trim();
}

module.exports = {
    injectNavigation,
    updatePageTitle,
    updateActiveNavigation,
    cleanupHTML
};