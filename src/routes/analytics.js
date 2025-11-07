const express = require('express');
const { UserSession } = require('../database/models');
const router = express.Router();

router.get('/stats', async (req, res) => {
  const totalUsers = await UserSession.countDocuments();
  const recentActivity = await UserSession.find()
    .sort({ updatedAt: -1 })
    .limit(10);
    
  res.json({
    totalUsers,
    recentActivity: recentActivity.map(session => ({
      chatId: session.telegramChatId,
      lastActive: session.updatedAt,
      messageCount: session.conversationHistory.length
    }))
  });
});

module.exports = router;