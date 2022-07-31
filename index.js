process.env.NTBA_FIX_319 = 1;

import TelegramApi from 'node-telegram-bot-api';

// replace the value below with the Telegram token you receive from @BotFather
const token = '5382301897:AAEG5XJxVSH1G7IZjRkBA6AxrEd1NSlH9T8';

// Create a bot that uses 'polling' to fetch new updates
 const bot = new TelegramApi(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
