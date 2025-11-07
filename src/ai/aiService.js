const { AI_PROVIDER } = require('../config');
const { generateResponse: geminiResponse } = require('./providers/geminiService');
// const { generateResponse: groqResponse } = require('./providers/groqService');

async function processMessage(userMessage, history = []) {
  try {
    let response;
    
    switch (AI_PROVIDER) {
      case 'groq':
        response = await groqResponse(userMessage, history);
        break;
      case 'gemini':
      default:
        response = await geminiResponse(userMessage, history);
    }
    
    return response;
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback to other provider if one fails
    try {
      console.log(`Trying fallback provider...`);
      if (AI_PROVIDER === 'gemini') {
        return await groqResponse(userMessage, history);
      } else {
        return await geminiResponse(userMessage, history);
      }
    } catch (fallbackError) {
      console.error('Fallback AI provider also failed:', fallbackError);
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again in a few moments.';
    }
  }
}

module.exports = { processMessage };