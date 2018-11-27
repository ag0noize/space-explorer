import Vue from 'vue';
import App from './App.vue';

import {store} from './store/';

import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.options.root = '/';

new Vue({
	el: '#app',
	store: store,
	render: h => h(App)
})
