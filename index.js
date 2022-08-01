
process.env.NTBA_FIX_319 = 1;
import TelegramApi from 'node-telegram-bot-api';
import Game from './game/game.js';
import 'dotenv/config'

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

let checkWin = async (chatId, game) => {
    let flag = true;
    try {
        switch (game.check()) {
            case 'user':
                await bot.sendMessage(chatId, `вы победили\n${game.graphics_string()}\n/game`);
                break;
            case 'bot':
                await bot.sendMessage(chatId, `вы проиграли\n${game.graphics_string()}\n/game`);
                break;
            case 'draw':
                await bot.sendMessage(chatId, `Ничья\n${game.graphics_string()}\n/game`);
                break;
            case false:
                flag = false;
                break;
        }

        return flag;
    } catch (err) {
        console.log(err);
    }
}

const outputPlot = async (chatId, game, text) => {
    const gameOptions = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: game.plot_graphics[0][0], callback_data: 'ticTac 0 0' },
                    { text: game.plot_graphics[0][1], callback_data: 'ticTac 0 1' },
                    { text: game.plot_graphics[0][2], callback_data: 'ticTac 0 2' },
                ],
                [
                    { text: game.plot_graphics[1][0], callback_data: 'ticTac 1 0' },
                    { text: game.plot_graphics[1][1], callback_data: 'ticTac 1 1' },
                    { text: game.plot_graphics[1][2], callback_data: 'ticTac 1 2' },
                ],
                [
                    { text: game.plot_graphics[2][0], callback_data: 'ticTac 2 0' },
                    { text: game.plot_graphics[2][1], callback_data: 'ticTac 2 1' },
                    { text: game.plot_graphics[2][2], callback_data: 'ticTac 2 2' },
                ],
            ]
        }),
        parse_mode: 'HTML',
    }
    try {
        await bot.sendMessage(chatId, text, gameOptions);
    } catch (err) {
        console.log(err);
    }

}

const ticTac = async (chatId, data, game) => {
    const i = Number(data[7]);
    const j = Number(data[9]);
    try {
        if (game.userStep(i, j)) {
            await outputPlot(chatId, game, "занято");
            return;
        }
        if (await checkWin(chatId, game)) {
            game.plot = game.zero2d(3, 3);
            game.plot_user = game.zero2d(3, 3);
            game.plot_bot = game.zero2d(3, 3);
            return;
        }
        
        game.botStep();
        if (await checkWin(chatId, game)) {
            game.plot = game.zero2d(3, 3);
            return;
        }
        await outputPlot(chatId, game, "ходите О");
    } catch (err) {
        console.log(err);
    }

}

const start = async () => {
    let game = new Game;
    try {
        bot.setMyCommands([
            { command: '/game', description: "крестики-нолики" }

        ]);

        bot.on('callback_query', async msg => {
            const data = msg.data;
            const chatId = msg.message.chat.id;
            if (data.startsWith('ticTac')) {
                ticTac(chatId, data, game);
            }

        })

        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;

            if (text == '/game') {
                game = new Game;
                game.botStep();
                await outputPlot(chatId, game, "Ходите O");
                return;
            }
        });
    } catch (err) {
        console.log(err);
    }

}

start();