<template>
    <div class="hop-editor">
        <form>
            <div class="form-group">
                <label for="hop-label" class="control-label">Label:</label>
                <input type="text" class="form-control" id="hop-label" v-model.trim="hop.label">
            </div>
            <div class="form-group">
                <label for="hop-description" class="control-label">Description:</label>
                <textarea class="form-control" id="hop-description" v-model.trim="hop.description"></textarea>
            </div>
            <div class="form-group">
                <label class="control-label">AKA:</label>
                <list-item-editor :items="hop.aka" @listChanged="akaChanged($event)"></list-item-editor>
            </div>
            <div class="form-group">
                <label for="form-control" class="control-label">Country:</label>
                <select id="hop-country" class="form-control" v-model="hop.countryOfOrigin">
                    <option disabled value="">Please select one</option>
                    <option v-for="country in countries" :key="country.twoChar" :value="country">{{country.label}}</option>
                </select>
            </div>
            <div class="form-footer">
                <button type="button" class="btn btn-primary" @click="submit()">Save</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
</style>

<script>
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import ListItemEditor from './ListItemEditor.vue';

const defaultHop = {
                id: null,
                label: '',
                description: '',
                aka: [],
                countryOfOrigin: {
                    twoChar: ''
                }
            };

export default {
    name: 'HopEditor',
    components: {
        ListItemEditor
    },
    data: () => {
        return {
            countries: [
                {
                    label: 'United States',
                    twoChar: 'US',
                    threeChar: 'USA'
                },
                {
                    label: 'Australia',
                    twoChar: 'AU',
                    threeChar: 'AUS'
                },
                {
                    label: 'New Zealand',
                    twoChar: 'NZ',
                    threeChar: 'NZL'
                },
                {
                    label: 'Germany',
                    twoChar: 'DE',
                    threeChar: 'DEU'
                }
            ],
            hop: cloneDeep(defaultHop)
        }
    },
    computed: {
        ...mapGetters(['getHop'])
    },
    beforeMount() {
        // react to route changes...
        if (this.$route.params.id) {
            let hop = cloneDeep(this.getHop(this.$route.params.id));
            if (!hop && this.$store) {
                this.$store.dispatch('loadHops')
                    .then(()=> {
                        hop = cloneDeep(this.getHop(this.$route.params.id));
                        if (hop) {
                            this.hop = hop;
                        }
                    })
                    .catch(error => {
                        window.alert('Could not load hops');
                        console.log(error);
                    });
            } else {
                this.hop = hop;
            }
        }
    },
    methods: {
        akaChanged(list) {
            this.hop.aka = list.slice(0);
        },
        submit() {
            // TODO:
            this.$store.dispatch('saveHop', this.hop);
            this.$router.push({ name: 'home' });
        }
    },
};
</script>
