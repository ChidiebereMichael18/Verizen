require('dotenv').config();

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini'
};