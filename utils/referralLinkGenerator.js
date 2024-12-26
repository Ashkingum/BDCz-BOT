function generateReferralLink(userId) {
  return `https://t.me/BillionDollarCodeZBot?start=ref_${userId}`;
}

module.exports = {
  generateReferralLink
};