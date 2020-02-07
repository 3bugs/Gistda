<template>
    <view>
        <bottom-sheet
                ref="bottomSheet"
                :snap-points="[screenHeight - statusBarHeight, '45%', '0%']"
                :initial-snap="2"
                :enabled-inner-scrolling="true"
                :enabled-content-tap-interaction="false"
                :enabled-content-gesture-interaction="false"
                :on-open-start="onOpen"
                :on-close-end="onClose">
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
                            v-if="imageList.length > 0"
                            :horizontal="true"
                            :style="{
                                padding: 0,
                                marginBottom: 15,
                                borderWidth: 0,
                                borderColor: 'red',
                            }">
                        <touchable-opacity
                                v-for="(item, index) in imageList"
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

                    <!--<flat-list
                            :data="activeMarker ? activeMarker.properties.IMAGES : []"
                            :key-extractor="(item, index) => index.toString()">
                        <view render-prop-fn="renderItem">
                            <card-view
                                    :style="{
                                        width: 200,
                                        height: 112,
                                        marginTop: 5,
                                        marginRight: 15,
                                    }"
                                    :card-elevation="10"
                                    :card-maxElevation="10"
                                    :corner-radius="10"
                                    :style="{}">
                                <image :source="{uri: args.item}"
                                       :style="{
                                            flex: 1,
                                       }"
                                       resize-mode="cover"/>
                            </card-view>
                        </view>
                    </flat-list>-->

                    <view v-if="description.length > 0"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">
                            {{'รายละเอียด'}}
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">
                            {{description}}
                        </text>
                    </view>

                    <view v-if="location.length > 0"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">
                            {{'ตำแหน่ง'}}
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">
                            {{location}}
                        </text>
                    </view>

                    <touchable-opacity
                            :on-press="onClickNavigate"
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
                          v-if="true"
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
                            fontSize: titleFontSize,
                            marginBottom: 5,
                        }">
                            {{title}}
                        </text>
                        <view v-if="showCategory"
                              :style="{
                                    flexDirection: 'row',
                              }">
                            <image :source="{uri: categoryImageUrl}"
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
                                {{categoryName}}
                            </text>
                        </view>
                    </view>
                    <view>
                        <touchable-opacity
                                :on-press="onClickCloseButton"
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
                                :on-press="onClickNavigate"
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
    import {DEBUG, DIMENSION, BOTTOM_NAV,} from '../../constants';

    import {Dimensions, StyleSheet} from 'react-native';
    import {getStatusBarHeight} from 'react-native-status-bar-height';
    import BottomSheet from 'reanimated-bottom-sheet';
    import CardView from 'react-native-cardview';

    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    export default {
        components: {BottomSheet, CardView,},
        props: {
            onOpen: {
                type: Function
            },
            onClose: {
                type: Function
            },
            onClickNavigate: {
                type: Function
            },
            onClickCloseButton: {
                type: Function
            },
            titleFontSize: {
                type: Number,
                default: 26,
            },
            title: {
                type: String,
                default: '',
            },
            showCategory: {
                type: Boolean,
                default: false,
            },
            categoryImageUrl: {
                type: String,
                default: null,
            },
            categoryName: {
                type: String,
                default: '',
            },
            imageList: {
                type: Array,
                default: [],
            },
            description: {
                type: String,
                default: '',
            },
            location: {
                type: String,
                default: '',
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG, DIMENSION, BOTTOM_NAV,
                Dimensions, StyleSheet,
                screenHeight: Dimensions.get('window').height,
                statusBarHeight: getStatusBarHeight(),
                imageClose, imageNavigate,
            };
        },
        methods: {
            snapTo: function (snapPoint) {
                this.$refs['bottomSheet'].snapTo(snapPoint);
            },
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>