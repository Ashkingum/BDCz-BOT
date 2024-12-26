function formatModeratorList(moderators) {
  if (!moderators.length) {
    return '*Moderators List*\n\nNo moderators found.';
  }

  return '*Moderators List*\n\n' +
    moderators.map((mod, index) => `${index + 1}. @${mod}`).join('\n');
}

module.exports = { formatModeratorList };