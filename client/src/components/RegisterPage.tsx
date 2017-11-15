import * as React from 'react';
//import PropTypes from 'prop-types';
import { TextField, Button, CardText } from 'react-md';

interface RegisterState {
	
}

interface RegisterProps {
		// onSubmit: props.func.isRequired,
		// onChange: props.func.isRequired,

}

export default class RegisterPage extends React.Component<RegisterProps, RegisterState> {
	public constructor(props: RegisterProps) {
		super(props);
		this.state = {
			
		};
	}
		
		// CardText that has a space needs to be adjust to put an acutal space
		// Need to have login button link to login page
		// Need to have register button actually store the user's info
	render() {
		return (
			<div className="registerCenter">
				<h2>Register</h2>
				<CardText>Enter a username:</CardText>

				<TextField
					label="Username:"
					type="text"
				/>

				<CardText>Enter a password:</CardText>
				<TextField
					label="Password:"
					type="password"
				/>

				<TextField
					label="Re-enter Password:"
					type="password"
				/>
				<CardText/> 
				<Button 
					raised={true} 
					primary={true}
				>Register?
				</Button>
				<CardText>Already have an account?</CardText>
				<Button 
					raised={true}
				>Login
				</Button>

			</div>
	 
		);
		}
}