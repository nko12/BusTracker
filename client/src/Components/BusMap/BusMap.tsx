import * as React from 'react';
import GoogleMap from 'google-map-react';

export class BusMap extends React.Component {
    render() {
        return (
            <GoogleMap defaultZoom={5} defaultCenter={{lat: 59.95, lng: 30.33}} />
        );
    }
}

      {/* <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <busmap.BusMap />
      </div> */}