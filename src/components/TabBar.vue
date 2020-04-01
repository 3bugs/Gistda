<!--https://dev.to/hrastnik/lets-create-a-custom-animated-tab-bar-with-react-native-3496-->

<template>
    <!--<view :style="{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end'}">-->
    <image-background
            v-if="visible"
            :source="BOTTOM_NAV.background[province]"
            :style="{
                position: 'absolute',
                height: tabBarHeight,
                width: '100%',
                bottom: 0,
            }"
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

            <Menu :renderer="Popover"
                  :rendererProps="{preferredPlacement: 'top'}">
                <MenuTrigger :custom-styles="{TriggerTouchableComponent: TouchableOpacity}">
                    <!--<touchable-opacity class="item-container-touchable"
                                       :on-press="addIncidentReport">-->
                    <view class="item-container">
                        <image :source="BOTTOM_NAV.addIcon[province]"
                               :style="{width: 56, height: 56}"
                               resize-mode="contain"/>
                        <text class="item-text-highlight">แจ้ง</text>
                    </view>
                    <!--</touchable-opacity>-->
                </MenuTrigger>
                <MenuOptions :style="{padding: 10}">
                    <MenuOption
                            class="menu-option"
                            :on-select="() => addIncidentReport(0)"
                            :custom-styles="{OptionTouchableComponent: TouchableOpacity}">
                        <Text class="menu-option-text">แจ้งเหตุ</Text>
                    </MenuOption>
                    <MenuOption
                            class="menu-option"
                            :on-select="() => addIncidentReport(1)"
                            :custom-styles="{OptionTouchableComponent: TouchableOpacity}">
                        <Text class="menu-option-text">แจ้งร้านอาหารปลอดภัย</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>

            <tab-bar-item
                    v-for="itemIndex in [2, 3]"
                    :itemIndex="itemIndex"
                    :state="currentRouteIndex === itemIndex"
                    :callback="handleClickItem"/>
        </view>
    </image-background>

    <!--<bottom-sheet
            ref="bottomSheet"
            :snap-points="['90%', '47%', '5%']"
            :initialSnap="2">
        <view render-prop-fn="renderContent">
            <view :style="{
                height: '100%',
                paddingLeft: DIMENSION.horizontal_margin,
                paddingRight: DIMENSION.horizontal_margin,
                paddingTop: DIMENSION.horizontal_margin - 5,
                paddingBottom: DIMENSION.horizontal_margin - 5,
                backgroundColor: 'rgba(255, 255, 255, 240)',
            }">
                <text>TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST CONTENT TEST
                    CONTENT TEST CONTENT TEST CONTENT
                </text>
            </view>
        </view>
        <view render-prop-fn="renderHeader">
            <view :style="{
                flexDirection: 'row',
                paddingLeft: DIMENSION.horizontal_margin,
                paddingRight: DIMENSION.horizontal_margin,
                paddingTop: DIMENSION.horizontal_margin - 5,
                paddingBottom: DIMENSION.horizontal_margin - 5,
                backgroundColor: 'rgba(255, 255, 255, 240)',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
            }">
                <view :style="{
                    flex: 1,
                }">
                    <text :style="{
                        fontFamily: 'DBHeavent-Bold',
                        color: '#333333',
                        fontSize: 22,
                    }">
                        ฟาร์มที่ผ่านการตรวจคุณภาพ
                    </text>
                </view>
                <text>CLOSE</text>
            </view>
            <view :style="{
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#999999'
            }"/>
        </view>
    </bottom-sheet>-->
    <!--</view>-->
</template>

<script>
    import store from '../store';
    import {DEBUG, BOTTOM_NAV, DIMENSION, PROVINCE_NAME_EN} from '../constants';
    import {setUser, getUser} from '../store/db';

    import {Dimensions, StyleSheet, TouchableOpacity, Alert} from 'react-native';
    import TabBarItem from './TabBarItem';
    import BottomSheet from 'reanimated-bottom-sheet';
    import {Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';

    const tabBarHeight = 100;
    const {Popover} = renderers;

    export default {
        components: {
            TabBarItem, BottomSheet,
            Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger
        },
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
            },
            isLoggedIn() {
                return store.state.userToken !== null
            },
            visible() {
                return !store.state.isSplashShowing[PROVINCE_NAME_EN[this.province]]; // && !store.state.drawerOpen;
            },
        },
        data: () => {
            return {
                StyleSheet, TouchableOpacity,
                DEBUG, BOTTOM_NAV, DIMENSION,
                tabBarHeight,
                paddingHorizontal: 0,
                tabBarTopPosition: 0,
                //activeItem: 0,
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                Popover,
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

                store.dispatch('CLOSE_DRAWER', {});

                let routeName = null;
                switch (itemIndex) {
                    case 0:
                        const stackNavigation = this.navigation.getParam('stackNavigation', null);
                        if (stackNavigation) {
                            //stackNavigation.goBack(null);
                            stackNavigation.navigate('Province');
                        }

                        /*if (this.navigation.state.params) {
                            const {stackNavigation} = this.navigation.state.params;
                            if (stackNavigation) {
                                //stackNavigation.goBack(null);
                                stackNavigation.navigate('Province');
                            }
                        }*/
                        return;
                    case 1:
                        routeName = 'News';
                        break;
                    case 2:
                        //routeName = 'Report';
                        //routeName = 'CctvNavigator';
                        Alert.alert('แจ้งเตือน', 'ยังไม่มีข้อมูล CCTV');
                        return;
                        break;
                    case 3:
                        routeName = 'Report';
                        break;
                }
                if (routeName) {
                    this.navigation.navigate(routeName);
                } else {
                    alert('No route to go!');
                }
            },
            addIncidentReport: function (formType) {
                /*this.navigation.navigate('IncidentForm');
                return;*/

                //const user = await getUser();

                store.dispatch('CLOSE_DRAWER', {});

                if (this.isLoggedIn /*user === null*/) {
                    this.navigation.navigate('IncidentForm', {
                        formType // 0 = แจ้งเหตุ, 1 = ร้านอาหารปลอดภัย
                    });
                } else {
                    this.navigation.navigate('Login', {
                        forward: 'IncidentForm',
                        params: {formType}
                    });
                }
            }
        }
    }
</script>

<style>
    .container {
        flex: 1;
        flex-direction: row;
        align-items: flex-end;
    }

    .item-container-touchable {
        flex: 1;
        justify-content: flex-end;
        align-items: center;
    }

    .item-container {
        justify-content: center;
        align-items: center;
        padding-bottom: 8;
        padding-left: 8;
        padding-right: 8;
    }

    .item-text-highlight {
        margin-top: 2;
        font-family: DBHeaventt-Light;
        color: white;
        font-size: 20;
    }

    .menu-option {
    }

    .menu-option-text {
        font-family: DBHeavent;
        font-size: 22;
    }
</style>
