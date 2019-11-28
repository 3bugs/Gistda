<template>
    <!--https://blog.logrocket.com/how-to-use-refs-to-access-your-application-dom-in-vue-js/-->
    <drawer ref="drawer"
            type="displace"
            :openDrawerOffset="80"
            :tapToClose="true"
            :open="drawerOpen"
            :acceptTap="true"
            :on-open="handleOpenFilterPanel"
            :on-close="handleCloseFilterPanel">
        <view render-prop="content">
            <FilterPanel/>
        </view>

        <view class="container">
            <map-view class="map-view"
                      :initial-region="{
                      latitude: 13.8196,
                      longitude: 100.04427,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                      }">
                <view v-for="(categoryType, categoryTypeIndex) in mapDataList">
                    <view v-for="(category, categoryIndex) in categoryType.list">
                        <marker v-for="(marker, markerIndex) in category.markerList"
                                v-if="category.markerVisibility"
                                :coordinate="marker.coordinate"
                                :title="marker.title"
                                :description="marker.description"
                                :image="category.image"
                                :opacity="category.markerOpacity"/>
                    </view>
                </view>
            </map-view>

            <view class="header-container">
                <linear-gradient class="header"
                                 :colors="['#09097e', '#4041da']">
                    <touchable-opacity class="menu-icon-touchable"
                                       :on-press="handleClickMenu">
                        <image :source="icMenuNakhonPathom"
                               v-if="!drawerOpen"
                               class="menu-icon"
                               resize-mode="contain"/>
                        <image :source="imageBack"
                               v-if="drawerOpen"
                               class="back-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>

                    <text class="province-name">นครปฐม</text>

                    <touchable-opacity class="alert-icon-touchable">
                        <image :source="icAlertNakhonPathom"
                               class="alert-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>
                </linear-gradient>
                <view class="search-input-container">
                    <!--<image-background :style="{
                    flexDirection: 'row',
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 15,
                    paddingRight: 15,
                    height: 50,
                    backgroundColor: '#fff',
                    shadowColor: '#808080',
                    shadowRadius: 5,
                    shadowOffset: { height: 0, width: 0},
                    shadowOpacity: 0.75,
                    elevation: 1,
                    borderWidth: 1,
                    borderRadius: 25,
                    borderColor: '#e0e0e0'}">-->
                    <card-view
                            :card-elevation="4"
                            :card-maxElevation="4"
                            :corner-radius="27"
                            :style="{
                flexDirection: 'row',
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 15,
                paddingRight: 15,
                height: 54,
                backgroundColor: '#fff'
                }">
                        <text-input class="search-input"
                                    placeholder="Search"
                                    placeholder-text-color="#aaa"/>

                        <view class="divider"/>

                        <touchable-opacity class="list-icon-touchable">
                            <image :source="icListNakhonPathom"
                                   class="list-icon"
                                   resize-mode="contain"/>
                        </touchable-opacity>
                    </card-view>
                    <!--</image-background>-->
                </view>
            </view>
        </view>
    </drawer>
</template>

<script>
    import store from '../../store';

    import MapView, {Marker} from 'react-native-maps';
    import LinearGradient from 'react-native-linear-gradient';
    import CardView from 'react-native-cardview';
    import Drawer from 'react-native-drawer';
    import FilterPanel from './FilterPanel';
    import Slider from '@react-native-community/slider';

    import icListNakhonPathom from '../../../assets/ic_list_nakhon_pathom.png';
    import icMenuNakhonPathom from '../../../assets/ic_menu_nakhon_pathom.png';
    import icAlertNakhonPathom from '../../../assets/ic_alert_nakhon_pathom.png';
    import imageBack from '../../../assets/ic_back.png';

    import imageLightOff from '../../../assets/ic_light_off.png';
    import imageLightOn from '../../../assets/ic_light_on.png';

    export default {
        components: {MapView, Marker, LinearGradient, CardView, Drawer, FilterPanel, Slider},
        computed: {
            mapDataList() {
                return store.state.coordinateCategoryList;
            },
            drawerOpen() {
                return store.state.drawerOpen;
            }
        },
        data: () => {
            return {
                icListNakhonPathom, icMenuNakhonPathom, icAlertNakhonPathom,
                imageBack, imageLightOff, imageLightOn,
            };
        },
        methods: {
            openFilterPanel: function () {
                this.$refs['drawer'].open();
            },
            closeFilterPanel: function () {
                this.$refs['drawer'].close();
            },
            handleClickMenu: function () {
                //this.openFilterPanel();
                store.dispatch('OPEN_DRAWER', {});
            },
            handleOpenFilterPanel: function () {

            },
            handleCloseFilterPanel: function () {
                store.dispatch('CLOSE_DRAWER', {});
            },
            handleSliderValueChange: function (value) {
                this.markerOpacity = value;
            },
            handleSliderValueChange2: function (value) {
                this.markerOpacity2 = value;
            },
            handleChangeOpacity: function (key, value) {
                //alert('KEY: ' + key + '\nVALUE: ' + value);
                this.mapDataList[key].markerOpacity = value;
            }
        },
        created: function () {
            /*store.dispatch('FETCH_MAP_DATA', {
                province: 0
            });*/
        }
    }
</script>

<style>
    .container {
        flex: 1;
        margin-bottom: 64;
        border-width: 0;
        border-color: red;
    }

    .header-container {
        position: absolute;
        height: 144;
        width: 100%;
        top: 0;
        left: 0;
        justify-content: flex-start;
        border-width: 0;
        border-color: red;
    }

    .header {
        flex-direction: row;
        height: 118;
        align-items: center;
        padding-left: 20;
        padding-right: 20;
        border-width: 0;
        border-color: yellow;
    }

    .province-name {
        flex: 1;
        text-align: center;
        font-family: DBHeavent-Bold;
        letter-spacing: 1;
        color: white;
        font-size: 24;
        border-width: 0;
        border-color: yellow;
    }

    .search-input-container {
        position: absolute;
        width: 100%;
        height: 100%;
        justify-content: flex-end;
        padding-left: 20;
        padding-right: 20;
    }

    .search-input {
        flex: 1;
        align-self: center;
        font-family: DBHeaventt-Light;
        padding-top: 0;
        padding-bottom: 0;
        color: black;
        font-size: 22;
        border-width: 0;
        border-color: orangered;
    }

    .divider {
        width: 1;
        background-color: #d0d0d0;
        margin-left: 10;
        margin-right: 10;
    }

    .list-icon-touchable {
        align-self: center;
        padding: 5;
    }

    .menu-icon-touchable {
        align-self: center;
        padding-left: 0;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
    }

    .alert-icon-touchable {
        align-self: center;
        padding: 0;
    }

    .list-icon {
        width: 20;
        height: 20;
    }

    .menu-icon {
        width: 20;
        height: 20;
    }

    .back-icon {
        width: 27;
        height: 18;
    }

    .alert-icon {
        width: 40;
        height: 40;
    }

    .map-view {
        flex: 1;
        margin-top: 116;
        border-width: 0;
        border-color: orangered;
    }

    .slider {
        flex: 1;
        padding-left: 0;
        padding-right: 0;
    }

    .image-light {
        width: 10;
        height: 10;
    }
</style>