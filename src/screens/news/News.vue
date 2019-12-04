<template>
    <view class="container">
        <linear-gradient class="header"
                         :colors="[
                                 MAP_HEADER.background[province].startColor,
                                 MAP_HEADER.background[province].endColor
                                 ]"
                         :style="{paddingTop: STATUS_BAR_HEIGHT}">
            <touchable-opacity class="menu-icon-touchable"
                               :on-press="handleClickMap">
                <image :source="imageMap"
                       resize-mode="contain"
                       :style="{width: 22, height: 22}"/>
            </touchable-opacity>

            <text class="title">ข่าว</text>

            <view :style="{width: 22, height: 22}"/>

            <!--<touchable-opacity class="alert-icon-touchable">
                <image :source="MAP_HEADER.alertIcon[province]"
                       class="alert-icon"
                       resize-mode="contain"/>
            </touchable-opacity>-->
        </linear-gradient>

        <tab-view :navigation-state="state"
                  :render-scene="SceneMap({
                  pr: NewsPr,
                  safety: NewsSafety,
                  guide: NewsGuide,
                  })"
                  :_initial-layout="{width: Dimensions.get('window').width}"
                  :on-index-change="handlePageChange"
                  :on-swipe-start="() => {swipeStart = true}"
                  :swipeEnabled="true">
            <!--<view render-prop-fn="renderTabBar">
                <tab-bar
                        :indicator-style="{backgroundColor: 'white'}"
                        :style="{backgroundColor: 'pink'}"/>
            </view>-->
        </tab-view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, MAP_HEADER} from '../../constants';

    import {Dimensions} from 'react-native';
    //import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
    import {TabView, TabBar, SceneMap} from '../../modules/my-react-native-tab-view/src';
    import LinearGradient from 'react-native-linear-gradient';
    import { getStatusBarHeight } from 'react-native-status-bar-height';
    import NewsPr from './News-Pr';
    import NewsSafety from './News-Safety';
    import NewsGuide from './News-Guide';

    import imageMap from '../../../assets/images/screen_map/ic_map.png';

    const routes = [
        {key: 'pr', title: 'ประชาสัมพันธ์'},
        {key: 'safety', title: 'ความปลอดภัย'},
        {key: 'guide', title: 'คำแนะนำ'},
    ];

    export default {
        components: {TabView, TabBar, LinearGradient},
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
                DEBUG, MAP_HEADER,
                Dimensions,
                STATUS_BAR_HEIGHT: getStatusBarHeight(),
                state: {
                    index: 0,
                    routes,
                },
                SceneMap,
                NewsPr, NewsSafety, NewsGuide,
                imageMap,
                swipeStart: false,
            };
        },
        methods: {
            handlePageChange: function (index) {
                // ถ้ากำหนด index แบบนี้ ต้องกดแท็บ 2 ทีถึงจะเปลี่ยนหน้า แต่ swipeStart ไม่มีปัญหา
                //this.state.index = index;

                // ถ้ากำหนด index แบบนี้ เวลา swipeStart จะเด้งไปมาไม่หยุด แต่กดแท็บเปลี่ยนหน้าได้
                /*this.state = {
                    index,
                    routes,
                };*/

                if (this.swipeStart) {
                    this.state.index = index;
                    this.swipeStart = false;
                } else {
                    this.state = {
                        index,
                        routes,
                    };
                }
            },
            handleClickMap: function () {
                this.navigation.goBack();
            }
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .header {
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

    .menu-icon-touchable {
        align-self: center;
        padding-left: 0;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
    }
</style>