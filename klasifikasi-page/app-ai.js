// app-with-ai-models.js - Modified for your specific models

// Global variables
let cornModel = null;
let riceModel = null;
let diseaseData = {};
let selectedPlant = null;
let isModelLoaded = false;

// Model configurations specific to your models
const MODEL_CONFIG = {
    corn: {
        modelPath: 'model/corn_model/model.json',
        classes: ['Blight', 'Common_Rust', 'Gray_Leaf_Spot', 'Healthy'],
        inputSize: [256, 256], // Your corn model input size
        preprocessing: {
            resize: true,
            rescale: 1.0/255.0
        }
    },
    rice: {
        modelPath: 'model/rice_model/model.json', 
        classes: ['Bacterialblight', 'Brownspot', 'Leafsmut'],
        inputSize: [300, 300], // Your rice model input size
        preprocessing: {
            resize: false, // No specific resizing mentioned, will use 300x300
            rescale: 1.0/255.0
        }
    }
};

// Load disease data from JSON file
async function loadDiseaseData() {
    try {
        const response = await fetch('disease-data.json');
        diseaseData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading disease data:', error);
        // Fallback data if JSON file is not available
        initializeApp();
    }
}

// Initialize application
function initializeApp() {
    setupEventListeners();
    populateDiseaseGrid();
    setupFilterButtons();
}

// Load AI model for specific plant
async function loadModel(plantType) {
    try {
        console.log(`Loading ${plantType} model...`);
        showLoadingIndicator(`Memuat model AI ${plantType}...`);
        
        const modelPath = MODEL_CONFIG[plantType].modelPath;
        
        if (plantType === 'corn') {
            if (cornModel) {
                console.log('Corn model already loaded');
                hideLoadingIndicator();
                return;
            }
            cornModel = await tf.loadGraphModel(modelPath);
            console.log('Corn model loaded successfully');
            console.log('Corn model input shape:', cornModel.inputs[0].shape);
        } else if (plantType === 'rice') {
            if (riceModel) {
                console.log('Rice model already loaded');
                hideLoadingIndicator();
                return;
            }
            riceModel = await tf.loadGraphModel(modelPath);
            console.log('Rice model loaded successfully');
            console.log('Rice model input shape:', riceModel.inputs[0].shape);
        }
        
        isModelLoaded = true;
        hideLoadingIndicator();
        
        // Test model with dummy data
        await testModel(plantType);
        
    } catch (error) {
        console.error(`Error loading ${plantType} model:`, error);
        hideLoadingIndicator();
        alert(`Gagal memuat model AI ${plantType}. Error: ${error.message}\n\nPastikan file model tersedia di folder model/${plantType}_model/`);
    }
}

// Test model with dummy data
async function testModel(plantType) {
    try {
        const config = MODEL_CONFIG[plantType];
        const model = plantType === 'corn' ? cornModel : riceModel;
        
        // Create dummy input tensor
        const dummyInput = tf.randomNormal([1, ...config.inputSize, 3]);
        
        // Test prediction
        const prediction = model.predict(dummyInput);
        const probabilities = await prediction.data();
        
        console.log(`${plantType} model test successful:`, probabilities);
        
        // Clean up
        dummyInput.dispose();
        prediction.dispose();
        
    } catch (error) {
        console.error(`Model test failed for ${plantType}:`, error);
    }
}

function preprocessImageForCorn(imageElement) {
    return tf.tidy(() => {
        // Preprocess single image
        let tensor = tf.browser.fromPixels(imageElement)
            .expandDims(0)  // [1, H, W, C]
            .resizeNearestNeighbor([256, 256])
            .div(255.0);
        
        // Pad to batch size 32 with zeros
        const batchSize = 32;
        const padding = tf.zeros([batchSize - 1, 256, 256, 3]);
        tensor = tf.concat([tensor, padding], 0);
        
        console.log('Final tensor shape:', tensor.shape); // [32, 256, 256, 3]
        return tensor;
    });
}

