// commands/blackjack.js
const { getUser, saveUser } = require('../utils/economy');
const { formatCoins } = require('../utils/format');

function drawCard() {
  const deck = [
    'A','2','3','4','5','6','7','8','9','10','J','Q','K'
  ];
  return deck[Math.floor(Math.random() * deck.length)];
}

function valueOfCard(c) {
  if (c === 'A') return 11;
  if (['J','Q','K'].includes(c)) return 10;
  return parseInt(c, 10);
}

function total(cards) {
  let sum = cards.reduce((s, c) => s + valueOfCard(c), 0);
  // ajustar Ases de 11 a 1 mientras >21
  let aces = cards.filter(c => c === 'A').length;
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces -= 1;
  }
  return sum;
}

module.exports = {
  name: 'blackjack',
  description: 'Blackjack rápido: !blackjack <cantidad> (versión instantánea)',
  async execute({ message, args }) {
    const amount = parseInt(args[0], 10);
    if (!amount || amount <= 0) return message.reply('Cantidad inválida.');
    const user = await getUser(message.author.id);
    if (user.balance < amount) return message.reply('No tienes suficiente saldo.');

    user.balance -= amount;

    // jugador
    const playerCards = [drawCard(), drawCard()];
    let playerTotal = total(playerCards);

    // banca: revelará cartas y juega automáticamente
    const dealerCards = [drawCard(), drawCard()];
    let dealerTotal = total(dealerCards);
    while (dealerTotal < 17) {
      dealerCards.push(drawCard());
      dealerTotal = total(dealerCards);
    }

    let resultText = `Tus cartas: ${playerCards.join(', ')} (Total: ${playerTotal})\n`;
    resultText += `Banca: ${dealerCards.join(', ')} (Total: ${dealerTotal})\n`;

    let winnings = 0;
    if (playerTotal > 21) {
      resultText += `Te has pasado. Pierdes ${amount} monedas.`;
    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
      winnings = amount * 2; // gana 2x
      resultText += `¡Ganaste ${winnings} monedas!`;
    } else if (playerTotal === dealerTotal) {
      winnings = amount; // devuelve
      resultText += `Empate. Recuperas ${amount} monedas.`;
    } else {
      resultText += `Pierdes ${amount} monedas.`;
    }

    user.balance += winnings;
    await saveUser(message.author.id, user);

    resultText += ` Balance: ${user.balance}`;
    message.reply(resultText);
  }
};
