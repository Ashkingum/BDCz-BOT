function formatModRightsMenu(commands, selectedMod = null) {
  const keyboard = [];
  const itemsPerRow = 2;

  // Create command toggle buttons
  for (let i = 0; i < commands.length; i += itemsPerRow) {
    const row = commands.slice(i, i + itemsPerRow).map(command => ({
      text: `${command.text} [${selectedMod ? 'Mod' : 'Admin'}]`,
      callback_data: `toggle_${command.callback}_${selectedMod || ''}`
    }));
    keyboard.push(row);
  }

  // Add navigation buttons
  keyboard.push([
    { text: '←', callback_data: 'mod_rights_prev' },
    { text: 'Cancel', callback_data: 'return_menu' },
    { text: '→', callback_data: 'mod_rights_next' }
  ]);

  return { inline_keyboard: keyboard };
}

module.exports = { formatModRightsMenu };