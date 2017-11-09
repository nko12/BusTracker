import * as React from 'react';
import { TextField, Button, CardText } from 'react-md';

// API: https://react-md.mlaursen.com/components/

interface LogInState {
	
}

interface LogInProps {

}

export default class LogIn extends React.Component<LogInProps, LogInState> {
	public constructor(props: LogInProps) {
		super(props);
		this.state = {
			
		};
	}

	// Need to link login button to actually login
	// Need to link create an account button to register page
	render() {
		return (
			<div className="loginCenter">
				<h2>Login</h2>
				<TextField
					label="Username:"
					type="text"
				/>
				
				<TextField
					label="Password:"
					type="password"
				/>
				
				<CardText> </CardText> 
				<Button raised primary>Login?</Button>
				<CardText>Don't have an account?</CardText>
				<Button raised secondary>Create A New Account?</Button>

			</div>
		);
	}
}