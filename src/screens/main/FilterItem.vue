<template>
    <view class="container">
        <view
                :style="{
                borderWidth: 0,
                borderColor: 'yellow',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 15,
                paddingRight: 20,
                }">
            <image :source="item.filterIcon"
                   class="image-filter"
                   resize-mode="contain"/>
            <text class="title">{{item.filterTitle}}</text>
            <check-box class="check"
                       :on-value-change="handleCheckChange"
                       :value="item.markerVisibility">
                <!--<view render-prop-fn="checkedIcon">
                    <image :source="imageCheckOn"/>
                </view>
                <view render-prop-fn="uncheckedIcon">
                    <image :source="imageCheckOff"/>
                </view>-->
            </check-box>
        </view>
        <card-view
                :card-elevation="1"
                :card-maxElevation="1"
                :corner-radius="10"
                :style="{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
                marginRight: 20,
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
                    thumb-tint-color="#4041da"
                    minimum-track-tint-color="#4041da"
                    :value="item.markerOpacity"
                    :on-value-change="handleSliderValueChange"/>
            <image :source="imageLightOn"
                   class="image-light"
                   resize-mode="contain"/>
        </card-view>
        <view
                :style="{
                width: '100%',
                marginTop: 15,
                marginBottom: 12,
                marginLeft: 20,
                marginRight: 0,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.2)'}"/>
    </view>
</template>

<script>
    import store from '../../store';

    import Slider from '@react-native-community/slider';
    import CardView from 'react-native-cardview';
    import imageLightOff from '../../../assets/ic_light_off.png';
    import imageLightOn from '../../../assets/ic_light_on.png';
    import imageCheckOff from '../../../assets/ic_check_off.png'
    import imageCheckOn from '../../../assets/ic_check_on.png'

    import imageFilterAccident from '../../../assets/ic_filter/ic_filter_geo_accident.png';

    export default {
        props: {
            item: { // ข้อมูล filter
                type: Object
            },
            index: { // index บอกลำดับของ filter
                type: Number
            }
        },
        components: {Slider, CardView,},
        data: () => {
            return {
                imageLightOff, imageLightOn,
                imageCheckOff, imageCheckOn,
                imageFilterAccident,
            };
        },
        methods: {
            handleSliderValueChange: function (value) {
                store.dispatch('SET_MARKER_OPACITY', {
                    key: this.index,
                    opacity: value
                });
            },
            handleCheckChange: function (value) {
                store.dispatch('SET_MARKER_VISIBILITY', {
                    key: this.index,
                    visibility: value
                });
            }
        },
    }
</script>

<style>
    .container {
        width: 100%;
        padding-left: 0;
    }

    .slider {
        flex: 1;
        padding-left: 0;
        padding-right: 0;
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
        flex: 1;
        font-family: DBHeavent;
        color: #b9bbff;
        font-size: 18;
        letter-spacing: 1;
        margin-bottom: 5;
    }

    .check {
        margin-bottom: 5;
        color: white;
    }
</style>