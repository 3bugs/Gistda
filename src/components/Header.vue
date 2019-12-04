<template>
    <linear-gradient class="container"
                     :colors="[
                                 MAP_HEADER.background[province].startColor,
                                 MAP_HEADER.background[province].endColor
                                 ]"
                     :style="{paddingTop: STATUS_BAR_HEIGHT}">
        <touchable-opacity class="left-icon-touchable"
                           :on-press="leftIcon.callback">
            <image :source="leftIcon.icon"
                   resize-mode="contain"
                   :style="{width: leftIcon.width, height: leftIcon.height}"/>
        </touchable-opacity>

        <text class="title">{{title}}</text>

        <!--<view :style="{width: 22, height: 22}"/>-->

        <touchable-opacity class="right-icon-touchable"
                           :on-press="rightIcon.callback">
            <image :source="rightIcon.icon"
                   resize-mode="contain"
                   :style="{width: leftIcon.width, height: leftIcon.height}"/>
        </touchable-opacity>
    </linear-gradient>
</template>

<script>
    import store from '../store';
    import {DEBUG, MAP_HEADER} from '../constants';

    import {getStatusBarHeight} from 'react-native-status-bar-height';
    import LinearGradient from 'react-native-linear-gradient';

    export default {
        components: {LinearGradient},
        props: {
            title: {
                type: String
            },
            leftIcon: {
                type: Object
            },
            rightIcon: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG, MAP_HEADER,
                STATUS_BAR_HEIGHT: getStatusBarHeight(),
            };
        },
        methods: {},
    }
</script>

<style>
    .container {
        height: 93;
        flex-direction: row;
        align-items: center;
        padding-left: 20;
        padding-right: 20;
        border-width: 0;
        border-color: yellow;
    }

    .title {
        flex: 1;
        text-align: center;
        font-family: DBHeavent-Bold;
        letter-spacing: 0;
        color: white;
        font-size: 24;
        border-width: 0;
        border-color: yellow;
    }

    .left-icon-touchable {
        align-self: center;
        padding-left: 0;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
    }

    .right-icon-touchable {
        align-self: center;
        padding-left: 8;
        padding-right: 0;
        padding-top: 8;
        padding-bottom: 8;
    }
</style>