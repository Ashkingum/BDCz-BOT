const { isAdmin } = require('../../utils/adminUtils');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');
const VoucherControlService = require('../../services/admin/voucherControlService');

const voucherControlService = new VoucherControlService();

async function handleVoucherControl(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  const isVouchersStopped = voucherControlService.isVouchersStopped();
  const message = isVouchersStopped
    ? 'This command resumes future BDCz personal voucher generation immediately.'
    : 'This command stops all future personal free voucher generation and displays an error message to users who attempt.';

  const keyboard = isVouchersStopped
    ? {
        inline_keyboard: [[
          { text: 'YES', callback_data: 'resume_vouchers' },
          { text: 'NO', callback_data: 'cancel_voucher_control' }
        ]]
      }
    : formatPeriodicKeyboard('front');

  await bot.sendMessage(chatId, message, { reply_markup: keyboard });
}

async function handleVoucherControlCallbacks(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  if (!isAdmin(userId)) {
    await bot.answerCallbackQuery(query.id, {
      text: '⛔ Unauthorized access',
      show_alert: true
    });
    return;
  }

  try {
    switch (query.data) {
      case 'resume_vouchers':
        await voucherControlService.resumeVouchers();
        await bot.sendMessage(chatId, 'Voucher generation resumed successfully.');
        break;

      case 'cancel_voucher_control':
        await bot.deleteMessage(chatId, query.message.message_id);
        break;

      default:
        if (query.data.startsWith('period_')) {
          const period = query.data.split('_')[1];
          await handleStopConfirmation(bot, query, period);
        } else if (query.data.startsWith('confirm_stop_vouchers_')) {
          const period = query.data.split('_')[3];
          await voucherControlService.stopVouchers(period);
          await bot.sendMessage(chatId, `Voucher generation stopped for ${period}.`);
        }
    }
  } catch (error) {
    console.error('Error handling voucher control callback:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}

async function handleStopConfirmation(bot, query, period) {
  const chatId = query.message.chat.id;
  
  await bot.sendMessage(
    chatId,
    `Do you confirm stopping voucher generation for ${period}?`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `confirm_stop_vouchers_${period}` },
          { text: 'NO', callback_data: 'cancel_voucher_control' }
        ]]
      }
    }
  );
}

module.exports = {
  handleVoucherControl,
  handleVoucherControlCallbacks
};