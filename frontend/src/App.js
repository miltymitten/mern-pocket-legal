import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// import components
import Users from './user/pages/Users';
import NewQuestion from './questions/pages/NewQuestion';
import UserQuestions from './questions/pages/UserQuestions';
import UpdateQuestion from './questions/pages/UpdateQuestion';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

// App() renders the home page
const App = () => {
  // useState hooks for keeping track of whether the user is logged in and their ID
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  // callback hooks to set initial values of hooks above
  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  // empty routes variable so that it can be set below
  let routes;

  // change the pages that a user can see depending on their isLoggedIn status
  // this is to differentiate features available logged in vs logged out
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/questions" exact>
          <UserQuestions />
        </Route>
        <Route path="/questions/new" exact>
          <NewQuestion />
        </Route>
        <Route path="/questions/:questionId">
          <UpdateQuestion />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/questions" exact>
          <UserQuestions />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

// renders the page on the webbrowser using the routes variable defined based on the 
// user's authorization status (whether they're logged in our out)
  return (
    // keep track of user's authorization status 
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

// export app component 
export default App;
