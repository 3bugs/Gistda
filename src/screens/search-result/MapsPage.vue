<template>
    <view class="container">
        <view class="container"
              :style="{marginBottom: BOTTOM_NAV.height}">
            <map-view
                    :provider="PROVIDER_GOOGLE"
                    ref="mapView"
                    class="map-view"
                    :initial-region="{
                        latitude: (PROVINCE_DIMENSION[province].minLatitude + PROVINCE_DIMENSION[province].maxLatitude) / 2,
                        longitude: (PROVINCE_DIMENSION[province].minLongitude + PROVINCE_DIMENSION[province].maxLongitude) / 2,
                        latitudeDelta: PROVINCE_DIMENSION[province].maxLatitude - PROVINCE_DIMENSION[province].minLatitude,
                        longitudeDelta: PROVINCE_DIMENSION[province].maxLongitude - PROVINCE_DIMENSION[province].minLongitude,
                    }"
                    :style="{
                        marginTop: 0, borderWidth: 2, borderColor: 'red',
                    }"
                    :on-map-ready="handleMapReady">

                <marker v-for="(marker, index) in searchResultList"
                        v-if="marker.geometry.type === 'Point'"
                        :coordinate="{
                            latitude: marker.geometry.coordinates[1],
                            longitude: marker.geometry.coordinates[0]
                        }"
                        :title="marker.properties.NAME_T"
                        :description="null"
                        :image="categoryData[marker.properties.CATEGORY].image"
                        :on-press="() => handleClickPoint(marker)"/>
            </map-view>
        </view>

        <!--<bottom-sheet
                ref="bottomSheet"
                :snap-points="[screenHeight - statusBarHeight, '45%', '0%']"
                :initial-snap="2"
                :on-open-start="handleOpenBottomSheet"
                :on-close-end="handleCloseBottomSheet">
            <view render-prop-fn="renderContent">
                <view :style="{
                    flexDirection: 'column',
                    height: '100%',
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: DIMENSION.horizontal_margin,
                    paddingBottom: DIMENSION.horizontal_margin,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                }">
                    <view
                            v-if="activeMarker && activeMarker.properties.IMAGES.length > 0"
                            :style="{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginBottom: 10,
                            }">
                        <card-view
                                v-for="(item, index) in activeMarker ? activeMarker.properties.IMAGES : []"
                                :style="{
                                    width: 150,
                                    height: 100,
                                    marginRight: 10,
                                    marginBottom: 10,
                                }"
                                :card-elevation="5"
                                :card-maxElevation="5"
                                :corner-radius="10">
                            <image :source="{uri: item}"
                                   :style="{
                                        width: 150,
                                        height: 100,
                                   }"
                                   resize-mode="cover"/>
                        </card-view>
                    </view>

                    <view v-if="activeMarker && activeMarker.properties.DESCRIPTION_T && activeMarker.properties.DESCRIPTION_T.trim().length > 0"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">รายละเอียด
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">{{activeMarker ? activeMarker.properties.DESCRIPTION_T : ''}}
                        </text>
                    </view>
                    <view v-if="activeMarker && activeMarker.properties.LOCATION_T && activeMarker.properties.LOCATION_T.trim().length > 0"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">ตำแหน่ง
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">{{activeMarker ? activeMarker.properties.LOCATION_T : ''}}
                        </text>
                    </view>
                </view>
            </view>
            <view render-prop-fn="renderHeader">
                <view :style="{
                    flexDirection: 'row',
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: DIMENSION.horizontal_margin - 5,
                    paddingBottom: DIMENSION.horizontal_margin - 10,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }">
                    <view :style="{
                        flex: 1,
                    }">
                        <text :style="{
                            fontFamily: 'DBHeavent-Bold',
                            color: '#333333',
                            fontSize: 24,
                        }">
                            {{activeMarker ? activeMarker.properties.NAME_T : ''}}
                        </text>
                        <view :style="{
                            flexDirection: 'row',
                        }">
                            <image :source="{uri: (activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].image : null)}"
                                   :style="{
                                        width: 35,
                                        height: 38,
                                   }"
                                   resize-mode="contain"/>
                            <text :style="{
                                flex: 1,
                                fontFamily: 'DBHeavent',
                                color: '#aaaaaa',
                                fontSize: 20,
                                marginTop: 2,
                            }">
                                {{activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''}}
                            </text>
                        </view>
                    </view>
                    <touchable-opacity
                            :on-press="handleClickCloseBottomSheet"
                            :style="{
                                marginTop: 0,
                            }">
                        <image :source="imageClose"
                               :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                    </touchable-opacity>
                </view>
                <view :style="{
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
                }"/>
            </view>
        </bottom-sheet>-->
    </view>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, APP_NAME, PROVINCE_DIMENSION, PROVINCE_NAME_EN, DIMENSION,
        BOTTOM_NAV, MAP_HEADER, COLOR_PRIMARY, COLOR_PRIMARY_DARK
    } from '../../constants';

    import {Platform, StyleSheet, Dimensions, Linking, BackHandler} from 'react-native';
    import MapView from 'react-native-maps';
    import {PROVIDER_GOOGLE, Marker, Polyline, Polygon, WMSTile} from 'react-native-maps';
    import BottomSheet from 'reanimated-bottom-sheet';
    import {getStatusBarHeight} from 'react-native-status-bar-height';

    import imageClose from '../../../assets/images/ic_close2.png';

    export default {
        components: {
            MapView, Marker, Polyline, Polygon, WMSTile, BottomSheet,
        },
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            searchResultList() {
                return store.state.searchResultList[PROVINCE_NAME_EN[this.province]];
            },
            categoryData() {
                return store.state.categoryData;
            },
        },
        data: () => {
            return {
                store, PROVIDER_GOOGLE,
                DEBUG, APP_NAME, PROVINCE_DIMENSION, PROVINCE_NAME_EN, DIMENSION,
                BOTTOM_NAV, MAP_HEADER, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
                StyleSheet,

                imageClose,

                screenHeight: Dimensions.get('window').height,
                statusBarHeight: getStatusBarHeight(),
                activeMarker: null,
                backHandler: null,
                isBottomSheetOpen: false,
            };
        },
        methods: {
            handleMapReady: function () {
                const resultList = this.searchResultList;
                let minLat = null, maxLat = null, minLng = null, maxLng = null;

                for (let i = 0; i < resultList.length; i++) {
                    const lat = resultList[i].geometry.coordinates[1];
                    const lng = resultList[i].geometry.coordinates[0];

                    if (i === 0) {
                        minLat = lat;
                        maxLat = lat;
                        minLng = lng;
                        maxLng = lng;
                    } else {
                        if (lat < minLat) {
                            minLat = lat;
                        }
                        if (lat > maxLat) {
                            maxLat = lat;
                        }
                        if (lng < minLng) {
                            minLng = lng;
                        }
                        if (lng > maxLng) {
                            maxLng = lng;
                        }
                    }
                }

                try {
                    this.$refs['mapView'].animateToRegion({
                        latitude: (minLat + maxLat) / 2,
                        longitude: (minLng + maxLng) / 2,
                        latitudeDelta: maxLat - minLat + .001,
                        longitudeDelta: maxLng - minLng + .001,
                    });
                } catch (e) {
                    console.log('Error animate to region: ' + e);
                }
            },
            handleClickPoint: function (marker) {
                //this.$refs['bottomSheet'].snapTo(1);
                this.activeMarker = marker;
                marker.active = true;
            },
            handleClickCloseBottomSheet: function () {
                //this.$refs['bottomSheet'].snapTo(2);
            },
            handleOpenBottomSheet: function () {
                this.isBottomSheetOpen = true;
            },
            handleCloseBottomSheet: function () {
                this.isBottomSheetOpen = false;
            },
        },
        created: function () {
            //this.navigation.state.params.header = null;
            //this.navigation.navigate('News');

            /*store.dispatch('FETCH_MAP_DATA', {
                province: 0
            });*/

            /*const self = this;
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.isBottomSheetOpen) {
                    this.$refs['bottomSheet'].snapTo(2);
                    return true;
                }
                return false;
            });*/
        },
        beforeDestroy: function () {
            /*if (this.backHandler) {
                this.backHandler.remove();
            }*/
        },
    }
</script>

<style>
    .container {
        flex: 1;
        background-color: #f4f6fa;
    }

    .map-view {
        flex: 1;
        border-width: 0;
        border-color: orangered;
    }
</style>