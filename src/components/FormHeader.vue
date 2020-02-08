<template>
    <view class="container">
        <header :title="title"
                :left-icon="{
                    icon: imageBack,
                    width: 24,
                    height: 18,
                    callback: onClickBack
                }"
                :right-icon="{
                    icon: null,
                    width: 22,
                    height: 22,
                    callback: null
                }"/>
        <view class="content-container">
            <view :style="{
                    height: DIMENSION.horizontal_margin + 10,
                    backgroundColor: COLOR_PRIMARY[province],
                }">
            </view>

            <view :style="{
                position: 'absolute',
                width: '100%', height: '100%',
            }">
                <view :style="{
                    backgroundColor: 'white',
                    borderTopLeftRadius: DIMENSION.horizontal_margin * 1.5,
                    borderTopRightRadius: DIMENSION.horizontal_margin * 1.5,
                }">
                    <view :style="{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                marginTop: DIMENSION.horizontal_margin,
                                marginBottom: 15,
                                marginLeft: DIMENSION.horizontal_margin,
                                marginRight: DIMENSION.horizontal_margin,
                                borderWidth: 0,
                                borderColor: 'red',
                          }">
                        <view :style="{
                            flex: 1,
                        }">
                            <text class="header-text"
                                  :style="{fontSize: headerFontSize}">{{headerText}}</text>
                            <view
                                    :style="{
                                        flexDirection: 'row'
                                    }">
                                <image
                                        v-if="categoryImage !== ''"
                                        :source="{uri: categoryImage}"
                                        :style="{
                                            width: 35,
                                            height: 38,
                                        }"
                                        resize-mode="contain"/>
                                <text
                                        :style="{
                                            flex: 1,
                                            fontFamily: 'DBHeaventt-Light',
                                            fontSize: 22,
                                            color: '#626B80',
                                            marginTop: 2,
                                            borderWidth: 0,
                                            borderColor: 'blue',
                                        }">
                                    {{subHeaderText}}
                                </text>
                            </view>
                        </view>
                        <touchable-opacity
                                v-if="!noCloseButton"
                                :on-press="onClickClose"
                                :style="{
                                    marginTop: 0,
                                }">
                            <image :source="closeButtonImage"
                                   :style="{
                                        width: 48,
                                        height: 48,
                                        padding: 0,
                                    }"/>
                        </touchable-opacity>
                    </view>
                    <view :style="{
                        marginTop: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#cccccc'
                    }"/>
                </view>
                <scroll-view
                        v-if="!overrideScrollView"
                        keyboard-should-persist-taps="handled"
                        :style="{
                            flex: 1,
                            backgroundColor: 'white',
                            paddingLeft: DIMENSION.horizontal_margin,
                            paddingRight: DIMENSION.horizontal_margin,
                        }">

                    <slot/>

                </scroll-view>

                <view
                        v-if="overrideScrollView"
                        :style="{
                            flex: 1,
                        }">
                    <slot/>
                </view>

                <view
                        v-if="buttonText != null"
                        :style="{
                            marginTop: 15,
                            marginBottom: 25,
                            paddingLeft: DIMENSION.horizontal_margin,
                            paddingRight: DIMENSION.horizontal_margin,
                        }">
                    <my-button
                            :text="buttonText"
                            :bg-color="FORM.buttonColor[province]"
                            :on-click="onClickButton"/>
                </view>
            </view>
        </view>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isSubmitting"/>
    </view>
</template>

<script>
    import store from '../store';
    import {DEBUG, DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, FORM} from '../constants';
    import Header from '../components/Header';
    import MyButton from '../components/MyButton';

    import {Dimensions, StyleSheet} from 'react-native';

    import imageBack from '../../assets/images/ic_back.png';
    import imageClose from '../../assets/images/ic_close2.png';

    export default {
        components: {Header, MyButton},
        props: {
            navigation: {
                type: Object
            },
            title: {
                type: String
            },
            headerText: {
                type: String
            },
            headerFontSize: {
                type: Number,
                default: 32
            },
            subHeaderText: {
                type: String
            },
            categoryImage: {
                type: String,
                default: ''
            },
            buttonText: {
                type: String
            },
            noCloseButton: {
                type: Boolean
            },
            closeButtonImage: {
                type: Number,
                default: imageClose
            },
            overrideScrollView: {
                type: Boolean
            },
            onClickBack: {
                type: Function
            },
            onClickClose: {
                type: Function
            },
            onClickButton: {
                type: Function
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            isSubmitting() {
                return store.state.submittingFormData;
            },
        },
        data: () => {
            return {
                DEBUG, DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, FORM,
                Dimensions, StyleSheet,
                imageBack, imageClose,
            };
        },
        methods: {

        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .content-container {
        flex: 1;
        border-width: 0;
        border-color: red;
    }

    .header-text {
        font-family: DBHeavent-Med;
        color: #212529;
        margin-bottom: 0;
        border-width: 0;
        border-color: red;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>