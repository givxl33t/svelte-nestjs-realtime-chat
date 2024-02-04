import { client } from '$lib/utilities/apolloClient';
import { gql } from '@apollo/client/core/index.js';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
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
      fetchPolicy: "no-cache"
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