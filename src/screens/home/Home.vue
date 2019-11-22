<template>
    <image-background :source="bg"
                      :style="{width: '100%', height: '100%'}"
                      :fade-duration="500"
                      resize-mode="stretch">
        <status-bar
                background-color="transparent"
                translucent
        />
        <view class="main-container">
            <view :style="{marginLeft: 25, marginBottom: 25}">
                <text class="province-name-en">{{provinceNameEn}}</text>
                <text class="province-name-th">{{provinceNameTh}}</text>
                <text class="temperature"
                      :on-layout="handleTemperatureLayoutChange">{{temperature}}
                </text>
                <text class="temperature-unit"
                      :style="{marginLeft: temperatureUnitMarginLeft}">°C
                </text>
                <text class="status">{{status}}</text>
            </view>

            <view-pager class="view-pager"
                        :initial-page="0"
                        :page-margin="-100"
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
            </view-pager>
        </view>
    </image-background>
</template>

<script>
    // แก้ปัญหาเรื่อง androidx
    // https://github.com/react-native-community/react-native-geolocation/issues/39

    import store from '../../store';

    import ViewPager from '@react-native-community/viewpager';
    import bgNakhonPathom from '../../../assets/bg_nakhon_pathom.jpg';
    import bgYasothon from '../../../assets/bg_yasothon.jpg';
    import imageNakhonPathom from '../../../assets/bg_card_nakhon_pathom_w500.png';
    import imageYasothon from '../../../assets/bg_card_yasothon_w500.png';

    const provinceList = [
        {
            bg: bgNakhonPathom,
            nameTh: 'นครปฐม',
            nameEn: 'Nakhon Pathom',
            temperature: 32,
            status: 'แดดจัด ห่างออกไป 239 กิโลเมตร',
        }, {
            bg: bgYasothon,
            nameTh: 'ยโสธร',
            nameEn: 'Yasothon',
            temperature: 38,
            status: 'แดดจัด ห่างออกไป 543 กิโลเมตร',
        }
    ];

    export default {
        components: {ViewPager},
        props: {
            navigation: { // stack navigator
                type: Object
            }
        },
        data: () => {
            return {
                bg: provinceList[0].bg,
                provinceNameTh: provinceList[0].nameTh,
                provinceNameEn: provinceList[0].nameEn,
                temperature: provinceList[0].temperature,
                status: provinceList[0].status,

                imageNakhonPathom,
                imageYasothon,
                imageWidth: 0,
                imageHeight: 0,
                viewPagerMargin: 0,
                temperatureUnitMarginLeft: 0,
                status: false,
            };
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
                this.temperatureUnitMarginLeft = width + 3;
            },
            handlePageSelect: function (e) {
                const selectedPageIndex = e.nativeEvent.position;
                this.bg = provinceList[selectedPageIndex].bg;
                this.provinceNameTh = provinceList[selectedPageIndex].nameTh;
                this.provinceNameEn = provinceList[selectedPageIndex].nameEn;
                this.temperature = provinceList[selectedPageIndex].temperature;
                this.status = provinceList[selectedPageIndex].status;
            },
            handleSelectProvince: function (province) {
                //alert(province);

                store.dispatch('FETCH_MAP_DATA', {
                    province
                });

                this.navigation.navigate('BottomTabNavigator');
            }
        }
    }
</script>

<style>
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
        color: white;
        font-size: 18;
        margin-top: 60;
        margin-left: 3;
    }

    .province-name-th {
        position: absolute;
        font-family: DBHeavent-Bold;
        color: white;
        font-size: 55;
        margin-top: 68;
    }

    .temperature {
        position: absolute;
        font-family: DBHeavent-Med;
        color: white;
        font-size: 90;
        margin-top: 96;
    }

    .temperature-unit {
        position: absolute;
        font-family: DBHeavent;
        color: white;
        font-size: 43;
        margin-top: 133;
    }

    .status {
        position: absolute;
        font-family: DBHeaventt-Light;
        color: white;
        font-size: 18;
        margin-top: 175;
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