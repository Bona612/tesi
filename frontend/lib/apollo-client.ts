"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const GRAPHQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT}`;




const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});


const httpLink = new HttpLink({ uri: GRAPHQL_API_ENDPOINT })

const cache = new InMemoryCache({});

const client = new ApolloClient({
  cache: cache,
  link: from([errorLink, httpLink]),
});

export default client;