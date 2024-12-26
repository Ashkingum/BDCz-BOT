const ModService = require('../../services/modService');
const { isAdmin } = require('../../utils/adminUtils');
const { formatModeratorList } = require('../../utils/admin/modFormatter');

const modService = new ModService();

async function handleModsMenu(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  await bot.sendMessage(chatId, 
    'Moderator Management:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '➕ Add Mod', callback_data: 'add_mod' },
            { text: '➖ Remove Mod', callback_data: 'remove_mod' }
          ],
          [{ text: '📋 List Mods', callback_data: 'list_mods' }],
          [{ text: '🔙 Return to Menu', callback_data: 'return_menu' }]
        ]
      }
    }
  );
}

async function handleAddModRequest(bot, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, 'Type or paste a username:');
}

async function handleAddModUsername(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.text.replace('@', '');

  try {
    if (modService.isModerator(username)) {
      await bot.sendMessage(chatId, 'This user is already a moderator.');
      return;
    }

    await bot.sendMessage(chatId,
      `Confirm adding ${username} as moderator?`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Confirm', callback_data: `confirm_add_mod_${username}` },
            { text: 'Cancel', callback_data: 'mods_menu' }
          ]]
        }
      }
    );
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to process moderator addition.');
  }
}

async function handleModInviteConfirmation(bot, query) {
  const chatId = query.message.chat.id;
  const username = query.data.split('_')[3];

  try {
    await modService.addModerator(username);
    
    // Send invitation to user
    await bot.sendMessage(username,
      'You have been selected to become a moderator for Billion Dollar CodeZ. Do you accept?',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Yes', callback_data: `accept_mod_invite` },
            { text: 'No', callback_data: `decline_mod_invite` }
          ]]
        }
      }
    );

    await bot.sendMessage(chatId, `Invitation sent to ${username}.`);
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to send moderator invitation.');
  }
}

async function handleModInviteResponse(bot, query, accepted) {
  const username = query.from.username;
  const chatId = query.message.chat.id;

  try {
    if (accepted) {
      await modService.acceptInvite(username);
      await bot.sendMessage(chatId, 'Congratulations 🎊 You are now a moderator.');
      // Notify admin
      await notifyAdmins(bot, `${username} is now a moderator.`);
    } else {
      await modService.declineInvite(username);
      // Notify admin
      await notifyAdmins(bot, `${username} declined the moderator invitation.`);
    }
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to process invitation response.');
  }
}

async function handleRemoveModRequest(bot, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, 'Type or paste a username:');
}

async function handleRemoveModUsername(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.text.replace('@', '');

  try {
    if (!modService.isModerator(username)) {
      await bot.sendMessage(chatId, 'Sorry, this user is not yet a moderator.');
      return;
    }

    await bot.sendMessage(chatId,
      `Confirm removing ${username} as moderator?`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Confirm', callback_data: `confirm_remove_mod_${username}` },
            { text: 'Cancel', callback_data: 'mods_menu' }
          ]]
        }
      }
    );
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to process moderator removal.');
  }
}

async function handleModRemovalConfirmation(bot, query) {
  const chatId = query.message.chat.id;
  const username = query.data.split('_')[3];

  try {
    await modService.removeModerator(username);
    
    // Notify removed moderator
    await bot.sendMessage(username, 'You have been demoted from your moderator status.');
    
    // Notify admin
    await bot.sendMessage(chatId, `${username} is no longer a moderator.`);
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to remove moderator.');
  }
}

async function handleListMods(bot, msg) {
  const chatId = msg.chat.id;
  const moderators = modService.getModeratorList();
  
  await bot.sendMessage(chatId,
    formatModeratorList(moderators),
    { parse_mode: 'Markdown' }
  );
}

async function notifyAdmins(bot, message) {
  const admins = modService.getModeratorList();
  for (const admin of admins) {
    try {
      await bot.sendMessage(admin, message);
    } catch (error) {
      console.error(`Failed to notify admin ${admin}:`, error);
    }
  }
}

module.exports = {
  handleModsMenu,
  handleAddModRequest,
  handleAddModUsername,
  handleModInviteConfirmation,
  handleModInviteResponse,
  handleRemoveModRequest,
  handleRemoveModUsername,
  handleModRemovalConfirmation,
  handleListMods
};