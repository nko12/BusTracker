import * as React from 'react';
import {Card, CardTitle, CardText, TextField, Button} from 'react-md';

interface LogInState {}

interface LogInProps {}

export default class LogIn extends React.Component<LogInProps, LogInState> {
	public constructor(props: LogInProps) {
		super(props);
		this.state = {};
	}

	hideLogin = () => {
		console.log('wawawewa');
		var blocker = document.getElementsByClassName('blocker')[0];
		// blocker.style.display = 'none';
		console.log(blocker);
	}

	// TODO: @Nkosi, @Alex: Need to link login button to actually login
	render() {
		return (
			<div className='blocker'>
				<Card className='login' >
					<CardTitle title='Log In' subtitle='or Register' />
					<CardText>
						<TextField
							label='Username'
							type='text'
						/>
						<TextField
							label='Password'
							type='password'
						/>
						<Button
							raised
							primary
							onClick={() => {this.hideLogin()}}
						>
						Login
						</Button>
						<Button
							raised
							secondary
							onClick={() => {this.hideLogin()}}
						>
						Register
						</Button>
					</CardText>
				</Card>
			</div>
		);
	}
}