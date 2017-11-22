import * as React from 'react';
import { Card, CardTitle, CardText, TextField, Button } from 'react-md';
import { BusTrackerApi } from '../api/BusTrackerApi';

interface LogInState {
	active: boolean;
	username: string;
	password: string;
}

interface LogInProps { }

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

	public async loginUser(): Promise<void> {
		const result = await this.api.login(this.state.username, this.state.password);
		if (result.success) {
			this.hideLogin();
		} else {
			alert(result.message);
		}
	}

	public async registerUser(): Promise<void> {
		const result = await this.api.register(this.state.username, this.state.password);
		if (result.success) {
			this.hideLogin();
		} else {
			alert(result.message);
		}
	}

	public hideLogin = () => {
		// get rid of the blurr once buttons 
		document.getElementsByClassName('blurr')[0].classList.remove('blurr');

		// janky way to stop this from rendering
		this.setState({ active: false });
	}

	// TODO: @Nkosi, @Alex: Need to link login button to actually login
	render() {
		// janky way to get this component to stop rendering
		if (!this.state.active) {
			return (<div/>);
		}
		return (
			<div className="blocker">
				<Card className="login" >
					<CardTitle title="Log In" subtitle="or Register" />
					<CardText>
						<TextField
							label="Username"
							type="text"
							onChange={(text: string) => this.setState({username: text})}
						/>
						<TextField
							label="Password"
							type="password"
							onChange={(text: string) => this.setState({password: text})}
						/>
						<Button
							raised={true}
							primary={true}
							onClick={async () => { await this.loginUser(); }}
						>
							Login
						</Button>
						<Button
							raised={true}
							secondary={true}
							onClick={async () => { await this.registerUser(); }}
						>
							Register
						</Button>
					</CardText>
				</Card>
			</div>
		);
	}
}