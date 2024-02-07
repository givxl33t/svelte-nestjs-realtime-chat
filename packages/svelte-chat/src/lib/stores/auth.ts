import { writable } from 'svelte/store';

// Initialize the store based on access_token cookie
export const isAuthenticated = writable(false);

// type to define the user object
export type CurrentUser = {
  me: {
    id: string;
    email: string;
    name: string;
  };
};

// Initialize the current user store
export const currentUser = writable<CurrentUser>({ 
  me: {
    id: '',
    email: '',
    name: '',
  } 
});

// function to update the currentUser store
export function updateCurrentUser(user: any) {
  currentUser.set(user);
}