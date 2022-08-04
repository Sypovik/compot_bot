import Game from "./game/game.js";
import { dataScore, dataUpdateUser, read, write } from './data/dataIO.js';

export default class TicTac2pleer {

    constructor(bot, from, chatId) {
        this.bot = bot;
        this.pleer = {
            "O": 0,
            "X": 0
        };
        this.status = 0;
        this.from = from;
        this.chatId = chatId;
        this.game = new Game;
        dataUpdateUser(from);
    }

    start = async () => {
        await this.outputPlot("Начало игры,\nжду 2го игрока - /game_2pleer");
    }


    checkWin = async () => {
        let flag = true;
        try {
            switch (this.game.check()) {
                case 'pleer1':
                    const scorePleer1 = dataScore(1, this.pleer['O']);
                    await this.bot.sendMessage(this.chatId,
                        'победил ' + read()[this.pleer['O']].first_name +
                        '\n' + this.game.graphics_string() +
                        '\nВаш счет:' + scorePleer1 +
                        '\n/game'
                    );
                    break;
                case 'pleer1':
                    const scorePleer2 = dataScore(1, this.pleer['X']);
                    await this.bot.sendMessage(this.chatId,
                        'победил ' + read()[this.pleer['X']].first_name +
                        '\n' + this.game.graphics_string() +
                        '\nВаш счет:' + scorePleer2 +
                        '\n/game'
                    );
                    break;
                case 'draw':
                    await this.bot.sendMessage(this.chatId, `Ничья\n${this.game.graphics_string()}\n/game`);
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
        // let keyboard = [[]];
        // for (let i = 0; i < 3; i++) {
        //     for (let j = 0; j < 3; j++) {
        //         keyboard[i].push({
        //             text: this.game.plot_graphics[i][j], callback_data:
        //             {
        //                 game: 'ticTac2pleer',
        //                 i: i, j: j,
        //                 status: this.status
        //             }
        //         })
        //     }
        // }
        const gameOptions = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    // [
                    //         {
                    //             text: this.game.plot_graphics[0][0], callback_data:
                    //             {
                    //                 game: 'ticTac2pleer',
                    //                 i: 0, j: 0,
                    //                 status: this.status,
                    //                 idRoom: this.pleer['O']
                    //             }
                    [
                        { text: this.game.plot_graphics[0][0], callback_data: '2pleerTicTac_0_0_' + this.status + '_' + this.pleer['O'] },
                        { text: this.game.plot_graphics[0][1], callback_data: '2pleerTicTac_0_1_' + this.status + '_' + this.pleer['O'] },
                        { text: this.game.plot_graphics[0][2], callback_data: '2pleerTicTac_0_2_' + this.status + '_' + this.pleer['O'] },
                    ],
                    [
                        { text: this.game.plot_graphics[1][0], callback_data: '2pleerTicTac_1_0_' + this.status + '_' + this.pleer['O'] },
                        { text: this.game.plot_graphics[1][1], callback_data: '2pleerTicTac_1_1_' + this.status + '_' + this.pleer['O'] },
                        { text: this.game.plot_graphics[1][2], callback_data: '2pleerTicTac_1_2_' + this.status + '_' + this.pleer['O'] },
                    ],
                    [
                        { text: this.game.plot_graphics[2][0], callback_data: '2pleerTicTac_2_0_' + this.status + '_' + this.pleer['O'] },
                        { text: this.game.plot_graphics[2][1], callback_data: '2pleerTicTac_2_1_' + this.status + '_' + this.pleer['O'] },
                        { text: this.game.plot_graphics[2][2], callback_data: '2pleerTicTac_2_2_' + this.status + '_' + this.pleer['O'] },
                    ],
                ]
            }),
            parse_mode: 'HTML',
        }
        try {
            await this.bot.sendMessage(this.pleer['O'], text, gameOptions);
            await this.bot.sendMessage(this.pleer['X'], text, gameOptions);
        } catch (err) {
            console.log(err);
        }

    }



    step = async ({ i, j }) => {
        try {
            if (this.pleer['X']) {
                let pleer = this.status == this.pleer['X'] ? 'X' : 'O';
                if (this.game.userStep(i, j, pleer)) {
                    await this.outputPlot("занято");
                    return;
                }
                if (await this.checkWin()) {
                    this.game.plot = this.game.plotZero(3, 3);
                    this.game.plot_user1 = this.game.plotZero(3, 3);
                    this.game.plot_user2 = this.game.plotZero(3, 3);
                    return;
                }
                this.status == this.pleer['X'] ? this.status = this.pleer['O'] : this.status = this.pleer['X'];
                await this.outputPlot(`ходит ${(pleer == 'X') ? 'O' : 'X'}`);
            } else {
                this.bot.sendMessage(this.chatId, "Добавьте 2-го игорока\n /game_2pleer");
            }
        } catch (err) {
            console.log(err);
        }

    }


}

export const callback_data_object = (data) => {
    let arr = data.split("_");
    let callback = {};
    callback.game = arr[0];
    callback.i = arr[1];
    callback.j = arr[2];
    callback.status = arr[3];
    callback.idRoom = arr[4];
    return callback;
}