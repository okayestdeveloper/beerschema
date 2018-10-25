<template>
    <ul class="list-item-editor">
        <li v-for="(text, index) in listItems" :key="`text-item-${index}`" class="list-item">
            <input type="text" :value="text" @input="editItem($event, index)" class="form-control">
            <button type="button" :class="{'btn': true, 'hidden': !text}" @click="deleteItem(index)">🗑️</button>
        </li>
    </ul>
</template>

<style scoped>
.btn {
    margin: 0 5px;
    border: 1px solid rgb(17, 122, 20);
    border-radius: 4px;
    background-color: white;
}

.list-item + .list-item {
    margin: 5px 0;
}

.form-control {
    font-size: 14px;
}
</style>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';

export default {
    name: 'ListItemEditor',
    props: {
        items: { // NOTE: Should be string[]
            type: Array,
            default: [],
            required: true
        }
    },
    data: function() {
        return {
            listItems: []
        };
    },
    methods: {
        editItem($event, index) {
            this.listItems = [
                ...this.listItems.slice(0, index),
                $event.target.value,
                ...this.listItems.slice(index + 1),
            ];
            this.listItems = this.listItems.filter(item => item);
            this.$emit('listChanged', this.listItems); // TODO: push change up to parent
            this.listItems.push('');
        },
        deleteItem(index) {
            if ( window.confirm('You sure?')) {
                this.listItems = [...this.listItems.slice(0, index), ...this.listItems.slice(index + 1)];
                this.$emit('listChanged', this.listItems); // TODO: push change up to parent
            }
        }
    },
    beforeMount() {
        this.listItems = this.items.filter(item => item);
        this.listItems = [...this.listItems, ''];
    }
};
</script>
