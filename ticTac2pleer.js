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
        this.mode = 'chat';
    }

    outputResult = async (user, chatId, score) => {
        if (user) {
            // const user = this.pleer[win];
            await this.bot.sendMessage(chatId,
                'победил ' + user.first_name +
                '\n\n' + this.game.graphics_string() +
                '\nего счет: ' + score +
                '\n/game_2pleer_' + this.mode
            );
        } else {
            await this.bot.sendMessage(chatId,
                'ничья' +
                '\n/game_2pleer_' + this.mode
            );
        }


    }

    checkWin = async () => {
        let flag = true;
        try {
            let score;
            switch (this.game.check()) {
                case 'O':
                    score = dataScore(1, this.pleer1.id_user);
                    await this.outputResult(this.pleer1, this.pleer1.id_chat, score);
                    if (this.pleer2.id_chat != this.pleer1.id_chat)
                        await this.outputResult(this.pleer1, this.pleer2.id_chat, score);
                    break;
                case 'X':
                    score = dataScore(1, this.pleer2.id_user);
                    await this.outputResult(this.pleer2, this.pleer1.id_chat, score);
                    if (this.pleer2.id_chat != this.pleer1.id_chat)
                        await this.outputResult(this.pleer2, this.pleer2.id_chat, score);
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
                        '2pleerTicTac' + this.mode.charAt(0).toUpperCase() + this.mode.slice(1) + '_' +
                        i + '_' +
                        j + '_' +
                        this.step_pleer + '_' +
                        this.pleer1.id_user + '_' +
                        this.pleer2.id_user
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

    step_mode_chat = async (userId, data) => {
        const dataObject = callback_data_object(data);
        if (this.pleer1.id_user == userId || this.pleer2.id_user == userId) {

            let pleer = ' ';
            this.pleer1.id_user == this.step_pleer
                ? pleer = this.pleer1
                : pleer = this.pleer2

            userId == pleer.id_user
                ? await this.step(dataObject)
                : await bot.sendMessage(chatId, "ходит игрок " + pleer.first_name)
        } else {
            await bot.sendMessage(chatId, "начните игру \n/game_2pleer"
                + this.mode.charAt(0).toUpperCase() + this.mode.slice(1))
        }
    }

    step_mode_user = async (userId, dataObject) => {
        if (this.pleer1.id_user == userId || this.pleer2.id_user == userId) {
            let current_pleer = ' ';
            this.pleer1.id_user == userId
                ? current_pleer = this.pleer1
                : current_pleer = this.pleer2

            userId == this.step_pleer
                ? await this.step(dataObject)
                : await this.bot.sendMessage(current_pleer.id_chat, "не твой ход ля")
        }
    }

    step = async ({ i, j }) => {
        try {
            if (this.pleer2.id_chat) {
                let pleer = (this.step_pleer == this.pleer2.id_user) ? 'X' : 'O';
                if (this.game.userStep(i, j, pleer)) {
                    await this.outputPlot("__________________________\n__________занято_________\n");
                    return;
                }
                const flag = await this.checkWin();
                if (flag) {
                    this.game.plot = this.game.plotZero(3, 3);
                    this.game.plot_user1 = this.game.plotZero(3, 3);
                    this.game.plot_user2 = this.game.plotZero(3, 3);
                    this.game.graphics_update();
                }
                this.step_pleer == this.pleer2.id_user
                    ? this.step_pleer = this.pleer1.id_user
                    : this.step_pleer = this.pleer2.id_user;
                await this.outputPlot(this.tablo());
            } else {
                this.bot.sendMessage(this.chatId, "Добавьте 2-го игорока\n /game_2pleer"
                    + this.mode.charAt(0).toUpperCase() + this.mode.slice(1));
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
    callback.pleer1_id = arr[4];
    callback.pleer2_id = arr[5];
    return callback;
}

export const startTicTac2pleer_chat_mode = async (bot, { chat, from }, ticTac2pleer) => {
    dataUpdateUser(from);
    if (connection.chat({ chat, from }, ticTac2pleer, TicTac2pleer, [bot, from, chat.id]) == 0) {
        ticTac2pleer[chat.id].step_pleer = from.id;
        await bot.sendMessage(chat.id,
            "<b>НАЧАЛО ИГРЫ</b>" +
            "\n" +
            "\n1-й игрок: " + from.first_name +
            "\nожидается 2-й игрок\n\n/game_2pleer_chat",
            { parse_mode: 'HTML' }
        )
    }
    else {
        const id_room = (Object.keys(ticTac2pleer).filter(key => ticTac2pleer[key]?.pleer2?.id_chat == chat.id))[0];
        await ticTac2pleer[id_room].outputPlot(ticTac2pleer[id_room].tablo());
    }
}

export const startTicTac2pleer_user_mode = async (bot, { chat, from }, ticTac2pleer) => {
    dataUpdateUser(from);
    if (connection.user({ chat, from }, ticTac2pleer, TicTac2pleer, [bot, from, chat.id]) == 0) {
        ticTac2pleer[from.id].step_pleer = from.id;
        await bot.sendMessage(chat.id,
            "<b>НАЧАЛО ИГРЫ</b>" +
            "\n" +
            "\n1-й игрок: " + from.first_name +
            "\nожидается 2-й игрок\n\n/game_2pleer_online",
            { parse_mode: 'HTML' }
        )
    }
    else {
        const id_room = (Object.keys(ticTac2pleer).filter(key => ticTac2pleer[key]?.pleer2?.id_user == from.id))[0];
        await ticTac2pleer[id_room].outputPlot(ticTac2pleer[id_room].tablo());
    }
}