<template>
    <view class="container">
        <header :title="`ผลการค้นหา`"
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
        <flat-list
                class="list"
                v-if="dataList && dataList.length > 0"
                :data="dataList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <list-item
                        :item="args.item"
                        :index="args.index"
                        :title="args.item.name ? args.item.name : args.item.formatted_address"
                        :details="args.item.formatted_address"
                        :show-date="true"
                        :date="getDistanceText(args.item)"
                        :on-click="() => handleClickItem(args.item)"/>
            </view>
            <!--<view render-prop="ListEmptyComponent"
                  :style="{width: '100%', height: '100%', borderWidth: 1, borderColor: 'blue'}">
                <view :style="{flex: 1, borderWidth: 1, borderColor: 'red'}">
                    <text>ไม่มีข้อมูล</text>
                </view>
            </view>-->
            <!--<view render-prop="ListHeaderComponent">
                <view :style="{height: 15}"/>
            </view>-->
            <view render-prop="ListFooterComponent"
                  v-if="true">
                <view :style="{height: 50}"/>
            </view>
        </flat-list>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isLoading"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {doGetPlaceDetails} from '../../store/fetch';
    import {
        DEBUG, PROVINCE_NAME_EN, DIMENSION, COLOR_PRIMARY,
    } from '../../constants';
    import Header from '../../components/Header';
    import ListItem from '../../components/ListItem';

    import React from 'react';
    import {StyleSheet, Alert} from 'react-native';
    import {getDistance} from 'geolib';

    import imageBack from '../../../assets/images/ic_back.png';

    export default {
        components: {Header, ListItem},
        props: {
            navigation: {
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                imageBack,
                PROVINCE_NAME_EN, DIMENSION, COLOR_PRIMARY,
                StyleSheet,
                currentLocation: null,
                dataList: [],
                currentLocation: null,
                isLoading: false,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickItem: async function (item) {
                this.isLoading = true;
                const apiResult = await doGetPlaceDetails(item.place_id);
                this.isLoading = false;

                if (apiResult.success) {
                    //console.log(`Name: ${apiResult.data.result.name}\nFormatted address: ${apiResult.data.result.formatted_address}`);

                    const lat = apiResult.data.result.geometry.location.lat;
                    const lng = apiResult.data.result.geometry.location.lng;

                    const marker = {
                        type: 'Feature',
                        id: 999999,
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                lng,
                                lat
                            ],
                            viewport: apiResult.data.result.geometry.viewport,
                        },
                        properties: {
                            NAME_T: apiResult.data.result.name ? apiResult.data.result.name : apiResult.data.result.formatted_address,
                            DESCRIPTION_T: ``,
                            LOCATION_T: apiResult.data.result.formatted_address,
                            CATEGORY: 0,
                            P_CODE: 0,
                            IMAGES: []
                        }
                    };
                    this.navigation.navigate('MarkerDetails', {marker});
                } else {
                    Alert.alert('ผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google Maps API');
                }
            },
            getDistanceText: function (searchResultItem) {
                return searchResultItem.distance
                    ? `${(searchResultItem.distance / 1000).toFixed(1)} กม.`
                    : '';
            },
            calculateDistance: function () {
                const originLatitude = this.currentLocation.latitude;
                const originLongitude = this.currentLocation.longitude;

                this.dataList.forEach(searchResultItem => {
                    const destinationLatitude = searchResultItem.geometry.location.lat;
                    const destinationLongitude = searchResultItem.geometry.location.lng;

                    const distanceMeters = getDistance(
                        {latitude: originLatitude, longitude: originLongitude},
                        {latitude: destinationLatitude, longitude: destinationLongitude}
                    );
                    searchResultItem.distance = distanceMeters;
                });
            },
            sortDataListByDistance: function () {
                this.dataList.sort((searchResultItem1, searchResultItem2) => {
                    return searchResultItem1.distance > searchResultItem2.distance ? 1 : -1;
                });
            },
        },
        created: function () {
            //todo: sort result list by distance
            this.dataList = this.navigation.getParam('dataList');
            this.currentLocation = this.navigation.getParam('currentLocation');

            this.calculateDistance();
            this.sortDataListByDistance();
        },
        mounted: function () {
        }
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