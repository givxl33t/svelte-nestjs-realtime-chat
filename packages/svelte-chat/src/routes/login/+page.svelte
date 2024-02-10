<!-- Login.svelte -->
<script>
// @ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { currentUser, isAuthenticated } from "$lib/stores/auth";
  import { updateNotifications } from '$lib/stores/notification';
  import { graphql } from "$houdini";
  import Swal from 'sweetalert2';

  let email = '';
  let password = '';

  $: isAuthenticatedValue = $isAuthenticated;

  onMount(async () => {
    if (isAuthenticatedValue) {
      goto('/');
    }
  });

  async function Notifications() {
		const notifications = graphql`
			query Notifications {
				myNotifications {
					id
					text
					read
					createdAt
					metadata {
            key
            value
        	}
				}
			}
		`;

		const res = await notifications.fetch({ policy: 'NetworkOnly' });

		if (res.data) {
			updateNotifications(res.data.myNotifications);
		}
	}

  async function handleLogin() {
    const login = graphql`
      mutation Login($email: String!, $password: String!) {
        login(input: { 
          email: $email,
          password: $password
        }) {
          id
          email
          name
        }
      }
    `;

    const res = await login.mutate({ email, password });

    if (!res.errors) {
      isAuthenticated.set(true);
      currentUser.set({ me: res.data.login });
      await Notifications();

      goto('/');
      Swal.fire('Login successful')
    } else {
      Swal.fire(res.errors[0].message);
    }
  }
</script>

<main class="flex items-center justify-center">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email" class="sr-only">Email</label>
          <input id="email" name="email" type="text" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Email" bind:value={email} />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Password" bind:value={password} />
        </div>
      </div>

      <div>
        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          Login
        </button>
      </div>
    </form>
  </div>
</main>