<template>
    <view class="container"
          :style="{marginBottom: 0}">
        <map-view
                v-if="resultType === 0"
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
                    :title="getTitle(marker)"
                    :description="null"
                    :image="getIcon(marker)"
                    :pin-color="getPinColor(marker)"
                    :on-press="() => handleClickPoint(marker)"/>
        </map-view>

        <flat-list
                v-if="resultType === 1"
                class="list"
                :data="searchResultList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <list-item
                        :item="args.item"
                        :index="args.index"
                        :image="(args.item.properties.IMAGES && args.item.properties.IMAGES.length > 0) ? args.item.properties.IMAGES[0] : ''"
                        :title="getTitle(args.item)"
                        :details="getDetails(args.item)"
                        :show-date="true"
                        :date="getDistanceText(args.item)"
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
                ref="markerDetails"
                :snap-points="[screenHeight - 140, (screenHeight - 140) / 2, 0]"
                :android-initial-snap="2"
                :coord="activeMarker ? {
                    latitude: activeMarker.geometry.coordinates[1],
                    longitude: activeMarker.geometry.coordinates[0],
                } : null"
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

        <!--dummy view มีไว้เพื่อให้ data binding ของ bottom sheet ทำงาน
            (น่าจะเป็น bug ของ bottom sheet หรือปัญหาจาก vue native)-->
        <!--<view :style="{
            position: 'absolute',
            width: 0, height: 0,
        }">
            <text>{{activeMarker ? activeMarker.properties.NAME_T : ''}}</text>
        </view>-->
    </view>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, APP_NAME, PROVINCE_DIMENSION, PROVINCE_NAME_EN, DIMENSION,
        BOTTOM_NAV, MAP_HEADER, COLOR_PRIMARY, COLOR_PRIMARY_DARK
    } from '../../constants';
    import ListItem from '../../components/ListItem';
    import MarkerDetails from '../map/MarkerDetails';

    import {Platform, StyleSheet, Dimensions, Linking, BackHandler, Alert} from 'react-native';
    import MapView from 'react-native-maps';
    import {PROVIDER_GOOGLE, Marker, Polyline, Polygon, WMSTile} from 'react-native-maps';
    //import BottomSheet from 'reanimated-bottom-sheet';
    import CardView from 'react-native-cardview';
    import {getStatusBarHeight} from 'react-native-status-bar-height';

    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    export default {
        components: {
            MapView, Marker, Polyline, Polygon, WMSTile, CardView, ListItem, MarkerDetails,
        },
        props: {
            navigation: {
                type: Object
            },
            resultType: {
                type: Number
            }
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
            getTitle: function (marker) {
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
            getIcon: function (marker) {
                return marker.properties.CATEGORY
                    ? this.categoryData[marker.properties.CATEGORY].image
                    : null;
            },
            getPinColor: function (marker) {
                if (marker.properties.CATEGORY) {
                    return '';
                } else if (marker.properties.LM_type === '500002') { // อำเภอ
                    return 'orange';
                } else if (marker.properties.LM_type === '500003') { // ตำบล
                    return 'green';
                } else {
                    return 'red';
                }
            },
            getDetails: function (marker) {
                if (marker.properties.CATEGORY) {
                    return marker.properties.DESCRIPTION_T;
                } else {
                    return marker.properties.DESCRIPTION_T;
                    //return marker.properties.LOCATION_T;
                }
            },
            handleMapReady: function () {
                console.log('*** Map ready');
                this.isMapReady = true;
                this.setRegion();

                this.handleClickCloseBottomSheet();
            },
            handleClickPoint: function (marker) {
                console.log(JSON.stringify(marker));

                //this.$refs['markerDetails'].snapTo(1);
                //this.$refs['rbSheet'].open();

                this.isMarkerClicked = true;
                this.activeMarker = marker;
                marker.active = true;

                this.navigation.navigate('MarkerDetails', {marker});
            },
            handleClickCloseBottomSheet: function () {
                //this.$refs['markerDetails'].snapTo(2);
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
            getDistanceText: function (searchResultItem) {
                return searchResultItem.distance
                    ? `${(searchResultItem.distance / 1000).toFixed(1)} กม.`
                    : '';
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