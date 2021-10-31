import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { green, orange } from '@mui/material/colors';
import { ThemeProvider } from '@mui/private-theming';
import { Container, createTheme } from '@mui/material';

import './App.css';
import AuthService from './utils/auth';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


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

const stanceTheme = createTheme({
  typography: {
    h6: {
      fontSize: 36
    }
  },
  palette:{
    primary: {
      main: green[400]
    },
    secondary: {
      main: orange[300]
    }
  }
})

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={stanceTheme}>
        <Router>
          <Navbar />
            <Container >
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/profile">
                  <Profile />
                </Route>
                <Route exact path="/signin">
                  <SignIn />
                </Route>
                <Route exact path="/signup">
                  <SignUp />
                </Route>
                <Route exact path="/me">
                  <Profile />
                </Route>
                <Route exact path="/profiles/:username">
                  <Profile />
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
