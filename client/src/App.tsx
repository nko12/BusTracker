import * as React from 'react';
import {appState} from './BusTrackerState';
import {BusTrackerEvents} from './BusTrackerEvents';
import * as cookies from 'js-cookie';
import {BusMap} from './components/BusMap';
import {SideBar} from './components/SideBar';
import LogIn from './components/LogIn';
import {Snackbar} from 'react-md';
import './styles/App.css';

interface Toast {
	text: string
}

interface AppState {
	isUserLoggedIn: boolean;
	toasts: Array<Toast>
}

export default class App extends React.Component<{}, AppState> {
	state = {
		isUserLoggedIn: false,
		toasts: new Array<Toast>()
	};

	public constructor(props: {}) {
		super(props);

		this.setState({});

		this.onLogin = this.onLogin.bind(this);
		this.onDismissToast = this.onDismissToast.bind(this);
		this.showToast = this.showToast.bind(this);
		this.onLogout = this.onLogout.bind(this);

		// TODO: uncomment this after debugging
		// it will change the current location to the user's geolocation, but by default it's NYC
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
		this.setState({toasts});
	}

	private showToast(message: string): void {
		const toasts = this.state.toasts.slice();
		toasts.push({text: message});
		this.setState({toasts});
	}

	render() {
		return (
			<div>
				{this.state.isUserLoggedIn ? null : <LogIn />}
				<div id={'appBlur'} className='blurr'>
					<div className='SideBar'>
						<SideBar />
					</div>
					<div className='BusMap'>
						<BusMap
							zoom={12}
						/>
					</div>
				</div>
				<Snackbar
					id='welcome-snackbar'
					autohide={true}
					toasts={this.state.toasts}
					onDismiss={this.onDismissToast}
					autohideTimeout={1500}
					// TODO: align text center
				/>
			</div>
		);
	}
}