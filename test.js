export const test = async (bot, chat) => {
    let keyboard = [];
    let tem = 0;
    for (let i = 0; i < 8; i++) {
        keyboard[i] = [];
        for (let j = 0; j < 8; j++) {
            keyboard[i].push({
                text: `${Math.abs(j-i)}`,
                callback_data:
                    'test_' +
                    i + '_' + j
            })
        }
    };
    const gameOptions = {
        reply_markup: JSON.stringify({
            inline_keyboard: 
            // keyboard
            [
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'ч',callback_data:' '},{text:'н',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'е',callback_data:' '},{text:'е',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'л',callback_data:' '},{text:'л',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'е',callback_data:' '},{text:'е',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'н',callback_data:' '},{text:'ч',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'е',callback_data:' '},{text:'ч',callback_data:' '},{text:'н',callback_data:' '},{text:'е',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'л',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'л',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
                [{text:' ',callback_data:' '},{text:' ',callback_data:' '},{text:'е',callback_data:' '},{text:'н',callback_data:' '},{text:'ч',callback_data:' '},{text:'е',callback_data:' '},{text:' ',callback_data:' '},{text:' ',callback_data:' '}],
            ]
        }),
        parse_mode: 'HTML',
    }
    await bot.sendMessage(chat, '----------------------------text------------------------------', gameOptions);
} 