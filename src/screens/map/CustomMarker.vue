<template>
    <marker :coordinate="{
                latitude: marker.geometry.coordinates[1],
                longitude: marker.geometry.coordinates[0]
            }"
            :anchor="{x: 0.5, y: 0.77}"
            :title="marker.properties.NAME_T"
            :description="null"
            :opacity="marker.opacity"
            :tracks-view-changes="tracksViewChanges"
            :on-press="onPress">
        <image
                :source="{uri: marker.image}"
                resize-mode="contain"
                :style="{
                    width: 40, //42, //36,
                    height: 43.33, //45.5, //39,
                }"
                :fade-duration="0"
                :on-load="stopTrackingViewChanges"/>
    </marker>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';

    import {Image, Dimensions} from 'react-native';
    import {Marker} from 'react-native-maps';

    import imagePin from '../../../assets/images/sidebar/ic_filter_basic_government.png'

    export default {
        components: {Image, Marker},
        props: {
            marker: {
                type: Object
            },
            onPress: {
                type: Function
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG,
                Dimensions,
                tracksViewChanges: true,
                imagePin,
            };
        },
        methods: {
            stopTrackingViewChanges: function () {
                this.tracksViewChanges = false;
            },
        },
    }
</script>

<style>
</style>
