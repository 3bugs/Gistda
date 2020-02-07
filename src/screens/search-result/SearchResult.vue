<template>
    <view class="container">
        <header :title="`ผลการค้นหา (${searchResultList.length})`"
                :left-icon="{
                    icon: imageBack,
                    width: 24, //22 imageMap
                    height: 18, //22 imageMap
                    callback: handleClickBack
                }"
                :right-icon="{
                    icon: null,
                    width: 22,
                    height: 22,
                    callback: null
                }"/>

        <my-tab-view
                :routes="routes"
                :renderScene="renderScene"
                :swipe-enabled="false"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, PROVINCE_NAME_EN,
    } from '../../constants';
    import Header from '../../components/Header';
    import MyTabView from '../../components/MyTabView';
    import MapsPage from './MapsPage';
    import ListPage from './ListPage';

    import React from 'react';

    //import imageMap from '../../../assets/images/screen_map/ic_map.png';
    import imageBack from '../../../assets/images/ic_back.png';

    const routes = [
        {key: 'maps', title: 'แผนที่'},
        {key: 'list', title: 'รายการ'},
    ];

    export default {
        components: {ListPage, MapsPage, Header, MyTabView,},
        props: {
            navigation: {
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            searchResultList() {
                return store.state.searchResultList[PROVINCE_NAME_EN[this.province]];
            },
        },
        data: () => {
            return {
                imageBack,
                routes,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            renderScene: function ({route}) {
                switch (route.key) {
                    case 'maps':
                        return <MapsPage navigation={this.navigation}/>;
                    case 'list':
                        return <ListPage navigation={this.navigation}/>;
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