import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

// renders links on the navigation bar, changing depending on the user's authentication status
const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <a href = "https://legalhaven.herokuapp.com/" target="_blank">Legal Dictionary</a>
      </li>
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {/* if user is logged in, then display the my questions link */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/questions`}>My Questions</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/questions/new">Ask A Question</NavLink>
        </li>
      )}
      {/* if a user is not logged in, show the login link */}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Login</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
