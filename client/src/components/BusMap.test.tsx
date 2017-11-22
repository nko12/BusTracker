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
			zoom: 10,
			polystring: 'ybpwFvxsbMuC_CUKWMaBe@gCo@A?_@Eg@O}DkAo@e@oCuB{BeBYSSOgCmBaAo@iAw@QKoBuAsBaBq@g@oI}GKIc@oAuBsAe@]}ASmCc@}B_@YEyC_@qACC?eADa@JgBRm@CWSs@e@AA{@g@MKm@c@aAm@KMq@e@y@i@uBqAsBwAuBsAYSaBgAcC_BgAs@}@m@yByAITsBrGIZ}B{AyByA{ByAm@a@mAw@{ByA{@k@}@m@{ByA{ByAeCaBwBwAMGyByA{ByAeBiASO}ByA{ByAmBqAMIcC_BqBuASM{ByA}B{AmBoAOK{ByAqBsAKG}B{AoBqAKG}B{A}B{AoBoAMI{B{A{B{AoBoAMIeCcByBwAMI{ByA}B{AeBiAUQ}ByA}B{Ak@_@oAy@}B{AiBmAQM}B{As@c@gAu@}B{Au@e@gAu@{ByAiCcBoA{@w@g@}B{A_C{A[UaBgA_C{AeAs@w@g@gCcBsA{@u@g@}B{A_C{AmBqAOK}B{A_C}AgCaBcAq@cAq@{ByAoBoAMK}B{A}B{AeAs@u@e@}B}AkAu@q@c@}B{AuA}@o@c@gCaBkBqAQK}B{AkFiDMK}B{AgAu@u@e@gBkAUM}B}AkBmAYSgCaB{@m@_Am@}B{A}@m@_Am@}B{Au@e@kAw@yE}CuCoB{@i@oA{@gCaB}B{Aq@e@iAu@gAs@y@c@q@]kAw@aAo@{@k@{B{AgAs@e@[MOOQuBuA}@m@gAs@}ByAo@c@kAw@{ByAu@e@gAu@{ByAaC_By@i@qH_FOIOh@Y|@{AxEsA}@s@c@{B{A{AcA_@WWOGEcBgAo@pBqDnL_@tAeAs@u@e@{ByA{ByAcAq@y@k@}ByAeBgAKEYC{@m@iAs@mBqAQ?c@rAsDhLM^M`@zBzALc@~EoO'
		};
		mountedBusMap = undefined;
	});

	it('always renders a GoogleMap', () => {

	});
});