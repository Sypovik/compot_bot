

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
        if (rooms.condition && rooms[id_room]) {
            this.fill_pleer(chatId, userId, first_name, rooms[id_room].pleer2);
            rooms.condition = false;
            return 1;
        } else {
            const id_room = chatId;
            rooms[id_room] = new Room(...ConstructParametrs);
            this.fill_pleer(chatId, userId, first_name, rooms[id_room].pleer1);
            rooms.condition = id_room;
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
            return 0;
        }
    },

    makeRoom() {

    },

    connectRoom() {

    }

}