import * as React from 'react';
import {TextField} from 'react-md';
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
	
	render() {
		return (
			<div>
				<TextField
					label="Username"
				/>
				<TextField
					label="Password"
				/>
			</div>
		);
	}
}