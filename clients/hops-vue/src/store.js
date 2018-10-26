import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const apiUrl = 'https://dev.api-menuviz.net/hops';

export default new Vuex.Store({
    state: {
        hops: []
    },
    mutations: {
        setHops(state, hops) {
            if (Array.isArray(hops)) {
                state.hops = hops;
            }
        }
    },
    getters: {
        getHop: state => (hopId) => {
            if (Array.isArray(state.hops)) {
                return state.hops.find(hop => hop.id === hopId);
            }
            return undefined;
        }
    },
    actions: {
        loadHops({ commit, state }) {
            return fetch(apiUrl)
                .then((response) => {
                    if (!response.bodyUsed) {
                        return response.json();
                    }
                    return state.hops;
                })
                .then((hops) => {
                    console.log(hops);
                    commit('setHops', hops);
                    return hops;
                });
        },
        saveHop({ commit, state }, hop) {
            let index = -1;
            if (hop.id) {
                index = state.hops.findIndex(item => item.id === hop.id);
            }

            if (index > -1) {
                // TODO: PUT to API then commit
                commit('setHops', [...state.hops.slice(0, index), hop, ...state.hops.slice(index + 1)]);
            } else {
                // TODO: POST to API then commit
                fetch(apiUrl, {
                    method: 'POST',
                    body: JSON.stringify(hop),
                    mode: 'cors'
                })
                    .then(response => response.json())
                    .then((newHop) => {
                        commit('setHops', [...state.hops, newHop]);
                    });
            }
        }
    },
});
