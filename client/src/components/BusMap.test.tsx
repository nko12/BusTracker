import * as React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import GoogleMap from 'google-map-react';
import {BusMap, BusMapProps, BusMapState, StopType} from './BusMap';

// TODO: this test uses the old way of transferring data between components
// i.e. via props and callbacks to parent components
// the new way uses signals and a unified state component
// TODO: re-write these tests using the new way

// const NYC = {lat: 40.7588528, lng: -73.9852625};
// const POLYSTRING= 'ybpwFvxsbMuC_CUKWMaBe@gCo@A?_@Eg@O}DkAo@e@oCuB{BeBYSSOgCmBaAo@iAw@QKoBuAsBaBq@g@oI}GKIc@oAuBsAe@]}ASmCc@}B_@YEyC_@qACC?eADa@JgBRm@CWSs@e@AA{@g@MKm@c@aAm@KMq@e@y@i@uBqAsBwAuBsAYSaBgAcC_BgAs@}@m@yByAITsBrGIZ}B{AyByA{ByAm@a@mAw@{ByA{@k@}@m@{ByA{ByAeCaBwBwAMGyByA{ByAeBiASO}ByA{ByAmBqAMIcC_BqBuASM{ByA}B{AmBoAOK{ByAqBsAKG}B{AoBqAKG}B{A}B{AoBoAMI{B{A{B{AoBoAMIeCcByBwAMI{ByA}B{AeBiAUQ}ByA}B{Ak@_@oAy@}B{AiBmAQM}B{As@c@gAu@}B{Au@e@gAu@{ByAiCcBoA{@w@g@}B{A_C{A[UaBgA_C{AeAs@w@g@gCcBsA{@u@g@}B{A_C{AmBqAOK}B{A_C}AgCaBcAq@cAq@{ByAoBoAMK}B{A}B{AeAs@u@e@}B}AkAu@q@c@}B{AuA}@o@c@gCaBkBqAQK}B{AkFiDMK}B{AgAu@u@e@gBkAUM}B}AkBmAYSgCaB{@m@_Am@}B{A}@m@_Am@}B{Au@e@kAw@yE}CuCoB{@i@oA{@gCaB}B{Aq@e@iAu@gAs@y@c@q@]kAw@aAo@{@k@{B{AgAs@e@[MOOQuBuA}@m@gAs@}ByAo@c@kAw@{ByAu@e@gAu@{ByAaC_By@i@qH_FOIOh@Y|@{AxEsA}@s@c@{B{A{AcA_@WWOGEcBgAo@pBqDnL_@tAeAs@u@e@{ByA{ByAcAq@y@k@}ByAeBgAKEYC{@m@iAs@mBqAQ?c@rAsDhLM^M`@zBzALc@~EoO'

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