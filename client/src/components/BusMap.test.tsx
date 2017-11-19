import * as React from 'react';
// import * as GoogleMapReact from 'google-map-react';
import {mount, ReactWrapper} from 'enzyme';
import GoogleMap from 'google-map-react';

import {BusMap, BusMapProps, BusMapState, StopType} from './BusMap';

const NYC = {lat: 40.7588528, lng: -73.9852625};

function centroid(stops: StopType[]) {
	let centroid = {lat: 0.0, lng: 0.0};
	let total = stops.length;

	for (let i = 0; i < stops.length; i++) {
		centroid.lat += stops[i].location.lat;
		centroid.lng += stops[i].location.lng;
	}
	centroid.lat /= total;
	centroid.lng /= total;

	return centroid;
}

describe('BusMap on init', () => {
	let busMapWrapper: ReactWrapper<BusMapProps, BusMapState>;
	let props: BusMapProps;
	let state: BusMapState;
	
	beforeEach(() => {
		// Create some BusMap properties
		props = {
			busses: [{ID: '512', location: NYC}],
			stops: [{ID: '400343', location: NYC}],
			zoom: 5
		};
		// Create a BusMap object to test on
		busMapWrapper = mount(<BusMap {...props} />);
		// capture state on init
		state = busMapWrapper.instance().state;
	});

	it('should render a Google Map', () => {
		expect(busMapWrapper.find(GoogleMap).length).toEqual(1);
	});

	it('should have received props', () => {
		expect(busMapWrapper.instance().props).toEqual(props);
	});

	it('should have a state', () => {
		expect(busMapWrapper.instance().state).toBeDefined();
	});

	it('should initialize state that reflects props', () => {
		expect(state.zoom).toBe(props.zoom);
		expect(state.center).toEqual(centroid(state.stops));

		// expect(state.map).toBeInstanceOf(google.maps.Map);
		// expect(state.maps).toBeInstanceOf(GoogleMapReact.Maps);

		expect(state.mapLoaded).toBeTruthy();

		expect(state.busses).toEqual(props.busses);
		expect(state.stops).toEqual(props.stops);

		// expect(state.busMarkers).toBeInstanceOf(google.maps.Marker[]);
		// expect(state.stopMarkers).toBeInstanceOf(google.maps.Marker[]);
	});

	it('should have a Google Map with passed parameters, or at least the ones we can check', () => {
		expect(state.map).toBeDefined();
		if (state.map != undefined) {
			expect(state.map.getZoom()).toEqual(state.zoom);
			expect(state.map.getCenter()).toEqual(state.center);
		}
	});
});

describe('BusMap on change', () => {
	let busMapWrapper: ReactWrapper<BusMapProps, BusMapState>;
	let props: BusMapProps;
	let state: BusMapState;
	
	beforeAll(() => {
		// Create some BusMap properties
		props = {
			busses: [{ID: '512', location: NYC}],
			stops: [{ID: '400343', location: NYC}],
			zoom: 5
		};
		// Create a BusMap object to test on
		busMapWrapper = mount(<BusMap {...props} />);
		// capture state on init
		state = busMapWrapper.instance().state;
	});

	beforeEach(() => {
		// redefine props
		props = {
			busses: [
				{ID: '256', location: {lat: 40.7588528, lng: -73.9852625}},
				{ID: '257', location: {lat: 40.7588528, lng: -74.9852625}},
				{ID: '258', location: {lat: 41.7588528, lng: -73.9852625}},
				{ID: '259', location: {lat: 41.7588528, lng: -74.9852625}}
			],
			stops: [
				{ID: '400343', location: {lat: 41.7588528, lng: -74.9852625}},
				{ID: '400344', location: {lat: 41.7588528, lng: -75.9852625}},
				{ID: '400345', location: {lat: 42.7588528, lng: -74.9852625}},
				{ID: '400346', location: {lat: 42.7588528, lng: -75.9852625}}
			],
			zoom: 5
		};
	});

	it('should receive new props', () => {
		expect(busMapWrapper.instance().props).toEqual(props);
	});

	it('should have a new state', () => {
		expect(JSON.stringify(busMapWrapper.instance().state) == JSON.stringify(state)).toBeFalsy();
	});

	it('should have correct new state', () => {
		let newState = busMapWrapper.instance().state;

		expect(newState.zoom).toBe(props.zoom);
		expect(newState.center).toEqual(centroid(newState.stops));

		// expect(state.map).toBeInstanceOf(google.maps.Map);
		// expect(state.maps).toBeInstanceOf(GoogleMapReact.Maps);

		expect(newState.mapLoaded).toBeTruthy();

		expect(newState.busses).toEqual(props.busses);
		expect(newState.stops).toEqual(props.stops);


		// expect(state.busMarkers).toBeInstanceOf(google.maps.Marker[]);
		// expect(state.stopMarkers).toBeInstanceOf(google.maps.Marker[]);
	});

	it('should have a Google Map with passed parameters, or at least the ones we can check', () => {
		expect(state.map).toBeDefined();
		if (state.map != undefined) {
			expect(state.map.getZoom()).toEqual(state.zoom);
			expect(state.map.getCenter()).toEqual(state.center);
		}
	});
});