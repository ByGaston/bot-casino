// deploy-commands.js
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.log('❌ Falta TOKEN, CLIENT_ID o GUILD_ID en tu archivo .env');
  process.exit(1);
}

// 🎮 Lista de comandos Slash
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde con pong!'),

  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Muestra tu balance actual'),

  new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Reclama tu recompensa diaria'),

  new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Juega cara o cruz')
    .addStringOption(opt =>
      opt.setName('eleccion')
        .setDescription('cara o cruz')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a apostar')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Juega a las tragamonedas')
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a apostar')
        .setRequired(true)),

  // 🎲 Ruleta
  new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Juega a la ruleta (0-36, red, black, even, odd)')
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a apostar')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('apuesta')
        .setDescription('Número o color')
        .setRequired(true)),

  // ♠️ Blackjack
  new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Juega al blackjack instantáneo')
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a apostar')
        .setRequired(true)),

  // 💸 Transferir monedas
  new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfiere monedas a otro usuario')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('A quién quieres enviar')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a transferir')
        .setRequired(true)),

  // 🧑‍💼 Comandos ADMIN
  new SlashCommandBuilder()
    .setName('give')
    .setDescription('ADMIN: Dar monedas a un usuario')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a modificar')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a añadir')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('removecoins')
    .setDescription('ADMIN: Quitar monedas a un usuario')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a modificar')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('cantidad')
        .setDescription('Cantidad a quitar')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('sayembed')
    .setDescription('ADMIN: Envía un embed con título y descripción')
    .addStringOption(opt =>
      opt.setName('titulo')
        .setDescription('Título del embed')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('descripcion')
        .setDescription('Descripción del embed')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando slash commands en el servidor...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Todos los comandos / registrados correctamente.');
  } catch (err) {
    console.error('❌ Error al registrar comandos:', err);
  }
})();
