let lastNumber = 0;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateAccountNumber() {
  lastNumber++;
  
  const numeric = String(lastNumber % 10000).padStart(4, '0');
  const letterIndex = Math.floor(lastNumber / 10000);
  
  const first = LETTERS[Math.floor(letterIndex / (26 * 26)) % 26];
  const second = LETTERS[Math.floor(letterIndex / 26) % 26];
  const third = LETTERS[letterIndex % 26];
  
  return `N°BDCz_${first}${second}${third}${numeric}`;
}

module.exports = { generateAccountNumber };