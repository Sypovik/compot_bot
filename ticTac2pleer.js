import Game from "./game/game.js";
import { dataScore, dataUpdateUser, read, write } from './data/dataIO.js';
import { connection } from "./connection.js";

export default class TicTac2pleer {

    constructor(bot, from, chatId) {
        this.bot = bot;
        this.pleer1 = {
            id_user: 0,
            first_name: ' ',
            id_chat: 0
        };
        this.pleer2 = {
            id_user: 0,
            first_name: ' ',
            id_chat: 0
        };
        this.step_pleer = 0;
        this.status = 0;
        this.from = from;
        this.chatId = chatId;
        this.game = new Game;
    }

    outputResult = async (user, chatId) => {
        if (user) {
            // const user = this.pleer[win];
            const score = dataScore(1, user.id_user);
            await this.bot.sendMessage(chatId,
                'победил ' + user.first_name +
                '\n\n' + this.game.graphics_string() +
                '\nего счет: ' + score +
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
                    await this.outputResult(this.pleer1, this.pleer1.id_chat);
                    if (this.pleer2.id_chat != this.pleer1.id_chat)
                        await this.outputResult(this.pleer1, this.pleer2.id_chat);
                    break;
                case 'X':
                    await this.outputResult(this.pleer2, this.pleer1.id_chat);
                    if (this.pleer2.id_chat != this.pleer1.id_chat)
                        await this.outputResult(this.pleer2, this.pleer2.id_chat);
                    break;
                case 'draw':
                    await this.outputResult(0, this.pleer1.id_chat);
                    if (this.pleer2.id_chat != this.pleer1.id_chat)
                        await this.outputResult(0, this.pleer2.id_chat);
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
        const pleer = (this.step_pleer == this.pleer2.id_user) ? 'X' : 'O';
        return '______________________________\n' +
            `игрок "O" - ${this.pleer1.first_name}` + `${(pleer == 'O') ? ' 👈 \n' : '\n'}` +
            `игрок "X" - ${this.pleer2.first_name}` + `${(pleer == 'X') ? ' 👈 \n' : '\n'}`
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
                        this.step_pleer + '_' +
                        this.chatId
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
            if (this.pleer1.id_chat)
                await this.bot.sendMessage(this.pleer1.id_chat, text, gameOptions);
            if (this.pleer2.id_chat && this.pleer2.id_chat != this.pleer1.id_chat)
                await this.bot.sendMessage(this.pleer2.id_chat, text, gameOptions);
        } catch (err) {
            console.log(err);
        }

    }



    step = async ({ i, j }) => {
        try {
            if (this.pleer2.id_chat) {
                let pleer = (this.step_pleer == this.pleer2.id_user) ? 'X' : 'O';
                if (this.game.userStep(i, j, pleer)) {
                    await this.outputPlot("занято");
                    return;
                }
                const flag = await this.checkWin();
                if (flag) {
                    this.game.plot = this.game.plotZero(3, 3);
                    this.game.plot_user1 = this.game.plotZero(3, 3);
                    this.game.plot_user2 = this.game.plotZero(3, 3);
                    this.game.graphics_update();
                }
                this.step_pleer == this.pleer2.id_user ? this.step_pleer = this.pleer1.id_user : this.step_pleer = this.pleer2.id_user;
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
    callback.step_pleer = arr[3];
    callback.idRoom = arr[4];
    return callback;
}

export const startTicTac2pleer = async (bot, { chat, from }, ticTac2pleer) => {
    dataUpdateUser(from);
    if (connection.chat({ chat, from }, ticTac2pleer, TicTac2pleer, [bot, from, chat.id]) == 0) {
        ticTac2pleer[chat.id].step_pleer = from.id;
        await bot.sendMessage(chat.id,
            "<b>НАЧАЛО ИГРЫ</b>" +
            "\n" +
            "\n1-й игрок: " + from.first_name +
            "\nожидается 2-й игрок\n\n/game_2pleer",
            { parse_mode: 'HTML' }
        )
    }
    else {
        const id_room = (Object.keys(ticTac2pleer).filter(key => ticTac2pleer[key]?.pleer2?.id_chat == chat.id))[0];
        await ticTac2pleer[id_room].outputPlot(ticTac2pleer[id_room].tablo());
    }
}