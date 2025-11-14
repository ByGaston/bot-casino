module.exports = {
name: 'ping',
description: 'Comprueba si el bot responde',
async execute({ message }) {
const m = await message.reply('Ping...');
m.edit(`Pong! Latencia: ${m.createdTimestamp - message.createdTimestamp}ms`);
}
};