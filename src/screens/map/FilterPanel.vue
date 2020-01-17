<template>
    <view class="container">
        <linear-gradient
                class="gradient-background"
                old_colors="['#09097e', '#4041da']"
                :colors="[
                SIDEBAR.background[province].startColor,
                SIDEBAR.background[province].endColor
                ]">
            <flat-list
                    class="list"
                    :data="coordinateCategoryList"
                    :keyExtractor="(item, index) => index.toString()"
                    :contentContainerStyle="{margin: 0}">
                <view render-prop-fn="renderItem">
                    <filter-type
                            :item="args.item"
                            :typeIndex="args.index"/>
                </view>
                <view render-prop="ListHeaderComponent">
                    <filter-panel-header
                            :navigation="navigation"/>
                </view>

                <view render-prop="ListFooterComponent">
                    <view :style="{marginBottom: 20}"/>

                    <view :style="{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingLeft: 20,
                        paddingRight: 20,
                    }">
                        <!--<touchable-opacity :on-press="handleClickAbout">-->
                            <!--<text :style="{
                                fontFamily: 'DBHeavent',
                                fontSize: 20,
                                color: 'rgba(255, 255, 255, 0.4)',
                            }">v{{APP_VERSION}}</text>-->
                        <!--</touchable-opacity>-->
                        <!--<touchable-opacity :on-press="handleClickLogout">
                            <text :style="{
                                fontFamily: 'DBHeavent',
                                fontSize: 20,
                                color: 'rgba(255, 255, 255, 0.4)',
                            }">ออกจากระบบ</text>
                        </touchable-opacity>-->
                    </view>

                    <view :style="{marginBottom: 100}"/>
                </view>
            </flat-list>
        </linear-gradient>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, SIDEBAR, PROVINCE_NAME_EN, APP_VERSION} from '../../constants';

    import {Alert} from 'react-native';
    import LinearGradient from 'react-native-linear-gradient';
    import FilterPanelHeader from './FilterPanelHeader';
    import FilterType from './FilterType';

    export default {
        components: {LinearGradient, FilterPanelHeader, FilterType},
        props: {
            navigation: {
                type: Object
            },
            onChangeOpacity: {
                type: Function
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            coordinateCategoryList() {
                return store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]];
            },
            isLoggedIn() {
                return store.state.userToken !== null
            },
        },
        data: () => {
            return {
                SIDEBAR, APP_VERSION,
            };
        },
        methods: {
            handleClickAbout: function () {

            },
            handleClickLogout: function () {
                if (this.isLoggedIn) {
                    Alert.alert(
                        'ออกจากระบบ',
                        'ยืนยันออกจากระบบ?',
                        [
                            {
                                text: 'ออกจากระบบ',
                                onPress: () => {
                                    store.dispatch('LOGOUT', {
                                        callback: () => {
                                            Alert.alert(
                                                'สำเร็จ',
                                                'ออกจากระบบสำเร็จ',
                                            );
                                        }
                                    });
                                }
                            },
                            {
                                text: 'ยกเลิก',
                                onPress: () => {
                                },
                                style: 'cancel'
                            },
                        ],
                        {cancelable: true}
                    );
                } else {
                    Alert.alert(
                        'ออกจากระบบ',
                        'คุณยังไม่ได้เข้าสู่ระบบ'
                    );
                }
            },
        },
    }
</script>

<style>
    .container {
        width: 100%;
        height: 100%;
        background-color: #4041da;
        border-width: 0;
        border-color: red;
    }

    .gradient-background {
        flex: 1;
    }

    .list {
        flex: 1;
        padding-left: 0;
        padding-right: 0;
        margin-top: 0;
    }
</style>