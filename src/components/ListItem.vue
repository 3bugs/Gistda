<template>
    <view>
        <ripple
                class="container"
                :ripple-color="COLOR_PRIMARY[province]"
                :ripple-opacity="0.2"
                :ripple-duration="500"
                :_active-opacity="0.5"
                :on-press="() => {onClick(item)}"
                :style="{
                    paddingTop: paddingTop,
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin
                }">
            <card-view
                    v-if="image"
                    class="cover-image-container"
                    :card-elevation="10"
                    :card-maxElevation="10"
                    :corner-radius="10"
                    :style="{}">
                <image
                        :source="{uri: image}"
                        class="cover-image"
                        resize-mode="cover"/>
                <view
                        v-if="item.seen != null && item.seen === false"
                        :style="{
                            position: 'absolute', zIndex: 1,
                            top: 0, left: 0,
                            width: 16, height: 16,
                            borderWidth: 2, borderColor: 'white',
                            borderRadius: 8,
                            backgroundColor: '#EB5757'
                        }"/>
            </card-view>
            <view class="content">
                <text class="title"
                      :numberOfLines="1">
                    {{title.trim()}}
                </text>
                <text class="caption"
                      :numberOfLines="showDate ? 2 : 3">
                    {{details.trim().length === 0 ? '(ไม่มีรายละเอียด)' : details.trim().concat('\n‌‌').concat(INVISIBLE_CHAR)}}
                </text>
                <text class="date"
                      v-if="showDate && date && date.trim().length > 0">
                    {{date}}
                </text>
            </view>
        </ripple>
        <view :style="{
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: DIMENSION.horizontal_margin,
                    marginRight: DIMENSION.horizontal_margin,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#999999'
        }"/>
    </view>
</template>

<script>
    import store from '../store';
    import {DEBUG, COLOR_PRIMARY, DIMENSION} from '../constants';

    import {StyleSheet} from 'react-native';
    import CardView from 'react-native-cardview';
    import Ripple from 'react-native-material-ripple';
    import {CachedImage} from 'react-native-cached-image';

    const INVISIBLE_CHAR = '‌‌ ';

    export default {
        components: {CardView, Ripple, CachedImage},
        props: {
            item: {
                type: Object
            },
            index: {
                type: Number
            },
            image: {
                type: String,
                default: '',
            },
            title: {
                type: String,
                default: '',
            },
            details: {
                type: String,
                default: '',
            },
            showDate: {
                type: Boolean,
                default: true,
            },
            date: {
                type: String,
                default: null,
            },
            paddingTop: {
                type: Number,
                default: 15,
            },
            onClick: {
                type: Function
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                StyleSheet, COLOR_PRIMARY, DIMENSION,
                INVISIBLE_CHAR,
            };
        },
        methods: {
        },
    }
</script>

<style>
    .container {
        flex: 1;
        flex-direction: row;
        padding-bottom: 20;
        border-width: 0;
        border-color: red;
        background-color: white;
    }

    .cover-image-container {
        width: 130;
        height: 88;
        margin-top: 5;
        margin-right: 15;
    }

    .cover-image {
        flex: 1;
        border-radius: 10;
    }

    .content {
        flex: 1;
        border-width: 0;
        border-color: red;
    }

    .title {
        font-family: DBHeavent-Bold;
        font-size: 22;
        color: #333333;
        margin-bottom: 1;
    }

    .caption {
        font-family: DBHeavent;
        font-size: 20;
        color: #626b80;
        margin-bottom: 0;
    }

    .date {
        font-family: DBHeavent;
        font-size: 18;
        color: #aaaaaa;
        margin-top: 2;
    }
</style>
