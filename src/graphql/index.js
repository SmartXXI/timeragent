import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const apiUrl = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:8080';

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: apiUrl,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('accessToken');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const defaultOptions = {
  query: {
    fetchPolicy: 'network-only',
  },
};

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions,
  connectToDevTools: true,
});

export default apolloClient;
