// c:\SmartV3\utils\audioProcessor.js

/**
 * Sends the audio recording data (Base64) to the server's upload endpoint.
 * This utility now uses the globally configured API_BASE_URL.
 *
 * @param {string} audioData - The Base64 encoded audio string (e.g., "data:audio/wav;base64,AAAA...").
 * @param {string} filename - The desired name for the saved audio file.
 * @param {string} userId - The ID of the user uploading the audio.
 * @returns {Promise<Object>} - The JSON response from the server.
 */
export async function uploadAudioToServer(audioData, filename, userId) {
    // 1. Determine the API URL using the global configuration
    // We combine the global base URL (e.g., 'http://localhost:3000') with the endpoint path.
    const apiUrl = `${global.API_BASE_URL}/upload-audio`;

    console.log(`Sending audio data to: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Keep-Alive connection header might be useful for large uploads
                'Connection': 'keep-alive'
            },
            // The audioData, filename, and userId are sent in the request body.
            body: JSON.stringify({
                audioData,
                filename,
                userId
            }),
            // Set high timeout if possible, although fetch often relies on OS/browser limits
            // A long-running process might benefit from a dedicated library like axios with explicit timeout setting.
        });

        // Check if the request itself failed (e.g., network error, server not running)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server returned status ${response.status}: ${errorText}`);
        }

        // Parse and return the JSON response from the API handler
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Failed to upload audio to server:', error);
        // Re-throw the error for the calling function to handle
        throw new Error(`Upload failed: ${error.message}`);
    }
}
