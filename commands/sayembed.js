// commands/saytext.js
const { isAdminMessage } = require('../utils/permissions');

module.exports = {
  name: 'saytext',
  description: 'ADMIN: Envía texto en canal y borra el comando. Uso: !saytext texto aquí',
  async execute({ client, message, args }) {
    try {
      if (!isAdminMessage(message.member)) return message.reply('No tienes permisos para usar este comando.');

      const texto = args.join(' ').trim();
      if (!texto) return message.reply('Escribe el texto a enviar: !saytext Hola mundo');

      // intenta borrar el comando del autor para dejar el canal limpio
      await message.delete().catch(() => {});

      // envía el texto en el canal
      await message.channel.send(texto);
    } catch (err) {
      console.error('Error en saytext:', err);
      message.reply('Ocurrió un error al enviar el mensaje.');
    }
  }
};
