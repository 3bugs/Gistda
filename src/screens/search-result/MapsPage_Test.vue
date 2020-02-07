<template>
    <view class="container"
          :style="{marginBottom: 0}">
        <flat-list
                class="list"
                v-if="searchResultList.length > 0"
                :data="searchResultList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <list-item
                        :item="args.item"
                        :index="args.index"
                        :image="args.item.properties.IMAGES.length > 0 ? args.item.properties.IMAGES[0] : ''"
                        :title="args.item.properties.NAME_T"
                        :details="args.item.properties.DESCRIPTION_T"
                        :show-date="false"
                        :on-click="() => handleClickPoint(args.item)"/>
            </view>
            <view render-prop="ListHeaderComponent"
                  v-if="false">
                <view :style="{height: 15}"/>
            </view>
            <view render-prop="ListFooterComponent"
                  v-if="true">
                <view :style="{height: 50}"/>
            </view>
        </flat-list>

        <!--<marker-details
                v-if="false"
                ref="markerDetails"
                :on-open="handleOpenBottomSheet"
                :on-close="handleCloseBottomSheet"
                :on-click-navigate="null"
                :on-click-close-button="handleClickCloseBottomSheet"
                :title-font-size="26"
                :title="activeMarker ? activeMarker.properties.NAME_T : ''"
                :show-category="true"
                :category-image-url="activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].image : null"
                :category-name="activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''"
                :image-list="activeMarker ? activeMarker.properties.IMAGES : []"
                :description="(activeMarker && activeMarker.properties.DESCRIPTION_T) ? activeMarker.properties.DESCRIPTION_T.trim() : ''"
                :location="(activeMarker && activeMarker.properties.LOCATION_T) ? activeMarker.properties.LOCATION_T.trim() : ''"/>-->

        <r-b-sheet
                ref="rbSheet"
                :height="300"
                :duration="400"
                :close-on-drag-down="true"
                :custom-styles="{
                    container: {
                        flex: 1,
                    },
                    wrapper: {
                        backgroundColor: 'transparent'
                    },
                    draggableIcon: {
                        backgroundColor: '#e0e0e0'
                    },
                }">
            <view>
                <view :style="{
                    flexDirection: 'row',
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: 10,
                    paddingBottom: DIMENSION.horizontal_margin - 10,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }">
                    <view :style="{
                        flex: 1,
                        marginRight: 5,
                    }">
                        <!--<touchable-opacity>
                            <view :style="{
                                alignSelf: 'center',
                                backgroundColor: '#e0e0e0',
                                width: 30,
                                height: 6,
                                marginLeft: 53,
                                marginBottom: 8,
                                borderRadius: 2,
                            }"/>
                        </touchable-opacity>-->

                        <text :style="{
                            fontFamily: 'DBHeavent-Bold',
                            color: '#333333',
                            fontSize: 26,
                            marginBottom: 5,
                        }">
                            {{activeMarker ? activeMarker.properties.NAME_T : ''}}
                        </text>
                        <view
                                :style="{
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
                                fontSize: 22,
                                marginTop: 2,
                            }">
                                {{activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''}}
                            </text>
                        </view>
                    </view>
                    <view>
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
                        <touchable-opacity
                                :on-press="handleClickNavigate"
                                :style="{
                                marginTop: 0,
                            }">
                            <image :source="imageNavigate"
                                   :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                        </touchable-opacity>
                    </view>
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
        </r-b-sheet>

        <bottom-sheet
                ref="markerDetails"
                :snap-points="[screenHeight - 140, (screenHeight - 140) / 2, 0]"
                :initial-snap="Platform.OS === 'android' ? 2 : 2"
                :enabled-inner-scrolling="true"
                :enabled-content-tap-interaction="false"
                :enabled-content-gesture-interaction="false"
                :on-open-start="handleOpenBottomSheet"
                :on-close-end="handleCloseBottomSheet">
            <view render-prop-fn="renderContent"
                  :style="{
                        height: '100%',
                  }">
                <scroll-view :style="{
                    flexDirection: 'column',
                    flex: 1,
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: DIMENSION.horizontal_margin,
                    paddingBottom: DIMENSION.horizontal_margin,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderTopWidth: 0,
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderColor: '#666666',
                }">
                    <scroll-view
                            v-if="activeMarker && activeMarker.properties.IMAGES.length > 0"
                            :horizontal="true"
                            :style="{
                                padding: 0,
                                marginBottom: 15,
                                borderWidth: 0,
                                borderColor: 'red',
                            }">
                        <touchable-opacity
                                v-for="(item, index) in activeMarker ? activeMarker.properties.IMAGES : []"
                                :on-press="null"
                                :active-opacity="0.6">
                            <card-view
                                    :style="{
                                        width: 150,
                                        height: 100,
                                        marginRight: 10,
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
                        </touchable-opacity>
                    </scroll-view>

                    <!--<flat-list
                            :data="activeMarker ? activeMarker.properties.IMAGES : []"
                            :key-extractor="(item, index) => index.toString()">
                        <view render-prop-fn="renderItem">
                            <card-view
                                    :style="{
                                        width: 200,
                                        height: 112,
                                        marginTop: 5,
                                        marginRight: 15,
                                    }"
                                    :card-elevation="10"
                                    :card-maxElevation="10"
                                    :corner-radius="10"
                                    :style="{}">
                                <image :source="{uri: args.item}"
                                       :style="{
                                            flex: 1,
                                       }"
                                       resize-mode="cover"/>
                            </card-view>
                        </view>
                    </flat-list>-->

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

                    <touchable-opacity
                            :on-press="handleClickNavigate"
                            :active-opacity="0.4">
                        <view :style="{
                            backgroundColor: '#F0F6FF',
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 28,
                        }">
                            <text :style="{
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 22,
                                color: '#435582',
                            }">
                                {{'นำทาง'}}
                            </text>
                        </view>
                    </touchable-opacity>

                    <text v-for="item in new Array(20)"
                          v-if="false"
                          :style="{
                                marginBottom: 10,
                          }">{{'Hello: ' + item}}
                    </text>

                    <view :style="{
                        height: BOTTOM_NAV.height,
                        marginBottom: 30,
                    }"/>
                </scroll-view>
            </view>
            <view render-prop-fn="renderHeader">
                <view :style="{
                    flexDirection: 'row',
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: 10,
                    paddingBottom: DIMENSION.horizontal_margin - 10,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    borderTopWidth: 2,
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderColor: '#666666',
                }">
                    <view :style="{
                        flex: 1,
                        marginRight: 5,
                    }">
                        <touchable-opacity>
                            <view :style="{
                                alignSelf: 'center',
                                backgroundColor: '#e0e0e0',
                                width: 30,
                                height: 6,
                                marginLeft: 53,
                                marginBottom: 8,
                                borderRadius: 2,
                            }"/>
                        </touchable-opacity>

                        <text :style="{
                            fontFamily: 'DBHeavent-Bold',
                            color: '#333333',
                            fontSize: 26,
                            marginBottom: 5,
                        }">
                            {{activeMarker ? activeMarker.properties.NAME_T : ''}}
                        </text>
                        <view
                                :style="{
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
                                fontSize: 22,
                                marginTop: 2,
                            }">
                                {{activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''}}
                            </text>
                        </view>
                    </view>
                    <view>
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
                        <touchable-opacity
                                :on-press="handleClickNavigate"
                                :style="{
                                marginTop: 0,
                            }">
                            <image :source="imageNavigate"
                                   :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                        </touchable-opacity>
                    </view>
                </view>

                <!--<touchable-opacity
                        :on-press="handleClickNavigate"
                        :active-opacity="0.4">
                    <view :style="{
                            backgroundColor: '#F0F6FF',
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 28,
                        }">
                        <text :style="{
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 22,
                                color: '#435582',
                            }">นำทาง</text>
                    </view>
                </touchable-opacity>-->

                <view :style="{
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
                }"/>
            </view>
        </bottom-sheet>
    </view>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, APP_NAME, PROVINCE_DIMENSION, PROVINCE_NAME_EN, DIMENSION,
        BOTTOM_NAV, MAP_HEADER, COLOR_PRIMARY, COLOR_PRIMARY_DARK
    } from '../../constants';
    import ListItem from '../../components/ListItem';

    import {Platform, StyleSheet, Dimensions, Linking, BackHandler, Alert} from 'react-native';
    import MapView from 'react-native-maps';
    import {PROVIDER_GOOGLE, Marker, Polyline, Polygon, WMSTile} from 'react-native-maps';
    import BottomSheet from 'reanimated-bottom-sheet';
    import CardView from 'react-native-cardview';
    import RBSheet from "react-native-raw-bottom-sheet";
    import {getStatusBarHeight} from 'react-native-status-bar-height';

    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    export default {
        components: {
            MapView, Marker, Polyline, Polygon, WMSTile, BottomSheet, CardView, RBSheet, ListItem,
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
                Platform, StyleSheet, Linking, Alert,

                imageClose, imageNavigate,

                screenHeight: Dimensions.get('window').height,
                statusBarHeight: getStatusBarHeight(),
                activeMarker: null,
                backHandler: null,
                isMapReady: false,
                isBottomSheetOpen: false,
                isMarkerClicked: false,
            };
        },
        methods: {
            handleMapReady: function () {
                console.log('*** Map ready');
                this.isMapReady = true;
                this.setRegion();

                this.handleClickCloseBottomSheet();
            },
            handleClickPoint: function (marker) {
                console.log(JSON.stringify(marker));

                this.$refs['markerDetails'].snapTo(1);
                //this.$refs['rbSheet'].open();

                this.isMarkerClicked = true;
                this.activeMarker = marker;
                marker.active = true;
            },
            handleClickCloseBottomSheet: function () {
                this.$refs['markerDetails'].snapTo(2);
            },
            handleOpenBottomSheet: function () {
                this.isBottomSheetOpen = true;
            },
            handleCloseBottomSheet: function () {
                this.isBottomSheetOpen = false;
            },
            setRegion: function () {
                const resultList = this.searchResultList;
                let minLat = null, maxLat = null, minLng = null, maxLng = null;

                for (let i = 0; i < resultList.length; i++) {
                    const name = resultList[i].properties.NAME_T;
                    const type = resultList[i].geometry.type;
                    const category = resultList[i].properties.CATEGORY;
                    const province = resultList[i].properties.P_CODE;
                    const lat = resultList[i].geometry.coordinates[1];
                    const lng = resultList[i].geometry.coordinates[0];

                    console.log(`[${type}][CATEGORY ${category}][P_CODE ${province}] ${name} - Lat: ${lat}, Lng: ${lng}`);

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
                    const region = {
                        latitude: (minLat + maxLat) / 2,
                        longitude: (minLng + maxLng) / 2,
                        latitudeDelta: maxLat - minLat + (.3 * (maxLat - minLat)),
                        longitudeDelta: maxLng - minLng + (.3 * (maxLng - minLng)),
                    };
                    console.log('Region for result markers', JSON.stringify(region));
                    this.$refs['mapView'].animateToRegion(region);
                } catch (e) {
                    console.log('Error animate to region: ' + e);
                }
            },
            handleClickNavigate: function () {
                let lat = null, lng = null;
                let label = null;

                if (this.activeMarker) {
                    lat = this.activeMarker.geometry.coordinates[1];
                    lng = this.activeMarker.geometry.coordinates[0];
                    label = this.activeMarker.properties.NAME_T;
                }

                if (lat !== null && lng != null) {
                    const scheme = Platform.select({
                        ios: 'maps:0,0?q=',
                        android: 'geo:0,0?q='
                    });
                    const latLng = `${lat},${lng}`;
                    const url = Platform.select({
                        ios: `${scheme}${label}@${latLng}`,
                        android: `${scheme}${latLng}(${label})`
                    });

                    Linking.openURL(url);
                } else {
                    Alert.alert('ผิดพลาด', 'ไม่สามารถนำทางได้')
                }
            },
        },
        beforeCreate: function () {
            console.log('*** Lifecycle beforeCreate');
        },
        created: function () {
            console.log('*** Lifecycle created');

            //this.navigation.state.params.header = null;
            //this.navigation.navigate('News');

            /*store.dispatch('FETCH_MAP_DATA', {
                province: 0
            });*/

            /*const self = this;
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.isBottomSheetOpen) {
                    this.$refs['markerDetails'].snapTo(2);
                    return true;
                }
                return false;
            });*/
        },
        beforeDestroy: function () {
            console.log('*** Lifecycle beforeDestroy');
            /*if (this.backHandler) {
                this.backHandler.remove();
            }*/
        },
        destroyed: function () {
            console.log('*** Lifecycle destroyed');
        },
        beforeUpdate: function () {
            console.log('*** Lifecycle beforeUpdate');
        },
        updated: function () {
            console.log('*** Lifecycle updated');

            if (this.isMapReady && !this.isMarkerClicked) {
                this.setRegion();
            }
            this.isMarkerClicked = false;
        },
        beforeMount: function () {
            console.log('*** Lifecycle beforeMount');
        },
        mounted: function () {
            console.log('*** Lifecycle mounted');
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