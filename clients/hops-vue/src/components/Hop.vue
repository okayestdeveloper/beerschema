<template>
    <div class="hop-item">
        <h2>{{hop.label}} <router-link :to="{ path: `/edit/${hop.id}`}" class="btn">✏️</router-link ></h2>
        <p>{{hop.description}}</p>
        <ul>
            <li>AKA: {{hop.aka}}</li>
            <li>Country: {{hop.countryOfOrigin.label}}</li>
        </ul>
    </div>
</template>

<style scoped>
</style>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';

export default {
    name: 'Hop',
    props: {
        hop: {
            type: Object,
            default: null,
            required: true
        }
    },
    methods: {
    },
};
</script>
