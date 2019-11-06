<template>
    <view class="container">
        <view
                :style="{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 10,
                }">
            <image :source="imageFilterAccident"
                   class="image-filter"
                   resize-mode="contain"/>
            <text class="title">ตำแหน่งอุบัติเหตุ</text>
        </view>
        <card-view
                :card-elevation="1"
                :card-maxElevation="1"
                :corner-radius="10"
                :style="{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 10,
                paddingRight: 10,
                height: 20,
                backgroundColor: '#fff'
                }">
            <image :source="imageLightOff"
                   class="image-light"
                   resize-mode="contain"/>
            <slider class="slider"
                    thumb-tint-color="#4041da"/>
            <image :source="imageLightOn"
                   class="image-light"
                   resize-mode="contain"/>
        </card-view>
    </view>
</template>

<script>
    import Slider from '@react-native-community/slider';
    import CardView from 'react-native-cardview';
    import imageLightOff from '../../assets/ic_light_off.png';
    import imageLightOn from '../../assets/ic_light_on.png';
    import imageFilterAccident from '../../assets/ic_filter_accident.png';

    export default {
        components: {Slider, CardView,},
        props: {},
        data: () => {
            return {
                imageLightOff, imageLightOn,
                imageFilterAccident,
            };
        },
        methods: {},
    }
</script>

<style>
    .container {
        width: 100%;
        padding: 10;
    }

    .slider {
        flex: 1;
    }

    .image-light {
        width: 10;
        height: 10;
    }

    .image-filter {
        width: 32;
        height: 35;
        margin-right: 5;
    }

    .title {
        font-family: DBHeaventt-Light;
        color: #b9bbff;
        font-size: 18;
        margin-bottom: 5;
    }
</style>