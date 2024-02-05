<!-- Login.svelte -->
<script>
  let email = '';
  let password = '';

  async function handleLogin() {
    const res = await fetch('/query/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('access_token', data.login.access_token);

      window.alert('Login successful');
      email = '';
      password = '';
    } else {
      window.alert(data.error);
    }
  }
</script>

<main>
  <h1>Login</h1>
  
  <form on:submit|preventDefault={handleLogin}>
    <label for="email">Email:</label>
    <input type="text" id="email" bind:value={email} />

    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />

    <button type="submit">Login</button>
  </form>
</main>

<style>
  main {
    max-width: 300px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-top: 10px;
  }

  input {
    margin-bottom: 15px;
    padding: 8px;
    font-size: 16px;
  }

  button {
    padding: 10px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>