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
                v-if="isReady"
                :routes="routes"
                :renderScene="renderScene"/>

        <view
                v-if="isError"
                :style="{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: BOTTOM_NAV.height,
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                }">
            <text
                    :style="{
                        fontFamily: 'DBHeavent',
                        fontSize: 22,
                        textAlign: 'center',
                        marginBottom: 20,
                    }">
                {{errorMessage}}
            </text>
            <my-button
                    :style="{
                        width: 150,
                    }"
                    text="ลองใหม่"
                    :font-size="22"
                    :bg-color="FORM.buttonColor[province]"
                    :padding="10"
                    :corner-radius="24"
                    :on-click="loadData"/>
        </view>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isLoading"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, COLOR_PRIMARY, FORM, BOTTOM_NAV, DIMENSION,} from '../../constants';
    import Header from '../../components/Header';
    import MyTabView from '../../components/MyTabView';
    import ReportPage from "./ReportPage";
    import MyButton from "../../components/MyButton";

    import React from 'react';

    import {Dimensions, StyleSheet, Alert} from 'react-native';
    import imageMap from '../../../assets/images/screen_map/ic_map.png';

    const routes = [
        {key: 'map', title: 'ภาพรวมทั้งหมด'},
        {key: 'by-incident', title: 'สรุปผลตามเหตุ'},
        {key: 'by-time', title: 'สรุปผลตามช่วงเวลา'},
    ];

    export default {
        components: {MyButton, Header, MyTabView, ReportPage},
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
                COLOR_PRIMARY, FORM, BOTTOM_NAV, DIMENSION,
                imageMap,
                routes,
                isReady: false,
                isError: false,
                errorMessage: null,
            };
        },
        methods: {
            handleClickMap: function () {
                this.navigation.goBack();
            },
            renderScene: function ({route}) {
                switch (route.key) {
                    case 'map':
                        return <ReportPage graphType={0} navigation={this.navigation}/>;
                    case 'by-incident':
                        return <ReportPage graphType={1} navigation={this.navigation}/>;
                    case 'by-time':
                        return <ReportPage graphType={2} navigation={this.navigation}/>;
                }
            },
            loadData: function () {
                this.isError = false;
                this.isReady = false;

                store.dispatch('GET_REPORT', {
                    callback: (success, message) => {
                        if (!success) {
                            //Alert.alert("ผิดพลาด", message);
                            this.isReady = false;
                            this.isError = true;
                            this.errorMessage = message;
                        } else {
                            this.isReady = true;
                            this.isError = false;
                        }
                    }
                });
            },
        },
        created: function () {
            this.loadData();
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