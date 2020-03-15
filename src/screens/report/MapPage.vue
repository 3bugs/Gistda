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
                :style="{marginTop: 0 /*MAP_HEADER.height*/}"
                :rotate-enabled="false"
                :on-map-ready="handleMapReady"
                :on-press="null"
                :on-region-change-complete="null">

            <custom-marker
                    v-for="(marker, index) in coordinateList"
                    v-if="marker.geometry.type === 'Point'"
                    :coordinate="{
                        latitude: marker.geometry.coordinates[1],
                        longitude: marker.geometry.coordinates[0]
                    }"
                    :marker="marker"
                    :on-press="() => handleClickPoint(marker)"/>

            <!--<marker v-for="(marker, index) in coordinateList"
                    v-if="marker.geometry.type === 'Point'"
                    :coordinate="{
                        latitude: marker.geometry.coordinates[1],
                        longitude: marker.geometry.coordinates[0]
                    }"
                    :title="marker.properties.NAME_T"
                    :description="null"
                    :image="getIcon(marker)"
                    :on-press="() => handleClickPoint(marker)"/>-->
        </map-view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, FORM, DIMENSION, PROVINCE_NAME_EN, BOTTOM_NAV, MAP_HEADER, PROVINCE_DIMENSION} from '../../constants';
    import CustomMarker from '../map/CustomMarker2';

    import {Dimensions, StyleSheet, Alert, Platform} from 'react-native';
    import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

    export default {
        components: {MapView, CustomMarker},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            coordinateList() {
                return store.state.reportData[PROVINCE_NAME_EN[this.province]].coords.features;
            },
            categoryData() {
                return store.state.categoryData;
            },
        },
        data: () => {
            return {
                DEBUG, FORM, DIMENSION, PROVINCE_NAME_EN, BOTTOM_NAV,
                PROVINCE_DIMENSION, MAP_HEADER,
                Dimensions, StyleSheet, PROVIDER_GOOGLE,
            };
        },
        methods: {
            handleMapReady: function () {
                //alert('Map ready!');
            },
            getIcon: function (marker) {
                return marker.properties.CATEGORY
                    ? this.categoryData[marker.properties.CATEGORY].image
                    : null;
            },
            handleClickPoint: function (marker) {
                marker.active = true;
                this.navigation.navigate('MarkerDetails', {marker});
            },
        },
        created: function () {
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .map-view {
        flex: 1;
        border-width: 0;
        border-color: orangered;
    }
</style>
