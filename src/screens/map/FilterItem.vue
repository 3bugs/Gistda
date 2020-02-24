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
                       :checked="visibilityValue">
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
                    :thumb-tint-color="SIDEBAR.sliderColor[province]"
                    :minimum-track-tint-color="SIDEBAR.sliderColor[province]"
                    :value="item.markerOpacity"
                    :thumb-image="SIDEBAR.sliderThumb[province]"
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
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: 'rgba(255, 255, 255, 0.2)'}"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {getLocalCategoryData, setLocalCategoryData} from '../../store/db';
    import {DEBUG, SIDEBAR} from '../../constants';

    import {StyleSheet} from 'react-native';
    import Slider from '@react-native-community/slider';
    import CardView from 'react-native-cardview';
    import {CheckBox} from 'react-native-elements';

    import imageLightOff from '../../../assets/images/sidebar/ic_light_off.png';
    import imageLightOn from '../../../assets/images/sidebar/ic_light_on.png';
    import imageCheckOff from '../../../assets/images/sidebar/ic_check_off.png'
    import imageCheckOn from '../../../assets/images/sidebar/ic_check_on.png'

    export default {
        props: {
            item: { // filter item
                type: Object
            },
            index: { // index บอกลำดับของ filter ใน type
                type: Number
            },
            typeIndex: { // index บอกลำดับของ filter type
                type: Number
            }
        },
        components: {Slider, CardView, CheckBox},
        computed: {
            province() {
                return store.state.province;
            },
            title() {
                let title = '';
                if (this.item.name) {
                    title = this.item.name.trim();
                    if (DEBUG && this.item.markerList) {
                        title += ` (${this.item.markerList.length})`;
                    }
                }
                return title;
            }
        },
        data: () => {
            return {
                DEBUG, SIDEBAR, StyleSheet,
                imageLightOff, imageLightOn,
                imageCheckOff, imageCheckOn,
                visibilityValue: true,
            };
        },
        methods: {
            handleSliderValueChange: function (value) {
                store.dispatch('SET_MARKER_OPACITY', {
                    id: this.item.id,
                    index: this.index,
                    typeIndex: this.typeIndex,
                    opacity: value
                });
            },
            handleCheckChange: async function (e) {
                //alert(e.target);

                this.visibilityValue = !this.visibilityValue;

                if (this.visibilityValue) {
                    console.log('Checking if cache exist');
                    const categoryData = await getLocalCategoryData(this.province, this.item.id);

                    if (true /*!categoryData || !categoryData.markerList*/) { // ถ้ายังไม่มีในแคช
                        console.log(`Cache NOT found: province-${this.province}-category-${this.item.id}`);

                        await store.dispatch('FETCH_COORDINATES', {
                            province: this.province,
                            idList: [this.item.id],
                            callback: (success, message) => {
                                //this.visibilityValue = !this.visibilityValue;

                                store.dispatch('SET_MARKER_VISIBILITY', {
                                    id: this.item.id,
                                    index: this.index,
                                    typeIndex: this.typeIndex,
                                    visibility: this.visibilityValue
                                });

                                setLocalCategoryData(this.province, this.item.id, {markerVisibility: this.visibilityValue});
                            },
                        });
                    } else { // ถ้ามีในแคชแล้ว ไม่ต้อง fetch ใหม่
                        console.log(`Cache found: province-${this.province}-category-${this.item.id}`);

                        //this.visibilityValue = !this.visibilityValue;

                        await store.dispatch('SET_MARKER_VISIBILITY', {
                            id: this.item.id,
                            index: this.index,
                            typeIndex: this.typeIndex,
                            visibility: this.visibilityValue
                        });

                        await setLocalCategoryData(this.province, this.item.id, {markerVisibility: this.visibilityValue});
                    }
                } else {
                    //this.visibilityValue = !this.visibilityValue;

                    await store.dispatch('SET_MARKER_VISIBILITY', {
                        id: this.item.id,
                        index: this.index,
                        typeIndex: this.typeIndex,
                        visibility: this.visibilityValue
                    });

                    await setLocalCategoryData(this.province, this.item.id, {markerVisibility: this.visibilityValue});

                    await store.dispatch('CLEAR_COORDINATES', {
                        province: this.province,
                        categoryId: this.item.id,
                        callback: (success, data) => {
                        }
                    });
                }
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
        /*color: #b9bbff;*/
        color: 'rgba(255, 255, 255, 0.7)';
        font-size: 20;
        letter-spacing: 0;
        margin-top: 4;
        margin-bottom: 10;
    }

    .check {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
    }
</style>
