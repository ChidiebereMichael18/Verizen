const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN } = require('../config');
const { processMessage } = require('../ai/aiService');
const { UserSession } = require('../database/models');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Store conversation context temporarily (in production, use DB)
const userSessions = new Map();

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Ignore non-text messages for now
  if (!userMessage) return;

  try {
    // Get or create a session for the user
    let session = userSessions.get(chatId);
    if (!session) {
      // Try to load from database first
      const dbSession = await UserSession.findOne({ telegramChatId: chatId.toString() });
      if (dbSession) {
        session = { history: dbSession.conversationHistory };
      } else {
        session = { history: [] };
      }
      userSessions.set(chatId, session);
    }

    // Send "typing..." action
    bot.sendChatAction(chatId, 'typing');

    // Get AI response
    const aiResponse = await processMessage(userMessage, session.history);

    // Update session history
    session.history.push({ role: 'user', content: userMessage });
    session.history.push({ role: 'assistant', content: aiResponse });

    // Keep history manageable (last 10 exchanges)
    if (session.history.length > 20) {
      session.history = session.history.slice(-20);
    }

    // Save to database
    await UserSession.findOneAndUpdate(
      { telegramChatId: chatId.toString() },
      { 
        telegramChatId: chatId.toString(),
        conversationHistory: session.history,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Send response back to user
    await bot.sendMessage(chatId, aiResponse);

  } catch (error) {
    console.error('Error processing message:', error);
    await bot.sendMessage(chatId, 'Sorry, I encountered an error. Please try again in a moment.');
  }
});

// Handle bot errors
bot.on('error', (error) => {
  console.error('Telegram Bot Error:', error);
});

module.exports = bot;