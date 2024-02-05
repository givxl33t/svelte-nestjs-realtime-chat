import { writable } from 'svelte/store';

// Check if localStorage is available
const isLocalStorageAvailable = typeof localStorage !== 'undefined';

// Initialize the store based on localStorage availability
export const isAuthenticated = writable(isLocalStorageAvailable && !!localStorage.getItem('access_token'));

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