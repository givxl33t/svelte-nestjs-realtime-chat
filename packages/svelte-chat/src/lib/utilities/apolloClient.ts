// @ts-nocheck
import fetch from 'node-fetch';
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core/index.js";
import { setContext } from '@apollo/client/link/context/index.js';

class Client {
  constructor() {
    if (Client._instance) {
      return Client._instance;
    }
    Client._instance = this;

    this.client = this.setupClient();
  }

  setupClient() {
    const link = new HttpLink({
      uri: 'http://localhost:5000/graphql',
      fetch,
    });

    const authLink = setContext((_, { headers }) => {
      const accessToken = headers?.authorization ?? "";

      return {
        headers: {
          ...headers,
          authorization: accessToken,
        },
      };
    });

    const client = new ApolloClient({
      link: authLink.concat(link),
      cache: new InMemoryCache(),
    });

    return client;
  }
}

export const client = (new Client()).client;