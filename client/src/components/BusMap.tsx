import * as React from 'react';
import GoogleMap from 'google-map-react'; // API: https://github.com/istarkov/google-map-react/blob/master/API.md
// There are a few other GoogleMaps packages for React that I know about:
// google-maps-react
// react-google-maps
// react-gmaps
// None of which have TypeScript definitions, which is why we're using google-map-react.
// however, the documentation for google-map-react is sparse and it doesn't seem to do as much as the others

// TODO: Props interface?
// TODO: remove `any`s

// import {GoogleApiWrapper} from 'google-maps-react';

export default class BusMap extends React.Component<any, any> {
	state = {
		pointA: this.props.pointA,
		pointB: this.props.pointB,
	}

	componentDidUpdate(prevProps: object, PrevState: object) {
		console.log(JSON.stringify(this.state));
		console.log(JSON.stringify(this.props));
	}

	_onChange({center, zoom, bounds, marginBounds}: any) {
		console.log('center: ' + JSON.stringify(center));
	}

	render() {
		return (
			<GoogleMap
				// defaultZoom={this.props.defaultZoom}
				zoom={this.props.zoom}
				center={this.props.pointA}
				onChange={this._onChange}
			/>
		);
	}
}

// export default GoogleApiWrapper({
// 	apiKey: (AIzaSyBc6ogBABh5D1YHPjL5aarMJ5cbizS8fzc)
// })(BusMap)