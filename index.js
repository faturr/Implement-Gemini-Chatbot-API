import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// --- Start of new code ---
// Check for API Key and exit if it's missing
if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
    console.error("Please create a .env file in the root of your project and add your key:");
    console.error("GEMINI_API_KEY=your_api_key_here");
    process.exit(1); // This stops the server
}
// --- End of new code ---

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.listen(port, () => {
    console.log(`Gemini Chatbot running on http://localhost:${port}`);
});

// Route penting!
app.post('/api/chat', async (req, res) => {
    console.log("Request body:", req.body);

    // Check if body-parser middleware ran successfully
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            error: "Request body is missing, empty, or not in JSON format.",
            tip: "In Postman, make sure you are sending a POST request with the 'Body' tab set to 'raw' and 'JSON'. Also, ensure the 'Content-Type' header is set to 'application/json'."
        });
    }

    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "The 'message' property is missing from the JSON body." });
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (err) {
        console.error(err);
        // --- Start of modified code ---
        // Send a more detailed error to the client
        res.status(500).json({ 
            reply: "An error occurred while communicating with the Gemini API.",
            errorDetails: err.message 
        });
        // --- End of modified code ---
    }
});