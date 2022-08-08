import Game from "./game/game.js";
import { dataScore, dataUpdateUser, read, write } from './data/dataIO.js';

export default class TicTac {

    constructor(bot, from, chatId) {
        this.bot = bot;
        // this.msg = msg;
        this.from = from;
        this.chatId = chatId;
        this.game = new Game;
        dataUpdateUser(from);
        // write(msg.from);
    }

    start = async () => {
        this.game.botStep();
        await this.outputPlot("Начало игры,\nходите 'O'");
    }


    checkWin = async () => {
        let flag = true;
        try {
            switch (this.game.check()) {
                case 'O':
                    const score = dataScore(1, this.from.id);
                    await this.bot.sendMessage(this.chatId,
                        'вы победили'
                        + '\n' + this.game.graphics_string()
                        + '\nВаш счет:' + score
                        + '\n/game_1pleer'
                    );
                    break;
                case 'X':
                    await this.bot.sendMessage(this.chatId, `вы проиграли\n${this.game.graphics_string()}\n/game_1pleer`);
                    break;
                case 'draw':
                    await this.bot.sendMessage(this.chatId, `Ничья\n${this.game.graphics_string()}\n/game_1pleer`);
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

    outputPlot = async (text) => {
        const gameOptions = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        { text: this.game.plot_graphics[0][0], callback_data: 'ticTac 0 0' },
                        { text: this.game.plot_graphics[0][1], callback_data: 'ticTac 0 1' },
                        { text: this.game.plot_graphics[0][2], callback_data: 'ticTac 0 2' },
                    ],
                    [
                        { text: this.game.plot_graphics[1][0], callback_data: 'ticTac 1 0' },
                        { text: this.game.plot_graphics[1][1], callback_data: 'ticTac 1 1' },
                        { text: this.game.plot_graphics[1][2], callback_data: 'ticTac 1 2' },
                    ],
                    [
                        { text: this.game.plot_graphics[2][0], callback_data: 'ticTac 2 0' },
                        { text: this.game.plot_graphics[2][1], callback_data: 'ticTac 2 1' },
                        { text: this.game.plot_graphics[2][2], callback_data: 'ticTac 2 2' },
                    ],
                ]
            }),
            parse_mode: 'HTML',
        }
        try {
            await this.bot.sendMessage(this.chatId, text, gameOptions);
        } catch (err) {
            console.log(err);
        }

    }

    step = async (data, pleer) => {
        const i = Number(data[7]);
        const j = Number(data[9]);
        try {
            if (this.game.userStep(i, j, 'O')) {
                await this.outputPlot("занято");
                return;
            }
            if (await this.checkWin()) {
                this.game.plot = this.game.plotZero(3, 3);
                this.game.plot_user1 = this.game.plotZero(3, 3);
                this.game.plot_user2 = this.game.plotZero(3, 3);
                return;
            }

            this.game.botStep();
            if (await this.checkWin()) {
                this.game.plot = this.game.plotZero(3, 3);
                return;
            }
            await this.outputPlot("ходите O");
        } catch (err) {
            console.log(err);
        }

    }

}
