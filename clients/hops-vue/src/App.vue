<template>
  <div id="app">
    <hops-list></hops-list>
  </div>
</template>

<script>
import HopsList from './components/HopsList.vue';
import Hop from './components/Hop.vue';

export default {
  name: 'app',
  components: {
    HopsList,
    Hop
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
