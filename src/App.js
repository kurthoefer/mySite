import React, { Component } from 'react';
import './App.css';

import LandingContainer from './components/landing/LandingContainer';

class App extends Component {
  render() {
    return (
      <div id='landingWindow'>
        <LandingContainer />
      </div>
    );
  }
}

export default App;
