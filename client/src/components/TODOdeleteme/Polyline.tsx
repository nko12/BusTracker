// import * as React from 'react';

// export class Polyline extends React.PureComponent<any, any> {
// 	componentWillUpdate() {
// 		this.line.setMap(null);
// 	}

// 	componentWillUnmount() {
// 		this.line.setMap(null);
// 	}

// 	getPaths() {
// 		const {origin, destination} = this.props;

// 		return [
// 			{lat: Number(origin.lat), lng: Number(origin.lng)},
// 			{lat: Number(destination.lat), lng: Number(destination.lng)},
// 		];
// 	}

// 	renderPolyline() {
// 		throw new Error('Implement renderPolyline method');
// 	}

// 	render() {
// 		const Polyline = this.props.maps.Polyline;
// 		const renderedPolyline = this.renderPolyline();
// 		const paths = {path: this.getPaths()};

// 		this.line = new Polyline(Object.assign({}, renderedPolyline, paths));
// 		this.line.setMap(this.props.map);

// 		return null;
// 	}
// }

// export default class Normal extends Polyline {
// 	renderPolyline() {
// 		return {
// 			geodesic: true,
// 			strokeColor: this.props.color || '#ffffff',
// 			strokeOpacity: 1,
// 			strokeWeight: 4,
// 		}
// 	}
// }