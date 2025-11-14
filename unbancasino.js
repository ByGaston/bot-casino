const { removeFromBlacklist } = require('../utils/casinoGuard');
const { isAdminMessage } = require('../utils/permissions');

module.exports = {
  name: 'unbancasino',
  description: 'Desbanea a un usuario del casino.',
  async execute({ message, args }) {
    if (!isAdminMessage(message.member)) return message.reply('🚫 No tienes permisos para usar este comando.');

    const target = message.mentions.users.first();
    if (!target) return message.reply('Debes mencionar a un usuario para desbanearlo.');

    removeFromBlacklist(target.id);
    message.reply(`✅ ${target.username} ha sido desbaneado del casino.`);
  },
};
