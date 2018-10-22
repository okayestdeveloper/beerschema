import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

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
    actions: {
        loadHops({ commit, state }) {
            fetch('https://dev.api-menuviz.net/hops')
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
        }
    },
});
