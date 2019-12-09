<template>
    <view>
        <ripple
                class="container"
                :ripple-color="COLOR_PRIMARY[province]"
                :ripple-opacity="0.2"
                :ripple-duration="500"
                :_active-opacity="0.5"
                :on-press="() => {onClick(item)}">
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
        </ripple>
        <view
                :style="{
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 20,
                marginRight: 20,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#999999'}"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, COLOR_PRIMARY} from '../../constants';

    import {StyleSheet} from 'react-native';
    import CardView from 'react-native-cardview';
    import Ripple from 'react-native-material-ripple';

    export default {
        components: {CardView, Ripple},
        props: {
            item: {
                type: Object
            },
            index: {
                type: Number
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
                StyleSheet, COLOR_PRIMARY
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
        padding-bottom: 20;
        padding-left: 20;
        padding-right: 20;
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