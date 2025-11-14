// commands/balance.js
const { getUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

module.exports = {
  name: 'balance',
  description: 'Muestra tu balance actual de monedas.',
  async execute({ message }) {
    try {
      const userId = message.author.id;
      const userData = await getUser(userId);

      const balance = userData.balance || 0;
      const formatted = formatCoins(balance);

      await message.reply(`💰 ${message.author}, tienes **${formatted}** monedas.`);
    } catch (error) {
      console.error('Error en balance.js:', error);
      await message.reply('❌ Ocurrió un error al consultar tu balance.');
    }
  },
};