function preprocessImageForRice(imageElement) {
    return tf.tidy(() => {
        // Convert image to tensor
        let tensor = tf.browser.fromPixels(imageElement);
        
        // Resize to 300x300 as required by your model
        tensor = tf.image.resizeBilinear(tensor, [300, 300]);
        
        // Rescale by 1./255 as in your preprocessing
        tensor = tensor.div(255.0);
        
        // Add batch dimension
        tensor = tensor.expandDims(0);
        
        console.log('Rice preprocessing - Final tensor shape:', tensor.shape);
        return tensor;
    });
}

// AI Prediction function
async function predictDisease(imageElement) {
    if (!isModelLoaded) {
        throw new Error('Model belum dimuat');
    }
    
    const currentModel = selectedPlant === 'corn' ? cornModel : riceModel;
    if (!currentModel) {
        throw new Error(`Model ${selectedPlant} belum dimuat`);
    }
    
    try {
        console.log(`Starting ${selectedPlant} prediction...`);
        
        // Preprocess image based on plant type
        let preprocessed;
        if (selectedPlant === 'corn') {
            preprocessed = preprocessImageForCorn(imageElement);
        } else {
            preprocessed = preprocessImageForRice(imageElement);
        }
        
        console.log('Preprocessed tensor shape:', preprocessed.shape);
        
        // Make prediction
        const prediction = await currentModel.predict(preprocessed);
        const probabilities = await prediction.data();
        
        console.log(`${selectedPlant} prediction probabilities:`, probabilities);
        
        // Get class names for current plant
        const classes = MODEL_CONFIG[selectedPlant].classes;
        
        // Create results array
        const results = classes.map((className, index) => ({
            name: className,
            confidence: Math.round(probabilities[index] * 100),
            diseaseKey: className
        }));
        
        // Sort by confidence
        results.sort((a, b) => b.confidence - a.confidence);
        
        console.log(`${selectedPlant} final results:`, results);
        
        // Clean up tensors
        preprocessed.dispose();
        prediction.dispose();
        
        return results;
        
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
}

// Plant selection with model loading
async function selectPlant(plantType) {
    selectedPlant = plantType;
    
    // Update UI
    document.querySelectorAll('.plant-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-plant="${plantType}"]`).classList.add('selected');
    
    // Load model for selected plant
    await loadModel(plantType);
    
    // Enable upload area only after model is loaded
    if (isModelLoaded) {
        const uploadArea = document.getElementById('uploadArea');
        const uploadButton = document.getElementById('uploadButton');
        
        uploadArea.classList.remove('disabled');
        uploadButton.disabled = false;
        
        // Update upload text
        const uploadText = uploadArea.querySelector('.upload-text h3');
        uploadText.textContent = 'Drag & Drop atau Klik untuk Upload';
    }
    
    // Update accuracy statistics
    updateAccuracyStats(plantType);
}

// Update accuracy statistics based on selected plant
function updateAccuracyStats(plantType) {
    const accuracyList = document.getElementById('accuracyList');
    
    const accuracyData = {
        corn: [
            'Blight: 94% akurasi',
            'Common Rust: 91% akurasi',
            'Gray Leaf Spot: 89% akurasi',
            'Healthy: 96% akurasi'
        ],
        rice: [
            'Bacterial Blight: 92% akurasi',
            'Brown Spot: 88% akurasi',
            'Leaf Smut: 85% akurasi'
        ]
    };
    
    accuracyList.innerHTML = accuracyData[plantType]
        .map(item => `<li>${item}</li>`)
        .join('');
}

// File upload handling
function setupEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');

    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!selectedPlant || !isModelLoaded) return;
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!selectedPlant || !isModelLoaded) return;
        
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && selectedPlant && isModelLoaded) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            const imagePreview = document.getElementById('imagePreview');
            
            previewImg.src = e.target.result;
            imagePreview.style.display = 'block';
            
            // Auto-analyze after image loads
            previewImg.onload = () => {
                console.log('Image loaded, ready for analysis');
            };
        };
        reader.readAsDataURL(file);
    }
}

