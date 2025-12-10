const express = require('express');
const app = express();

// 1. Middleware (Built-in Express replacement for body-parser)
// This handles the Form POST data from Schoology
app.use(express.urlencoded({ extended: true })); 
// If you also expect JSON later, you can add: app.use(express.json());

// 2. Health Check (Render looks for this)
app.get('/api/health', (req, res) => {
    // Return 200 immediately so Render knows the app is alive
    res.status(200).send('OK');
});

// 3. The Schoology Callback
app.post('/api/auth/callback/schoology', (req, res) => {
    const { body = {} } = req;
    const { id_token = null, state, error } = body;

    console.log("--- SCHOOLOGY CALLBACK RECEIVED ---");
    
    if (error) {
        console.error("Error received from Schoology:", error);
        return res.status(400).send("Login Failed: " + error);
    }

    console.log("State:", state);

    if (id_token) {
        console.log("✅ ID Token Received (Truncated):", id_token.substring(0, 50) + "...");
        // In real production, you would validate the token here
        return res.send("Login Successful! Check server console for token.");
    } else {
        console.error("❌ No id_token found.");
        console.log("Full Body:", body);
        return res.status(400).send("Invalid Request: No token received.");
    }
});

// 4. Start Server on Dynamic Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});