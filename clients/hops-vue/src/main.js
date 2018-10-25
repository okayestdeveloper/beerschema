import Vue from 'vue';
import App from './App.vue';
import router from './app.routes';
import store from './store';

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(App),
    router
}).$mount('#app');
