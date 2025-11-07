const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  telegramChatId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  conversationHistory: [{
    timestamp: { type: Date, default: Date.now },
    role: String, // 'user' or 'assistant'
    content: String
  }]
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = { UserSession };