import * as React from 'react';
import { Card, CardTitle, CardText, TextField, Button } from 'react-md';

interface LogInState {
	active: boolean;
}

interface LogInProps { }

export default class LogIn extends React.Component<LogInProps, LogInState> {
	public constructor(props: LogInProps) {
		super(props);
		this.state = {
			active: true
		};
	}

	hideLogin = () => {
		// get rid of the blurr
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
						/>
						<TextField
							label="Password"
							type="password"
						/>
						<Button
							raised={true}
							primary={true}
							onClick={() => { this.hideLogin(); }}
						>
							Login
						</Button>
						<Button
							raised={true}
							secondary={true}
							onClick={() => { this.hideLogin(); }}
						>
							Register
						</Button>
					</CardText>
				</Card>
			</div>
		);
	}
}