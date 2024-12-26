function formatReferralList(referrals) {
  return referrals.map(ref => 
    `${ref.name} - @${ref.username} - ref. reward "$${ref.isPremium ? '1' : '0.1'}"`
  ).join('\n');
}

function formatReferralMessage(referrals, referralLink) {
  return `*Your Referrals*\n\n` +
    `Current number of referrals: ${referrals.length}/10\n\n` +
    (referrals.length > 0 ? formatReferralList(referrals) + '\n\n' : '') +
    `Share your referral link:\n${referralLink}`;
}

module.exports = {
  formatReferralList,
  formatReferralMessage
};