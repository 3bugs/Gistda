<template>
    <view class="container"
          :style="{marginBottom: BOTTOM_NAV.height}">
        <flat-list
                class="list"
                v-if="!isLoading && dataList && dataList.length > 0"
                :data="dataList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <news-item
                        v-if="page === 0 || page === 2"
                        :item="args.item"
                        :index="args.index"
                        :show-date="false"
                        :on-click="handleClickNewsItem"/>
                <er-item
                        v-if="page === 1"
                        :item="args.item"
                        :index="args.index"
                        :on-click="handleClickErItem"/>
            </view>
            <!--<view render-prop="ListEmptyComponent"
                  :style="{width: '100%', height: '100%', borderWidth: 1, borderColor: 'blue'}">
                <view :style="{flex: 1, borderWidth: 1, borderColor: 'red'}">
                    <text>ไม่มีข้อมูล</text>
                </view>
            </view>-->
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
                v-if="isLoading || isLoadingNewsDetails"/>

        <no-data v-if="dataList && dataList.length === 0"/>

        <view>
            <dialog-container :visible="showPhoneCallDialog"
                              :on-backdrop-press="() => {showPhoneCallDialog = false}">
                <view :style="{alignItems: 'center'}">
                    <image class="image-phone-call"
                           :source="imagePhoneCall"
                           resize-mode="cover"/>
                    <text class="dialog-item-name">{{phoneItem ? phoneItem.name : ''}}</text>
                    <text class="dialog-confirm-label">ต้องการโทรใช่หรือไม่</text>
                </view>
                <dialog-button
                        label="ยกเลิก"
                        :on-press="() => {showPhoneCallDialog = false}"
                        :style="{
                            fontFamily: 'DBHeavent-Med',
                            fontSize: 22,
                            color: COLOR_PRIMARY_DARK[province],
                        }"/>
                <dialog-button
                        label="โทร"
                        :on-press="startPhoneCall"
                        :style="{
                            fontFamily: 'DBHeavent-Med',
                            fontSize: 22,
                            color: COLOR_PRIMARY_DARK[province],
                        }"/>
            </dialog-container>
        </view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, APP_NAME, PROVINCE_NAME_EN, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK} from '../../constants';

    import {Platform, PermissionsAndroid, Linking} from 'react-native';
    import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
    import Dialog from "react-native-dialog";

    import NoData from '../../components/NoData';
    import NewsItem from './NewsItem';
    import ErItem from './ErItem';

    import imagePhoneCall from '../../../assets/images/screen_news/ic_phone_call.png';

    export default {
        components: {
            DialogContainer: Dialog.Container,
            DialogTitle: Dialog.Title,
            DialogButton: Dialog.Button,
            DialogDescription: Dialog.Description,
            NewsItem, ErItem, NoData
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
            isLoading() {
                switch (this.page) {
                    case 0: // News
                        return store.state.loadingNews[PROVINCE_NAME_EN[this.province]];
                    case 1: // ER
                        return store.state.loadingEr[PROVINCE_NAME_EN[this.province]];
                    case 2: // Suggest
                        return store.state.loadingSuggest[PROVINCE_NAME_EN[this.province]];
                }
            },
            dataList() {
                switch (this.page) {
                    case 0: // News
                        return store.state.newsList[PROVINCE_NAME_EN[this.province]];
                    case 1: // Er
                        return store.state.erList[PROVINCE_NAME_EN[this.province]];
                    case 2: // Suggest
                        return store.state.suggestList[PROVINCE_NAME_EN[this.province]];
                }
            },
            isLoadingNewsDetails() {
                return store.state.loadingNewsDetails[PROVINCE_NAME_EN[this.province]];
            },
            newsDetailsList() {
                return store.state.newsDetailsList[PROVINCE_NAME_EN[this.province]];
            },
        },
        data: () => {
            return {
                DEBUG, APP_NAME, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
                showPhoneCallDialog: false,
                phoneItem: null,
                imagePhoneCall,
            };
        },
        methods: {
            handleClickNewsItem: function (item) {
                let cachedItem = null;
                this.newsDetailsList.forEach(newsDetails => {
                    if (item.id === newsDetails.id) {
                        cachedItem = newsDetails;
                    }
                });

                if (cachedItem) {
                    this.navigation.navigate(
                        'NewsDetails',
                        {
                            item: cachedItem
                        }
                    );
                } else {
                    store.dispatch('FETCH_NEWS_DETAILS', {
                        newsId: item.id,
                        callback: (success, data) => {
                            if (success) {
                                this.navigation.navigate(
                                    'NewsDetails',
                                    {
                                        item: data
                                    }
                                );
                            } else {
                                alert(data); // data คือ error message
                            }
                        }
                    });
                }
            },
            handleClickErItem: function (item) {
                this.phoneItem = item;
                this.showPhoneCallDialog = true;
            },
            startPhoneCall: function () {
                this.showPhoneCallDialog = false;

                if (Platform.OS === 'android') { // android
                    this.requestPhoneCallPermission((success, message) => {
                        if (success) {
                            //Linking.openURL(`tel:${item.phone}`)
                            RNImmediatePhoneCall.immediatePhoneCall(this.phoneItem.phone);
                        } else {
                            alert(message);
                        }
                    });
                } else { // ios
                    RNImmediatePhoneCall.immediatePhoneCall(this.phoneItem.phone);
                }
            },
            requestPhoneCallPermission: async function (callback) {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                        {
                            title: this.APP_NAME,
                            message:
                                'แอปจำเป็นต้องได้รับการอนุญาต จึงจะสามารถโทรออกได้',
                            buttonNegative: 'ยกเลิก',
                            buttonPositive: 'ตกลง',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        callback(true, null);
                    } else {
                        callback(false, 'แอปไม่ได้รับการอนุญาตจากผู้ใช้ จึงไม่สามารถโทรออกได้');
                    }
                } catch (err) {
                    callback(false, err);
                }
            }
        },
        created: function () {
            let storeAction = null;

            switch (this.page) {
                case 0: // News
                    storeAction = 'FETCH_NEWS';
                    break;
                case 1: // ER
                    storeAction = 'FETCH_ER';
                    break;
                case 2: // Suggest
                    storeAction = 'FETCH_SUGGEST';
                    break;
            }

            if (/*!this.dataList &&*/ storeAction) {
                store.dispatch(storeAction, {
                    province: this.province,
                    callback: (success, data) => {
                        if (!success) {
                            //todo: เปลี่ยนเป็นการแสดง error ใน layout และมีปุ่ม retry
                            //todo: กรณี error พอออกไปแล้วกลับมาใหม่ ก็ไม่ยอม fetch ข้อมูล
                            alert(data); // data คือ error message
                        }
                    }
                });
            }
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

    .image-phone-call {
        width: 55;
        height: 55;
        margin-bottom: 15;
    }

    .dialog-item-name {
        font-family: DBHeavent-Bold;
        font-size: 26;
        color: #252C3B;
        margin-bottom: 5;
    }

    .dialog-confirm-label {
        font-family: DBHeavent;
        font-size: 22;
        color: #aaaaaa;
        margin-bottom: 10;
    }
</style>