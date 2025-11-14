// commands/horserace.js
const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

module.exports = {
  name: 'horserace',
  description: 'Apuesta en una carrera de caballos. Elige entre 1, 2 o 3.',
  async execute({ message, args }) {
    const userId = message.author.id;
    const bet = parseInt(args[0]);
    const horse = parseInt(args[1]);

    if (!bet || bet <= 0) return message.reply('Debes apostar una cantidad válida.');
    if (![1, 2, 3].includes(horse)) return message.reply('Debes elegir un caballo: **1**, **2** o **3**.');
    const userData = await getUser(userId);
    if (userData.balance < bet) return message.reply('No tienes suficiente dinero.');

    const winner = Math.floor(Math.random() * 3) + 1;
    let response;

    if (horse === winner) {
      const winnings = bet * 3;
      userData.balance += winnings;
      response = `🐎 ${message.author} apostó al caballo **${horse}**...\n🥇 ¡Ganaste! Caballo ganador: **${winner}**.\nGanaste 🪙 ${winnings}`;
    } else {
      userData.balance -= bet;
      response = `🐎 ${message.author} apostó al caballo **${horse}**...\n😢 Perdiste. El caballo ganador fue **${winner}**.`;
    }

    await saveUser(userId, userData);
    await message.reply(response);
  }
};
