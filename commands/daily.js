const { getUser, saveUser } = require('../utils/economy');


module.exports = {
name: 'daily',
description: 'Reclama tu bonificación diaria',
async execute({ message }) {
const user = await getUser(message.author.id);
const now = Date.now();
const oneDay = 1000 * 60 * 60 * 24;
if (user.lastDaily && (now - user.lastDaily) < oneDay) {
const remaining = oneDay - (now - user.lastDaily);
const horas = Math.floor(remaining / (1000 * 60 * 60));
return message.reply(`Ya reclamaste hoy. Vuelve en ${horas}h aprox.`);
}
const amount = 100; // amount diario
user.balance += amount;
user.lastDaily = now;
await saveUser(message.author.id, user);
message.reply(`Has recibido ${amount} monedas. Nuevo balance: ${user.balance}`);
}
};