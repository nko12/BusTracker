// Imports: 
import * as React from 'react';
import * as cookies from 'js-cookie';
import * as md5 from 'md5';
import {Card, CardTitle, CardText, TextField, Button} from 'react-md';
import {BusTrackerEvents} from '../BusTrackerEvents';
import {appState} from '../BusTrackerState';
import {BusTrackerApi} from '../api/BusTrackerApi';
import {User} from '../models/User';
import {TypedResult} from '../Result';

// States: 
interface LogInState {
	active: boolean;
	username: string;
	password: string;
}

interface LogInProps {}

// This function holds the functions for the login screen
export class LogIn extends React.Component<LogInProps, LogInState> {
	private readonly api: BusTrackerApi;

	public constructor(props: LogInProps) {
		super(props);
		this.state = {
			active: true,
			username: '',
			password: ''
		};

		this.api = new BusTrackerApi();
	}

	public async loginOrRegisterUser(loginOrRegister: string): Promise<void> {
		// Do not accept the empty string
		if (this.state.username == '' || this.state.password == '') {
			alert('Username and/or password cannot be empty');
			return;
		}

		let loginRegisterResult: TypedResult<User>;
		if (loginOrRegister == 'login')
			loginRegisterResult = await this.api.login(this.state.username, md5(this.state.password));
		else
			loginRegisterResult = await this.api.register(this.state.username, md5(this.state.password));

		if (loginRegisterResult.success) {
			// Store the user id in a cookie so they don't have to log in again.
			cookies.set('usernameAndHash', {username: loginRegisterResult.data.username, passwordHash: md5(this.state.password)});
			// Store the user object to the state and alert the rest of the UI that login has occurred.
			appState.user = Object.assign({}, loginRegisterResult.data);
			BusTrackerEvents.login.loginSucceeded.dispatch();
		} else
			alert(loginRegisterResult.message);
	}

	public hideLogin = () => {
		// Get rid of the blurr once buttons 
		document.getElementsByClassName('blurr')[0].classList.remove('blurr');

		// Set active to false
		this.setState({active: false});
	}

	render() {
		// Set the active state
		if (!this.state.active)
			return <div/>;

	// The return function holds text fields for the username and password.
	// It also holds the buttons Login and Register and the logic for them. 
		return (
			<div className='blocker'>
				<Card className='login' >
					<CardTitle title='Log In' subtitle='or Register' />
					<CardText>
						<TextField
							label='Username'
							type='text'
							onChange={(text: string) => this.setState({username: text})}
						/>
						<TextField
							label='Password'
							type='password'
							onChange={(text: string) => this.setState({password: text})}
						/>
						<Button
							raised
							primary
							onClick={async () => {await this.loginOrRegisterUser('login');}}
						>
							Login
						</Button>
						<Button
							raised
							secondary
							onClick={async () => {await this.loginOrRegisterUser('register');}}
						>
							Register
						</Button>
					</CardText>
				</Card>
			</div>
		);
	}
}