import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/footer';
import { Container, Grid } from '@mui/material';
import SignInUpButton from './components/signInUpButton';
import './App.css';

const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Navbar />
        <Router>
          <Container >
              <Route exact path="/">
                <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{minHeight: '60vh'}}>
                  <Grid item xs={12}>
                    <SignInUpButton />
                  </Grid>
                </Grid>
              </Route>
          </Container>
        </Router>
      <Footer />
    </ApolloProvider>
  )
}

export default App;
