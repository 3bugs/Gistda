<template>
    <view class="container">
        <text class="title"
              :style="{color: SIDEBAR.filterTypeTextColor[province]}">
            {{item.name}}
        </text>
        <!--<flat-list
                :data="item.list"
                :keyExtractor="(item, index) => index.toString()">
            <view render-prop-fn="renderItem">
                <filter-item
                        :item="args.item"
                        :index="args.index"/>
            </view>
        </flat-list>-->
        <filter-item
                v-for="(filter, index) in item.list"
                :item="filter"
                :index="index"
                :typeIndex="typeIndex"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, SIDEBAR} from '../../constants';

    import FilterItem from './FilterItem';

    export default {
        components: {FilterItem},
        props: {
            item: { // filter type item
                type: Object
            },
            typeIndex: {
                type: Number
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG, SIDEBAR
            };
        },
        methods: {
        },
    }
</script>

<style>
    .container {
        border-width: 0;
        border-color: greenyellow;
    }
    .title {
        font-family: DBHeavent;
        font-size: 20;
        letter-spacing: 0;
        margin-top: 20;
        margin-bottom: 15;
        margin-left: 20;
    }
</style>