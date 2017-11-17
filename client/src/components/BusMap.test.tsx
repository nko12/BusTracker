import * as React from 'react';
import {mount} from 'enzyme';
import {BusMap, BusMapProps} from './BusMap';

describe('BusMap', () => {
	let props: BusMapProps;
	let mountedBusMap: any; // TODO: what type?
	const busMap = () => {
		if (!mountedBusMap) {
			mountedBusMap = mount(
				<BusMap {...props} />
			);
		}
		console.log(busMap); // TODO: delete this
		return mountedBusMap;
	}

	beforeEach(() => {
		props = {
			busses: [{location: {lat: 0, lng: 0}, ID: '256'}],
			stops: [{location: {lat: 0, lng: 0}, ID: '400323'}],
			zoom: 10
		};
		mountedBusMap = undefined;
	});

	it('always renders a GoogleMap', () => {

	});
});