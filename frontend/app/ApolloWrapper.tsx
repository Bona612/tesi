"use client";
// ^ this file needs the "use client" pragma

// import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

// const GRAPHQL_API_ENDPOINT = "https://api.studio.thegraph.com/query/88554/erc6956full/version/latest";
const GRAPHQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT}`;

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: "https://api.studio.thegraph.com/query/88554/erc6956full/version/latest",
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: "no-store" },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });

  // use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
    cache: new InMemoryCache(),
    link: httpLink,
  });

  // return new ApolloClient({
  //   cache: new InMemoryCache(),
  //   link:
  //     typeof window === "undefined"
  //       ? ApolloLink.from([
  //           new SSRMultipartLink({
  //             stripDefer: true,
  //           }),
  //           httpLink,
  //         ])
  //       : httpLink,
  // });
}
// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}




// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors)
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   if (networkError) console.error(`[Network error]: ${networkError}`);
// });
// // onError(({ graphQLErrors, networkError, operation, forward }) => {
// //     if (graphQLErrors) {
// //       for (let err of graphQLErrors) {
// //         switch (err.extensions.code) {
// //           // Apollo Server sets code to UNAUTHENTICATED
// //           // when an AuthenticationError is thrown in a resolver
// //           case "UNAUTHENTICATED":
// //             // Modify the operation context with a new token
// //             const oldHeaders = operation.getContext().headers;
// //             operation.setContext({
// //               headers: {
// //                 ...oldHeaders,
// //                 authorization: getNewToken(),
// //               },
// //             });
// //             // Retry the request, returning the new observable
// //             return forward(operation);
// //         }
// //       }
// //     }
  
// //     // To retry on network errors, we recommend the RetryLink
// //     // instead of the onError link. This just logs the error.
// //     if (networkError) {
// //       console.log(`[Network error]: ${networkError}`);
// //     }
// //   });

// const httpLink = new HttpLink({ uri: GRAPHQL_API_ENDPOINT })

// const cache = new InMemoryCache({
//   // typePolicies: {
//   //   Query: {
//   //     fields: {
//   //       tokens: {
//   //         keyArgs: ['tags'],
//   //         // merge(existing, incoming, { args: { offset = 0 }}) {
//   //         //   // Slicing is necessary because the existing data is
//   //         //   // immutable, and frozen in development.
//   //         //   const merged = existing ? existing.slice(0) : [];
//   //         //   for (let i = 0; i < incoming.length; ++i) {
//   //         //     merged[offset + i] = incoming[i];
//   //         //   }
//   //         //   return merged;
//   //         // },
//   //       },
//   //     },
//   //   },
//   // },
// });

// const client = new ApolloClient({
//   cache: cache,
//   link: from([errorLink, httpLink]),
// });
// // defaultOptions: {
// //   watchQuery: {
// //     fetchPolicy: "network-only",
// //     nextFetchPolicy: "network-only",
// //   },
// // },

// export default client;