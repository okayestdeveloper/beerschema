<template>
    <div id="app">
        <router-view></router-view>
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

#app .form-control, #app .btn {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  font-size: 14px;
  border: 1px solid #2c3e50;
  background-color: white;
  border-radius: 0;
}

#app .btn {
    text-align: center;
    border: 1px solid green;
}

#app .btn.btn-primary {
    font-weight: bold;
}

#app .control-label {
    display: block;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  font-size: 14px;
}

#app .form-group + .form-group {
    margin: 15px 0;
    vertical-align: top;
}

.hidden {
    visibility: hidden !important;
}
</style>
