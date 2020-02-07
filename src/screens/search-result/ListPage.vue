<template>
    <view class="container"
          :style="{marginBottom: BOTTOM_NAV.height}">
        <flat-list
                class="list"
                v-if="searchResultList.length > 0"
                :data="searchResultList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <list-item
                        :item="args.item"
                        :index="args.index"
                        :image="args.item.properties.IMAGES.length > 0 ? args.item.properties.IMAGES[0] : ''"
                        :title="args.item.properties.NAME_T"
                        :details="args.item.properties.DESCRIPTION_T"
                        :show-date="false"
                        :on-click="handleClickItem"/>
            </view>
            <view render-prop="ListHeaderComponent"
                  v-if="page === 1">
                <view :style="{height: 15}"/>
            </view>
            <view render-prop="ListFooterComponent"
                  v-if="true">
                <view :style="{height: 50}"/>
            </view>
        </flat-list>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="false"/>

        <no-data v-if="false"/>

        <!--<view>
            <dialog-container :visible="showDialog"
                              :on-backdrop-press="() => {showDialog = false}">
                <view :style="{alignItems: 'center'}">
                    &lt;!&ndash;dialog content here&ndash;&gt;
                </view>
                <dialog-button
                        label="ยกเลิก"
                        :on-press="() => {showDialog = false}"
                        :style="{
                            fontFamily: 'DBHeavent-Med',
                            fontSize: 22,
                            color: COLOR_PRIMARY_DARK[province],
                        }"/>
                <dialog-button
                        label="โทร"
                        :on-press="null"
                        :style="{
                            fontFamily: 'DBHeavent-Med',
                            fontSize: 22,
                            color: COLOR_PRIMARY_DARK[province],
                        }"/>
            </dialog-container>
        </view>-->

        <bottom-sheet
                ref="markerDetails2"
                :snap-points="[screenHeight - 200, '50%', '0%']"
                :initial-snap="Platform.OS === 'android' ? 2 : 2"
                :enabled-inner-scrolling="true"
                :enabled-content-tap-interaction="false"
                :enabled-content-gesture-interaction="false"
                :on-open-start="() => {}"
                :on-close-end="() => {}">
            <view render-prop-fn="renderContent"
                  :style="{
                        height: '100%',
                  }">
                <scroll-view :style="{
                    flexDirection: 'column',
                    flex: 1,
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: DIMENSION.horizontal_margin,
                    paddingBottom: DIMENSION.horizontal_margin,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderWidth: 0,
                    borderColor: 'red',
                }">
                    <scroll-view
                            v-if="false"
                            :horizontal="true"
                            :style="{
                                padding: 0,
                                marginBottom: 15,
                                borderWidth: 0,
                                borderColor: 'red',
                            }">
                        <touchable-opacity
                                v-for="(item, index) in []"
                                :on-press="null"
                                :active-opacity="0.6">
                            <card-view
                                    :style="{
                                        width: 150,
                                        height: 100,
                                        marginRight: 10,
                                    }"
                                    :card-elevation="5"
                                    :card-maxElevation="5"
                                    :corner-radius="10">
                                <image :source="{uri: item}"
                                       :style="{
                                            width: 150,
                                            height: 100,
                                       }"
                                       resize-mode="cover"/>
                            </card-view>
                        </touchable-opacity>
                    </scroll-view>

                    <view v-if="true"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">รายละเอียด
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">{{'TEST'}}
                        </text>
                    </view>

                    <view v-if="false"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">ตำแหน่ง
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">{{''}}
                        </text>
                    </view>

                    <touchable-opacity
                            :on-press="() => {}"
                            :active-opacity="0.4">
                        <view :style="{
                            backgroundColor: '#F0F6FF',
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 28,
                        }">
                            <text :style="{
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 22,
                                color: '#435582',
                            }">
                                {{'นำทาง'}}
                            </text>
                        </view>
                    </touchable-opacity>

                    <text v-for="item in new Array(20)"
                          v-if="false"
                          :style="{
                                marginBottom: 10,
                          }">{{'Hello: ' + item}}
                    </text>

                    <view :style="{
                        height: BOTTOM_NAV.height,
                        marginBottom: 30,
                    }"/>
                </scroll-view>
            </view>
            <view render-prop-fn="renderHeader">
                <view :style="{
                    flexDirection: 'row',
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: 10,
                    paddingBottom: DIMENSION.horizontal_margin - 10,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }">
                    <view :style="{
                        flex: 1,
                        marginRight: 5,
                    }">
                        <touchable-opacity>
                            <view :style="{
                                alignSelf: 'center',
                                backgroundColor: '#e0e0e0',
                                width: 50,
                                height: 4,
                                marginLeft: 53,
                                marginBottom: 8,
                                borderRadius: 2,
                            }"/>
                        </touchable-opacity>

                        <text :style="{
                            fontFamily: 'DBHeavent-Bold',
                            color: '#333333',
                            fontSize: 26,
                            marginBottom: 5,
                        }">
                            {{activeMarker ? activeMarker.properties.NAME_T : ''}}
                        </text>
                        <view :style="{
                                    flexDirection: 'row',
                              }">
                            <image :source="{uri: (activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].image : null)}"
                                   :style="{
                                        width: 35,
                                        height: 38,
                                   }"
                                   resize-mode="contain"/>
                            <text :style="{
                                flex: 1,
                                fontFamily: 'DBHeavent',
                                color: '#aaaaaa',
                                fontSize: 22,
                                marginTop: 2,
                            }">
                                {{activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''}}
                            </text>
                        </view>
                    </view>
                    <view>
                        <touchable-opacity
                                :on-press="() => {}"
                                :style="{
                                marginTop: 0,
                            }">
                            <image :source="imageClose"
                                   :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                        </touchable-opacity>
                        <touchable-opacity
                                :on-press="() => {}"
                                :style="{
                                marginTop: 0,
                            }">
                            <image :source="imageNavigate"
                                   :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                        </touchable-opacity>
                    </view>
                </view>

                <!--<touchable-opacity
                        :on-press="handleClickNavigate"
                        :active-opacity="0.4">
                    <view :style="{
                            backgroundColor: '#F0F6FF',
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 28,
                        }">
                        <text :style="{
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 22,
                                color: '#435582',
                            }">นำทาง</text>
                    </view>
                </touchable-opacity>-->

                <view :style="{
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
                }"/>
            </view>
        </bottom-sheet>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, APP_NAME, PROVINCE_NAME_EN, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK, DIMENSION, } from '../../constants';
    import NoData from '../../components/NoData';
    import ListItem from '../../components/ListItem';

    import {Platform, StyleSheet, Dimensions, PermissionsAndroid, Linking} from 'react-native';
    import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
    import Dialog from "react-native-dialog";
    import BottomSheet from 'reanimated-bottom-sheet';
    import CardView from 'react-native-cardview';

    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    export default {
        components: {
            DialogContainer: Dialog.Container,
            DialogTitle: Dialog.Title,
            DialogButton: Dialog.Button,
            DialogDescription: Dialog.Description,
            ListItem, NoData, BottomSheet, CardView,
        },
        props: {
            navigation: {
                type: Object
            },
            page: {
                type: Number
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            searchResultList() {
                return store.state.searchResultList[PROVINCE_NAME_EN[this.province]];
            },
        },
        data: () => {
            return {
                store,
                DEBUG, APP_NAME, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK, DIMENSION,
                Platform, StyleSheet,
                showDialog: false,
                phoneItem: null,
                screenHeight: Dimensions.get('window').height,
                imageClose, imageNavigate,

                activeMarker: null,
            };
        },
        methods: {
            handleClickItem: function (item) {
                this.$refs['markerDetails2'].snapTo(1);
                this.activeMarker = item;
            },
        },
        created: function () {
        }
    }
</script>

<style>
    .container {
        flex: 1;
        background-color: #f4f6fa;
    }

    .list {
        flex: 1;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>