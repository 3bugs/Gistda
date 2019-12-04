<!--https://dev.to/hrastnik/lets-create-a-custom-animated-tab-bar-with-react-native-3496-->

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
                        :state="currentRouteIndex === itemIndex"
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
                        :state="currentRouteIndex === itemIndex"
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
            navigation: { // bottom nav
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            currentRouteIndex() {
                return this.navigation.state.index === 0
                    ? -1
                    : this.navigation.state.index;
            }
        },
        data: () => {
            return {
                DEBUG, BOTTOM_NAV,
                tabBarHeight,
                paddingHorizontal: 0,
                tabBarTopPosition: 0,
                //activeItem: 0,
            }
        },
        created: function () {
            const {height, width} = Dimensions.get('window');
            this.tabBarTopPosition = height - this.tabBarHeight;
            this.paddingHorizontal = (width * 2) / 100;

            //alert(this.navigation.state.index);
        },
        methods: {
            handleClickItem: function (itemIndex) {
                //this.activeItem = itemIndex;

                let routeName = null;
                switch (itemIndex) {
                    case 0:
                        /*const stackNavigation = this.navigation.getParam('stackNavigation', null);
                        if (stackNavigation) {
                            stackNavigation.goBack();
                        }*/

                        if (this.navigation.state.params) {
                            const {stackNavigation} = this.navigation.state.params;
                            if (stackNavigation) {
                                //stackNavigation.goBack(null);
                                stackNavigation.navigate('Province');
                            }
                        }
                        return;
                    case 1:
                        routeName = 'News';
                        break;
                    case 2:
                        routeName = 'News2';
                        //routeName = 'CctvNavigator';
                        break;
                    case 3:
                        //routeName = 'ReportNavigator';
                        break;
                }
                if (routeName) {
                    this.navigation.navigate(routeName);
                } else {
                    alert('No route to go!');
                }
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