import * as React from 'react';
//import BusMap from './components/BusMap';
//import SideBar from './components/SideBar';
import LogIn from './components/LogIn';
import * as GMapReact from 'google-map-react';
import './App.css';
import {CardText} from 'react-md';
import {Button} from 'react-md';

interface AppState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
}

export default class App extends React.Component<{}, AppState> {
	public constructor(props: Object) {
		super(props);
		this.state = {
			pointA: {lat: 41.337716, lng: -74.35912},
			pointB: {lat: 40.7588528, lng: -73.9852625}
		};
	}

	recieveFromSideBar = (pointA: GMapReact.Coords, pointB: GMapReact.Coords) => {
		this.setState({pointA: pointA, pointB: pointB});
	}

	render() {
		return (
			<div className="loginPage">
				<h2>Login Page</h2>
				<LogIn />
				<Button raised primary>Login?</Button>
				<CardText>Don't have an account?</CardText>
				<Button raised secondary>Create A New Account?</Button>
			</div>	
		);
	}
}