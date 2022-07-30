
import TelegramApi from 'node-telegram-bot-api';
import Game from './game/game.js';

const token = '5382301897:AAEG5XJxVSH1G7IZjRkBA6AxrEd1NSlH9T8';

const bot = new TelegramApi(token, { polling: true });

let checkWin = async (chatId, game) => {
    let flag = 1;
    try {
        switch (game.check()) {
            case -1:
                game.graf();
                const gameOptions = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [
                                { text: "заново", callback_data: '0 0' },
                            ]
                        ]
                    })
                }
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
        console.log(flag);
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
            console.log("занято");
            await outputPlot(chatId, game, "занято");
            return;
        }
        // console.log("checkWin(chatId, game) = " + await checkWin(chatId, game));
        if (await checkWin(chatId, game) == 1) {
            console.log("checkWin1");
            game.plot = game.zero2d(3, 3);
            return;
        }
        game.botTry();

        if (await checkWin(chatId, game) == 1) {
            console.log("checkWin1");
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

        // await bot.sendMessage(chatId, `текст: ${text}\nимя: ${msg.from.first_name}`);
    });
}

start();