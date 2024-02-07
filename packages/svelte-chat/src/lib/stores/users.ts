import { writable } from "svelte/store";

interface User {
  id: string;
  email: string;
  name: string;
  is_online: boolean;
}

export const usersData = writable<User[]>([]);

export function updateUsers(users: any) {
  usersData.set(users);
}

export function updateSingleUser(user: any) {
  usersData.update((allUsers: any[]) => {
    const index = allUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      allUsers[index] = user;
    } else {
      allUsers.push(user);
    }
    return allUsers;
  });
}