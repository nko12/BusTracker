import * as React from 'react';
import BusMap from './components/BusMap';
import SideBar from './components/SideBar';
// import {NavigationDrawer} from 'react-md';
import './App.css';

// const logo = require('./logo.svg');

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
			// <NavigationDrawer
			// 	drawerTitle='react-md with CRA'
			// 	toolbarTitle='Welcome to react-md'
			// >
			// 	<div className='App'>
			// 		<header className='App-header'>
			// 			<img src={logo} className='App-logo' alt='logo' />
			// 			<h1 className='App-title'>Welcome to React</h1>
			// 		</header>
			// 		<p className='App-intro'>
			// 			To get started, edit <code>src/App.tsx</code> and save to reload.
			// 		</p>
			// 	</div>
			// </NavigationDrawer>
		);
	}
}

export default App;