import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
import './App.css';

export class App extends React.Component {
	render() {
		return (
			<div>
				<div className="SideBar">
					<SideBar />
				</div>
				<div className="BusMap">
					<BusMap
						defaultZoom={15}
						defaultCenter={{lat: 40.71, lng: -74}}
					/>
				</div>
			</div>
		);
	}
}

export default App;