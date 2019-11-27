<template>
    <view class="container">
        <view
                :style="{
                borderWidth: 0,
                borderColor: 'yellow',
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 15,
                paddingRight: 0,
                }">
            <image :source="{uri: item.image}"
                   class="image-filter"
                   resize-mode="contain"/>
            <text class="title">
                {{title}}
            </text>
            <check-box class="check"
                       :container-style="{
                       marginTop: 0,
                       marginBottom: 0,
                       marginTop: 3,
                       paddingTop: 5,
                       paddingBottom: 5
                       }"
                       :on-press="handleCheckChange"
                       :checked="item.markerVisibility">
                <view render-prop="checkedIcon">
                    <image :style="{width: 15, height: 15}"
                           :source="imageCheckOn"/>
                </view>
                <view render-prop="uncheckedIcon">
                    <image :style="{width: 15, height: 15}"
                           :source="imageCheckOff"/>
                </view>
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
                marginBottom: 10,
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
    import {CheckBox} from 'react-native-elements';

    import imageLightOff from '../../../assets/ic_light_off.png';
    import imageLightOn from '../../../assets/ic_light_on.png';
    import imageCheckOff from '../../../assets/ic_check_off.png'
    import imageCheckOn from '../../../assets/ic_check_on.png'

    export default {
        props: {
            item: { // filter item
                type: Object
            },
            index: { // index บอกลำดับของ filter
                type: Number
            }
        },
        components: {Slider, CardView, CheckBox},
        computed: {
            title() {
                let title = '';
                if (this.item.name) {
                    title = this.item.name.trim();
                    if (this.item.markerList) {
                        title += ` (${this.item.markerList.length})`;
                    }
                }
                return title;
            }
        },
        data: () => {
            return {
                imageLightOff, imageLightOn,
                imageCheckOff, imageCheckOn,
                visibilityValue: true,
            };
        },
        methods: {
            handleSliderValueChange: function (value) {
                store.dispatch('SET_MARKER_OPACITY', {
                    id: this.item.id,
                    opacity: value
                });
            },
            handleCheckChange: function (e) {
                //alert(e.target);
                this.visibilityValue = !this.visibilityValue;

                store.dispatch('SET_MARKER_VISIBILITY', {
                    id: this.item.id,
                    visibility: this.visibilityValue
                });
            }
        },
        created: function () {
            this.visibilityValue = this.item.markerVisibility;
        }
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
        width: 35;
        height: 38;
        margin-right: 6;
    }

    .title {
        flex: 1;
        font-family: DBHeavent;
        color: #b9bbff;
        font-size: 19;
        letter-spacing: 0;
        margin-top: 5;
        margin-bottom: 10;
    }

    .check {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
    }
</style>