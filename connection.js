

export let connection = {
    fill_pleer(chat, user, first_name, pleer) {
        pleer.id_chat = chat;
        pleer.id_user = user;
        pleer.first_name = first_name;
    },

    user({ chat, from }, rooms, Room, ConstructParametrs = []) {
        const chatId = chat.id;
        const userId = from.id;
        const first_name = from.first_name;
        if (rooms.condition) {
            const room_id =rooms.condition;
            this.fill_pleer(chatId, userId, first_name, rooms[room_id].pleer2);
            rooms[room_id].status = 0;
            rooms.condition = false;
            return 1;
        } else {
            rooms[userId] = new Room(...ConstructParametrs);
            this.fill_pleer(chatId, userId, first_name, rooms[userId].pleer1);
            rooms[userId].status = 1;
            rooms.condition = userId;
            rooms[userId].mode = 'online';
            return 0;
        }
    },

    chat({ chat, from }, rooms, Room, ConstructParametrs = []) {
        const chatId = chat.id;
        const userId = from.id;
        const first_name = from.first_name;
        if (rooms[chatId]?.status) {
            this.fill_pleer(chatId, userId, first_name, rooms[chatId].pleer2);
            rooms[chatId].status = 0;
            return 1;
        } else {
            rooms[chatId] = new Room(...ConstructParametrs);
            this.fill_pleer(chatId, userId, first_name, rooms[chatId].pleer1);
            rooms[chatId].status = 1;
            rooms[chatId].mode = 'chat';
            return 0;
        }
    },

    makeRoom() {

    },

    connectRoom() {

    }

}