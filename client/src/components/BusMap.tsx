import * as React from 'react';
import GoogleMap from 'google-map-react';
import './../styles/BusMap.css';

export class BusMap extends React.Component {
	render() {
		return (
			<div className='BusMap'>
				<GoogleMap
					defaultZoom={15} 
					defaultCenter={{lat: 40.71, lng: -74}}
				/>
			</div>
		);
	}
}

export default BusMap;