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
    import SearchResultPage from './SearchResultPage';
    //import ListPage from './MapsPage_Test';

    import React from 'react';

    //import imageMap from '../../../assets/images/screen_map/ic_map.png';
    import imageBack from '../../../assets/images/ic_back.png';

    const routes = [
        {key: 'maps', title: 'แผนที่'},
        {key: 'list', title: 'รายการ'},
    ];

    export default {
        components: {SearchResultPage, Header, MyTabView,},
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
                        return <SearchResultPage navigation={this.navigation} resultType={0}/>;
                    case 'list':
                        return <SearchResultPage navigation={this.navigation} resultType={1}/>;
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