<template>
    <view class="container">
        <form-header
                title="รายละเอียดสถานที่"
                :header-text="getHeader(marker)"
                :header-font-size="28"
                :sub-header-text="getSubHeader(marker)"
                :category-image="marker.properties.CATEGORY === 0 ? '' : store.state.categoryData[marker.properties.CATEGORY].image"
                :button-text="null"
                :override-scroll-view="true"
                :no-close-button="false"
                :close-button-image="imageNavigate"
                :on-click-back="handleClickBack"
                :on-click-close="handleClickNavigate">
            <view :style="{flex: 1}">
                <scroll-view
                        :style="{
                                flexDirection: 'column',
                                flex: 1,
                                paddingLeft: DIMENSION.horizontal_margin,
                                paddingRight: DIMENSION.horizontal_margin,
                                paddingTop: DIMENSION.horizontal_margin,
                                paddingBottom: DIMENSION.horizontal_margin,
                                backgroundColor: 'rgba(255, 255, 255, 240)',
                        }">
                    <scroll-view
                            v-if="marker.properties.IMAGES && marker.properties.IMAGES.length > 0"
                            :horizontal="true"
                            :style="{
                                padding: 0,
                                marginBottom: 15,
                                borderWidth: 0,
                                borderColor: 'red',
                            }">
                        <touchable-opacity
                                v-for="(item, index) in marker.properties.IMAGES"
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
                                            borderRadius: 10,
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

                    <view v-if="marker.properties.DESCRIPTION_T && marker.properties.DESCRIPTION_T.length > 0"
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
                            {{marker.properties.DESCRIPTION_T}}
                        </text>
                    </view>

                    <view v-if="marker.properties.LOCATION_T && marker.properties.LOCATION_T.length > 0"
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
                            {{marker.properties.LOCATION_T}}
                        </text>
                    </view>

                    <map-view
                            :provider="PROVIDER_GOOGLE"
                            :style="{
                                width: '100%',
                                height: STATIC_MAP_DIMENSION.height * (screenWidth - (2 * DIMENSION.horizontal_margin)) / STATIC_MAP_DIMENSION.width,
                                marginBottom: 15,
                            }"
                            :initial-region="{
                                latitude: marker.geometry.coordinates[1],
                                longitude: marker.geometry.coordinates[0],
                                latitudeDelta: marker.geometry.viewport ? marker.geometry.viewport.northeast.lat - marker.geometry.viewport.southwest.lat : 0.01,
                                longitudeDelta: marker.geometry.viewport ? marker.geometry.viewport.northeast.lng - marker.geometry.viewport.southwest.lng : 0.01,
                            }">
                        <custom-marker
                                v-if="marker.geometry.coordinates"
                                :marker="marker"/>

                        <!--<marker
                                v-for="point in nearbyRiskPointList"
                                v-if="nearbyRiskPointList"
                                :coordinate="{latitude: point.geometry.coordinates[1], longitude: point.geometry.coordinates[0]}"
                                pin-color="#000000"/>

                        <polyline
                                :coordinates="pathList"
                                :stroke-color="'#008000'"
                                :stroke-width="3"/>-->

                        <!--<marker
                                v-if="marker.geometry.coordinates"
                                :coordinate="{latitude: marker.geometry.coordinates[1], longitude: marker.geometry.coordinates[0]}"/>-->

                        <!--<map-view-directions
                                :origin="{latitude: 13.7563, longitude: 100.5018}"
                                :destination="{latitude: 13.7563, longitude: 102.5018}"
                                :api-key="GOOGLE_MAPS.geocodingApiKey"/>-->
                    </map-view>

                    <view :style="{flexDirection: 'row', marginBottom: 15}">
                        <view v-if="distanceText !== '' && !isLoadingStaticMaps"
                              :style="{flex: 1}">
                            <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">
                                {{'ระยะทาง'}}
                            </text>
                            <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">
                                {{distanceText}}
                            </text>
                        </view>
                        <view v-if="durationText !== '' && !isLoadingStaticMaps"
                              :style="{flex: 1}">
                            <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">
                                {{'ใช้เวลาเดินทาง'}}
                            </text>
                            <text :style="{
                                fontFamily: 'DBHeavent',
                                color: '#333333',
                                fontSize: 22,
                            }">
                                {{durationText}}
                            </text>
                        </view>
                    </view>

                    <text v-if="alertText"
                          :style="{
                                fontFamily: 'DBHeavent-Med',
                                paddingTop: 5,
                                paddingBottom: 5,
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: 'white',
                                backgroundColor: 'red',
                                fontSize: 22,
                          }">{{alertText}}
                    </text>

                    <image
                            v-if="staticMaps && !isLoadingStaticMaps"
                            :style="{
                                width: '100%',
                                height: STATIC_MAP_DIMENSION.height * (screenWidth - (2 * DIMENSION.horizontal_margin)) / STATIC_MAP_DIMENSION.width,
                                marginBottom: 15,
                            }"
                            resize-mode="contain"
                            :source="{uri: staticMaps}"/>
                    <view
                            v-if="isLoadingStaticMaps"
                            :style="{
                                marginTop: 30,
                                marginBottom: 40,
                            }">
                        <activity-indicator
                                size="small"
                                :color="COLOR_PRIMARY_DARK[province]"/>
                        <text class="progress-text">
                            {{'กำลังคำนวณระยะทางและโหลดภาพแผนที่เส้นทาง'}}
                        </text>
                    </view>

                    <Menu
                            ref="shareMenu"
                            :renderer="Popover"
                            :rendererProps="{preferredPlacement: 'top'}">
                        <MenuTrigger :custom-styles="{TriggerTouchableComponent: TouchableOpacity}">
                            <view
                                    :style="{
                                        backgroundColor: '#F0F6FF',
                                        paddingTop: 18,
                                        paddingBottom: 18,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 28,
                                    }">
                                <text
                                        :style="{
                                            fontFamily: 'DBHeavent-Med',
                                            fontSize: 22,
                                            color: '#435582',
                                        }">
                                    {{'แชร์'}}
                                </text>
                            </view>
                        </MenuTrigger>
                        <MenuOptions :style="{padding: 10}">
                            <MenuOption
                                    class="menu-option"
                                    :on-select="() => handleClickShare(0)"
                                    :custom-styles="{OptionTouchableComponent: TouchableOpacity}">
                                <Text class="menu-option-text">Facebook</Text>
                            </MenuOption>
                            <MenuOption
                                    class="menu-option"
                                    :on-select="() => handleClickShare(1)"
                                    :custom-styles="{OptionTouchableComponent: TouchableOpacity}">
                                <Text class="menu-option-text">อื่นๆ</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>

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
                <!--<view :style="{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
                }"/>-->
            </view>
        </form-header>
    </view>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, DIMENSION, STATIC_MAP_DIMENSION, PROVINCE_DIMENSION,
        GOOGLE_MAPS, COLOR_PRIMARY, COLOR_PRIMARY_DARK, PROVINCE_NAME_EN,
        RISK_POINT_CATEGORY_ID,
    } from '../../constants';
    import FormHeader from '../../components/FormHeader';
    import Progress from '../../components/Progress';
    import CustomMarker from './CustomMarker2';
    import {getCurrentLocation} from '../../constants/utils';
    import {doGetStaticMapsWithDirections, fetchCoordinates} from '../../store/fetch';

    import {Dimensions, StyleSheet, Alert, Platform, Linking, TouchableOpacity} from 'react-native';
    import CardView from 'react-native-cardview';
    import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
    //import MapViewDirections from 'react-native-maps-directions';
    import Share from 'react-native-share';
    import {LoginManager, ShareDialog, ShareApi} from 'react-native-fbsdk';
    import {Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';

    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    const {Popover} = renderers;

    export default {
        components: {
            FormHeader, CardView, Progress, MapView, Marker, Polyline, CustomMarker,
            Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger
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
            marker() {
                return this.navigation.getParam('marker');
            },
        },
        data: () => {
            return {
                store, PROVIDER_GOOGLE, PROVINCE_DIMENSION, GOOGLE_MAPS,
                DEBUG, DIMENSION, STATIC_MAP_DIMENSION,
                COLOR_PRIMARY, COLOR_PRIMARY_DARK,
                Dimensions, StyleSheet,
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                imageNavigate,

                distanceText: '', durationText: '', alertText: '',
                staticMaps: null,
                nearbyRiskPointList: [],
                pathList: [],
                isLoadingStaticMaps: false,
                Popover, TouchableOpacity,
            };
        },
        methods: {
            getHeader: function (marker) {
                if (marker.properties.CATEGORY) {
                    return marker.properties.NAME_T;
                } else if (marker.properties.LM_type === '500002') { // อำเภอ
                    return `อ.${marker.properties.NAME_T}`;
                } else if (marker.properties.LM_type === '500003') { // ตำบล
                    return `ต.${marker.properties.NAME_T}`;
                } else {
                    return marker.properties.NAME_T;
                }
            },
            getSubHeader: function (marker) {
                if (marker.properties.CATEGORY !== 0) {
                    return store.state.categoryData[marker.properties.CATEGORY].name;
                } else if (marker.properties.DESCRIPTION_T) {
                    return marker.properties.DESCRIPTION_T;
                } else {
                    return marker.properties.LOCATION_T;
                }
            },
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickNavigate: function () {
                let lat = null, lng = null;
                let label = null;

                if (this.marker) {
                    lat = this.marker.geometry.coordinates[1];
                    lng = this.marker.geometry.coordinates[0];
                    label = this.marker.properties.NAME_T;
                }

                if (lat !== null && lng != null) {
                    const latLng = `${lat},${lng}`;
                    //const appleMapsUrl = `maps:0,0?q=${label}@${latLng}`;
                    //const iosUrl = `https://www.google.com/maps/search/?api=1&query=${label}&center=${lat},${lng}`;
                    const iosGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}&center=${latLng}`;
                    const iosAppleMapsUrl = `maps:0,0?q=${label}@${latLng}`;
                    const androidUrl = `geo:0,0?q=${latLng}(${label})`;

                    /*const scheme = Platform.select({
                        ios: 'maps:0,0?q=',
                        android: 'geo:0,0?q='
                    });
                    const url = Platform.select({
                        ios: `${scheme}${label}@${latLng}`,
                        android: `${scheme}${latLng}(${label})`
                    });*/

                    const url = Platform.select({
                        ios: Linking.canOpenURL(`comgooglemaps://?center=${latLng}`) ? iosGoogleMapsUrl : iosAppleMapsUrl,
                        android: androidUrl
                    });

                    /*let url = appleMapsUrl;
                    if (Platform.OS === 'android') {
                        url = googleMapsUrl;
                    }*/

                    try {
                        Linking.openURL(url);
                    } catch (err) {
                        Alert.alert('ผิดพลาด', JSON.stringify(err));
                    }
                } else {
                    Alert.alert('ผิดพลาด', 'ไม่สามารถนำทางได้');
                }
            },
            handleClickShare: function (shareType) {
                this.$refs['shareMenu'].close();

                const markerName = this.marker.properties.NAME_T;
                const markerDescription = this.marker.properties.DESCRIPTION_T;
                const markerLocation = this.marker.properties.LOCATION_T;

                let markerLatLng = null;
                let url = null;
                if (this.marker.geometry.type.toLowerCase() === 'point'
                    && this.marker.geometry.coordinates) {
                    const latitude = this.marker.geometry.coordinates[1].toFixed(4);
                    const longitude = this.marker.geometry.coordinates[0].toFixed(4);
                    markerLatLng = `พิกัด:\nละติจูด ${latitude}, ลองจิจูด ${longitude}`;
                    url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                }

                let message = markerName;
                message += markerDescription && markerDescription.trim() !== ''
                    ? ((message === '' ? '' : '\n\n') + `รายละเอียด:\n${markerDescription}`)
                    : '';
                message += markerLocation && markerLocation.trim() !== ''
                    ? ((message === '' ? '' : '\n\n') + `ตำแหน่ง:\n${markerLocation}`)
                    : '';
                //message += markerLatLng === null ? '' : ((message === '' ? '' : '\n\n') + `${markerLatLng}`);
                if (shareType === 1) {
                    message += url === null ? '' : ((message === '' ? '' : '\n\n') + `${url}`);
                }
                message += '\n\n-------------\nข้อมูลจากแอปพลิเคชัน SAFE SAFE โดยสำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)';

                //https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393

                if (shareType === 0) {
                    const shareLinkContent = {
                        contentType: 'link',
                        quote: message,
                        contentUrl: url,
                        contentDescription: message,
                    };

                    ShareDialog.canShow(shareLinkContent)
                        .then(
                            function (canShow) {
                                if (canShow) {
                                    return ShareDialog.show(shareLinkContent);
                                }
                            }
                        )
                        .then(
                            function (result) {
                                if (result.isCancelled) {
                                    console.log('Share cancelled');
                                } else {
                                    console.log('Share success with postId: ' + result.postId);
                                }
                            },
                            function (error) {
                                console.log('Share fail with error: ' + error);
                            }
                        );
                } else if (shareType === 1) {
                    const shareOptions = {
                        title: markerName,
                        subject: markerName,
                        message,
                        //url,
                    };

                    //alert('title: ' + markerName + '\n\nmessage: ' + message);

                    Share.open(shareOptions)
                        .then((res) => {
                            console.log(res)
                        })
                        .catch((err) => {
                            err && console.log(err);
                        });
                }
            },
        },
        created: async function () {
            this.isLoadingStaticMaps = true;

            /*const riskCategoryList = [RISK_POINT_CATEGORY_ID];
            const riskPointList = store.state.markerList[PROVINCE_NAME_EN[0]].filter(
                coord => riskCategoryList.includes(coord.properties.CATEGORY)
            ).concat(store.state.markerList[PROVINCE_NAME_EN[1]].filter(
                coord => riskCategoryList.includes(coord.properties.CATEGORY)
            ));*/

            let riskPointList = [];
            const apiResultNakhonPathom = await fetchCoordinates({province: 0, idList: [RISK_POINT_CATEGORY_ID]});
            if (apiResultNakhonPathom.success) {
                riskPointList = riskPointList.concat(apiResultNakhonPathom.data.features);
            } else {
                // ignore fetch error
            }
            const apiResultYasothon = await fetchCoordinates({province: 1, idList: [RISK_POINT_CATEGORY_ID]});
            if (apiResultYasothon.success) {
                riskPointList = riskPointList.concat(apiResultYasothon.data.features);
            } else {
                // ignore fetch error
            }

            getCurrentLocation({
                callback: async coordinate => {
                    try {
                        const apiResult = await doGetStaticMapsWithDirections(
                            {latitude: coordinate.latitude, longitude: coordinate.longitude},
                            {latitude: this.marker.geometry.coordinates[1], longitude: this.marker.geometry.coordinates[0]},
                            riskPointList
                        );

                        this.isLoadingStaticMaps = false;
                        if (apiResult.success) {
                            this.distanceText = apiResult.data.distanceText;
                            this.durationText = apiResult.data.durationText;
                            this.alertText = apiResult.data.alertText;
                            this.staticMaps = apiResult.data.staticMapsUrl;
                            this.pathList = apiResult.data.pathList;
                            this.nearbyRiskPointList = apiResult.data.nearbyRiskPointList;
                        } else {
                            this.distanceText = '';
                            this.durationText = '';
                            this.alertText = '';
                            this.staticMaps = null;
                            //todo: กำหนดภาพ default / error
                            alert(apiResult.message);
                        }
                    } catch (e) {
                        console.log('Error get static maps: ' + e);
                    }
                }
            });
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .progress-text {
        text-align: center;
        font-family: DBHeaventt-Light;
        font-size: 22;
        margin-top: 10;
    }

    .menu-option {
    }

    .menu-option-text {
        font-family: DBHeavent;
        font-size: 22;
    }
</style>
