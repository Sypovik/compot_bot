import { log } from 'console';
import fs from 'fs';

export default class Cities {
    constructor() {
        this.void = "Масква";
        this.output = "Масква";
        this.cities = JSON.parse(fs.readFileSync('data/russia_cities.json'));
        this.cities.forEach(e => e.spoken = 0);
    }

    string_search_err(str) {
        for (let i = 0; i < str.length; i++) {
            const err_str = str.replace(str[i], '.');
            let regexp = new RegExp(err_str.toLowerCase());
            for (let j = 0; j < this.cities.length; j++) {
                if (this.cities[j].city.toLowerCase().match(regexp)) {
                    return this.cities[j].city
                }
            }
        }
        return 0;
    }

    spoken(city) {
        for (let i = 0; i < this.cities.length; i++)
            if (this.cities[i].city == city) {
                this.cities[i].spoken++;
                return city;
            }
        return 0;
    }

    delite(city) {
        for (let i = 0; i < this.cities.length; i++)
            if (this.cities[i].city == city) {
                this.cities.splice(i, 1);
                return city;
            }
        return 0;
    }

    check(input) {
        for (let i = 0; i < this.cities.length; i++) {
            if (String(this.cities[i].city.toLowerCase()).includes(String(input.toLowerCase()))) {
                this.void = this.cities[i].city;
                return 0;
            }
        }
        let string_not_err = this.string_search_err(input);
        if (string_not_err) {
            this.void = string_not_err;
            return 1;
        }
        return 2;
    }

    random_city(arr) {
        let number = 0;
        let sity = 0;
        do {
            number = Math.floor(Math.random() * arr.length);
            sity = arr[number]?.city;
        } while (arr[number].spoken != 0);
        arr[number].spoken++;
        return sity;
    }

    output_cities() {
        let i = 0;
        let cities_letter = [];
        do {
            cities_letter = this.cities.filter(el => ((el.city[0] == this.void[this.void.length - (1 + i)].toUpperCase()) && !el.spoken));
        } while (i++ < this.void.length && cities_letter.length == 0);
        if (cities_letter.length) {
            this.output = this.random_city(cities_letter);
            return 0;
        } else {
            return 1
        }
    }

}

let cities = new Cities();
// cities.string_search_err("Масква");
// console.log(cities.cities);
let i = 0;
do {


    switch (cities.check(String(cities.output))) {
        case 1:
            log('Возможно имелось ввиду: ' + cities.void)
            break
        case 2:
            log('Не найде такой город');
            break
    }
    if (!cities.output_cities()) {
        if (cities.void[cities.void.length - 1].toLowerCase() != cities.output[0].toLowerCase()) {
            log(cities.void, cities.output);
        }
        console.log(i + 1 + " результат cities.output: " + cities.output);
    }
    else console.log("Нет гродов на эту букву");

}
while (i++ < 500);

