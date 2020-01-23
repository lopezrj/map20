import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.css';

export class Sidebar extends Component {
  render() {
    return (
      <div className="App-sidebar">
        <ul>
          <Link to='/'><li>Mapa</li></Link>
          <Link to='/about'><li>About</li></Link>
          <li>Other</li>
          <li>Other</li>
          <li>Other</li>
          <li>Other</li>
        </ul>
      </div>
    )
  }
}

export default Sidebar
