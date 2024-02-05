import { client } from '$lib/utilities/apolloClient';
import { gql } from '@apollo/client/core/index.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const query = gql`
      query {
        books {
          id
          title
          author
          publishedDate
        }
      }
    `;

    const { data } = await client.query({
      query,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: request.headers.get("authorization"),
        },
      },
    });

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify(err), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}