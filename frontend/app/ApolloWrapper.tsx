"use client";
import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

const GRAPHQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT}`;

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    uri: "https://api.studio.thegraph.com/query/88554/erc6956full/version/latest",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
