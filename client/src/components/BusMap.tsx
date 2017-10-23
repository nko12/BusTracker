import * as React from 'react';
import GoogleMap from 'google-map-react';

export class BusMap extends React.Component {
	render() {
		return (
			<GoogleMap
				defaultZoom={15} 
				defaultCenter={{lat: 40.71, lng: -74}}
			/>
		);
	}
}

export default BusMap;