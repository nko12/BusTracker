import * as React from 'react';
import { appState } from './BusTrackerState';
import { BusTrackerEvents } from './BusTrackerEvents';
import * as cookies from 'js-cookie';
/* import * as GoogleMapReact from 'google-map-react'; */
import { BusMap } from './components/BusMap';
import { SideBar } from './components/SideBar';
import LogIn from './components/LogIn';
import { Snackbar } from 'react-md';
import './styles/App.css';

/* const ORIGIN = { lat: 0.0, lng: 0.0 };
const NYC = { lat: 40.7588528, lng: -73.9852625 };

interface StopTypeDB {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
} */

interface Toast {
	text: string
}

interface AppState {
	isUserLoggedIn: boolean;
	toasts: Array<Toast>
	/* allStops: Map<number, StopType>;
	allBusses: Map<number, BusType>;

	activeBusses: BusType[];
	activeStops: StopType[];

	currentLocation: GoogleMapReact.Coords;
	polyString: string; */
}

export default class App extends React.Component<{}, AppState> {
	state = {
		/* allStops: new Map<number, StopType>(),
		allBusses: new Map<number, BusType>(),

		activeBusses: [{location: ORIGIN, ID: '256'}],
		activeStops: [{location: ORIGIN, ID: '256', name: 'default'}],

		currentLocation: NYC,
		polyString: '' */

		isUserLoggedIn: false,
		toasts: new Array<Toast>()
	};

	public constructor(props: {}) {
		super(props);

		this.setState({
			/* activeBusses: [{location: ORIGIN, ID: '256'}], // TODO: hashmap[0]
			activeStops: [{location: ORIGIN, ID: '400323', name: 'default'}], // TODO: hashmap[0]
			currentLocation: NYC,
			polyString: '' */
		});

		this.onLogin = this.onLogin.bind(this);
		this.onDismissToast = this.onDismissToast.bind(this);
		this.showToast = this.showToast.bind(this);
		this.onLogout = this.onLogout.bind(this);

		// TODO: uncomment this after debugging
		// navigator.geolocation.getCurrentPosition((position: any) => {
		// 	this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}});
		// });
	}

	public async componentDidMount(): Promise<void> {

		// Listen to certain events.
		BusTrackerEvents.login.loginSucceeded.add(this.onLogin);
		BusTrackerEvents.login.logoutRequested.add(this.onLogout);

		// Is the user already logged in?
		const userIdAndHash = cookies.getJSON('usernameAndHash');
		if (userIdAndHash != null) {
			// Retrieve the user's data.
			const result = await appState.api.login(userIdAndHash['username'], userIdAndHash['passwordHash']);
			if (result.success) {
				// Store the user data into the state.
				appState.user = result.data;
				// Set up the ui with the user's data.
				this.onLogin();
			} else {
				// Unable to login the user. The login UI will show up.
				this.showToast('Unable to log you back in, please login again.');
			}
		}
	}

	private onLogin(): void {

		// Hide the blur background and login window.
		this.setState({ isUserLoggedIn: true });

		// Have to manually remove the blur.
		document.getElementById('appBlur').classList.remove('blurr');

		// Show a message welcoming the user.
		this.showToast('Welcome ' + appState.user.username);
	}

	private onLogout(): void {

		// Logout has been requested.
		this.setState({ isUserLoggedIn: false});
		cookies.remove('usernameAndHash');

		// Show a message telling the user they've been logged out.
		this.showToast('Goodbye ' + appState.user.username);

		// Have to manually remove the blur.
		document.getElementById('appBlur').classList.add('blurr');

		// Reset the app state accordingly.
		appState.user = null;
	}

	private onDismissToast(): void {
		const [, ...toasts] = this.state.toasts;
		this.setState({ toasts });
	}

	private showToast(message: string): void {
		
		const toasts = this.state.toasts.slice();
		toasts.push({ text: message });
		this.setState({ toasts });
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
				{this.state.isUserLoggedIn ? null : <LogIn />}
				<div id={'appBlur'} className='blurr'>
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
				<Snackbar
					id="welcome-snackbar"
					autohide={true}
					toasts={this.state.toasts}
					onDismiss={this.onDismissToast}
					autohideTimeout={1500}
				/>
			</div>
		);
	}
}