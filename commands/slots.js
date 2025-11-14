const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');


function spin() {
const symbols = ['🍒','🍋','🔔','⭐','🍀'];
return [
symbols[Math.floor(Math.random() * symbols.length)],
symbols[Math.floor(Math.random() * symbols.length)],
symbols[Math.floor(Math.random() * symbols.length)]
];
}


module.exports = {
name: 'slots',
description: 'Juega a las slots: !slots <cantidad>',
async execute({ message, args }) {
const amount = parseInt(args[0], 10);
if (!amount || amount <= 0) return message.reply('Cantidad inválida.');
const user = await getUser(message.author.id);
if (user.balance < amount) return message.reply('No tienes suficiente saldo.');


user.balance -= amount; // apuesta
const resultado = spin();
let reply = `| ${resultado.join(' | ')} |\n`;


const [a, b, c] = resultado;
let winnings = 0;
if (a === b && b === c) {
// triple: gran premio
winnings = amount * 5; // paga 5x
reply += `¡TRIPLE! Has ganado ${winnings} monedas.`;
} else if (a === b || b === c || a === c) {
// par: premio pequeño
winnings = amount * 2;
reply += `Has conseguido un par. Ganaste ${winnings} monedas.`;
} else {
reply += `No hubo suerte. Perdiste ${amount} monedas.`;
}


user.balance += winnings;
await saveUser(message.author.id, user);
reply += ` Balance: ${user.balance}`;
message.reply(reply);
}
};