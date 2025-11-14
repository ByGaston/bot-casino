// commands/dicebattle.js
const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

/*
 Uso: !dicebattle <cantidad> <numero(1-6)>
 Ejemplo: !dicebattle 100 4

 Lógica:
 - Si el jugador no tiene saldo suficiente -> deniega.
 - Se genera userRoll (1-6) y botRoll (1-6).
 - Si userRoll > botRoll => jugador gana (se le suma 2x bet).
 - Si userRoll < botRoll => jugador pierde (se le resta bet).
 - Si empate => no hay cambio.
 - Bonus: si el jugador adivinó exactamente el número que salió (guess === userRoll),
   además de la resolución anterior recibe un bonus extra de +bet (se suma).
*/
module.exports = {
  name: 'dicebattle',
  description: 'Tira dado contra el bot. Uso: !dicebattle <cantidad> <numero(1-6)>',
  async execute({ message, args }) {
    try {
      const userId = message.author.id;
      const bet = parseInt(args[0], 10);
      const guess = parseInt(args[1], 10);

      if (!bet || bet <= 0) return message.reply('Debes apostar una cantidad válida (>0).');
      if (!guess || guess < 1 || guess > 6) return message.reply('Debes elegir un número entre 1 y 6.');

      const userData = await getUser(userId);
      if (userData.balance < bet) return message.reply('No tienes suficiente saldo para esa apuesta.');

      // Tiradas
      const userRoll = Math.floor(Math.random() * 6) + 1;
      const botRoll = Math.floor(Math.random() * 6) + 1;

      let response = `🎲 ${message.author} apostó **${bet}** monedas y eligió el número **${guess}**.\n`;
      response += `Tiradas: ${message.author.username} -> **${userRoll}**, Bot -> **${botRoll}**.\n`;

      // Resultado básico ganar/perder/empate (pago doble al ganar)
      if (userRoll > botRoll) {
        const winAmount = bet * 2; // paga doble (ganancia)
        userData.balance += winAmount;
        response += `🎉 ¡Has ganado la batalla! (+${winAmount} monedas)\n`;
      } else if (userRoll < botRoll) {
        userData.balance -= bet;
        response += `😢 Has perdido la batalla. (-${bet} monedas)\n`;
      } else {
        response += `🤝 Empate. No hay cambios en tu saldo.\n`;
      }

      // Bonus por adivinar exactamente el número que salió
      if (guess === userRoll) {
        const bonus = bet; // premio extra
        userData.balance += bonus;
        response += `💥 ¡Bono por adivinar exactamente el número (${guess})! +${bonus} monedas extra.\n`;
      }

      response += `💰 Nuevo balance de ${message.author.username}: ${userData.balance} monedas.`;

      await saveUser(userId, userData);
      await message.reply(response);
    } catch (err) {
      console.error('Error en dicebattle:', err);
      message.reply('Ocurrió un error con dicebattle.');
    }
  }
};
