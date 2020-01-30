<template>
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
                    :on-press="() => handlePressPoint(marker)"/>

        </map-view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, APP_NAME, PROVINCE_DIMENSION, PROVINCE_NAME_EN, BOTTOM_NAV, MAP_HEADER, COLOR_PRIMARY, COLOR_PRIMARY_DARK} from '../../constants';

    import {Platform, Linking} from 'react-native';
    import MapView from 'react-native-maps';
    import {PROVIDER_GOOGLE, Marker, Polyline, Polygon, WMSTile} from 'react-native-maps';

    export default {
        components: {
            MapView, Marker, Polyline, Polygon, WMSTile,
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
                PROVIDER_GOOGLE,
                DEBUG, APP_NAME, PROVINCE_DIMENSION, PROVINCE_NAME_EN,
                BOTTOM_NAV, MAP_HEADER, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
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
            handlePressPoint: function (marker) {
                //this.$refs['bottomSheet'].snapTo(1);
                //alert(marker.properties.NAME_T);
                marker.active = true;
            },
        },
        created: function () {
        },
        mounted: function () {
        }
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