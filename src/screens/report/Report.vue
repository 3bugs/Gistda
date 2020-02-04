<template>
    <view class="container">
        <header title="ข้อมูลสรุปการแจ้งเหตุ"
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

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isLoading"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, COLOR_PRIMARY,} from '../../constants';
    import Header from '../../components/Header';
    import MyTabView from '../../components/MyTabView';
    import ReportPage from "./ReportPage";

    import React from 'react';

    import imageMap from '../../../assets/images/screen_map/ic_map.png';

    const routes = [
        {key: 'by-incident', title: 'สรุปผลตามเหตุ'},
        {key: 'by-time', title: 'สรุปผลตามช่วงเวลา'},
    ];

    export default {
        components: {Header, MyTabView, ReportPage},
        props: {
            navigation: {
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            isLoading() {
                return store.state.loadingReport;
            },
        },
        data: () => {
            return {
                COLOR_PRIMARY,
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
                    case 'by-incident':
                        return <ReportPage graphType={0} navigation={this.navigation}/>;
                    case 'by-time':
                        return <ReportPage graphType={1} navigation={this.navigation}/>;
                }
            },
        },
        created: function () {
            store.dispatch('GET_REPORT', {
                callback: (success, message) => {
                }
            });
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>