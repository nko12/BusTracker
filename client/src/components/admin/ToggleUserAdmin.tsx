import * as React from 'react';
import { Button, TextField, Grid, Cell } from 'react-md';
import { AdminViewProps } from './AdminTools';
import { appState } from '../../BusTrackerState';

interface ToggleUserAdminState {
	targetUsername: string
}

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

	private toggleAdminStatusRequested = async (adminStatus: boolean) => {

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