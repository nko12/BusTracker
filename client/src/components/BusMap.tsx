import * as React from 'react';
import GoogleMap from 'google-map-react'; // API: https://github.com/istarkov/google-map-react/blob/master/API.md
// There are two other GoogleMaps packages for React that I know about:
// google-maps-react and react-google-maps. Neither of which have
// TypeScript definitions, which is why we're using google-map-react.

// TODO: Props interface?
// TODO: remove `any`s

export class BusMap extends React.Component<any, any> {
	_onChange({center, zoom, bounds, marginBounds}: any) {
		console.log('center: ' + JSON.stringify(center));
	}

	render() {
		return (
			<GoogleMap
				defaultZoom={this.props.defaultZoom}
				defaultCenter={this.props.defaultCenter}
				onChange={this._onChange}
			/>
		);
	}
}

export default BusMap;