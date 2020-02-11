<template>
    <view class="container">
        <header title="ประวัติการแจ้งเหตุ"
                :left-icon="{
                    icon: imageBack,
                    width: 24,
                    height: 18,
                    callback: handleClickBack
                }"
                :right-icon="{
                    icon: null,
                    width: 22,
                    height: 22,
                    callback: null
                }"/>

        <my-tab-view
                v-if="store.state.historyList"
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
    import {PROVINCE_NAME_EN, COLOR_PRIMARY} from '../../constants';
    import Header from '../../components/Header';
    import MyTabView from '../../components/MyTabView';
    import HistoryPage from './HistoryPage';

    import React from 'react';
    import {Alert} from 'react-native';

    import imageBack from '../../../assets/images/ic_back.png';

    const routes = [
        {key: 'wait-approve', title: 'รอตวจสอบ'},
        {key: 'publish', title: 'ตรวจสอบแล้ว / เผยแพร่'},
    ];

    export default {
        components: {Header, MyTabView, HistoryPage},
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
                return store.state.loadingHistory[PROVINCE_NAME_EN[this.province]];
            },
        },
        data: () => {
            return {
                COLOR_PRIMARY,
                imageBack,
                routes, store,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            renderScene: function ({route}) {
                switch (route.key) {
                    case 'wait-approve':
                        return <HistoryPage page={0} navigation={this.navigation}/>;
                    case 'publish':
                        return <HistoryPage page={1} navigation={this.navigation}/>;
                }
            },
        },
        created: function () {
            store.dispatch('FETCH_HISTORY', {
                province: this.province,
                callback: (success, data) => {
                    if (!success) {
                        //todo: เปลี่ยนเป็นการแสดง error ใน layout และมีปุ่ม retry
                        //todo: กรณี error พอออกไปแล้วกลับมาใหม่ ก็ไม่ยอม fetch ข้อมูล
                        Alert.alert('ผิดพลาด', data); // data คือ error message
                        this.navigation.goBack();
                    }
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