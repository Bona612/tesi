"use client";
// ^ this file needs the "use client" pragma

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// const GRAPHQL_API_ENDPOINT = "https://api.studio.thegraph.com/query/88554/erc6956full/version/latest";
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
// onError(({ graphQLErrors, networkError, operation, forward }) => {
//     if (graphQLErrors) {
//       for (let err of graphQLErrors) {
//         switch (err.extensions.code) {
//           // Apollo Server sets code to UNAUTHENTICATED
//           // when an AuthenticationError is thrown in a resolver
//           case "UNAUTHENTICATED":
//             // Modify the operation context with a new token
//             const oldHeaders = operation.getContext().headers;
//             operation.setContext({
//               headers: {
//                 ...oldHeaders,
//                 authorization: getNewToken(),
//               },
//             });
//             // Retry the request, returning the new observable
//             return forward(operation);
//         }
//       }
//     }
  
//     // To retry on network errors, we recommend the RetryLink
//     // instead of the onError link. This just logs the error.
//     if (networkError) {
//       console.log(`[Network error]: ${networkError}`);
//     }
//   });

const httpLink = new HttpLink({ uri: GRAPHQL_API_ENDPOINT })

const cache = new InMemoryCache({
  // typePolicies: {
  //   Query: {
  //     fields: {
  //       tokens: {
  //         keyArgs: ['tags'],
  //         // merge(existing, incoming, { args: { offset = 0 }}) {
  //         //   // Slicing is necessary because the existing data is
  //         //   // immutable, and frozen in development.
  //         //   const merged = existing ? existing.slice(0) : [];
  //         //   for (let i = 0; i < incoming.length; ++i) {
  //         //     merged[offset + i] = incoming[i];
  //         //   }
  //         //   return merged;
  //         // },
  //       },
  //     },
  //   },
  // },
});

const client = new ApolloClient({
  cache: cache,
  link: from([errorLink, httpLink]),
});
// defaultOptions: {
//   watchQuery: {
//     fetchPolicy: "network-only",
//     nextFetchPolicy: "network-only",
//   },
// },

export default client;