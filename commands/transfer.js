// commands/transfer.js
const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

module.exports = {
  name: 'transfer',
  description: '💸 Transfiere monedas a otro usuario. Uso: !transfer @usuario cantidad',
  async execute({ message, args }) {
    try {
      if (!message.guild)
        return message.reply('❌ Este comando solo funciona dentro de un servidor.');

      const target = message.mentions.users.first();
      const amount = parseInt(args[1], 10);

      if (!target)
        return message.reply('👤 Debes mencionar a un usuario. Ejemplo: `!transfer @Juan 100`.');
      if (!amount || isNaN(amount) || amount <= 0)
        return message.reply('💵 Cantidad inválida. Usa un número positivo.');

      // 🚫 Evita que alguien se transfiera a sí mismo
      if (target.id === message.author.id)
        return message.reply('❌ No puedes transferirte monedas a ti mismo, tramposillo 😏.');

      // Cargar datos
      const sender = await getUser(message.author.id);
      const receiver = await getUser(target.id);

      // Verificar saldo suficiente
      if (sender.balance < amount)
        return message.reply(`💸 No tienes suficiente saldo. Tu balance actual: **${formatCoins(sender.balance)}** monedas.`);

      // Ejecutar transferencia
      sender.balance -= amount;
      receiver.balance += amount;

      // Guardar cambios
      await saveUser(message.author.id, sender);
      await saveUser(target.id, receiver);

      // Mensaje de confirmación
      const formattedAmount = formatCoins(amount);
      const formattedSender = formatCoins(sender.balance);
      const formattedReceiver = formatCoins(receiver.balance);

      await message.reply(
        `✅ **Transferencia completada**\n` +
        `👤 **${message.author.username}** → 💰 **${target.username}**\n` +
        `📦 Enviados: **${formattedAmount} monedas**\n\n` +
        `💳 Tu nuevo balance: **${formattedSender}**\n` +
        `💰 Balance de ${target.username}: **${formattedReceiver}**`
      );
    } catch (err) {
      console.error('Error en transfer.js:', err);
      await message.reply('⚠️ Ocurrió un error al procesar la transferencia.');
    }
  }
};
