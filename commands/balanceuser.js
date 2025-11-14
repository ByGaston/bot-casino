// commands/balanceuser.js
const { getUser } = require('../utils/economy');

module.exports = {
  name: 'balanceuser',
  description: 'Muestra el balance de otro usuario mencionado o el tuyo.',
  async execute({ client, message, args }) {
    try {
      const mentioned = message.mentions.users.first() || message.author;
      const userId = mentioned.id;

      const userData = await getUser(userId); // usa la función que ya existe
      const balance = (userData && typeof userData.balance === 'number') ? userData.balance : 0;

      await message.channel.send(`${mentioned} tiene ${balance} monedas.`);
      await message.delete().catch(() => {});
    } catch (err) {
      console.error('Error en balanceuser:', err);
      message.reply('Ocurrió un error al obtener el balance.');
    }
  }
};
