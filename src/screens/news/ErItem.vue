<template>
    <view class="container">
        <card-view
                class="card"
                :card-elevation="7"
                :card-maxElevation="7"
                :corner-radius="12"
                :style="{}">
            <ripple
                    class="content-touchable"
                    :ripple-color="COLOR_PRIMARY[province]"
                    :ripple-opacity="0.2"
                    :ripple-duration="500"
                    :_active-opacity="0.5"
                    :ripple-sequential="false"
                    :on-press="null">
                <view class="content">
                    <text class="title"
                          :numberOfLines="1">
                        {{item.name}}
                    </text>
                    <text class="detail"
                          :numberOfLines="1">
                        {{item.detail}}
                    </text>
                </view>
                <view class="icon-container">
                    <image :source="SCREEN_NEWS.phoneIcon[province]"
                           class="icon"
                           resize-mode="cover"/>
                    <text class="phone">
                        {{item.phone}}
                    </text>
                </view>
            </ripple>
        </card-view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, COLOR_PRIMARY, SCREEN_NEWS} from '../../constants';

    import {StyleSheet} from 'react-native';
    import CardView from 'react-native-cardview';
    import Ripple from 'react-native-material-ripple';

    import imagePhone from '../../../assets/images/screen_news/ic_phone_nakhon_pathom.png';

    export default {
        components: {CardView, Ripple},
        props: {
            item: {
                type: Object
            },
            index: {
                type: Number
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                StyleSheet, COLOR_PRIMARY, SCREEN_NEWS,
                imagePhone,
            };
        },
        methods: {},
    }
</script>

<style>
    .container {
        padding-top: 5;
        padding-bottom: 10;
        padding-left: 20;
        padding-right: 20;
        border-width: 0;
        border-color: orangered;
    }

    .card {
        flex: 1;
    }

    .content-touchable {
        flex: 1;
        flex-direction: row;
        align-items: center;
        padding-top: 10;
        padding-bottom: 13;
        padding-left: 15;
        padding-right: 15;
    }

    .content {
        flex: 1;
        border-width: 0;
        border-color: green;
    }

    .title {
        font-family: DBHeavent-Bold;
        font-size: 30;
        color: #333333;
        margin-bottom: 0;
    }

    .detail {
        font-family: DBHeavent;
        font-size: 18;
        color: #626b80;
    }

    .icon-container {
        align-items: center;
    }

    .icon {
        width: 30;
        height: 30;
        margin-top: 5;
        margin-bottom: 3;
    }

    .phone {
        font-family: DBHeavent;
        font-size: 15;
        color: #626b80;
    }
</style>