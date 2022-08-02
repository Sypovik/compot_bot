import { winCombinations } from "./winCombinations.js"

export default class Game {
    constructor() {
        this.plot = this.plotZero(3, 3);
        this.plot_user = this.plotZero(3, 3);
        this.plot_bot = this.plotZero(3, 3);
        this.plot_graphics = [[], [], []];
        this.graphics_update();
        this.win = winCombinations;
    }

    checkDraw() {
        let flag = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.plot[i][j] == 0) {
                    flag = 1;
                    break;
                }
            }
            if (flag) break;
        }
        return !flag;
    }

    userStep(i, j) {
        let flag = false;
        if (this.plot[i][j] == 0) {
            this.plot[i][j] = -1;
            this.plot_user[i][j] = 1;
        } else {
            flag = true;
        }
        this.graphics_update();


        return flag;
    }

    botStep() {
        let flag = 1;
        while (flag) {

            let rand_i = Math.floor(Math.random() * 3);
            let rand_j = Math.floor(Math.random() * 3);

            if (this.plot[rand_i][rand_j] == 0) {
                this.plot[rand_i][rand_j] = 1;
                this.plot_bot[rand_i][rand_j] = 1;
                flag = 0;
            }
        }
        this.graphics_update();
    }

    comparison(arr1, arr2) {
        let flag = 0;
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr1[0].length; j++) {
                if (arr1[i][j] && (arr2[i][j] != arr1[i][j])) {
                    flag = 1;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
        return !flag;
    }


    plotZero(x = 0, y = 0) {
        let arr = [];
        for (let i = 0; i < x; i++) {
            arr[i] = [];
            for (let j = 0; j < y; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    graphics_string() {
        let arr = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                arr += `${this.plot_graphics[i][j] == ' '
                    ? '#'
                    : this.plot_graphics[i][j]} `

            }
            // (i != 2)
            //     ? arr += `\n------\n`
            //     : 
            arr += '\n';
        }
        return arr;
    }

    graphics_update() {
        for (let i = 0; i < this.plot.length; i++) {
            for (let j = 0; j < this.plot[0].length; j++) {
                switch (this.plot[i][j]) {
                    case 0:
                        this.plot_graphics[i][j] = ' ';
                        break;
                    case 1:
                        this.plot_graphics[i][j] = 'X';
                        break;
                    case -1:
                        this.plot_graphics[i][j] = 'O';
                        break;
                }
            }
        }
    }

    check() {
        let win = false;
        for (let i = 0; i < this.win.length; i++) {
            if (this.comparison(this.win[i], this.plot_user)) {
                win = 'user';
                break;
            }
            if (this.comparison(this.win[i], this.plot_bot)) {
                win = 'bot';
                break;
            }
        }
        if (this.checkDraw() && !win) win = 'draw'
        return win;
    }
}
