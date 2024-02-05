import { browser } from "$app/environment"

export async function load({ fetch }) {
  const accessToken = browser && localStorage.getItem('access_token');

  try {
    const res = await fetch('/query/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${accessToken ? `Bearer ${accessToken}` : ''}`,
      },
    });

    const data = await res.json();
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    console.error(err);
  }
}