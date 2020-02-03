<template>
    <view class="container">
        <header title="ข่าว"
                :left-icon="{
                    icon: imageMap,
                    width: 22,
                    height: 22,
                    callback: handleClickMap
                }"
                :right-icon="{
                    icon: null,
                    width: 22,
                    height: 22,
                    callback: null
                }"/>

        <my-tab-view
                :routes="routes"
                :renderScene="renderScene"/>
    </view>
</template>

<script>
    import store from '../../store';
    import Header from '../../components/Header';
    import MyTabView from '../../components/MyTabView';
    import NewsPage from './NewsPage';

    import React from 'react';

    import imageMap from '../../../assets/images/screen_map/ic_map.png';

    const routes = [
        {key: 'overview', title: 'ภาพรวมทั้งหมด'},
        {key: 'er', title: 'ความปลอดภัย'},
        {key: 'suggest', title: 'คำแนะนำ'},
    ];

    export default {
        components: {Header, MyTabView, NewsPage},
        props: {
            navigation: {
                type: Object
            }
        },
        data: () => {
            return {
                imageMap,
                routes,
            };
        },
        methods: {
            handleClickMap: function () {
                this.navigation.goBack();
            },
            renderScene: function ({route}) {
                switch (route.key) {
                    case 'news':
                        return <NewsPage page={0} navigation={this.navigation}/>;
                    case 'er':
                        return <NewsPage page={1} navigation={this.navigation}/>;
                    case 'suggest':
                        return <NewsPage page={2} navigation={this.navigation}/>;
                }
            },
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>