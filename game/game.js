import { winCombinations } from "./winCombinations.js"

export default class Game {
    constructor() {
        this.plot = this.zero2d(3, 3);
        this.grafika = [[], [], []];
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

    userTry(i, j) {
        let flag = false;
        if (this.plot[i][j] == 0) {
            this.plot[i][j] = -1;
        } else {
            flag = true;
        }
        return flag;
    }

    botTry() {
        let flag = 1;
        while (flag) {

            let rand_i = Math.floor(Math.random() * 3);
            let rand_j = Math.floor(Math.random() * 3);

            if (this.plot[rand_i][rand_j] == 0) {
                this.plot[rand_i][rand_j] = 1;
                flag = 0;
            }
        }
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


    zero2d(x = 0, y = 0) {
        let arr = [];
        for (let i = 0; i < x; i++) {
            arr[i] = [];
            for (let j = 0; j < y; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    graf_string() {
        let arr = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                arr += `${this.grafika[i][j]} `;
            }
            arr += '\n';
        }
        return arr;
    }

    graf() {
        for (let i = 0; i < this.plot.length; i++) {
            for (let j = 0; j < this.plot[0].length; j++) {
                switch (this.plot[i][j]) {
                    case 0:
                        this.grafika[i][j] = ' ';
                        break;
                    case 1:
                        this.grafika[i][j] = 'X';
                        break;
                    case -1:
                        this.grafika[i][j] = 'O';
                        break;
                }
            }
        }
    }

    check() {
        let bot = this.zero2d(3, 3);
        let user = this.zero2d(3, 3);
        for (let i = 0; i < this.plot.length; i++) {
            for (let j = 0; j < this.plot[0].length; j++) {
                if (this.plot[i][j] === 1) {
                    bot[i][j] = 1;
                } else {
                    if (this.plot[i][j] === -1) {
                        user[i][j] = 1;
                    }
                }
            }
        }
        let flag = 0;
        for (let i = 0; i < this.win.length; i++) {
            if (this.comparison(this.win[i], user)) {
                flag = -1;
                break;
            }
            if (this.comparison(this.win[i], bot)) {
                flag = 1;
                break;
            }
        }
        return flag;
    }
}
