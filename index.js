
process.env.NTBA_FIX_319 = 1;
import TelegramApi from 'node-telegram-bot-api';
import Game from './game/game.js';
import 'dotenv/config'

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

let checkWin = async (chatId, game) => {
    let flag = 1;
    try {
        switch (game.check()) {
            case -1:
                game.graf();
                await bot.sendMessage(chatId, `вы победили\n${game.graf_string()}\n/game`);
                break;
            case 1:
                game.graf();
                await bot.sendMessage(chatId, `вы проиграли\n${game.graf_string()}\n/game`);
                break;
            case 0:
                flag = 0;
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
                    { text: game.grafika[0][0], callback_data: '0 0' },
                    { text: game.grafika[0][1], callback_data: '0 1' },
                    { text: game.grafika[0][2], callback_data: '0 2' },
                ],
                [
                    { text: game.grafika[1][0], callback_data: '1 0' },
                    { text: game.grafika[1][1], callback_data: '1 1' },
                    { text: game.grafika[1][2], callback_data: '1 2' },
                ],
                [
                    { text: game.grafika[2][0], callback_data: '2 0' },
                    { text: game.grafika[2][1], callback_data: '2 1' },
                    { text: game.grafika[2][2], callback_data: '2 2' },
                ],
            ]
        })
    }
    game.graf();
    await bot.sendMessage(chatId, text, gameOptions);
}

const start = () => {
    let game = new Game;

    bot.setMyCommands([
        { command: '/game', description: "крестики-нолики" }

    ]);

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const i = Number(data[0]);
        const j = Number(data[2]);

        if (game.userTry(i, j)) {
            await outputPlot(chatId, game, "занято");
            return;
        }
        if (await checkWin(chatId, game) == 1) {
            game.plot = game.zero2d(3, 3);
            return;
        }
        game.botTry();

        if (await checkWin(chatId, game) == 1) {
            game.plot = game.zero2d(3, 3);
            return;
        }
        if (game.checkDraw()) {
            game.graf();
            await bot.sendMessage(chatId, `Ничья\n${game.graf_string()}\n/game`);
            game.plot = game.zero2d(3, 3);
            return;
        }
        game.graf();
        await outputPlot(chatId, game, "ходите О");


    })

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text == '/game') {
            game = new Game;
            game.botTry();
            game.graf();
            await outputPlot(chatId, game, "Ходите 'O'");
            return;
        }
    });
}

start();