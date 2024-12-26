const VoucherService = require('../../services/voucherService');
const { channels } = require('../../config/channels');
const { formatBatchVoucherMenu } = require('../../utils/admin/voucherFormatter');

const voucherService = new VoucherService();

async function handleBatchVoucherMenu(bot, msg) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId,
    'Generate batch vouchers for distribution:',
    {
      reply_markup: formatBatchVoucherMenu()
    }
  );
}

async function handleBatchVoucherGeneration(bot, query) {
  const [_, type, amount, quantity] = query.data.split('_');
  const chatId = query.message.chat.id;

  try {
    // Send status message
    const statusMsg = await bot.sendMessage(chatId, 'Generating and distributing vouchers...');
    
    let successCount = 0;
    let errorCount = 0;

    // Generate and distribute vouchers
    for (const channel of channels) {
      try {
        const voucher = type === 'free' 
          ? await voucherService.generateFreeVoucher()
          : await voucherService.generateGiftVoucher(parseFloat(amount));

        await bot.sendMessage(`@${channel}`, 
          `🎟 New ${type} voucher available!\nCode: ${voucher.code}`
        );
        
        successCount++;
        
        // Update status every 10 channels
        if (successCount % 10 === 0) {
          await bot.editMessageText(
            `Distributing... ${successCount}/${channels.length} channels completed`,
            {
              chat_id: chatId,
              message_id: statusMsg.message_id
            }
          );
        }
      } catch (error) {
        console.error(`Failed to distribute to ${channel}:`, error);
        errorCount++;
      }
    }

    // Send final status
    await bot.editMessageText(
      `Batch distribution completed!\n✅ Sent to: ${successCount} channels\n❌ Failed: ${errorCount} channels`,
      {
        chat_id: chatId,
        message_id: statusMsg.message_id
      }
    );
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to generate batch vouchers.');
  }
}

module.exports = {
  handleBatchVoucherMenu,
  handleBatchVoucherGeneration
};