const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../../config');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function generateResponse(prompt, history = []) {
  try {
    // Build conversation context from history
    let fullPrompt = `You are VeriZen AI, a helpful and empathetic customer service agent for a fintech company. Your goal is to:
1. Understand the user's issue or complaint clearly.
2. Ask for any crucial missing information (like transaction ID, amount, date) in a friendly way.
3. Provide a helpful, accurate, and concise response.
4. If you cannot resolve the issue, assure the user that a human agent will review it shortly.

Be professional yet warm. Use the user's language.

Previous conversation context:\n`;

    // Add history to context (last 5 exchanges to manage token usage)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      fullPrompt += `${msg.role}: ${msg.content}\n`;
    });

    fullPrompt += `\nCurrent user message: ${prompt}\n\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI response from Gemini');
  }
}

module.exports = { generateResponse };