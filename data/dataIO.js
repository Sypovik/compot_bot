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

export const dataUpdateUser = (user) => {
    let flag = 0;
    const id = user.id;
    const data = read();
    if (!data[id]) {
        data[id] = {
            first_name: user.first_name,
            username: user.username,
            score: 0,
        }
        console.log(data);
        write(data);
    }
}

export const dataScore = (n, id) => {
    let data = read();
    if (data[id].score) {
        data[id].score += n;
        write(data);
    }
    return data[id].score;
}

// export const checkUser = (user) => {
//     let flag = 0;
//     const id = user.id;
//     let data = read();
//     if (!data[id]) {
//         dataUpdateUser(user);
//     }
// }