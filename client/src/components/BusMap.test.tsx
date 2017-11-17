import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import GoogleMap from 'google-map-react';

import {BusMapProps, BusMapState}  from '../components/BusMap';
import BusMap from '../components/BusMap';

describe('BusMap', () => {

    // Since the Google Map is a pretty heavy component, we'll want to do as much testing as possible on a single
    // instance of the BusMap.
    let busMapWrapper: ReactWrapper<BusMapProps, BusMapState>;
    let props: BusMapProps;
    
    beforeAll(() => {

        // Create some bus map properties.
        props = {
            pointA: {lat: 41.337716, lng: -74.35912},
            pointB: {lat: 40.7588528, lng: -73.9852625},
            zoom: 5
        }
        // Create a busmap object to test on.
        
        busMapWrapper = mount(<BusMap pointA={props.pointA} pointB={props.pointB} zoom={5} />);
    });

    it('should render a GoogleMap element.', () => {
        
        expect(busMapWrapper.find(GoogleMap).length).toEqual(1);
    });
});