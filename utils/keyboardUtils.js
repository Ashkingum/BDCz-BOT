const getMainKeyboard = (show = false) => ({
  keyboard: [
    ['English', 'French'],
    ['Menu', 'Help']
  ],
  resize_keyboard: true,
  persistent: false,
  one_time_keyboard: true
});

const removeKeyboard = () => ({
  remove_keyboard: true
});

module.exports = {
  getMainKeyboard,
  removeKeyboard
};