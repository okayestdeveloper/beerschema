<template>
<div>
   <div v-for="hop in hops" :key="hop.id" class="hop">
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
    created() {
        if (this.$store && (!this.hops || !this.hops.length)) {
            this.$store.dispatch('loadHops')
                .catch(error => {
                    window.alert('Could not load hops');
                    console.log(error);
                });
        }
    },
};
</script>
