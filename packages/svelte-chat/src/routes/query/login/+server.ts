import { client } from  '$lib/utilities/apolloClient';
import { gql } from '@apollo/client/core/index.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const mutation = gql`
      mutation {
        login(input: { 
          email: "${email}", 
          password: "${password}"
        }) {
          name
          email
          access_token
        }
      }
    `;

    const { data } = await client.mutate({
      mutation
    });

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    if (err.message === 'Invalid credentials') {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}