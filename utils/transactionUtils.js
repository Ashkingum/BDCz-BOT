const crypto = require('crypto');

function generateTxnId() {
  const prefix = 'bdcz';
  const randomPart = crypto.randomBytes(5)
    .toString('hex')
    .toLowerCase();
  return `${prefix}${randomPart}`;
}

module.exports = { generateTxnId };