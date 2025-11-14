// index.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');


const PREFIX = process.env.PREFIX || '!';
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
console.error('No DISCORD_TOKEN en .env');
process.exit(1);
}


const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
],
partials: [Partials.Channel]
});


// simple command handler: carga todos los archivos .js de /commands
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of files) {
const cmd = require(path.join(commandsPath, file));
if (cmd.name) client.commands.set(cmd.name, cmd);
}
}


client.once('ready', () => {
console.log(`Bot listo: ${client.user.tag}`);
client.user.setActivity(`${PREFIX}help | Casino`, { type: 'PLAYING' });
});


client.on('messageCreate', async message => {
if (message.author.bot) return;
if (!message.content.startsWith(PREFIX)) return;


const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
const commandName = args.shift().toLowerCase();
const command = client.commands.get(commandName);
if (!command) return;


try {
await command.execute({ client, message, args });
} catch (err) {
console.error('Error ejecutando comando', err);
message.reply('Error al ejecutar el comando.');
}
});


// seguridad básica: salva datos cada X segundos (por si acaso)
setInterval(() => {
// si quieres implementar backup periódico, lo puedes añadir aquí
}, 1000 * 60 * 5);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  switch (commandName) {
    case 'ping':
      await interaction.reply('🏓 Pong!');
      break;

    case 'balance': {
      const { getUser } = require('./utils/economy');
      const user = await getUser(interaction.user.id);
      await interaction.reply(`Tu balance: ${user.balance} monedas.`);
      break;
    }

    case 'daily': {
      const { getUser, saveUser } = require('./utils/economy');
      const user = await getUser(interaction.user.id);
      const now = Date.now();
      const oneDay = 1000 * 60 * 60 * 24;
      if (user.lastDaily && (now - user.lastDaily) < oneDay) {
        const horas = Math.floor((oneDay - (now - user.lastDaily)) / (1000 * 60 * 60));
        return interaction.reply(`Ya reclamaste hoy. Vuelve en ${horas}h.`);
      }
      const amount = 100;
      user.balance += amount;
      user.lastDaily = now;
      await saveUser(interaction.user.id, user);
      await interaction.reply(`Reclamaste ${amount} monedas. Nuevo balance: ${user.balance}`);
      break;
    }

    case 'coinflip': {
      const { getUser, saveUser } = require('./utils/economy');
      const amount = options.getInteger('cantidad');
      const choice = options.getString('eleccion').toLowerCase();
      const user = await getUser(interaction.user.id);
      if (user.balance < amount) return interaction.reply('No tienes suficiente saldo.');
      const flip = Math.random() < 0.5 ? 'cara' : 'cruz';
      let msg = `Salió **${flip}** — `;
      if (flip === choice) {
        user.balance += amount;
        msg += `¡Ganaste ${amount}!`;
      } else {
        user.balance -= amount;
        msg += `Perdiste ${amount}.`;
      }
      await saveUser(interaction.user.id, user);
      await interaction.reply(`${msg} Tu balance: ${user.balance}`);
      break;
    }

    case 'slots': {
      const { getUser, saveUser } = require('./utils/economy');
      const amount = options.getInteger('cantidad');
      const user = await getUser(interaction.user.id);
      if (user.balance < amount) return interaction.reply('No tienes suficiente saldo.');

      user.balance -= amount;
      const symbols = ['🍒','🍋','🔔','⭐','🍀'];
      const resultado = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
      const [a,b,c] = resultado;
      let winnings = 0;
      let reply = `| ${resultado.join(' | ')} |\\n`;

      if (a === b && b === c) winnings = amount * 5;
      else if (a === b || b === c || a === c) winnings = amount * 2;

      user.balance += winnings;
      reply += winnings > 0
        ? `Has ganado ${winnings} monedas.`
        : `No hubo suerte. Perdiste ${amount} monedas.`;
      await saveUser(interaction.user.id, user);
      await interaction.reply(reply);
      break;
    }

    default:
      await interaction.reply('Comando no reconocido.');
  }
});

client.login(TOKEN);