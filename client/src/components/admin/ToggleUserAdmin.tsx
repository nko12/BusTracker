import * as React from 'react';
import { Button, TextField, Grid, Cell } from 'react-md';
import { AdminViewProps } from './AdminTools';
import { appState } from '../../BusTrackerState';

/**
 * Interface for the state variables that the ToggleUserAdmin component needs to use.
 */
interface ToggleUserAdminState {
	targetUsername: string
}

/**
 * Represents the contents of the Toggle Admin tab in the AdminTools window. This allows
 * an administrator to grant or revoke admin priviliges on another user.
 */
export class ToggleUserAdmin extends React.Component<AdminViewProps, ToggleUserAdminState> {

	public constructor(props: AdminViewProps) {
		super(props);
		this.state = {
			targetUsername: ''
		};
	}

	public render() {

		return (
			<div style={{ width: '80%', float: 'none', margin: '0 auto' }}>
				<Grid>
					<Cell size={8}>
						<TextField
							id={'text-field-target-user-id'}
							placeholder={'Target Username...'}
							value={this.state.targetUsername}
							onChange={(value: string) => this.setState({ targetUsername: value })}
						/>
					</Cell>
				</Grid>
				<Grid>
					<Cell size={4}>
						<Button raised onClick={async () => await this.toggleAdminStatusRequested(true)}>Grant Admin Status</Button>
					</Cell>
					<Cell size={4}>
						<Button raised onClick={async () => await this.toggleAdminStatusRequested(false)}>Revoke Admin Status</Button>
					</Cell>
				</Grid>
			</div>
		);
	}

	/**
	 * Toggles the admin status of the user whose username was provided in the textbox.
	 * @param adminStatus: True to grant admin status, false to revoke it.
	 */
	private toggleAdminStatusRequested = async (adminStatus: boolean) => {

		// Attempt to grant or revoke the admin status of the target user.
		const result = await appState.api.toggleAdminRights(appState.user.id, this.state.targetUsername, adminStatus);
		if (result.success) {
			if (adminStatus) {
				this.props.showToastCallback('Granted ' + this.state.targetUsername + ' admin privileges.');
			} else {
				this.props.showToastCallback('Revoked ' + this.state.targetUsername + '\'s admin privileges.');
			}
			
			this.setState({targetUsername: ''});        
		} else {
			this.props.showToastCallback('Failed to change admin status: ' + result.message);
		}
	}
}