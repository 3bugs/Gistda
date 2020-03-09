<template>
    <view class="container">
        <header :title="title"
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
        <view class="text-input-container"
              :style="{
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
              }">
            <text-input
                    class="text-input"
                    v-model="textContent"
                    return-key-type="search"
                    :auto-focus="true"
                    :placeholder="placeHolder"
                    placeholder-text-color="#aaa"
                    :on-submit-editing="handleClickSearch"
                    :on-change-text="handleChangeText"/>
        </view>
        <!--<view :style="{
                    marginTop: 0,
                    marginBottom: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
        }"/>-->
        <flat-list
                class="list"
                v-if="dataList && dataList.length > 0"
                :data="dataList"
                :keyExtractor="(item, index) => index.toString()"
                keyboard-should-persist-taps="handled"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <touchable-opacity
                        :on-press="() => handleClickAutocompleteItem(args.item)">
                    <view
                          :style="{
                                paddingLeft: DIMENSION.horizontal_margin,
                                paddingRight: DIMENSION.horizontal_margin,
                                paddingTop: 10,
                                paddingBottom: 10,
                          }">
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            fontSize: 22,
                            color: '#626b80',
                        }">
                            {{args.item.structured_formatting.main_text}}
                        </text>
                    </view>
                </touchable-opacity>
                <!--<list-item
                        :item="args.item"
                        :index="args.index"
                        :title="args.item.structured_formatting.main_text"
                        :details="args.item.description"
                        :show-date="true"
                        :date="getDistanceText(args.item.distance_meters)"
                        :on-click="() => handleClickAutocompleteItem(args.item)"/>-->
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
    import {doGetPlaceAutocomplete, doGetPlaceDetails, doPlaceTextSearch, doGetAddress} from '../../store/fetch';
    import {
        DEBUG, PROVINCE_NAME_EN, DIMENSION, COLOR_PRIMARY,
    } from '../../constants';
    import Header from '../../components/Header';
    import ListItem from '../../components/ListItem';

    import React from 'react';
    import {StyleSheet, Alert} from 'react-native';

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
            title() {
                let title = 'ค้นหา';
                if (this.searchType === 'backend') {
                    title += 'ข้อมูลแอป'
                } else if (this.searchType === 'google') {
                    title += 'ข้อมูล Google Maps';
                } else if (this.searchType === 'latlng') {
                    title += 'ด้วยพิกัด';
                }
                return title;
            },
            placeHolder() {
                let placeHolder;
                if (this.searchType === 'backend') {
                    placeHolder = 'กรอกคำที่ต้องการค้นหา'
                } else if (this.searchType === 'google') {
                    placeHolder = 'กรอกชื่อสถานที่/หมู่บ้าน/ตำบล/อำเภอ ที่ต้องการค้นหา';
                } else if (this.searchType === 'latlng') {
                    placeHolder = `กรอกพิกัดในรูปแบบ 'ละติจูด , ลองจิจูด'`;
                }
                return placeHolder;
            },
        },
        data: () => {
            return {
                imageBack,
                PROVINCE_NAME_EN, DIMENSION, COLOR_PRIMARY,
                StyleSheet,
                textContent: '',
                searchType: null,
                currentLocation: null,
                dataList: [],
                isLoading: false,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleChangeText: async function (text) {
                if (this.searchType === 'backend') {
                    // do nothing for now (that means no suggestion for backend search)
                } else if (this.searchType === 'google') {
                    if (text.trim() === '') {
                        this.dataList = [];
                        return;
                    }

                    const apiResult = await doGetPlaceAutocomplete(
                        text.trim(), this.currentLocation.latitude, this.currentLocation.longitude
                    );

                    if (apiResult.success) {
                        this.dataList = apiResult.data.predictions ? apiResult.data.predictions : [];
                    } else {
                        // error, we can safely ignore it
                    }
                }
            },
            handleClickSearch: async function () {
                if (!this.textContent || this.textContent.trim().length === 0) {
                    return;
                }

                if (this.searchType === 'backend') {
                    this.isLoading = true;

                    await store.dispatch('SEARCH', {
                        province: this.province,
                        searchTerm: this.textContent.trim(),
                        currentLocation: this.currentLocation,
                        callback: (success, message) => {
                            this.isLoading = false;

                            if (success) {
                                if (store.state.searchResultList[PROVINCE_NAME_EN[this.province]].length === 0) {
                                    Alert.alert('ผลการค้นหา', 'ไม่พบข้อมูล');
                                } else {
                                    const currentLocation = this.currentLocation;
                                    this.navigation.navigate('SearchResult', {currentLocation});
                                }
                            } else {
                                Alert.alert('ผิดพลาด', message);
                            }
                        },
                    });

                } else if (this.searchType === 'google' /*|| this.searchType === 'latlng'*/) {
                    let lat, lng;

                    if (this.searchType === 'latlng') {
                        const COMMA = ',';
                        const textContent = this.textContent.trim();
                        const part = textContent.split(COMMA);

                        lat = part[0];
                        lng = part[1];

                        if (textContent.indexOf(COMMA) === -1
                            || part.length !== 2
                            || isNaN(parseFloat(part[0]))
                            || isNaN(parseFloat(part[1]))) {
                            Alert.alert('ผิดพลาด', 'รูปแบบไม่ถูกต้อง ให้กรอกค่าในรูปแบบ "ละติจูด , ลองจิจูด" เช่น\n\n15.7810 , 104.1192');
                            return;
                        }
                    }

                    this.isLoading = true;
                    const apiResult = this.searchType === 'google'
                        ? await doPlaceTextSearch(this.textContent.trim())
                        : await doGetAddress(lat, lng);
                    this.isLoading = false;

                    if (apiResult.success) {
                        const dataList = apiResult.data.results ? apiResult.data.results : [];
                        const currentLocation = this.currentLocation;
                        if (dataList.length > 0) {
                            this.navigation.navigate('SearchResultGoogle', {dataList, currentLocation});
                        } else {
                            Alert.alert('ผลการค้นหา', 'ไม่พบข้อมูล');
                        }
                    } else {
                        Alert.alert('ผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อ Google Maps API');
                    }
                } else if (this.searchType === 'latlng') {
                    this.isLoading = true;

                    const COMMA = ',';
                    const textContent = this.textContent.trim();
                    const part = textContent.split(COMMA);

                    let lat = parseFloat(part[0]);
                    let lng = parseFloat(part[1]);

                    if (textContent.indexOf(COMMA) === -1
                        || part.length !== 2
                        || isNaN(lat)
                        || isNaN(lng)
                        || lat > 90 || lat < -90
                        || lng > 180 || lat < -180) {
                        Alert.alert('ผิดพลาด', 'รูปแบบไม่ถูกต้อง ให้กรอกค่าในรูปแบบ "ละติจูด , ลองจิจูด" โดยที่\n\n-90 <= ละติจูด <= 90 และ\n-180 <= ลองจิจูด <= 180\n\nเช่น\n\n15.7810 , 104.1192');
                        this.isLoading = false;
                        return;
                    }

                    this.navigation.goBack();
                    const onSearch = this.navigation.getParam('onSearch');
                    onSearch({
                        latitude: lat,
                        longitude: lng,
                    });

                    setTimeout(() => {
                        this.isLoading = false;
                    }, 1000);
                }
            },
            handleClickAutocompleteItem: async function (item) {
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
                            NAME_T: apiResult.data.result.name,
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
            getDistanceText: function (value) {
                if (value == null) return null;

                return (value / 1000).toFixed(1) + ' กม.';
            }
        },
        created: function () {
            this.searchType = this.navigation.getParam('searchType');
            this.currentLocation = this.navigation.getParam('currentLocation');
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .text-input-container {

    }

    .text-input {
        font-family: DBHeavent;
        font-size: 22;
        color: #666666;
        padding-top: 0;
        padding-bottom: 5;
        margin-top: 15;
        margin-bottom: 15;
        border-bottom-width: 1;
        border-bottom-color: #cccccc;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>