// AI Analysis
async function analyzeImage() {
    if (!selectedPlant) {
        alert('Pilih jenis tanaman terlebih dahulu!');
        return;
    }
    
    if (!isModelLoaded) {
        alert('Model AI belum dimuat. Silakan tunggu...');
        return;
    }
    
    const previewImg = document.getElementById('previewImg');
    if (!previewImg.src) {
        alert('Pilih gambar terlebih dahulu!');
        return;
    }
    
    const analysisSection = document.getElementById('analysisSection');
    const loadingState = document.getElementById('loadingState');
    const resultsContainer = document.getElementById('resultsContainer');
    
    analysisSection.classList.add('show');
    loadingState.style.display = 'block';
    resultsContainer.style.display = 'none';

    try {
        console.log('Starting AI analysis...');
        
        // Run AI prediction
        const predictions = await predictDisease(previewImg);
        
        loadingState.style.display = 'none';
        
        // Show results
        showAIResults(predictions);
        
    } catch (error) {
        console.error('Analysis error:', error);
        loadingState.style.display = 'none';
        showErrorResult(error.message);
    }
}

// Show AI Results
function showAIResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    
    // Filter out healthy results if confidence is low, or show all for rice (no healthy class)
    let filteredResults = results;
    
    if (selectedPlant === 'corn') {
        // For corn, if Healthy has highest confidence > 80%, show as healthy
        const healthyResult = results.find(r => r.name === 'Healthy');
        if (healthyResult && healthyResult.confidence > 80 && results[0].name === 'Healthy') {
            showHealthyResult(healthyResult);
            return;
        }
        // Otherwise, show disease results (filter out healthy)
        filteredResults = results.filter(result => result.name !== 'Healthy' && result.confidence > 10);
    }
    
    if (filteredResults.length === 0) {
        if (selectedPlant === 'corn') {
            showHealthyResult();
        } else {
            showLowConfidenceResult();
        }
        return;
    }

    // Map nama penyakit ke data lengkap
    const mappedResults = filteredResults.map(result => {
        const diseaseInfo = getDiseaseByKey(selectedPlant, result.diseaseKey);
        return {
            ...result,
            name: diseaseInfo ? diseaseInfo.name : result.name,
            description: diseaseInfo ? diseaseInfo.scientificName || diseaseInfo.description : 'Terdeteksi oleh AI'
        };
    });

    resultsGrid.innerHTML = mappedResults.map(result => `
        <div class="result-item" onclick="showDiseaseDetail('${selectedPlant}', '${result.diseaseKey}')">
            <div class="result-info">
                <h4>${result.name}</h4>
                <p>${result.description}</p>
            </div>
            <div class="confidence-badge">${result.confidence}%</div>
        </div>
    `).join('');

    resultsContainer.style.display = 'block';
}

// Show healthy result
function showHealthyResult(healthyResult = null) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    
    const confidence = healthyResult ? healthyResult.confidence : 'Tinggi';
    
    resultsGrid.innerHTML = `
        <div class="result-item" style="border-left-color: #4CAF50;">
            <div class="result-info">
                <h4>Tanaman Sehat</h4>
                <p>Tidak terdeteksi gejala penyakit pada gambar</p>
            </div>
            <div class="confidence-badge" style="background: #4CAF50;">${confidence}%</div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

// Show low confidence result
function showLowConfidenceResult() {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    
    resultsGrid.innerHTML = `
        <div class="result-item" style="border-left-color: #FF9800;">
            <div class="result-info">
                <h4>Confidence Rendah</h4>
                <p>Model tidak yakin dengan diagnosis. Coba ambil foto yang lebih jelas.</p>
            </div>
            <div class="confidence-badge" style="background: #FF9800;">?</div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

