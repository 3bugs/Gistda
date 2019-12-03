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
                       class="menu-icon"
                       resize-mode="contain"/>
            </touchable-opacity>

            <text class="title">ข่าว</text>

            <view class="menu-icon"/>
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
                  :style="{backgroundColor: 'white'}">
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
        props: {},
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
            };
        },
        methods: {
            handlePageChange: function (index) {
                // ถ้ากำหนดแค่ state.index จะไม่ work (กด tab จะไม่เปลี่ยนหน้า)
                this.state = {
                    index,
                    routes,
                };
            },
            handleClickMap: function () {
                //todo:
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

    .menu-icon {
        width: 22;
        height: 22;
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
</style>