<template>
    <!--https://blog.logrocket.com/how-to-use-refs-to-access-your-application-dom-in-vue-js/-->
    <drawer ref="drawer"
            type="static"
            :openDrawerOffset="80"
            :open="false"
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
                <view v-for="(mapData, index1) in mapDataList">
                    <marker v-for="(marker, index2) in mapData.markerList"
                            v-if="mapData.markerVisibility"
                            :coordinate="marker.coordinate"
                            :title="marker.title"
                            :description="marker.description"
                            :image="mapData.filterIcon"
                            :opacity="mapData.markerOpacity"
                    />
                </view>
            </map-view>

            <view class="header-container">
                <linear-gradient class="header"
                                 :colors="['#09097e', '#4041da']">
                    <touchable-opacity class="menu-icon-touchable"
                                       :on-press="handleClickMenu">
                        <image :source="icMenuNakhonPathom"
                               class="menu-icon"
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
                            :corner-radius="25"
                            :style="{
                flexDirection: 'row',
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 15,
                paddingRight: 15,
                height: 50,
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

            <!--<card-view
                    :card-elevation="3"
                    :card-maxElevation="3"
                    :corner-radius="10"
                    :style="{
                    position: 'absolute',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginLeft: '10%',
                    marginRight: '10%',
                    top: 155,
                    height: 20,
                    width: '80%',
                    backgroundColor: '#fff'
                    }">
                <image :source="imageLightOff"
                       class="image-light"
                       resize-mode="contain"/>
                <slider class="slider"
                        :value="1"
                        :minimumValue="0"
                        :maximumValue="1"
                        thumb-tint-color="#4041da"
                        minimum-track-tint-color="#4041da"
                        :on-value-change="handleSliderValueChange"/>
                <image :source="imageLightOn"
                       class="image-light"
                       resize-mode="contain"/>
            </card-view>-->

            <!--<card-view
                    :card-elevation="3"
                    :card-maxElevation="3"
                    :corner-radius="10"
                    :style="{
                    position: 'absolute',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginLeft: '10%',
                    marginRight: '10%',
                    top: 190,
                    height: 20,
                    width: '80%',
                    backgroundColor: '#fff'
                    }">
                <image :source="imageLightOff"
                       class="image-light"
                       resize-mode="contain"/>
                <slider class="slider"
                        :value="1"
                        :minimumValue="0"
                        :maximumValue="1"
                        thumb-tint-color="#4041da"
                        minimum-track-tint-color="#4041da"
                        :on-value-change="handleSliderValueChange2"/>
                <image :source="imageLightOn"
                       class="image-light"
                       resize-mode="contain"/>
            </card-view>-->

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

    import imageLightOff from '../../../assets/ic_light_off.png';
    import imageLightOn from '../../../assets/ic_light_on.png';
    import imageFilterAccident from '../../../assets/ic_filter/ic_filter_geo_accident.png';
    import imageFilterRisk from '../../../assets/ic_filter/ic_filter_geo_risk_area.png';

    export default {
        components: {MapView, Marker, LinearGradient, CardView, Drawer, FilterPanel, Slider},
        computed: {
            mapDataList() {
                return store.state.mapDataList;
            }
        },
        data: () => {
            return {
                icListNakhonPathom, icMenuNakhonPathom, icAlertNakhonPathom,
                imageLightOff, imageLightOn,
                imageFilterAccident,

                /*mapDataList: [
                    {
                        key: '0',
                        filterTitle: 'ตำแหน่งอุบัติเหตุ',
                        filterIcon: imageFilterGeoAccident,
                        markerOpacity: 1,
                        markerList: [
                            {
                                coordinate: {
                                    latitude: 13.8100,
                                    longitude: 100.04427,
                                },
                                title: 'ทดสอบ 1',
                                description: 'รายละเอียด ทดสอบ 1',
                                image: imageFilterGeoAccident,
                            },
                            {
                                coordinate: {
                                    latitude: 13.8200,
                                    longitude: 100.05627,
                                },
                                title: 'ทดสอบ 2',
                                description: 'รายละเอียด ทดสอบ 2',
                                image: imageFilterGeoAccident,
                            },
                            {
                                coordinate: {
                                    latitude: 13.8300,
                                    longitude: 100.04227,
                                },
                                title: 'ทดสอบ 3',
                                description: 'รายละเอียด ทดสอบ 3',
                                image: imageFilterGeoAccident,
                            },
                        ]
                    },
                    {
                        key: '1',
                        filterTitle: 'พื้นที่เสี่ยงบนท้องถนน',
                        filterIcon: imageFilterRisk,
                        markerOpacity: 1,
                        markerList: [
                            {
                                coordinate: {
                                    latitude: 13.8400,
                                    longitude: 100.01427,
                                },
                                title: 'ทดสอบ 4',
                                description: 'รายละเอียด ทดสอบ 4',
                                image: imageFilterRisk,
                            },
                            {
                                coordinate: {
                                    latitude: 13.8000,
                                    longitude: 100.02627,
                                },
                                title: 'ทดสอบ 5',
                                description: 'รายละเอียด ทดสอบ 5',
                                image: imageFilterRisk,
                            },
                            {
                                coordinate: {
                                    latitude: 13.7900,
                                    longitude: 100.03227,
                                },
                                title: 'ทดสอบ 6',
                                description: 'รายละเอียด ทดสอบ 6',
                                image: imageFilterRisk,
                            },
                        ]
                    },
                ],*/
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
                this.openFilterPanel();
            },
            handleOpenFilterPanel: function () {

            },
            handleCloseFilterPanel: function () {

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
        height: 136;
        width: 100%;
        top: 0;
        left: 0;
        justify-content: flex-start;
        border-width: 0;
        border-color: red;
    }

    .header {
        flex-direction: row;
        height: 111;
        align-items: center;
        padding-left: 20;
        padding-right: 20;
    }

    .province-name {
        flex: 1;
        text-align: center;
        font-family: DBHeavent-Bold;
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

    .alert-icon {
        width: 40;
        height: 40;
    }

    .map-view {
        flex: 1;
        margin-top: 111;
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