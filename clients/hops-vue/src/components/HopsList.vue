<template>
<div>
   <div v-for="(hop, index) in hops" :key="index" class="hop">
     <hop :hop="hop"></hop>
   </div>
</div>
</template>

<style scoped>
</style>

<script>
import { mapState } from 'vuex';
import Hop from './Hop.vue';

export default {
    name: 'HopsList',
    components: {
        Hop,
    },
    computed: {
        ...mapState({ hops: state => state.hops })
    },
    /**
     * Load up hops on creation
     */
    beforeCreate() {
        if (this.$store) {
            this.$store.dispatch('loadHops');
        }
    },
};
</script>
