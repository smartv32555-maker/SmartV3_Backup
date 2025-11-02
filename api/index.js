// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const cors = require('cors');

// Initialize Express app
const app = express();

// --- Configuration for large payloads (Crucial Fix) ---
// We need to increase the limit for JSON and URL-encoded bodies
// to handle large Base64 encoded audio data (e.g., up to 50MB)

// Use JSON body parser with increased limit
app.use(bodyParser.json({ limit: '50mb' }));

// Use URL-encoded body parser with increased limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// --------------------------------------------------------

// Enable CORS for all routes and origins (for development)
app.use(cors());

// A simple test route
app.get('/', (req, res) => {
    res.send('SmartV3 API is running with 50MB body limit.');
});

// --- Main Audio Upload Route (Placeholder for original logic) ---
// This is where your original audio processing and file writing logic would go.
// The key is that 'req.body' can now safely contain large Base64 strings.
app.post('/upload-audio', async (req, res) => {
    try {
        const { audioData, filename, userId } = req.body;

        if (!audioData || !filename || !userId) {
            return res.status(400).json({ success: false, message: 'Missing audio data, filename, or user ID.' });
        }

        // Base64 string looks like: "data:audio/wav;base64,AAAA..."
        // We need to strip the prefix "data:audio/wav;base64,"
        const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, "");
        
        // You would typically decode base64 and save the file here.
        // Example (requires 'fs' module which is usually available in a Node.js environment):
        /*
        const fs = require('fs');
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = `./uploads/${userId}/${filename}`; // Adjust path as needed

        await fs.promises.mkdir(`./uploads/${userId}`, { recursive: true });
        await fs.promises.writeFile(filePath, buffer);
        */

        console.log(`Received large audio file: ${filename} (Size of Base64 string: ${base64Data.length} chars) for user ${userId}`);

        // Mock success response for now, assuming the file saving logic is external
        res.status(200).json({ 
            success: true, 
            message: 'Audio received successfully! (50MB limit is active)', 
            file_details: { filename, size: base64Data.length } 
        });

    } catch (error) {
        console.error('Error processing audio upload:', error);
        res.status(500).json({ success: false, message: 'Internal server error during upload.', error: error.message });
    }
});
// ----------------------------------------------------------------

// Export the Express app
module.exports = app;
