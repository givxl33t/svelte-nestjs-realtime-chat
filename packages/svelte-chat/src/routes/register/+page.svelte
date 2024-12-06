<!-- Login.svelte -->
<script>
// @ts-nocheck
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { isAuthenticated } from "$lib/stores/auth";
  import { graphql } from "$houdini";
  import Swal from 'sweetalert2';

  let name = '';
  let email = '';
  let password = '';

  $: isAuthenticatedValue = $isAuthenticated;

  onMount(async () => {
    if (isAuthenticatedValue) {
      goto('/');
    }
  });

  async function handleRegister() {
    const register = graphql`
      mutation Register($name: String!, $email: String!, $password: String!) {
        createUser(input: {
          name: $name, 
          email: $email,
          password: $password
        }) {
          id
        }
      }
    `;

    const res = await register.mutate({ name, email, password });

    if (!res.errors) {
      goto('/');
      Swal.fire('Success Register!')
    } else {
      Swal.fire(res.errors[0].message);
    }
  }
</script>

<main class="flex items-center justify-center">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Register</h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="name" class="sr-only">Name</label>
          <input id="name" name="name" type="text" autocomplete="name" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Name" bind:value={name} />
        </div>
        <div>
          <label for="email" class="sr-only">Email</label>
          <input id="email" name="email" type="text" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Email" bind:value={email} />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" placeholder="Password" bind:value={password} />
        </div>
      </div>

      <div>
        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          Register
        </button>
      </div>
    </form>
  </div>
</main>