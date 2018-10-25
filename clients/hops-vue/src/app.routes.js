import Vue from 'vue';
import VueRouter from 'vue-router';
import HopsList from './components/HopsList.vue';
import HopEdit from './components/HopEdit.vue';

Vue.use(VueRouter);

const routes = [
    { name: 'home', path: '/', component: HopsList },
    { name: 'hopedit', path: '/edit/:id', component: HopEdit }
];

export default new VueRouter({
    routes
});
