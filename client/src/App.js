import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccountForm from './components/CreateAccountSteps/CreateAccountSteps';

import Landing from './pages/Landing';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import CreateTransaction from './pages/CreateTransaction'
import { ThemeProvider } from '@mui/material';
import { Container, createTheme } from '@mui/material';

import './App.css';
import AuthService from './utils/auth';

import '@fontsource/saira';


// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = AuthService.getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const theme = createTheme({
  typography:{
    fontFamily: 'Saira',
    fontWeight: 500
  },
  palette: {
    primary: {
      light: '#af8dff',
      main: '#7b5fe0',
      dark: '#4634ad',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#67ffd6',
      main: '#00eaa4',
      dark: '#00b675',
      contrastText: '#000000',
    },
  },
});

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar/>
            <Container >
              <Switch>
                <Route exact path="/">
                  <Landing />
                </Route>
                <Route exact path="/signin">
                  <SignIn />
                </Route>
                <Route exact path="/signup">
                  <SignUp />
                </Route>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/account/:id">
                  <Account/>
                </Route>
                <Route exact path="/createTransaction">
                  <CreateTransaction/>
                </Route>
                <Route exact path="/createAccount">
                  <AccountForm />
                </Route>
              </Switch>
            </Container>
          <Footer />
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App;
