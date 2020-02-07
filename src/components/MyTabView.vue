<template>
    <view class="container">
        <tab-view :navigation-state="state"
                  :render-scene="doRenderScene"
                  :_initial-layout="{width: Dimensions.get('window').width}"
                  :on-index-change="handlePageChange"
                  :on-swipe-start="() => {swipeStart = true}"
                  :swipe-enabled="swipeEnabled"
                  :lazy="false"/>
    </view>
</template>

<script>
    import store from '../store';
    import {DEBUG} from '../constants';

    import {Dimensions} from 'react-native';
    //import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
    import {TabView, TabBar, SceneMap} from '../modules/my-react-native-tab-view/src';

    export default {
        components: {TabView},
        props: {
            routes: {
                type: Array
            },
            renderScene: {
                type: Function
            },
            swipeEnabled: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG,
                Dimensions,
                state: {
                    index: 0,
                    routes: [],
                },
                SceneMap,
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
                        routes: this.routes,
                    };
                }
            },
            doRenderScene: function ({route}) {
                if (!route.key) return null;
                return this.renderScene({route});
            },
        },
        created: function () {
            this.state = {
                index: 0,
                routes: this.routes,
            };
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>