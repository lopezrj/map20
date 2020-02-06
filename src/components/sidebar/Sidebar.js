import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.css';

function Button(props) {
  return (
    <Link to={props.to}><li>{props.text}</li></Link>
  )
}

export class Sidebar extends Component {
  render() {
    return (
      <div className="App-sidebar">
        <ul>
          <Button to='/' text="Mapa" />
          <Button to='/asegurados' text="Asegurados" />
          <Button to='/about' text="About" />
        </ul>
      </div>
    )
  }
}

export default Sidebar
