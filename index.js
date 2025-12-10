const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 1. Middleware to parse the "application/x-www-form-urlencoded" body
// Schoology sends the data as a form POST, not JSON.
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/health', (req, res) => {
    res.send('OK');
});

// 2. The Callback Endpoint
// Note: This MUST be 'post', not 'get'
app.post('/api/auth/callback/schoology', (req, res) => {
    
    // The data is inside req.body, NOT req.query
    const {body = {}} = req;
    const { id_token = null, state, error } = body;

    // --- LOGGING FOR DEBUGGING ---
    console.log("--- SCHOOLOGY CALLBACK RECEIVED ---");
    
    if (error) {
        console.error("Error received from Schoology:", error);
        return res.status(400).send("Login Failed: " + error);
    }

    // 1. Verify State (CSRF Protection)
    // Compare 'state' received here with the one you generated in Step 1
    // const isValidState = checkState(state); 
    console.log("State:", state);

    // 2. The 'id_token' is the credential
    // It is a long JWT string containing the user's info (sub, name, email)
    if (id_token) {
        console.log("✅ ID Token Received (Truncated):", id_token.substring(0, 50) + "...");
        
        // TODO: Validate this token!
        // 1. Verify signature using Schoology's JWKS (Public Keys)
        // 2. Decode payload to get User ID (req.body.id_token.sub)
        
        return res.send("Login Successful! Check server console for token.");
    } else {
        console.error("❌ No id_token found in request body.");
        console.log("Full Body:", req.body); // Helpful for debugging
        return res.status(400).send("Invalid Request: No token received.");
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));