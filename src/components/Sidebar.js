import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.css';

export class Sidebar extends Component {
  render() {
    return (
      <div className="App-sidebar">
        <ul>
          <li><Link to='/'>Mapa</Link></li>
          <li><Link to='/about'>About</Link></li>
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
