<template>
    <view :style="{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end'}">
        <image-background :source="BOTTOM_NAV.background[province]"
                          :style="{height: tabBarHeight}"
                          resize-mode="cover">
            <view class="container"
                  :style="{
                  paddingLeft: paddingHorizontal,
                  paddingRight: paddingHorizontal,
                  }">
                <tab-bar-item
                        v-for="itemIndex in [0, 1]"
                        :itemIndex="itemIndex"
                        :state="activeItem === itemIndex"
                        :callback="handleClickItem"/>
                <touchable-opacity class="item-container-touchable"
                                   :on-press="null">
                    <view class="item-container">
                        <image :source="BOTTOM_NAV.addIcon[province]"
                               :style="{width: 56, height: 56}"
                               resize-mode="contain"/>
                        <text class="item-text-highlight">แจ้งเหตุ</text>
                    </view>
                </touchable-opacity>
                <tab-bar-item
                        v-for="itemIndex in [2, 3]"
                        :itemIndex="itemIndex"
                        :state="activeItem === itemIndex"
                        :callback="handleClickItem"/>
            </view>
        </image-background>
    </view>
</template>

<script>
    import store from '../store';
    import {DEBUG, BOTTOM_NAV} from '../constants';

    import {Dimensions} from 'react-native';
    import TabBarItem from './TabBarItem';

    const tabBarHeight = 100;

    export default {
        components: {TabBarItem},
        props: {
            navigation: { // stack navigator
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG, BOTTOM_NAV,
                tabBarHeight,
                paddingHorizontal: 0,
                tabBarTopPosition: 0,
                activeItem: 0,
            }
        },
        created: function () {
            const {height, width} = Dimensions.get('window');
            this.tabBarTopPosition = height - this.tabBarHeight;
            this.paddingHorizontal = (width * 2) / 100;
        },
        methods: {
            handleClickItem: function (itemIndex) {
                this.activeItem = itemIndex;
                /*this.resetItemsIcon();

                let routeName = null;
                switch (itemIndex) {
                    case ITEM_HOME:
                        routeName = 'Settings';
                        this.homeIcon = icHomeOn;
                        break;
                    case ITEM_NEWS:
                        routeName = 'Settings';
                        this.newsIcon = icNewsOn;
                        break;
                    case ITEM_CCTV:
                        routeName = 'Settings';
                        this.cctvIcon = icCctvOn;
                        break;
                    case ITEM_REPORT:
                        routeName = 'Settings';
                        this.reportIcon = icReportOn;
                        break;
                }
                if (routeName) {
                    this.navigation.navigate(routeName);
                } else {
                    alert('No route to go!');
                }*/
            },
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

    .item-text-highlight {
        margin-top: 4;
        font-family: DBHeaventt-Light;
        color: white;
        font-size: 18;
    }
</style>