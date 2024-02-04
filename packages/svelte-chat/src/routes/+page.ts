// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export async function load({ fetch }) {
  try {
    const res = await fetch('/query/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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