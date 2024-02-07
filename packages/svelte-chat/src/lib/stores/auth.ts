import { writable } from 'svelte/store';

// Initialize the store based on access_token cookie
export const isAuthenticated = writable(false);

// Initialize the current user store
export const currentUser = writable({ 
  me : {
    id: null,
    email: null,
    name: null,
  } 
});

// function to update the currentUser store
export function updateCurrentUser(user: any) {
  currentUser.set(user);
}