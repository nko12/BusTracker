import * as React from 'react';
import './App.css';
// import * as busmap from './Components/BusMap/BusMap';
import GoogleMap from 'google-map-react';

// const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <GoogleMap 
        defaultZoom={11} 
        defaultCenter={{lat: 59.95, lng: 30.33}}
      />
    );
  }
}

export default App;
