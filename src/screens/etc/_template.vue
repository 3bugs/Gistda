<template>
    <view class="container">

    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';

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
        methods: {

        },
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>