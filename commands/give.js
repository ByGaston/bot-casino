// commands/give.js
const { getUser, saveUser } = require('../utils/economy');
const { isAdminMessage } = require('../utils/permissions');

module.exports = {
  name: 'give',
  description: 'ADMIN: Da monedas a un usuario: !give @user 100',
  async execute({ message, args }) {
    if (!isAdminMessage(message.member)) return message.reply('No tienes permisos para usar este comando.');
    const target = message.mentions.users.first();
    const amount = parseInt(args[1], 10);
    if (!target) return message.reply('Menciona a un usuario.');
    if (!amount || amount <= 0) return message.reply('Cantidad inválida.');

    const user = await getUser(target.id);
    user.balance += amount;
    await saveUser(target.id, user);

    message.reply(`Se han añadido ${amount} monedas a ${target.tag}. Nuevo balance: ${user.balance}`);
  }
};
