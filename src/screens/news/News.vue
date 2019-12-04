<template>
    <view class="container">
        <header title="ข่าว"
                :left-icon="{icon: imageMap, width: 22, height: 22, callback: handleClickMap}"
                :right-icon="{icon: null, width: 22, height: 22, callback: null}"/>

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
    import Header from '../../components/Header';

    import {Dimensions} from 'react-native';
    //import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
    import {TabView, TabBar, SceneMap} from '../../modules/my-react-native-tab-view/src';
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
        components: {Header, TabView, TabBar},
        props: {
            navigation: { // stack navigator
                type: Object
            }
        },
        data: () => {
            return {
                Dimensions,
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
</style>