import React from 'react';

import './MainHeader.css';

// renders the website logo
const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
