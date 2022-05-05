import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

// renders a backdrop on the web browser (i.e. a dark background when a modal shows up)
const Backdrop = props => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
