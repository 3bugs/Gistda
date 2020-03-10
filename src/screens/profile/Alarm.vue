<template>
    <view class="container">
        <form-header
                title="แจ้งเตือน"
                :show-header="false"
                :override-scroll-view="true"
                :on-click-back="handleClickBack">

            <flat-list
                    class="list"
                    v-if="dataList && dataList.length > 0"
                    :data="dataList"
                    :keyExtractor="(item, index) => index.toString()"
                    :contentContainerStyle="{margin: 0}"
                    :style="{
                        marginTop: DIMENSION.horizontal_margin * 1.5,
                    }">
                <view render-prop-fn="renderItem">
                    <list-item
                            :item="args.item"
                            :index="args.index"
                            :image="args.item.image"
                            :title="args.item.detail"
                            :details="args.item.detail"
                            :show-date="false"
                            :padding-top="args.index === 0 ? 5 : 15"
                            :on-click="() => handleClickItem(args.item)"/>
                </view>
                <!--<view render-prop="ListEmptyComponent"
                      :style="{width: '100%', height: '100%', borderWidth: 1, borderColor: 'blue'}">
                    <view :style="{flex: 1, borderWidth: 1, borderColor: 'red'}">
                        <text>ไม่มีข้อมูล</text>
                    </view>
                </view>-->
                <view render-prop="ListFooterComponent"
                      v-if="true">
                    <view :style="{height: 50}"/>
                </view>
            </flat-list>

            <no-data v-if="dataList && dataList.length === 0"/>

            <activity-indicator
                    class="progress"
                    size="large"
                    :color="COLOR_PRIMARY[province]"
                    v-if="isLoading"/>

        </form-header>

        <!--<header title="แจ้งเตือน"
                :left-icon="{
                    icon: imageBack,
                    width: 24,
                    height: 18,
                    callback: handleClickBack
                }"
                :right-icon="{
                    icon: null,
                    width: 22,
                    height: 22,
                    callback: null
                }"/>-->
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, PROVINCE_NAME_EN, COLOR_PRIMARY, DIMENSION} from '../../constants';
    import {addSeenAlarm} from '../../store/db';
    import FormHeader from '../../components/FormHeader';
    import NoData from '../../components/NoData';
    import ListItem from '../../components/ListItem';

    import {Dimensions, StyleSheet, Alert} from 'react-native';

    import imageBack from '../../../assets/images/ic_back.png';

    export default {
        components: {FormHeader, NoData, ListItem},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            isLoading() {
                return store.state.loadingAlarm[PROVINCE_NAME_EN[this.province]]
                    || store.state.loadingAlarmDetails[PROVINCE_NAME_EN[this.province]]
                    || store.state.loadingSingleCoordinate;
            },
            dataList() {
                return store.state.alarmList[PROVINCE_NAME_EN[this.province]];
            },
        },
        data: () => {
            return {
                DEBUG, COLOR_PRIMARY, DIMENSION,
                Dimensions, StyleSheet,
                imageBack,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickItem: function (item) {
                console.log('Alarm ID: ', item.id);

                /*array(
                    1 => "รอตรวจสอบ",
                    2 => "ตรวจสอบแล้ว / เผยแพร่",
                    3 => "เหตุการณ์สิ้นสุดแล้ว",
                    0 => "ยกเลิก"
                )*/
                const statusId = parseInt(item.status.id);
                switch (statusId) {
                    case 0:
                        Alert.alert('แจังเตือน', 'การแจ้งเหตุนี้ถูกยกเลิก');
                        return;
                    case 1:
                        Alert.alert('แจังเตือน', 'การแจ้งเหตุนี้อยู่ระหว่างการตรวจสอบ');
                        return;
                    case 3:
                        Alert.alert('แจังเตือน', 'เหตุการณ์นี้สิ้นสุดแล้ว');
                        return;
                }

                store.dispatch('FETCH_ALARM_DETAILS', {
                    alarmId: item.id,
                    callback: (success, alarmDetails) => {
                        if (success) {
                            console.log('Coord ID: ', alarmDetails.coords.id);

                            store.dispatch('FETCH_SINGLE_COORDINATE', {
                                coordId: alarmDetails.coords.id,
                                callback: (success, marker) => {
                                    if (success) {
                                        item.seen = true;
                                        addSeenAlarm(item.id);

                                        if (marker == null) {
                                            Alert.alert('แจังเตือน', 'เหตุการณ์นี้ได้สิ้นสุดแล้ว');
                                        } else {
                                            this.navigation.navigate('MarkerDetails', {marker});
                                        }
                                    } else {
                                        Alert.alert('ผิดพลาด', marker); // marker คือ error message
                                    }
                                }
                            });
                        } else {
                            Alert.alert('ผิดพลาด', alarmDetails); // alarmDetails คือ error message
                        }
                    }
                });
            },
        },
        created: function () {
            store.dispatch('FETCH_ALARM', {
                province: this.province,
                callback: (success, data) => {
                    if (!success) {
                        //todo: เปลี่ยนเป็นการแสดง error ใน layout และมีปุ่ม retry
                        //todo: กรณี error พอออกไปแล้วกลับมาใหม่ ก็ไม่ยอม fetch ข้อมูล
                        Alert.alert('ผิดพลาด', data); // data คือ error message
                        this.navigation.goBack();
                    }
                }
            });
        }
    }
</script>

<style>
    .container {
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
