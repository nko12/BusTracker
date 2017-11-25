import * as React from 'react';
import {Card, CardTitle, CardText, TextField, Button} from 'react-md';
import {Coords} from 'google-map-react';
import {BusTrackerApi} from '../api/BusTrackerApi';

interface StopTypeDB {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
}

interface LogInState {
	active: boolean;
	username: string;
	password: string;
}

interface LogInProps {
	currentLocation: Coords;
	sendToParent: (stops: StopTypeDB[]) => void;
}

export default class LogIn extends React.Component<LogInProps, LogInState> {
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
		// do not accept the empty string
		if (this.state.username == '' || this.state.password == '') {
			alert('Username and/or password cannot be empty');
			return;
		}

		let loginRegisterResult;
		if (loginOrRegister == 'login')
			loginRegisterResult = await this.api.login(this.state.username, this.state.password);
		else
			loginRegisterResult = await this.api.register(this.state.username, this.state.password);

		if (loginRegisterResult.success) {
			this.hideLogin();
			
			const stopResult = await this.api.getBusStopsNearLocation(this.props.currentLocation);
			const routeResult = await this.api.getRoutesNearLocation(this.props.currentLocation);
			
			stopResult.message;
			routeResult.message;

			this.props.sendToParent(stopResult.data);
		} else
			alert(loginRegisterResult.message)
	}

	public hideLogin = () => {
		// get rid of the blurr once buttons 
		document.getElementsByClassName('blurr')[0].classList.remove('blurr');

		// janky way to stop this from rendering
		this.setState({active: false});
	}

	// TODO: @Nkosi, @Alex: Need to link login button to actually login
	render() {
		// janky way to get this component to stop rendering
		if (!this.state.active)
			return <div/>;

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