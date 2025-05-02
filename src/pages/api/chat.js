// pages/api/chat.js

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash"; // Or your preferred model
const API_KEY = 'AIzaSyD3UhQzSqXGZDlKujE0H3aNzbbJjGuOLJU'; // Store securely!

// --- Define Your System Prompt ---
// Be specific and clear. Provide context about the company, the AI's role, tone, and limitations.
const systemPrompt = `
You are "KrokBot", a friendly and helpful customer support assistant for KrokPlus.
KrokPlus is an online learning platform specializing in medical exam preparation, primarily serving medical students.

**About KrokPlus:**
* **Core Service:** We provide comprehensive online courses, extensive practice question banks, and realistic mock exams for various medical licensing exams.
* **Key Features:** High-quality video lectures, detailed explanations for practice questions, performance tracking, customizable study plans.
* **Target Audience:** Medical students preparing for exams like KROK (Ukraine), USMLE, etc. (Specify relevant exams).
* **Website:** Assume the main website is krokplus.com (replace if different).

**Your Role & Tone:**
* **Goal:** Assist users with inquiries about KrokPlus services, features, pricing, account issues, and navigating the website.
* **Tone:** Be professional, empathetic, patient, and concise. Keep responses helpful and easy to understand.
* **Limitations:**
    * You **cannot** provide medical advice or interpretations of medical information.
    * You **cannot** process payments or modify user accounts directly (unless specific backend functions are added later).
    * If you cannot answer a specific question or the user requires sensitive account actions, politely direct them to contact human support via email at support@krokplus.com (replace with actual email) or through a specific contact form link (if available).
    * Do not make up information about features or pricing if you are unsure. It's better to say you don't have that specific detail and suggest where the user might find it (e.g., "You can find detailed pricing information on our Pricing page.") or refer them to human support.

**Current Context:**
* The current date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
* Assume the user is interacting from near Ukrania unless they specify otherwise. (This might be less relevant for general support but included as requested).

Begin the conversation by greeting the user and asking how you can help them regarding KrokPlus.
`;
// --- End of System Prompt Definition ---


// Basic safety settings - Adjust as needed
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  // ... (keep your other safety settings) ...
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- Initialize the Generative AI Client ---
// Do this outside the handler for potential reuse if your server setup allows
let genAI;
let model;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        // --- Pass the system instruction during model initialization ---
        systemInstruction: systemPrompt,
    });
} else {
    console.error("GEMINI_API_KEY environment variable not set.");
}
// --- --------------------------------------- ---


async function runChat(history, newMessage) {
    // Removed apiKey parameter as model is initialized outside now
    if (!model) { // Check if model initialization failed
        throw new Error("Generative model not initialized. Check API key.");
    }

    const generationConfig = {
        temperature: 0.8, // Slightly lower temperature might be better for factual support
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    // Map frontend history to Gemini format
    let chatHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // FIX: Ensure history passed to startChat starts with 'user' role.
    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
        console.warn("History started with 'model', removing initial model message for Gemini API call.");
        chatHistory = chatHistory.slice(1);
    }

    try {
        // Start chat using the pre-initialized model (which includes the system prompt)
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: chatHistory, // Pass the potentially adjusted history
        });

        const result = await chat.sendMessage(newMessage);

        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            console.warn("Gemini response blocked or empty:", result.response?.promptFeedback);
            return "I apologize, but I couldn't generate a response for that. Could you please rephrase your message?";
        }

        const responseText = result.response.text();
        return responseText;

    } catch (error) {
        console.error("Error calling Gemini API in runChat:", error);
        return "Sorry, I encountered an error trying to respond. Please try again later.";
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Check if model is available (handles missing API key case)
    if (!model) {
         console.error("API handler error: Model not initialized.");
         return res.status(500).json({ error: "AI service configuration error." });
    }

    const { history, message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const reply = await runChat(history || [], message); // Pass history from request
        res.status(200).json({ reply });
    } catch (error) {
        // Error already logged in runChat, just send generic response
        res.status(500).json({ error: "Failed to get response from AI service." });
    }
}