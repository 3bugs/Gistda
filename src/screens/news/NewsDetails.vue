<template>
    <view class="container">
        <header title="ประชาสัมพันธ์"
                :left-icon="{
                    icon: imageBack,
                    width: 24,
                    height: 18,
                    callback: handleClickBack
                }"
                :right-icon="{
                    icon_old: imageShare,
                    icon: null,
                    width: 14,
                    height: 16.5,
                    callback: handleClickShare
                }"/>
        <view class="content-container">
            <view :style="{
                    height: DIMENSION.horizontal_margin + 10,
                    backgroundColor: COLOR_PRIMARY[province],
                    borderBottomLeftRadius: DIMENSION.horizontal_margin,
                    borderBottomRightRadius: DIMENSION.horizontal_margin,
                }">
            </view>

            <!--todo: Compose UI-->
            <scroll-view
                    class="content"
                    :style="{
                        position: 'absolute',
                        width: '100%', height: '100%',
                        backgroundColor: 'transparent',
                        paddingLeft: DIMENSION.horizontal_margin,
                        paddingRight: DIMENSION.horizontal_margin
                    }">
                <image class="cover-image"
                       :source="{uri: item.image}"
                       :style="{
                            width: '100%',
                            aspectRatio: 1.78,
                       }"/>
                <text class="date">{{item.date}}</text>
                <text class="title">{{item.title}}</text>

                <!--ที่อยู่-->
                <view v-if="item && item.address && item.address.trim() !== ''"
                      :style="{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            marginBottom: 15,
                            borderWidth: 0,
                            borderColor: 'red',
                      }">
                    <image :source="imagePin"
                           :style="{
                                width: 15,
                                height: 16,
                                marginTop: 5,
                                marginRight: 5,
                            }"/>
                    <text :style="{
                        flex: 1,
                        fontFamily: 'DBHeaventt-Light',
                        fontSize: 20,
                        color: '#626B80',
                        paddingRight: 20,
                    }">
                        {{item.address}}
                    </text>
                </view>

                <!--<text>{{item.caption}}</text>-->
                <text class="body"
                      v-for="paragraph in detailParagraphList">
                    {{paragraph}}
                </text>
                <view :style="{marginBottom: 20}"/>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, DIMENSION, COLOR_PRIMARY} from '../../constants';
    import Header from '../../components/Header';

    import {Dimensions} from 'react-native';
    import CardView from 'react-native-cardview';

    import imageBack from '../../../assets/images/ic_back.png';
    import imageShare from '../../../assets/images/ic_share.png';
    import imagePin from '../../../assets/images/screen_news/ic_pin.png';

    export default {
        components: {Header, CardView},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            item() {
                return this.navigation.getParam('item');
            },
            detailParagraphList() {
                //return this.item.detail.replace(/<br><br>/gi, '\n');
                return this.item.detail.trim().split('<br><br>\r\n');
            }
        },
        data: () => {
            return {
                DEBUG, DIMENSION, COLOR_PRIMARY,
                Dimensions,
                imageBack, imageShare, imagePin,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickShare: function () {
                //todo:
            },
        },
        created: function () {
            //alert(this.item.id);
            //todo: Get details by ID (this.item.id) from API
        }
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

    .content {

    }

    .cover-image {
        margin-bottom: 8;
    }

    .date {
        font-family: DBHeavent;
        font-size: 20;
        color: #aaaaaa;
        margin-bottom: 5;
    }

    .title {
        font-family: DBHeavent-Bold;
        font-size: 24;
        color: #333333;
        margin-bottom: 12;
    }

    .body {
        font-family: DBHeavent;
        font-size: 22;
        color: #333333;
        margin-bottom: 10;
    }
</style>