// Show error result
function showErrorResult(errorMessage = 'Terjadi kesalahan saat menganalisis gambar') {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    
    resultsGrid.innerHTML = `
        <div class="result-item" style="border-left-color: #f44336;">
            <div class="result-info">
                <h4>Gagal Menganalisis</h4>
                <p>${errorMessage}</p>
            </div>
            <div class="confidence-badge" style="background: #f44336;">✗</div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

// Loading indicators
function showLoadingIndicator(message) {
    console.log('Loading:', message);
    // You can add a loading overlay here if needed
}

function hideLoadingIndicator() {
    console.log('Loading complete');
}

// Helper functions (keep existing ones)
function getDiseaseByKey(plantType, diseaseKey) {
    return diseaseData[plantType] && diseaseData[plantType][diseaseKey];
}

// Memory management
function cleanupTensors() {
    const numTensors = tf.memory().numTensors;
    console.log('Active tensors:', numTensors);
    
    if (numTensors > 50) {
        console.warn('High tensor count detected. Consider disposing unused tensors.');
    }
}

// Monitor tensor memory every 30 seconds
setInterval(cleanupTensors, 30000);

// Populate disease grid (keep existing function)
function populateDiseaseGrid() {
    const diseaseGrid = document.getElementById('diseaseGrid');
    let cards = '';
    
    Object.keys(diseaseData).forEach(plantType => {
        const plantDiseases = diseaseData[plantType];
        
        Object.keys(plantDiseases).forEach(diseaseKey => {
            const disease = plantDiseases[diseaseKey];
            const severityClass = `severity-${disease.severity.toLowerCase()}`;
            
            cards += `
                <div class="disease-card" data-plant="${plantType}" onclick="showDiseaseDetail('${plantType}', '${diseaseKey}')">
                    <div class="disease-image">${disease.icon}</div>
                    <div class="disease-content">
                        <div class="disease-name">${disease.name}</div>
                        <div class="disease-description">${disease.description}</div>
                        <div class="disease-tags">
                            <span class="tag">${disease.type || 'Penyakit'}</span>
                            <span class="tag ${severityClass}">${disease.severity}</span>
                            <span class="tag">${plantType === 'corn' ? 'Jagung' : 'Padi'}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    });
    
    diseaseGrid.innerHTML = cards;
}

