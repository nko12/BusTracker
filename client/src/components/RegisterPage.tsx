import * as React from 'react';
//import PropTypes from 'prop-types';
import { TextField, Button, CardText } from 'react-md';

interface RegisterState {
	
}

interface RegisterProps {
    // onSubmit: props.func.isRequired,
    // onChange: props.func.isRequired,

}

// const RegisterPage = 
// ({
//     onSubmit,
//     onChange,
//     errors,
//     user,
// }) => (

//     <Card className="registerPage">
//      <form action="/" onSubmit={onSubmit}>
//         <h2>Register Page</h2>

//         {errors.summary && <p className="error-message">{errors.summary}</p>}

//         <div className="field-line">
//             <TextField
//                 label="Username"
//                 name="username"
//                 errorText={errors.username}
//                 onChange={onChange}
//                 value={user.username} 
//             />
//         </div> 

//         <div className="field-line">
//             <TextField
//                 label="Password"
//                 type="password"
//                 name="password"
//                 errorText={errors.password}
//                 onChange={onChange}
//                 value={user.password} 
//             />
//         </div>  

//         <div className="button-line">
//         <Button raised primary>Register?</Button>
//         //<CardText>Already have an account?</CardText> 
//         // Basically want to connnect back to the login screen.  
//         <Button raised>Already have an account?</Button>
//         </div> 

//       </form>
//     </Card>  
                
// );



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
                <CardText> </CardText> 
                <Button raised primary>Register?</Button>
                <CardText>Already have an account?</CardText>
                <Button raised>Login</Button>

			</div>
   
		);
    }
}