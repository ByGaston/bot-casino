// commands/help.js
module.exports = {
  name: 'help',
  description: 'Muestra todos los comandos disponibles',
  async execute({ message }) {
    const helpText = `
**🎰 COMANDOS DE CASINO:**
> !roulette [apuesta] [rojo|negro|verde] - Apuesta en la ruleta
> !slots [apuesta] - Tragamonedas
> !blackjack [apuesta] - Partida rápida de Blackjack
> !dicebattle [apuesta] - Lucha de dados contra el bot
> !coinflip [apuesta] [cara|cruz] - Cara o cruz contra el bot
> !horserace [apuesta] [1|2|3] - Carrera de caballos
> !luckyladder [apuesta] - Escalera de la suerte

**💰 ECONOMÍA:**
> !balance - Tu saldo
> !balanceuser [@usuario] - Ver saldo de otro usuario
> !transfer [@usuario] [cantidad] - Transferir monedas

**🛠️ ADMIN:**
> !give [@usuario] [cantidad] - Agrega monedas a un usuario
> !removecoins [@usuario] [cantidad] - Quita monedas a un usuario

**🤖 OTROS:**
> !help - Muestra esta lista de comandos

💎 *Casino Bot - Echo por Gaston`;

    await message.reply(helpText);
  },
};
