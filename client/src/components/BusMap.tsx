import * as React from 'react';
import GoogleMap from 'google-map-react';

// TODO: Props interface?

export class BusMap extends React.Component<any, any> {
	constructor() {
		super();
		this.state = {
			map: null
		};
	}

	mapMoved() {
		console.log('mapMoved: ');
	}

	render() {
		return (
			<GoogleMap
				defaultZoom={this.props.defaultZoom}
				defaultCenter={this.props.defaultCenter}
				onChange={this.mapMoved.bind(this)}
			/>
		);
	}
}

export default BusMap;