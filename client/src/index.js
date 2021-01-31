import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache,ApolloProvider } from '@apollo/client'
import { createHttpLink } from 'apollo-link-http';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';



//연동할 graphql 서버의 uri를 설정해야해야 함.

const httpLink = createHttpLink({
  uri :"http://localhost:3002/graphql"
});

const wsLink = new WebSocketLink({
  uri : "ws://localhost:3002/subscriptions",
  options :{
    reconnect : true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);



const client = new ApolloClient({
  splitLink,
  uri : "http://localhost:3002/graphql",
  cache: new InMemoryCache()
});
//for fetching data

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
