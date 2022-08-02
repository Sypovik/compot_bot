
process.env.NTBA_FIX_319 = 1;
import TelegramApi from 'node-telegram-bot-api';
import 'dotenv/config'
import TicTac from './ticTac1pleer.js';

const bot = new TelegramApi(process.env.TOKEN, { polling: true });
let ticTac;

const start = async () => {
    // let ticTac = new TicTac;
    try {
        bot.setMyCommands([
            { command: '/game', description: "крестики-нолики" }

        ]);

        bot.on('callback_query', async msg => {
            const data = msg.data;
            if (data.startsWith('ticTac')) {
                ticTac.chatId = msg.message.chat.id;

                await ticTac?.step(data);
            }

        })

        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;
            const nameBot = (await bot.getMe()).username;
            if (text == '/game' || text == `/game@${nameBot}`) {
                ticTac = new TicTac(bot, msg, chatId);
                ticTac.start();
                return;
            }
        });
    } catch (err) {
        console.log(err);
    }

}

start();