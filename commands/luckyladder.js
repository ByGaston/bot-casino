// commands/luckyladder.js
const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

/*
Uso: !luckyladder <cantidad>

Lógica:
- El jugador apuesta una cantidad.
- A medida que sube escalones, la probabilidad de seguir subiendo baja.
- Cada escalón da una ganancia parcial (40% a 80% de la apuesta).
- Si no sube ni uno, pierde toda la apuesta.
- Si gana algo, obtiene la suma de los escalones + la apuesta original.
*/

module.exports = {
  name: 'luckyladder',
  description: 'Sube la escalera de la suerte, pero cuidado: cada paso es más difícil.',
  async execute({ message, args }) {
    try {
      const userId = message.author.id;
      const bet = parseInt(args[0], 10);

      if (!bet || bet <= 0) {
        return message.reply('Debes apostar una cantidad válida (mayor que 0).');
      }

      const userData = await getUser(userId);
      if (userData.balance < bet) {
        return message.reply('No tienes suficiente saldo para esa apuesta.');
      }

      const maxSteps = 6;
      let steps = 0;
      let prize = 0;

      // Probabilidad base de subir el primer escalón
      let baseProb = 0.5;

      for (let i = 0; i < maxSteps; i++) {
        const threshold = baseProb - i * 0.08; // Disminuye la probabilidad con cada escalón
        const roll = Math.random();

        if (roll < Math.max(0.08, threshold)) {
          steps++;
          const add = Math.floor(bet * (0.4 + Math.random() * 0.4)); // 40% a 80% de la apuesta
          prize += add;
        } else {
          break; // Se cayó
        }
      }

      let response = `🪜 ${message.author} apostó **${bet}** monedas en la Escalera de la Suerte.\n`;

      if (steps > 0) {
        const totalWin = prize + bet; // Incluye la apuesta original
        userData.balance += totalWin;
        response += `✨ Subiste **${steps}** escalón(es) y ganaste **${totalWin}** monedas (incluye tu apuesta).`;
      } else {
        userData.balance -= bet;
        response += `💀 No subiste ni un escalón y perdiste **${bet}** monedas.`;
      }

      response += `\n💰 Nuevo balance de ${message.author.username}: ${userData.balance} monedas.`;

      await saveUser(userId, userData);
      await message.reply(response);

    } catch (error) {
      console.error('Error en luckyladder.js:', error);
      await message.reply('❌ Ocurrió un error al ejecutar el comando luckyladder.');
    }
  },
};
