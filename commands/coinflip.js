const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');


module.exports = {
name: 'coinflip',
description: 'Apuesta a cara o cruz: !coinflip <cantidad> <cara/cruz>',
async execute({ message, args }) {
const amount = parseInt(args[0], 10);
const choice = (args[1] || '').toLowerCase();
if (!amount || amount <= 0) return message.reply('Cantidad inválida.');
if (!['cara', 'cruz', 'heads', 'tails'].includes(choice)) return message.reply('Debes elegir "cara" o "cruz".');


const user = await getUser(message.author.id);
if (user.balance < amount) return message.reply('No tienes suficiente saldo.');


const flip = Math.random() < 0.5 ? 'cara' : 'cruz';
if ((flip === 'cara' && (choice === 'cara' || choice === 'heads')) ||
(flip === 'cruz' && (choice === 'cruz' || choice === 'tails'))) {
// gana 2x (recupera + gana)
const win = amount;
user.balance += win;
await saveUser(message.author.id, user);
return message.reply(`Salió **${flip}** — ¡GANASTE! Has ganado ${win} monedas. Balance: ${user.balance}`);
} else {
user.balance -= amount;
await saveUser(message.author.id, user);
return message.reply(`Salió **${flip}** — PERDISTE ${amount} monedas. Balance: ${user.balance}`);
}
}
};