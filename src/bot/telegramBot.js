const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN } = require('../config');
const { processMessage } = require('../ai/aiService');
const { UserSession } = require('../database/models');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Simple session storage
const userSessions = new Map();

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Ignore non-text messages
  if (!userMessage) {
    bot.sendMessage(chatId, "I currently only support text messages. Please send your question as text.");
    return;
  }

  try {
    console.log(`📨 Message from ${chatId}: ${userMessage}`);

    // Get or create session
    let session = userSessions.get(chatId);
    if (!session) {
      // Try to load from database
      const dbSession = await UserSession.findOne({ telegramChatId: chatId.toString() });
      session = dbSession ? { history: dbSession.conversationHistory } : { history: [] };
      userSessions.set(chatId, session);
    }

    // Send "typing..." indicator
    bot.sendChatAction(chatId, 'typing');

    // Get AI response
    const aiResponse = await processMessage(userMessage, session.history);

    // Update session history
    session.history.push({ role: 'user', content: userMessage });
    session.history.push({ role: 'assistant', content: aiResponse });

    // Keep last 6 messages to manage context
    if (session.history.length > 6) {
      session.history = session.history.slice(-6);
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

    // Send response
    await bot.sendMessage(chatId, aiResponse);
    console.log(`🤖 Response sent to ${chatId}`);

  } catch (error) {
    console.error('💥 Error processing message:', error);
    await bot.sendMessage(chatId, "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.");
  }
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `👋 Welcome to VeriZen AI!\n\nI'm your customer service assistant. I can help you with:\n• Transaction inquiries\n• Account questions\n• Issue resolution\n• General support\n\nHow can I help you today?`;
  bot.sendMessage(chatId, welcomeMessage);
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `🆘 **VeriZen AI Help**\n\nI can assist with:\n• Transaction details and history\n• Account-related questions\n• Problem resolution\n• General customer service\n\nJust describe your issue in your own words, and I'll do my best to help!`;
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

console.log('✅ Telegram bot started with polling');

module.exports = bot;