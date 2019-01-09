import graphqlQueries from './graphql/queries';
import graphqlMutations from './graphql/mutations';
import graphqlClient from './graphql';
import notification from './notification';


function gqQuery(name, variables) {
  const queryName = `${name}`;
  return graphqlClient.query({
    query: graphqlQueries[queryName],
    variables,
  })
    .then(({ data }) => data)
    .catch((error) => {
      let messages = '';
      error.graphQLErrors.forEach((value) => {
        if (value.category === 'internal') {
          messages = `${messages} ${value.debugMessage}`;
        }
        if (value.category === 'graphql') {
          messages = `${messages} ${value.message}`;
        }
      });
      notification.showError(messages);
      return Promise.reject(error);
    });
}

function gqMutation(name, variables) {
  return graphqlClient.mutate({
    mutation: graphqlMutations[name],
    variables,
  })
    .then(({ data }) => data)
    .catch((error) => {
      let messages = '';
      error.graphQLErrors.forEach((value) => {
        // if (value.message === 'validation') {
        //   Object.values(value.validation).forEach(([message]) => {
        //     messages = `${messages} ${message}`;
        //   });
        // } else {
        //   const message = `${value.message.split('{')[0]} ${value.message.split('.')[value.message.split('.').length - 2]}`;
        //   messages = `${messages} ${message}`;
        // }
        if (value.category === 'internal') {
          messages = `${messages} ${value.debugMessage}`;
        }
      });
      notification.showError(messages);
      return Promise.reject(error);
    });
}

export {
  gqQuery,
  gqMutation,
};
