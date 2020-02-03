<template>
    <view class="container">
        <header title="ผลการค้นหา"
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
    import MapsPage from './MapsPage';
    import NewsPage from '../news/NewsPage';

    import React from 'react';

    import imageMap from '../../../assets/images/screen_map/ic_map.png';

    const routes = [
        {key: 'maps', title: 'แผนที่'},
        {key: 'list', title: 'รายการ'},
    ];

    export default {
        components: {MapsPage, Header, MyTabView,},
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
                    case 'maps':
                        return <MapsPage navigation={this.navigation}/>;
                    case 'list':
                        return <NewsPage navigation={this.navigation}/>;
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