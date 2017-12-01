import * as React from 'react';
import { TextField, Button } from 'react-md';
import { appState } from '../../BusTrackerState';
import { AdminViewProps } from './AdminTools';
// import { BusTrackerEvents } from '../../BusTrackerEvents';

/**
 * Interface for the state variables that the CreateStop component needs to use.
 */
interface CreateStopState {
	latitude: string,
	longitude: string,
	name: string,
	lastStopId: string
}

/**
 * Represents the contents of the Create Bus Stop tab in the AdminTools window. This 
 * component allows an administrator to create a new bus stop.
 */
export class CreateStop extends React.Component<AdminViewProps, CreateStopState> {

	public constructor(props: AdminViewProps) {
		super(props);
		this.state = {
			latitude: null,
			longitude: null,
			name: '',
			lastStopId: ''
		};
	}

	public render() {
		
		let idArea = null;
		if (this.state.lastStopId != '') {
			idArea = (
				<div>
					<span>New Bus Stop ID: {this.state.lastStopId}</span>
				</div>
			)
		}
		return (
			<div className={'md-grid'}>
					<TextField
						id={'textFieldStopName'}
						placeholder={'Enter Bus Stop Name...'}
						value={this.state.name}
						onChange={(text: string) => this.setState({ name: text })} />
					<TextField
						id={'textFieldStopLat'}
						placeholder={'Enter Bus Stop Latitude...'}
						value={this.state.latitude}
						onChange={(text: string) => this.setState({ latitude: text })} />
					<TextField
						id={'textFieldStopLong'}
						placeholder={'Enter Bus Stop Longitude...'}
						value={this.state.longitude}
						onChange={(text: string) => this.setState({ longitude: text })} />
					<Button primary flat onClick={async () => await this.addNewBus()}>Create Bus Stop</Button>
					{idArea}
			</div>
		);
	}

	/**
	 * Creates a new fake bus stop using the bus stop name, latitude and longitude that the administrator provided
	 * to the user interface.
	 */
	private addNewBus = async (): Promise<void> => {
		
		// Attempt to create the new stop.
		const result = await appState.api.addNewStop(appState.user.id, this.state.name, parseFloat(this.state.latitude), parseFloat(this.state.longitude));
		if (result.success) {
			this.setState({latitude: '', longitude: '', name: '', lastStopId: result.data});
			this.props.showToastCallback('Successfully created new bus stop. ID: ' + result.data);
		} else {
			this.props.showToastCallback('Failed to create new bus stop: ' + result.message);
		}
	}
}