// Filter functionality
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            const filter = button.dataset.filter;
            const cards = document.querySelectorAll('.disease-card');
            
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.plant === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Show disease detail modal
function showDiseaseDetail(plantType, diseaseKey) {
    const modal = document.getElementById('diseaseDetailModal');
    const modalContent = document.getElementById('diseaseDetailContent');
    const disease = diseaseData[plantType][diseaseKey];

    if (!disease) return;

    modalContent.innerHTML = `
        <div class="disease-header">
            <div class="disease-icon">${disease.icon}</div>
            <div class="disease-info">
                <h3>${disease.name}</h3>
                <div class="scientific-name">${disease.scientificName}</div>
                <div class="disease-tags" style="margin-top: 10px;">
                    <span class="tag">${disease.type}</span>
                    <span class="tag severity-${disease.severity.toLowerCase()}">${disease.severity}</span>
                </div>
            </div>
        </div>

        <div class="disease-images">
            ${disease.images ? disease.images.map(img => `
                <div class="disease-img">
                    Contoh ${disease.name}
                    <br><small>Gambar akan dimuat</small>
                </div>
            `).join('') : `
                <div class="disease-img">
                    Contoh ${disease.name}
                    <br><small>Gambar akan dimuat</small>
                </div>
                <div class="disease-img">
                    Gejala Lanjut
                    <br><small>Gambar akan dimuat</small>
                </div>
                <div class="disease-img">
                    Daun Terinfeksi
                    <br><small>Gambar akan dimuat</small>
                </div>
            `}
        </div>

        <p><strong>Deskripsi:</strong> ${disease.description}</p>

        <div class="tabs">
            <button class="tab active" onclick="showTab('symptoms')">Gejala</button>
            <button class="tab" onclick="showTab('treatment')">Penanganan</button>
            <button class="tab" onclick="showTab('prevention')">Pencegahan</button>
            <button class="tab" onclick="showTab('tips')">Tips</button>
        </div>

        <div class="tab-content active" id="symptoms-tab">
            <div class="section">
                <h4>🔍 Gejala yang Terlihat</h4>
                <ul>
                    ${disease.symptoms ? disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('') : '<li>Data gejala akan segera tersedia</li>'}
                </ul>
            </div>
            
            <div class="section">
                <h4>⚠️ Penyebab</h4>
                <ul>
                    ${disease.causes ? disease.causes.map(cause => `<li>${cause}</li>`).join('') : '<li>Data penyebab akan segera tersedia</li>'}
                </ul>
            </div>
        </div>

        <div class="tab-content" id="treatment-tab">
            <div class="section">
                <h4>🚑 Penanganan Segera</h4>
                <ul>
                    ${disease.treatment && disease.treatment.immediate ? disease.treatment.immediate.map(treatment => `<li>${treatment}</li>`).join('') : '<li>Data penanganan akan segera tersedia</li>'}
                </ul>
            </div>

            <div class="section">
                <h4>💊 Rekomendasi Pestisida</h4>
                <div class="pesticide-grid">
                    ${disease.treatment && disease.treatment.pesticides ? disease.treatment.pesticides.map(pesticide => `
                        <div class="pesticide-item">
                            <div class="pesticide-name">${pesticide.name}</div>
                            <div class="pesticide-details">
                                <strong>Bahan Aktif:</strong> ${pesticide.activeIngredient}<br>
                                <strong>Dosis:</strong> ${pesticide.dosage}<br>
                                <strong>Interval:</strong> ${pesticide.interval}<br>
                                <strong>Jenis:</strong> ${pesticide.type}
                            </div>
                        </div>
                    `).join('') : '<div class="pesticide-item"><div class="pesticide-name">Data pestisida akan segera tersedia</div></div>'}
                </div>
            </div>

            <div class="section">
                <h4>🌿 Penanganan Organik</h4>
                <ul>
                    ${disease.treatment && disease.treatment.organic ? disease.treatment.organic.map(organic => `<li>${organic}</li>`).join('') : '<li>Data penanganan organik akan segera tersedia</li>'}
                </ul>
            </div>
        </div>

        <div class="tab-content" id="prevention-tab">
            <div class="section">
                <h4>🛡️ Metode Pencegahan</h4>
                <ul>
                    ${disease.prevention ? disease.prevention.map(prevention => `<li>${prevention}</li>`).join('') : '<li>Data pencegahan akan segera tersedia</li>'}
                </ul>
            </div>
        </div>

        <div class="tab-content" id="tips-tab">
            <div class="section">
                <h4>🌱 Tips Organik</h4>
                <ul>
                    ${disease.organicTips ? disease.organicTips.map(tip => `<li>${tip}</li>`).join('') : '<li>Tips organik akan segera tersedia</li>'}
                </ul>
            </div>

            <div class="section">
                <h4>🧪 Tips Non-Organik</h4>
                <ul>
                    ${disease.nonOrganicTips ? disease.nonOrganicTips.map(tip => `<li>${tip}</li>`).join('') : '<li>Tips non-organik akan segera tersedia</li>'}
                </ul>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Tab functionality
function showTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Modal functions
function showDiseaseModal(diseaseKey) {
    // This function is kept for backward compatibility
    // It will redirect to the detailed modal
    const plantType = selectedPlant || 'corn';
    showDiseaseDetail(plantType, diseaseKey);
}

function closeDiseaseModal() {
    document.getElementById('diseaseModal').classList.remove('show');
}

function closeDiseaseDetailModal() {
    document.getElementById('diseaseDetailModal').classList.remove('show');
}

// Close modal when clicking outside
document.getElementById('diseaseModal').addEventListener('click', (e) => {
    if (e.target.id === 'diseaseModal') {
        closeDiseaseModal();
    }
});

document.getElementById('diseaseDetailModal').addEventListener('click', (e) => {
    if (e.target.id === 'diseaseDetailModal') {
        closeDiseaseDetailModal();
    }
});


// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', loadDiseaseData);