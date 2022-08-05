import Game from "./game/game.js";
import { dataScore, dataUpdateUser, read, write } from './data/dataIO.js';

export default class TicTac2pleer {

    constructor(bot, from, chatId) {
        this.bot = bot;
        this.pleer = {
            "O": {
                id_user: 0,
                first_name: ' ',
                id_chat: 0
            },
            "X": {
                id_user: 0,
                first_name: ' ',
                id_chat: 0
            },
        };
        this.status = 0;
        this.from = from;
        this.chatId = chatId;
        this.game = new Game;
        dataUpdateUser(from);
    }

    outputResult = async (win, chatId) => {
        if (win) {

            const user = this.pleer[win];
            console.log(user);
            const score = dataScore(1, user.id_user);
            await this.bot.sendMessage(chatId,
                'победил' + user.first_name +
                '\n\n' + this.game.graphics_string() +
                '\nего счет:' + score +
                '\n/game_2pleer'
            );
        } else {
            await this.bot.sendMessage(chatId,
                'ничья' +
                '\n/game_2pleer'
            );
        }


    }

    checkWin = async () => {
        let flag = true;
        try {
            switch (this.game.check()) {
                case 'O':
                    this.outputResult('O', this.pleer['O'].id_chat);
                    if (this.pleer['X'].id_chat != this.pleer['O'].id_chat)
                        this.outputResult('O', this.pleer['X'].id_chat);
                    break;
                case 'X':
                    this.outputResult('X', this.pleer['O'].id_chat);
                    if (this.pleer['X'].id_chat != this.pleer['O'].id_chat)
                        this.outputResult('X', this.pleer['X'].id_chat);
                    break;
                case 'draw':
                    this.outputResult(0, this.pleer['O'].id_chat);
                    if (this.pleer['X'].id_chat != this.pleer['O'].id_chat)
                        this.outputResult(0, this.pleer['X'].id_chat);
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

    tablo = () => {
        const pleer = (this.status == this.pleer['X'].id_chat) ? 'X' : 'O';
        return '______________________________\n' +
            `игрок "O" - ${this.pleer['O'].first_name}` + `${(pleer == 'O') ? ' 👈 \n' : '\n'}` +
            `игрок "X" - ${this.pleer['X'].first_name}` + `${(pleer == 'X') ? ' 👈 \n' : '\n'}`
            ;
    }

    outputPlot = async (text) => {
        let keyboard = [[], [], []];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                keyboard[i].push({
                    text: this.game.plot_graphics[i][j],
                    callback_data:
                        '2pleerTicTac_' +
                        i + '_' +
                        j + '_' +
                        this.status + '_' +
                        this.pleer['O'].id_chat
                })
            }
        }
        const gameOptions = {
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            }),
            parse_mode: 'HTML',
        }
        try {
            if (this.pleer['O'].id_chat)
                await this.bot.sendMessage(this.pleer['O'].id_chat, text, gameOptions);
            if (this.pleer['X'].id_chat && this.pleer['X'].id_chat != this.pleer['O'].id_chat)
                await this.bot.sendMessage(this.pleer['X'].id_chat, text, gameOptions);
        } catch (err) {
            console.log(err);
        }

    }



    step = async ({ i, j }) => {
        try {
            if (this.pleer['X'].id_chat) {
                let pleer = (this.status == this.pleer['X'].id_chat) ? 'X' : 'O';
                if (this.game.userStep(i, j, pleer)) {
                    await this.outputPlot("занято");
                    return;
                }
                if (await this.checkWin()) {
                    this.game.plot = this.game.plotZero(3, 3);
                    this.game.plot_user1 = this.game.plotZero(3, 3);
                    this.game.plot_user2 = this.game.plotZero(3, 3);
                    this.game.graphics_update();
                }
                this.status == this.pleer['X'].id_chat ? this.status = this.pleer['O'].id_chat : this.status = this.pleer['X'].id_chat;
                await this.outputPlot(this.tablo());
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

export const startTicTac2pleer = async (bot, { chat, from }, ticTac2pleer) => {
    const chatId = chat.id;
    const userId = from.id;
    let condition = read().tic_tac_2pleer;
    if (condition && ticTac2pleer[condition]) {
        ticTac2pleer[condition].pleer['X'].id_chat = chatId;
        ticTac2pleer[condition].pleer['X'].id_user = userId;
        ticTac2pleer[condition].pleer['X'].first_name = from.first_name;
        // let pleer = (ticTac2pleer[condition].status == ticTac2pleer[condition].pleer['X'].id_user) ? 'X' : 'O';
        console.log(ticTac2pleer[condition].tablo());
        await ticTac2pleer[condition].outputPlot(ticTac2pleer[condition].tablo());
        let data = read();
        data.tic_tac_2pleer = false;
        write(data);
    } else {
        condition = chatId;
        ticTac2pleer[condition] = new TicTac2pleer(bot, from, chatId);
        ticTac2pleer[condition].pleer['O'].id_chat = chatId;
        ticTac2pleer[condition].pleer['O'].id_user = userId;
        ticTac2pleer[condition].pleer['O'].first_name = from.first_name;
        ticTac2pleer[condition].status = chatId;
        let data = read();
        data.tic_tac_2pleer = condition;
        write(data);
        await bot.sendMessage(chatId, "<b>НАЧАЛО ИГРЫ</b>\n\n1-й игрок: " +
            from.first_name +
            "\nожидается 2-й игрок\n\n/game_2pleer",
            { parse_mode: 'HTML' }
        );
    }
}