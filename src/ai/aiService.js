const { GoogleGenAI } = require("@google/genai");
const { GEMINI_API_KEY } = require('../config');

// Initialize with your API key
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function processMessage(userMessage, history = []) {
  try {
    console.log('🤖 Using Gemini 2.0 Flash...');
    
    // Build the conversation context
    const messages = [
      {
        role: "user",
        parts: [{ text: `You are VeriZen AI, a helpful and empathetic customer service agent for a fintech company. Your goal is to understand user issues, ask for missing information politely, and provide helpful responses. Be professional yet warm. Keep responses concise and under 300 words.

Previous conversation context:
${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user message: ${userMessage}

Respond helpfully:` }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",  // Use the correct model name
      contents: messages,
    });

    console.log('✅ Gemini response received');
    return response.text;

  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    
    // Fallback to rule-based responses
    return getFallbackResponse(userMessage, history);
  }
}

// Keep your fallback responses as backup
function getFallbackResponse(userMessage, history) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('/start') || message.includes('hello') || message.includes('hi')) {
    return `👋 Welcome to VeriZen AI! I'm your customer service assistant. I can help with transactions, account issues, and general support. How can I help you today?`;
  }
  
  if (message.includes('transaction') || message.includes('charge')) {
    return "I can help with transaction inquiries! Please provide the transaction ID, amount, or date for me to investigate.";
  }
  
  if (message.includes('balance')) {
    return "For balance information, please check our mobile app or online banking. I can help with specific transaction questions if you have details to share!";
  }
  
  if (message.includes('problem') || message.includes('issue')) {
    return "I'm here to help! Please describe the issue you're experiencing in more detail.";
  }
  
  if (message.includes('thank')) {
    return "You're welcome! Is there anything else I can help with?";
  }
  
  return "Thank you for your message! I'm here to help with your financial service questions. How can I assist you today?";
}

module.exports = { processMessage };