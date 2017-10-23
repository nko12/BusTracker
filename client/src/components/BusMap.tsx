import * as React from 'react';
import GoogleMap from 'google-map-react';

export class BusMap extends React.Component {
	render() {
		return (
			<GoogleMap
				defaultZoom={5} 
				defaultCenter={{lat: 59.95, lng: 30.33}}
			/>
		);
	}
}