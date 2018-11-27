import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		planets: [],
		dataReady: false,
		appVer: 1.1,
		currentPlanet: 'mercury',
		sidebarShown: false,
        featuresShown: true,
        aboutShown: false,
        patchNotesShown: false
	},

	getters: {
		dataReady(state){
			return state.dataReady;
		},

		appVersion(state){
			return state.appVer;
		},

		planets(state){
			return state.planets;
		},

		currentPlanet(state){
			return state.currentPlanet;
		},

        sidebarStatus(state){
        	return state.sidebarShown;
        },

        featuresStatus(state){
        	return state.featuresShown;
        },

        aboutStatus(state){
        	return state.aboutShown;
        },

        patchNotesStatus(state){
        	return state.patchNotesShown;
        },

        planetData(state){
            return state.planets.find(planet => planet.name === state.currentPlanet);
        },

        planetName(state, getters){
        	return getters.planetData.name;
        },

        planetFeatures(state, getters){
        	return getters.planetData.features;
        },

        planetContent(state, getters){
        	return getters.planetData.content;
        }
	},

	mutations: {
		clearPlanetsCnt(state){
			state.planets = [];
		},

		loadPlanetsCnt(state, data){
			state.planets = data;
		},

		allowRender(state){
			state.dataReady = true;
		},

		setActivePlanet(state, planetName){
			state.currentPlanet = planetName;
			document.querySelector('.simplebar-scroll-content').scrollTop = 0;
		},

		showSidebar(state){
			state.sidebarShown = true;
		},

		closeSidebar(state){
			state.sidebarShown = false;
		},

		switchPlanetFeatures(state){
			state.featuresShown = !state.featuresShown;
		},

        showAbout(state){
            state.aboutShown = true;
        },

        showPatchNotes(state){
            state.patchNotesShown = true;
        },

        closeModals(state){
            state.aboutShown = false;
            state.patchNotesShown = false;
        }
	},

	actions:{
		loadPlanetsCnt(store){

			// clear cached content
			store.commit('clearPlanetsCnt');

		  	Vue.http.get('planets.json')
		  	  	.then(response => response.json())
		  	  	.then(data => {
		  	  	  	store.commit('loadPlanetsCnt', data);
		  	  	  	store.commit('allowRender');
		  	  	});
		}
	}
});