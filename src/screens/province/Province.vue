<template>
    <image-background :source="bg"
                      :style="{width: '100%', height: '100%'}"
                      :fade-duration="500"
                      resize-mode="stretch">
        <status-bar
                background-color="transparent"
                translucent/>
        <view class="main-container">
            <view :style="{marginLeft: 25, marginBottom: isTallScreen ? 70 : 35}">
                <text class="province-name-en">{{provinceNameEn}}</text>
                <text class="province-name-th"
                      :style="{fontSize: isTallScreen ? 65 : 55, marginTop: isTallScreen ? 68 : 68}">
                    {{provinceNameTh}}
                </text>
                <text class="temperature"
                      v-if="temperature !== null"
                      :on-layout="handleTemperatureLayoutChange"
                      :style="{fontSize: isTallScreen ? 120 : 90}">
                    {{temperature}}
                </text>
                <text class="temperature-unit"
                      v-if="temperature !== null"
                      :style="{marginLeft: temperatureUnitMarginLeft, fontSize: isTallScreen ? 50 : 43, marginTop: isTallScreen ? 150 : 133}">
                    °C
                </text>
                <text class="status"
                      :style="{marginTop: isTallScreen ? 203 : 175}">
                    {{status}}
                </text>
            </view>
            <!--https://stackoverflow.com/questions/43212931/react-native-horizontal-scroll-view-pagination-preview-next-page-card-->
            <!--<view-pager class="view-pager"
                        :initial-page="0"
                        :page-margin="-130"
                        :on-page-scroll="e => handlePageScroll(e)"
                        :on-page-scroll-state-changed="e => handlePageScrollStateChanged(e)"
                        :on-move-should-set-responder-capture="e => handleMoveShouldSetResponderCapture(e)"
                        :on-page-selected="handlePageSelect">
                <view key="1">
                    <touchable-opacity
                            :activeOpacity="0.85"
                            :on-press="() => handleSelectProvince(0)"
                            :style="{flex: 1}">
                        <image :source="imageNakhonPathom"
                               class="image-nakhon-pathom"
                               resize-mode="contain"
                               :on-layout="handleLayoutChange"/>
                    </touchable-opacity>
                </view>
                <view key="2">
                    <touchable-opacity
                            :activeOpacity="0.85"
                            :on-press="() => handleSelectProvince(1)"
                            :style="{flex: 1}">
                        <image :source="imageYasothon"
                               class="image-yasothon"
                               resize-mode="contain"/>
                    </touchable-opacity>
                </view>
            </view-pager>-->

            <view
                    :style="{
                        flex: 1,
                        marginTop: 170,
                    }">
                <carousel
                        ref="carousel"
                        :data="provinceList"
                        :slider-width="screenWidth"
                        :item-width="screenWidth - 100"
                        :inactive-slide-scale="1"
                        :on-snap-to-item="handlePageSelect">
                    <view render-prop-fn="renderItem">
                        <!--<view :style="{width: '100%', height: '100%', borderWidth: 2, borderColor: 'white'}">-->
                            <touchable-opacity
                                    :activeOpacity="0.85"
                                    :on-press="() => handleSelectProvince(args.index)"
                                    :style="{
                                        width: '100%',
                                        height: '100%',
                                        borderWidth: 0,
                                        borderColor: 'white'
                                    }">
                                <image :source="args.item.imageCarousel"
                                       :style="{flex: 1, width: '100%'}"
                                       resize-mode="contain"/>
                            </touchable-opacity>
                        <!--</view>-->
                    </view>
                </carousel>
            </view>
        </view>

        <Progress :showIf="loadingCoordinateCategories || loadingCoordinates"
                  :message="loadingMessage"
                  color="#fff"/>
    </image-background>
</template>

