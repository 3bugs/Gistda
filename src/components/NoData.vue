<template>
    <view :style="{flex: 1, justifyContent: 'center', alignItems: 'center'}">
        <text :style="{fontFamily: 'DBHeaventt-Light', fontSize: 24, color: '#333333'}">
            ไม่มีข้อมูล
        </text>
    </view>
</template>

<script>
    import store from '../store';
    import {DEBUG} from '../constants';

    import {Dimensions} from 'react-native';

    export default {
        components: {},
        props: {},
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG,
                Dimensions,
            };
        },
        methods: {},
    }
</script>

<style>
</style>