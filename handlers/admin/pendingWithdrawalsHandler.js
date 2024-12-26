const WithdrawalService = require('../../services/withdrawalService');
const { formatWithdrawalList, formatWithdrawalDetails } = require('../../utils/admin/withdrawalFormatter');
const { generateTxnId } = require('../../utils/transactionUtils');

const withdrawalService = new WithdrawalService();

async function handlePendingWithdrawals(bot, msg, page = 1) {
  const chatId = msg.chat.id;
  const { withdrawals, totalPages, currentPage } = withdrawalService.getPendingWithdrawals(page);

  if (withdrawals.length === 0) {
    await bot.sendMessage(chatId, 'No pending withdrawal requests.');
    return;
  }

  await bot.sendMessage(chatId,
    formatWithdrawalList(withdrawals),
    {
      parse_mode: 'Markdown',
      reply_markup: formatPaginationKeyboard(currentPage, totalPages)
    }
  );
}

async function handleWithdrawalDetails(bot, msg, withdrawalId) {
  const chatId = msg.chat.id;
  const withdrawal = withdrawalService.getWithdrawal(withdrawalId);

  if (!withdrawal) {
    await bot.sendMessage(chatId, 'Withdrawal request not found.');
    return;
  }

  await bot.sendMessage(chatId,
    formatWithdrawalDetails(withdrawal),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve_withdrawal_${withdrawalId}` },
            { text: '❌ Reject', callback_data: `reject_withdrawal_${withdrawalId}` }
          ],
          [
            { text: '⬅️ Previous', callback_data: `withdrawal_prev_${withdrawalId}` },
            { text: '➡️ Next', callback_data: `withdrawal_next_${withdrawalId}` }
          ],
          [{ text: '🔙 Return to Menu', callback_data: 'return_menu' }]
        ]
      }
    }
  );
}

async function handleWithdrawalApproval(bot, query) {
  const chatId = query.message.chat.id;
  const withdrawalId = query.data.split('_')[2];
  const withdrawal = withdrawalService.getWithdrawal(withdrawalId);

  try {
    const txnId = generateTxnId();
    await withdrawalService.approveWithdrawal(withdrawalId, txnId);

    // Notify user
    await bot.sendMessage(withdrawal.userId,
      `Your withdrawal request for $${withdrawal.amount.toFixed(2)} has been approved.\n` +
      `Txn ID: ${txnId}\n` +
      `Copy the transaction ID and click [here](https://forms.gle/vCKgWLqVoKn3KJW9A) to receive your cash.`,
      {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      }
    );

    await bot.sendMessage(chatId, 'Withdrawal approved successfully.');
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to approve withdrawal.');
  }
}

async function handleWithdrawalRejection(bot, query) {
  const chatId = query.message.chat.id;
  const withdrawalId = query.data.split('_')[2];

  try {
    await withdrawalService.rejectWithdrawal(withdrawalId);
    await bot.sendMessage(chatId, 'Withdrawal rejected and removed from the list.');
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to reject withdrawal.');
  }
}

function formatPaginationKeyboard(currentPage, totalPages) {
  const buttons = [];
  
  // Navigation buttons
  const navRow = [];
  if (currentPage > 1) {
    navRow.push({ text: '←', callback_data: `withdrawal_page_${currentPage - 1}` });
  }
  navRow.push({ text: `${currentPage}/${totalPages}`, callback_data: 'noop' });
  if (currentPage < totalPages) {
    navRow.push({ text: '→', callback_data: `withdrawal_page_${currentPage + 1}` });
  }
  buttons.push(navRow);

  // Return to menu button
  buttons.push([{ text: 'Return to Menu', callback_data: 'return_menu' }]);

  return { inline_keyboard: buttons };
}

module.exports = {
  handlePendingWithdrawals,
  handleWithdrawalDetails,
  handleWithdrawalApproval,
  handleWithdrawalRejection
};