<script>
    // แก้ปัญหาเรื่อง androidx
    // https://github.com/react-native-community/react-native-geolocation/issues/39

    import store from '../../store';
    import Progress from '../../components/Progress';
    import {PROVINCE_NAME_EN} from "../../constants";

    import {Dimensions, Alert} from 'react-native';
    import ViewPager from '@react-native-community/viewpager';
    import Carousel from 'react-native-snap-carousel';

    import bgNakhonPathom from '../../../assets/images/screen_province/bg_nakhon_pathom.jpg';
    import bgYasothon from '../../../assets/images/screen_province/bg_yasothon.jpg';
    import imageNakhonPathom from '../../../assets/images/screen_province/bg_card_nakhon_pathom_w480.png';
    import imageYasothon from '../../../assets/images/screen_province/bg_card_yasothon_w480.png';

    const provinceList = [
        {
            bg: bgNakhonPathom,
            imageCarousel: imageNakhonPathom,
            nameTh: 'นครปฐม',
            nameEn: 'Nakhon Pathom',
            temperature: 32,
            status: 'แดดจัด ห่างออกไป 239 กิโลเมตร',
        }, {
            bg: bgYasothon,
            imageCarousel: imageYasothon,
            nameTh: 'ยโสธร',
            nameEn: 'Yasothon',
            temperature: 38,
            status: 'แดดจัด ห่างออกไป 543 กิโลเมตร',
        }
    ];

    export default {
        components: {ViewPager, Progress, Carousel},
        props: {
            navigation: { // stack navigator
                type: Object
            }
        },
        data: () => {
            return {
                provinceList,
                currentProvince: 0,

                bg: provinceList[0].bg,
                provinceNameTh: provinceList[0].nameTh,
                provinceNameEn: provinceList[0].nameEn,
                //status: provinceList[0].status,

                imageNakhonPathom, imageYasothon,
                imageWidth: 0,
                imageHeight: 0,
                viewPagerMargin: 0,
                temperatureUnitMarginLeft: 0,

                test: false,
                isPageScrolling: false,

                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                isTallScreen: Dimensions.get('window').height / Dimensions.get('window').width > 1.8,
            };
        },
        computed: {
            province() {
                return store.state.province;
            },
            temperature() {
                return store.state.temperature[PROVINCE_NAME_EN[this.currentProvince]];
            },
            status() {
                return store.state.weatherDescription[PROVINCE_NAME_EN[this.currentProvince]];
            },
            loadingCoordinateCategories() {
                return store.state.loadingCoordinateCategories;
            },
            loadingCoordinates() {
                return store.state.loadingCoordinates;
            },
            loadingMessage() {
                return store.state.loadingMessage;
            }
        },
        methods: {
            handleLayoutChange: function (e) {
                if (this.status) {
                    return;
                }

                const {x, y, width, height} = e.nativeEvent.layout;
                this.imageWidth = width;
                this.imageHeight = height;
                //alert(`x: ${x}\ny: ${y}\nwidth: ${width}\nheight: ${height}`);

                let scaleMargin = null;
                if ((height / width) > (773 / 500)) {
                    // ความกว้างรูปจะเต็ม image
                    // ช่องว่างด้านซ้ายรูป 19px, ช่องว่างด้านขวารูป: 46px
                    scaleMargin = (width * 46 / 500);
                    this.viewPagerMargin = -1 * scaleMargin;
                } else {
                    // ความสูงรูปจะเต็ม image

                }
                this.status = true;
            },
            handleTemperatureLayoutChange: function (e) {
                const {x, y, width, height} = e.nativeEvent.layout;
                this.temperatureUnitMarginLeft = this.isTallScreen ? width - 7 : width - 3;
            },
            handlePageScroll: function (e) {
                this.isPageScrolling = true;
            },
            handlePageScrollStateChanged: function (e) {
                if ('idle' === e.nativeEvent.pageScrollState) {
                    this.isPageScrolling = false;
                } else {
                    this.isPageScrolling = true;
                }
            },
            handleMoveShouldSetResponderCapture: function (e) {
                return this.isPageScrolling;
            },
            handlePageSelect: function (e) {
                //const selectedPageIndex = e.nativeEvent.position;
                this.currentProvince = e; //selectedPageIndex;

                this.bg = provinceList[e].bg;
                this.provinceNameTh = provinceList[e].nameTh;
                this.provinceNameEn = provinceList[e].nameEn;
                //this.temperature = store.state.temperature[PROVINCE_NAME_EN[selectedPageIndex]];
                //this.status = provinceList[selectedPageIndex].status;
            },
            handleSelectProvince: function (province) {
                if (this.loadingCoordinateCategories || this.loadingCoordinates) {
                    return;
                }

                if (province !== this.currentProvince) {
                    setTimeout(() => {
                        this.$refs['carousel'].snapToItem(province);
                    }, 250);
                } else {
                    // Set province + load coordinate categories data / coordinates data
                    store.dispatch('SET_PROVINCE', {
                        province,
                        callback: (success, message) => {
                            if (success) {
                                this.navigation.navigate(
                                    'BottomTabNavigator',
                                    {
                                        // todo: refactor, คิดว่าไม่จำเป็นต้องส่ง stack navigation ไป
                                        stackNavigation: this.navigation,
                                    }
                                );
                            } else {
                                Alert.alert('ผิดพลาด', message);
                            }
                        }
                    });
                }
            },
        },
        created: function () {
            store.dispatch('GET_WEATHER', {
                province: 0,
                callback: (success, message) => {
                    if (success) {
                    }
                }
            });

            store.dispatch('GET_WEATHER', {
                province: 1,
                callback: (success, message) => {
                    if (success) {
                    }
                }
            });
        }
    }
</script>

<style>
    .progress-container {
        position: absolute;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: cyan;
    }

    .progress {
        border-width: 0;
        border-color: yellow;
    }

    .progress-text {
        text-align: center;
        font-family: DBHeaventt-Light;
        color: white;
        font-size: 22;
        margin-top: 10;
    }

    .main-container {
        flex: 1;
    }

    .view-pager {
        flex: 1;
        margin-top: 180;
    }

    .province-name-en {
        position: absolute;
        font-family: DBHeaventt-Light;
        letter-spacing: 1;
        color: white;
        font-size: 18;
        margin-top: 60;
        margin-left: 3;
    }

    .province-name-th {
        position: absolute;
        font-family: DBHeavent-Bold;
        letter-spacing: 2;
        color: white;
    }

    .temperature {
        position: absolute;
        font-family: DBHeavent;
        color: white;
        margin-top: 96;
    }

    .temperature-unit {
        position: absolute;
        font-family: DBHeavent;
        color: white;
    }

    .status {
        position: absolute;
        font-family: DBHeaventt-Light;
        color: white;
        font-size: 18;
        margin-left: 3;
    }

    .image-nakhon-pathom {
        flex: 1;
        width: 100%;
        border-width: 0;
        border-color: red;
    }

    .image-yasothon {
        flex: 1;
        width: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>
