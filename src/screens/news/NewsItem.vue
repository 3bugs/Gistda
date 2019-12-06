<template>
    <view>
        <touchable-opacity
                class="container"
                :active-opacity="0.5"
                :on-press="null">
            <card-view
                    class="cover-image-container"
                    :card-elevation="10"
                    :card-maxElevation="10"
                    :corner-radius="10"
                    :style="{}">
                <image :source="{uri: item.image}"
                       class="cover-image"
                       resize-mode="cover"/>
            </card-view>
            <view class="content">
                <text class="title"
                      :numberOfLines="1">
                    {{item.title}}
                </text>
                <text class="caption"
                      :numberOfLines="2">
                    {{item.caption}}
                </text>
                <text class="date">
                    {{'20/20/2020'}}
                </text>
            </view>
        </touchable-opacity>
        <view
                :style="{
                marginTop: 5,
                marginBottom: 0,
                marginLeft: 20,
                marginRight: 20,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#999999'}"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';

    import {StyleSheet} from 'react-native';
    import CardView from 'react-native-cardview';

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
            };
        },
        methods: {},
    }
</script>

<style>
    .container {
        flex: 1;
        flex-direction: row;
        padding-top: 15;
        padding-bottom: 15;
        padding-left: 20;
        padding-right: 20;
    }

    .cover-image-container {
        width: 130;
        height: 88;
        margin-top: 5;
        margin-right: 15;
    }

    .cover-image {
        flex: 1;
    }

    .content {
        flex: 1;
        border-width: 0;
        border-color: red;
    }

    .title {
        font-family: DBHeavent-Bold;
        font-size: 20;
        color: #333333;
        margin-bottom: 5;
    }

    .caption {
        font-family: DBHeavent;
        font-size: 18;
        color: #626b80;
        margin-bottom: 5;
    }

    .date {
        font-family: DBHeavent;
        font-size: 18;
        color: #dadada;
    }
</style>