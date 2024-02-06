// @ts-nocheck
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client/core/index.js";
import { setContext } from '@apollo/client/link/context/index.js';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions/index.js';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities/index.js';
import { browser } from "$app/environment"

class Client {
  constructor() {
    if (Client._instance) {
      return Client._instance;
    }
    Client._instance = this;

    this.apolloClient = this.setupClient();
  }

  setupClient() {
    const httpLink = new HttpLink({
      uri: 'http://localhost:5000/graphql'
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

    const wsLink = browser
      ? new GraphQLWsLink({
        client: createClient({
          url: 'ws://localhost:5000/graphql',
          webSocketImpl: WebSocket,
        }),
      })
      : null;

    const link = 
      browser && wsLink !== null
        ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLink,
          authLink.concat(httpLink),
        )
        : authLink.concat(httpLink);

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }
}

export const client = new Client().apolloClient;