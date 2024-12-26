// Add to existing bot.js
const { handleAdminMenu, handleAdminCallbacks } = require('./handlers/admin/adminMenuHandler');
const { handleTransactionMenu, handleTransactionId } = require('./handlers/admin/transactionHandler');
const { handleModsMenu } = require('./handlers/admin/modsHandler');

// Add command handler for admin menu
bot.onText(/\/admin/, (msg) => handleAdminMenu(bot, msg));

// Add to existing callback query handler
bot.on('callback_query', async (query) => {
  if (query.data.startsWith('admin_')) {
    await handleAdminCallbacks(bot, query);
  }
  // ... existing callback handlers
});

// Add message handler for transaction ID input
bot.on('message', async (msg) => {
  if (msg.text && msg.text.toLowerCase().startsWith('bdcz')) {
    await handleTransactionId(bot, msg);
  }
  // ... existing message handlers
});