<template>
    <view :style="{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end'}">
        <image-background :source="bg"
                          :style="{height: tabBarHeight}"
                          resize-mode="cover">
            <view class="container">
                <touchable-opacity class="item-container-touchable">
                    <view class="item-container">
                        <image :source="icHome"
                               :style="{width: iconSize, height: iconSize}"
                               resize-mode="contain"/>
                        <text class="item-text">HOME</text>
                    </view>
                </touchable-opacity>
                <touchable-opacity class="item-container-touchable">
                    <view class="item-container">
                        <image :source="icNews"
                               :style="{width: iconSize, height: iconSize}"
                               resize-mode="contain"/>
                        <text class="item-text">NEWS</text>
                    </view>
                </touchable-opacity>
                <touchable-opacity class="item-container-touchable">
                    <view class="item-container">
                        <image :source="button"
                               :style="{width: 56, height: 56}"
                               resize-mode="contain"/>
                        <text class="item-text-highlight">แจ้งเหตุ</text>
                    </view>
                </touchable-opacity>
                <touchable-opacity class="item-container-touchable">
                    <view class="item-container">
                        <image :source="icCctv"
                               :style="{width: iconSize, height: iconSize}"
                               resize-mode="contain"/>
                        <text class="item-text">CCTV</text>
                    </view>
                </touchable-opacity>
                <touchable-opacity class="item-container-touchable">
                    <view class="item-container">
                        <image :source="icReport"
                               :style="{width: iconSize, height: iconSize}"
                               resize-mode="contain"/>
                        <text class="item-text">REPORT</text>
                    </view>
                </touchable-opacity>
            </view>
        </image-background>
    </view>
</template>

<script>
    import {Dimensions} from 'react-native';

    import bg from '../../../assets/bottom_nav/bg_tab_bar_nakhon_pathom.png';
    import button from '../../../assets/bottom_nav/button_add_nakhon_pathom.png';
    import icHome from '../../../assets/bottom_nav/ic_home_off.png';
    import icNews from '../../../assets/bottom_nav/ic_news_off.png';
    import icCctv from '../../../assets/bottom_nav/ic_cctv_off.png';
    import icReport from '../../../assets/bottom_nav/ic_report_off.png';

    const iconSize = 20;
    const tabBarHeight = 100;

    export default {
        data: () => {
            return {
                bg, button,
                icHome, icNews, icCctv, icReport,
                iconSize, tabBarHeight,
                tabBarTopPosition: 0,
            }
        },
        created: function () {
            const {height, width} = Dimensions.get('window');
            this.tabBarTopPosition = height - this.tabBarHeight;
        }
    }
</script>

<style>
    .container {
        flex: 1;
        flex-direction: row;
        border-width: 0;
        border-color: red;
    }

    .item-container-touchable {
        flex: 1;
        justify-content: flex-end;
        align-items: center;
        border-width: 0;
        border-color: yellow;
    }

    .item-container {
        justify-content: center;
        align-items: center;
        padding-bottom: 8;
        border-width: 0;
        border-color: red;
    }

    .item-text {
        margin-top: 3;
        font-family: DBHeaventt-Light;
        color: rgba(255, 255, 255, 0.5);
        font-size: 16;
    }

    .item-text-highlight {
        margin-top: 4;
        font-family: DBHeaventt-Light;
        color: white;
        font-size: 18;
    }
</style>