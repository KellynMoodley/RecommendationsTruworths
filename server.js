const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/api/lookup', async (req, res) => {
    if (!req.body.account_number) {
        return res.status(400).json({
            error: 'Missing account_number in request body'
        });
    }
    
    try {
        const webhookUrl = 'https://kkarodia.app.n8n.cloud/webhook/90df798a-908a-458c-a10a-1189267dc4b3';
        
        const response = await axios.post(webhookUrl, {
            Account_no: req.body.account_number
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 100000
        });
        
        // Safely handle different response formats
        let processedData;
        
        if (typeof response.data === 'string') {
            try {
                // Try to parse if it's a JSON string
                processedData = JSON.parse(response.data);
            } catch {
                // Handle string response
                const objectMatch = response.data.match(/^\[object Object\](.*)/);
                processedData = objectMatch ? {
                    text: objectMatch[1].trim(),
                    type: 'string_response'
                } : { text: response.data, type: 'raw_string' };
            }
        } else if (typeof response.data === 'object') {
            processedData = response.data;
        } else {
            throw new Error('Unexpected response format from webhook');
        }
        
        // Log processed data for debugging
        console.log('Processed webhook response:', JSON.stringify(processedData, null, 2));
        
        // Send consistent response format
        res.json({
            success: true,
            data: processedData
        });
        
    } catch (error) {
        // Enhanced error logging
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data || 'No response data',
            status: error.response?.status || 500
        });
        
        res.status(500).json({
            success: false,
            error: 'Error processing request',
            details: error.message
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Debug mode enabled - check console for detailed logs');
});