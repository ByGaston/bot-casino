// commands/roulette.js
const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

module.exports = {
  name: 'roulette',
  description: '🎡 Juega a la ruleta (rojo, negro o verde) con resultado instantáneo.',
  async execute({ client, message, args }) {
    try {
      const userId = message.author.id;
      const betAmount = parseInt(args[0]);
      const choice = args[1]?.toLowerCase();

      // ⚙️ Validaciones básicas
      if (!betAmount || betAmount <= 0)
        return message.reply('💵 Debes apostar una cantidad válida.');
      if (!['rojo', 'negro', 'verde'].includes(choice))
        return message.reply('🎯 Debes apostar a **rojo**, **negro** o **verde** (ejemplo: `!roulette 100 rojo`).');

      const userData = await getUser(userId);
      if (userData.balance < betAmount)
        return message.reply('❌ No tienes suficiente saldo para apostar.');

// ⚖️ Probabilidades más naturales y variadas
// Esto genera un resultado aleatorio pero balanceado
const outcomes = ['rojo', 'negro', 'verde'];

// Aumentamos la frecuencia base de rojo y negro (como en una ruleta real)
const weights = {
  rojo: 0.45,   // 45%
  negro: 0.45,  // 45%
  verde: 0.10   // 10%
};

// Generamos un número aleatorio y lo comparamos con los pesos
const random = Math.random();
let cumulative = 0;
for (const color of outcomes) {
  cumulative += weights[color];
  if (random <= cumulative) {
    result = color;
    break;
  }
}

// 🌀 Pequeño ajuste: si el mismo color salió 3 veces seguidas, fuerza variedad
if (!client.lastRouletteResult) client.lastRouletteResult = { color: null, streak: 0 };

if (client.lastRouletteResult.color === result) {
  client.lastRouletteResult.streak++;
  if (client.lastRouletteResult.streak >= 3) {
    // Cambia el color aleatoriamente para romper la racha
    const otherColors = outcomes.filter(c => c !== result);
    result = otherColors[Math.floor(Math.random() * otherColors.length)];
    client.lastRouletteResult.streak = 0;
  }
} else {
  client.lastRouletteResult.color = result;
  client.lastRouletteResult.streak = 1;
}

      // 🎯 Resultado instantáneo
      let winnings = 0;
      let resultText;
      const colorEmoji = result === 'rojo' ? '🔴' : result === 'negro' ? '⚫' : '🟢';

      if (choice === result) {
        winnings = result === 'verde' ? betAmount * 14 : betAmount * 2;
        userData.balance += winnings;
        resultText = `🎉 ¡Has ganado **${formatCoins(winnings)}** monedas!`;
      } else {
        userData.balance -= betAmount;
        resultText = `💀 Has perdido **${formatCoins(betAmount)}** monedas.`;
      }

      await saveUser(userId, userData);

      // 💬 Mensaje final
      await message.reply(
        `🎡 **${message.author.username}** apostó **${formatCoins(betAmount)}** monedas al **${choice.toUpperCase()}**.\n` +
        `🎯 La ruleta cayó en ${colorEmoji} **${result.toUpperCase()}**.\n${resultText}\n\n` +
        `💰 Tu nuevo balance: **${formatCoins(userData.balance)}** monedas.`
      );
    } catch (err) {
      console.error('Error en roulette.js:', err);
      await message.reply('⚠️ Ocurrió un error al ejecutar el comando.');
    }
  }
};
