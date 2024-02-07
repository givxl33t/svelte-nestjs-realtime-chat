import { writable } from "svelte/store";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
}

interface Room {
  id: string;
  messages: Message[];
}

export const currentRoom = writable<Room>({
  id: "",
  messages: []
});

export function updateRoom(room: Room) {
  currentRoom.set(room);
}

export function pushMessage(message: Message) {
  currentRoom.update((room) => {

    console.log('room', room);

    return {
      ...room,
      messages: [...room.messages, message]
    };
  });
}


export function clearRoom() {
  currentRoom.set({
    id: "",
    messages: []
  });
}