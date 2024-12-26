const path = require('path');

const VOUCHER_IMAGES = {
  welcome: path.join(__dirname, '../assets/welcome_voucher.jpg'),
  free: path.join(__dirname, '../assets/free_voucher.jpg'),
  gift: {
    1: path.join(__dirname, '../assets/gift_voucher_1.jpg'),
    5: path.join(__dirname, '../assets/gift_voucher_5.jpg'),
    10: path.join(__dirname, '../assets/gift_voucher_10.jpg')
  }
};

module.exports = { VOUCHER_IMAGES };