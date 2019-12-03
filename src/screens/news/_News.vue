<template>
    <view class="container">
        <view :style="{height: 100}"></view>
        <scrollable-tab-view
                :tab-bar-text-style="{fontFamily: 'DBHeavent', fontSize: 20}">
            <news-pr tab-label="ประชาสัมพันธ์"/>
            <news-pr tab-label="ความปลอดภัย"/>
            <news-pr tab-label="คำแนะนำ"/>
        </scrollable-tab-view>
    </view>
</template>

<script>
    import ScrollableTabView from 'react-native-scrollable-tab-view';
    import NewsPr from './News-Pr';

    export default {
        components: {ScrollableTabView, NewsPr},
        props: {},
        computed: {
        },
        data: () => {
            return {
                NewsPr
            };
        },
        methods: {
            test: function () {
            }
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>