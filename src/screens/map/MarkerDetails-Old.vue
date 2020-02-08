<template>
    <bottom-sheet
            ref="bottomSheet"
            :snap-points="snapPoints"
            :initial-snap="Platform.OS === 'android' ? androidInitialSnap : 2"
            :enabled-inner-scrolling="true"
            :enabled-content-tap-interaction="false"
            :enabled-content-gesture-interaction="false"
            :on-open-start="onOpen"
            :on-close-end="onClose">
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
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: '#333333',
            }">
                <scroll-view
                        v-if="imageList.length > 0"
                        :horizontal="true"
                        :style="{
                                padding: 0,
                                marginBottom: 15,
                                borderWidth: 0,
                                borderColor: 'red',
                            }">
                    <touchable-opacity
                            v-for="(item, index) in imageList"
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

                <view v-if="description.length > 0"
                      :style="{marginBottom: 15}">
                    <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">
                        {{'รายละเอียด'}}
                    </text>
                    <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">
                        {{description}}
                    </text>
                </view>

                <view v-if="location.length > 0"
                      :style="{marginBottom: 15}">
                    <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">
                        {{'ตำแหน่ง'}}
                    </text>
                    <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">
                        {{location}}
                    </text>
                </view>

                <!--<map-view
                        :provider="PROVIDER_GOOGLE"
                        :style="{
                            height: 2 * (screenWidth - (2 * DIMENSION.horizontal_margin)) / 3,
                            borderColor: '#cccccc',
                            borderWidth: StyleSheet.hairlineWidth,
                        }"
                        :initial-region="{
                            latitude: (PROVINCE_DIMENSION[province].minLatitude + PROVINCE_DIMENSION[province].maxLatitude) / 2,
                            longitude: (PROVINCE_DIMENSION[province].minLongitude + PROVINCE_DIMENSION[province].maxLongitude) / 2,
                            latitudeDelta: PROVINCE_DIMENSION[province].maxLatitude - PROVINCE_DIMENSION[province].minLatitude,
                            longitudeDelta: PROVINCE_DIMENSION[province].maxLongitude - PROVINCE_DIMENSION[province].minLongitude,
                        }">
                    <marker
                            v-if="coord"
                            :coordinate="coord"/>
                    <marker
                            v-if="currentLocation"
                            :coordinate="currentLocation"/>

                    &lt;!&ndash;<map-view-directions
                            :origin="{latitude: 37.3318456, longitude: -122.0296002}"
                            :destination="{latitude: 37.771707, longitude: -122.4053769}"
                            :api-key="GOOGLE_MAPS.geocodingApiKey"/>&ndash;&gt;
                </map-view>-->

                <image
                        v-if="staticMapsImage"
                        :style="{
                            width: '100%',
                            height: STATIC_MAP_DIMENSION.height * (screenWidth - (2 * DIMENSION.horizontal_margin)) / STATIC_MAP_DIMENSION.width,
                            marginBottom: 15,
                        }"
                        resize-mode="contain"
                        :source="{uri: staticMapsImage}"/>

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
                        height: 0,
                        marginBottom: 50,
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
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: '#333333',
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
                            fontSize: titleFontSize,
                            marginBottom: 5,
                        }">
                        {{title}}
                    </text>
                    <view v-if="showCategory"
                          :style="{
                                    flexDirection: 'row',
                              }">
                        <image :source="{uri: categoryImageUrl}"
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
                            {{categoryName}}
                        </text>
                    </view>
                </view>
                <view>
                    <touchable-opacity
                            :on-press="onClickCloseButton"
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
</template>

<script>
    import store from '../../store';
    import {doGetStaticMapsWithDirections} from '../../store/fetch';
    import {DEBUG, DIMENSION, BOTTOM_NAV, GOOGLE_MAPS, PROVINCE_DIMENSION, STATIC_MAP_DIMENSION,} from '../../constants';
    import {getCurrentLocation} from '../../constants/utils'

    import {Dimensions, StyleSheet, Platform, Linking, Alert} from 'react-native';
    import {getStatusBarHeight} from 'react-native-status-bar-height';
    import BottomSheet from 'reanimated-bottom-sheet';
    import CardView from 'react-native-cardview';
    import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
    import MapViewDirections from 'react-native-maps-directions';

    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    export default {
        components: {BottomSheet, CardView, MapView, MapViewDirections, Marker},
        props: {
            snapPoints: {
                type: Array,
                default: [this.screenHeight - 140, (this.screenHeight - 140) / 2, 0]
            },
            androidInitialSnap: {
                type: Number,
                default: 2
            },
            coord: {
                type: Object
            },
            onOpen: {
                type: Function
            },
            onClose: {
                type: Function
            },
            onClickNavigate: {
                type: Function
            },
            onClickCloseButton: {
                type: Function
            },
            titleFontSize: {
                type: Number,
                default: 26,
            },
            title: {
                type: String,
                default: '',
            },
            showCategory: {
                type: Boolean,
                default: false,
            },
            categoryImageUrl: {
                type: String,
                default: null,
            },
            categoryName: {
                type: String,
                default: '',
            },
            imageList: {
                type: Array,
                default: [],
            },
            description: {
                type: String,
                default: '',
            },
            location: {
                type: String,
                default: '',
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG, DIMENSION, BOTTOM_NAV, GOOGLE_MAPS,
                PROVIDER_GOOGLE, PROVINCE_DIMENSION, STATIC_MAP_DIMENSION,
                Dimensions, StyleSheet, Platform,
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                statusBarHeight: getStatusBarHeight(),
                imageClose, imageNavigate,
                //currentLocation: null,
                staticMapsImage: null,
            };
        },
        methods: {
            snapTo: function (snapPoint) {
                this.$refs['bottomSheet'].snapTo(snapPoint);

                if (snapPoint === 1) {
                    getCurrentLocation({
                        callback: async coordinate => {
                            try {
                                const apiResult = await doGetStaticMapsWithDirections(
                                    {latitude: coordinate.latitude, longitude: coordinate.longitude},
                                    {latitude: this.coord.latitude, longitude: this.coord.longitude}
                                );

                                if (apiResult.success) {
                                    console.log(`Static maps image: ${apiResult.data.staticMapsUrl}`);
                                    this.staticMapsImage = apiResult.data.staticMapsUrl;
                                }
                                //this.currentLocation = coord;

                                /*this.$refs['mapView'].animateToRegion({
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                });*/
                            } catch (e) {
                                console.log('Error animate to region: ' + e);
                            }
                        }
                    });
                }
            },
            handleClickNavigate: function () {
                if (this.onClickNavigate) {
                    this.onClickNavigate(); // callback ไปยัง parent เผื่อจะทำอะไรสักอย่าง
                }

                let lat = null, lng = null;
                let label = null;

                if (this.coord) {
                    lat = this.coord.latitude;
                    lng = this.coord.longitude;
                    label = this.title;
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
                    Alert.alert('ผิดพลาด', 'ไม่สามารถนำทางได้');
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