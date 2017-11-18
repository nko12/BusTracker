import * as React from 'react';
import * as GMapReact from 'google-map-react';

export interface BusMarkerProps {
	text: string;
	lat: number;
	lng: number;
}

interface BusMarkerState {
	pointA: GMapReact.Coords;
	pointB: GMapReact.Coords;
}

export default class BusMarker extends React.Component<BusMarkerProps, BusMarkerState> {
	render() {
		return (
			<div className="busMarker">
				{this.props.text}
			</div>
		);
	}
}