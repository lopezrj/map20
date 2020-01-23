import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Map from 'components/Map';
import About from 'components/About';
import Error from 'components/Error';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <div className="App-main">
        <Sidebar></Sidebar>
        <Switch>
          <Route path="/" component={Map} exact />
          <Route path="/about" component={About} />
          <Route component={Error} />  
        </Switch>
      </div>
    </div>
  );
}

export default App;
