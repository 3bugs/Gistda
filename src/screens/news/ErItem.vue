<template>
    <view class="container">
        <card-view
                class="card"
                :card-elevation="7"
                :card-maxElevation="7"
                :corner-radius="12"
                :style="{}">
            <touchable-opacity
                    class="content-touchable"
                    :active-opacity="0.5"
                    :on-press="null">
                <view class="content">
                    <text class="title">{{item.name}}</text>
                    <text class="detail">{{item.detail}}</text>
                </view>
                <view class="icon-container">
                    <image :source="imagePhone"
                           class="icon"
                           resize-mode="cover"/>
                    <text class="phone">{{item.phone}}</text>
                </view>
            </touchable-opacity>


        </card-view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';

    import {StyleSheet} from 'react-native';
    import CardView from 'react-native-cardview';

    import imagePhone from '../../../assets/images/screen_news/ic_phone.png';

    export default {
        components: {CardView},
        props: {
            item: {
                type: Object
            },
            index: {
                type: Number
            },
        },
        data: () => {
            return {
                StyleSheet,
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