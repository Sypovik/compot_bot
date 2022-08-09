
process.env.NTBA_FIX_319 = 1;
import TelegramApi from 'node-telegram-bot-api';
import 'dotenv/config'
import TicTac from './ticTac1pleer.js';
import { dataUpdateUser, read, write } from './data/dataIO.js';
import TicTac2pleer, { callback_data_object, startTicTac2pleer } from './ticTac2pleer.js';
import { connection } from './connection.js';
import { test } from './test.js';

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = async () => {
    let ticTac = {};
    let ticTac2pleer = { condition: false };
    try {
        bot.setMyCommands([
            { command: '/game_1pleer', description: "крестики-нолики" },
            { command: '/game_2pleer', description: "крестики нолики на 2-их" },
            { command: '/test', description: "test" }

        ]);

        bot.on('callback_query', async msg => {
            const data = msg.data;
            const userId = msg.from.id;
            const chatId = msg.message.chat.id;
            // bot.sendMessage(chatId, data)
            if (data.startsWith('ticTac')) {
                if (ticTac[chatId]) {
                    ticTac[chatId].chatId = chatId;
                    await ticTac[chatId].step(data);
                } else {
                    bot.sendMessage(chatId, "начните игру \n/game")
                }
            }

            if (data.startsWith('2pleerTicTac')) {
                const dataObject = callback_data_object(data);
                // console.log(dataObject);
                if (dataObject.idRoom == chatId) {
                    const room = ticTac2pleer[chatId];
                    if (room?.pleer1?.id_user == userId || room?.pleer2?.id_user == userId) {
                        userId == room.step_pleer
                            ? await ticTac2pleer[dataObject.idRoom].step(dataObject)
                            : await bot.sendMessage(chatId, "ходит игрок "+ room.step_pleer)
                    } else {
                        await bot.sendMessage(chatId, "начните игру \n/game_2pleer")
                    }
                }
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
            if (text == '/game_2pleer' || text == `/game_2pleer@${nameBot}`) {

                await startTicTac2pleer(bot, msg, ticTac2pleer);

            }

            if (text == '/test' || text == `/test@${nameBot}`) {
                test(bot,chatId);
            }

        });
    } catch (err) {
        console.log(err);
    }

}

start();