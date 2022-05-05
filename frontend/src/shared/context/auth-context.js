import { createContext } from 'react';

// keep track of authorization status of users using this component
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {}
});
