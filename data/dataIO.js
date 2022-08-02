import fs from 'fs';

export const read = () => {
    let file = fs.readFileSync('data/dataPleer.json');
    let data = JSON.parse(file);
    return data;
}

export const write = async (data) => {
    let file = JSON.stringify(data, null, 2);
    fs.writeFileSync('data/dataPleer.json', file);
}