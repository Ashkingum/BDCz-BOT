const TransactionService = require('../../services/transactionService');
const { formatTransactionDetails } = require('../../utils/admin/transactionFormatter');

const transactionService = new TransactionService();

async function handleTransactionMenu(bot, msg) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId,
    'Enter Transaction ID:',
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '🔙 Return to Menu', callback_data: 'return_menu' }
        ]]
      }
    }
  );
}

async function handleTransactionId(bot, msg) {
  const chatId = msg.chat.id;
  const txnId = msg.text.toLowerCase();

  if (!txnId.startsWith('bdcz') || txnId.length !== 14) {
    await bot.sendMessage(chatId, '❌ Invalid transaction ID format');
    return;
  }

  const transaction = transactionService.getTransaction(txnId);
  if (!transaction) {
    await bot.sendMessage(chatId, '❌ Transaction not found');
    return;
  }

  await bot.sendMessage(chatId,
    formatTransactionDetails(transaction),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Mark as Paid', callback_data: `paid_${txnId}` },
            { text: '❌ Delete', callback_data: `delete_txn_${txnId}` }
          ],
          [{ text: '🔙 Return to Menu', callback_data: 'return_menu' }]
        ]
      }
    }
  );
}

async function handleTransactionPaid(bot, query) {
  const chatId = query.message.chat.id;
  const txnId = query.data.split('_')[1];

  try {
    const transaction = await transactionService.markAsPaid(txnId);

    // Notify user
    await bot.sendMessage(transaction.userId,
      'Alert! Your funds are on the way! ' +
      'Spread the good news: https://t.me/+ssAEJyyuiTI1NTk8',
      { disable_web_page_preview: true }
    );

    // Notify channel
    await bot.sendMessage('@empire_blacck',
      `Good news... A believer just got paid $${transaction.amount.toFixed(2)}! ` +
      'Show some love or reactions.',
      { disable_web_page_preview: true }
    );

    // Remove transaction
    await transactionService.deleteTransaction(txnId);
    await bot.sendMessage(chatId, '✅ Transaction marked as paid and removed');
  } catch (error) {
    await bot.sendMessage(chatId, '❌ Failed to process transaction');
  }
}

async function handleTransactionDelete(bot, query) {
  const chatId = query.message.chat.id;
  const txnId = query.data.split('_')[2];

  await bot.sendMessage(chatId,
    'You\'re about to permanently erase an unpaid transaction ID from the system. ' +
    'This action cannot be undone. Are you sure of your choice?',
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `confirm_delete_${txnId}` },
          { text: 'NO', callback_data: 'return_menu' }
        ]]
      }
    }
  );
}

async function handleTransactionDeleteConfirm(bot, query) {
  const chatId = query.message.chat.id;
  const txnId = query.data.split('_')[2];

  try {
    await transactionService.deleteTransaction(txnId);
    await bot.sendMessage(chatId, '✅ Transaction permanently deleted');
  } catch (error) {
    await bot.sendMessage(chatId, '❌ Failed to delete transaction');
  }
}

module.exports = {
  handleTransactionMenu,
  handleTransactionId,
  handleTransactionPaid,
  handleTransactionDelete,
  handleTransactionDeleteConfirm
};