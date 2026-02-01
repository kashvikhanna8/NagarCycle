const fs = require('fs');
const path = require('path');

const datasetDir = path.join(__dirname, '../dataset');
const outputFile = path.join(__dirname, '../data/dataset_index.json');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

function scanDataset() {
    if (!fs.existsSync(datasetDir)) {
        console.log("Dataset directory not found.");
        return;
    }

    // Pass the base datasetDir (searches recursively)
    const images = getAllFiles(datasetDir);

    // Create relative paths for cleaner storage
    const index = images.map(absolutePath => {
        const relativePath = path.relative(datasetDir, absolutePath);
        // Heuristic: Use parent folder name or filename as label
        const label = path.basename(path.dirname(absolutePath)) !== 'dataset'
            ? path.basename(path.dirname(absolutePath))
            : path.basename(absolutePath).split('.')[0].replace(/[0-9]/g, '');

        return {
            path: relativePath,
            label: label.replace(/_/g, ' ').trim()
        };
    });

    fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
    console.log(`Indexed ${images.length} images.`);
}

scanDataset();
