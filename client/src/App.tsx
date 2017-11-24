import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { appStartupAction } from './state/BusTrackerState';
import * as cookies from 'js-cookie';
import * as GoogleMapReact from 'google-map-react';
import {BusMap, BusType, StopType} from './components/BusMap';
import {SideBar} from './components/SideBar';
import LogIn from './components/LogIn';
import './styles/App.css';

const ORIGIN = {lat: 0.0, lng: 0.0};
const NYC = {lat: 40.7588528, lng: -73.9852625};

interface StopTypeDB {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
}

interface AppProps {
	dispatch: Dispatch<{}>
}

interface AppState {
	isUserLoggedIn: boolean;
	/* allStops: Map<number, StopType>;
	allBusses: Map<number, BusType>;

	activeBusses: BusType[];
	activeStops: StopType[];

	currentLocation: GoogleMapReact.Coords;
	polyString: string; */
}

class App extends React.Component<AppProps, AppState> {
	state = {
		/* allStops: new Map<number, StopType>(),
		allBusses: new Map<number, BusType>(),

		activeBusses: [{location: ORIGIN, ID: '256'}],
		activeStops: [{location: ORIGIN, ID: '256', name: 'default'}],

		currentLocation: NYC,
		polyString: '' */

		isUserLoggedIn: false
	};

	public constructor(props: AppProps) {
		super(props);

		this.setState({
			/* activeBusses: [{location: ORIGIN, ID: '256'}], // TODO: hashmap[0]
			activeStops: [{location: ORIGIN, ID: '400323', name: 'default'}], // TODO: hashmap[0]
			currentLocation: NYC,
			polyString: '' */
		});

		// TODO: uncomment this after debugging
		// navigator.geolocation.getCurrentPosition((position: any) => {
		// 	this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}});
		// });
	}

	componentDidMount() {
		const userId: string = cookies.get('userId');
		this.props.dispatch(appStartupAction(userId));
	}

	/* recieveFromLogin = (stopsFromLogin: StopTypeDB[]) => {
		let mappedStops = this.state.allStops;
		for (let i = 0; i < stopsFromLogin.length; i++) {
			let stop: StopType = {
				ID: stopsFromLogin[i].id,
				name: stopsFromLogin[i].name,
				location: {
					lat: stopsFromLogin[i].latitude,
					lng: stopsFromLogin[i].longitude
				}
			}
			mappedStops.set(parseInt(stopsFromLogin[i].id.split('_')[1]), stop);
		}

		this.setState({allStops: mappedStops});
	}

	recieveFromSideBar = (activeBusses = this.state.activeBusses, activeStops = this.state.activeStops, polyString = this.state.polyString) => {
		this.setState({activeBusses: activeBusses, activeStops: activeStops, polyString: polyString});
	} */

	render() {
		return (
			<div>
				<LogIn 
					/* currentLocation={this.state.currentLocation}
					sendToParent={this.recieveFromLogin} */
				/>
				<div className='blurr'>
					<div className='SideBar'>
						<SideBar
							/* busses={this.state.activeBusses}
							allStops={this.state.allStops}
							activeStops={this.state.activeStops}
							polyString={this.state.polyString}
							sendToParent={this.recieveFromSideBar} */
						/>
					</div>
					<div className='BusMap'>
						<BusMap
							zoom={12}
							/* busses={this.state.activeBusses}
							stops={this.state.activeStops}
							polyString={this.state.polyString} */
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default connect()(App);