
process.env.NTBA_FIX_319 = 1;
import TelegramApi from 'node-telegram-bot-api';
import 'dotenv/config'
import TicTac from './ticTac1pleer.js';
import { dataUpdateUser, read, write } from './data/dataIO.js';
import { callback_data_object, startTicTac2pleer_chat_mode, startTicTac2pleer_user_mode } from './ticTac2pleer.js';
import { connection } from './connection.js';
import { test } from './test.js';

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = async () => {
    let ticTac = {};
    let ticTac2pleer = { condition: false };
    try {
        bot.setMyCommands([
            { command: '/game_1pleer', description: "крестики-нолики" },
            { command: '/game_2pleer_chat', description: "крестики нолики на 2-их в общем чате" },
            { command: '/game_2pleer_online', description: "крестики нолики на 2-их, подсоединение по id" },

            { command: '/test', description: "test" }

        ]);

        bot.on('callback_query', async msg => {
            const data = msg.data;
            const userId = msg.from.id;
            const chatId = msg.message.chat.id;

            if (data.startsWith('game_1pleer')) {
                if (ticTac[chatId]) {
                    ticTac[chatId].chatId = chatId;
                    await ticTac[chatId].step(data);
                } else {
                    bot.sendMessage(chatId, "начните игру \n/game")
                }
                return;
            }

            if (data.startsWith('2pleerTicTacChat')) {
                ticTac2pleer[chatId]
                    ? await ticTac2pleer[chatId].step_mode_chat(userId, data)
                    : await bot.sendMessage(chatId, "начните игру \n/game_2pleer_chat")
                return;
            }

            if (data.startsWith('2pleerTicTacOnline')) {

                const dataObject = callback_data_object(data);
                console.log(data,dataObject);
                (dataObject.pleer1_id == userId || dataObject.pleer2_id == userId)
                    ? await ticTac2pleer[dataObject.pleer1_id]?.step_mode_user(userId, dataObject)
                    : await bot.sendMessage(chatId, "начните игру \n/game_2pleer_online")
                return;
            }

        })

        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;
            const userId = msg.from.id;
            const nameBot = (await bot.getMe()).username;

            if (text == '/game_1pleer' || text == `/game_1pleer@${nameBot}`) {
                ticTac[chatId] = new TicTac(bot, msg.from, chatId);
                ticTac[chatId].start();
                return;
            }

            if (text == '/game_2pleer_chat' || text == `/game_2pleer_chat@${nameBot}`) {
                await startTicTac2pleer_chat_mode(bot, msg, ticTac2pleer);
                return;
            }

            if (text == '/game_2pleer_online' || text == `/game_2pleer_online@${nameBot}`) {
                await startTicTac2pleer_user_mode(bot, msg, ticTac2pleer);
                return;
            }

            if (text == '/test' || text == `/test@${nameBot}`) {
                test(bot, chatId);
            }

        });
    } catch (err) {
        console.log(err);
    }

}

start();