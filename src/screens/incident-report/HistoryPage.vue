<template>
    <view class="container"
          :style="{_marginBottom: BOTTOM_NAV.height}">
        <flat-list
                class="list"
                v-if="dataList && dataList.length > 0"
                :data="dataList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <list-item
                        :item="args.item"
                        :index="args.index"
                        :image="args.item.image"
                        :title="args.item.detail"
                        :details="args.item.detail"
                        :show-date="false"
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
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, APP_NAME, PROVINCE_NAME_EN, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK} from '../../constants';
    import NoData from '../../components/NoData';
    import ListItem from '../../components/ListItem';

    import {Platform, PermissionsAndroid, Linking, Alert} from 'react-native';

    export default {
        components: {
            ListItem, NoData
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
                return store.state.loadingAlarmDetails[PROVINCE_NAME_EN[this.province]]
                    || store.state.loadingSingleCoordinate;
            },
            dataList() {
                const historyList = store.state.historyList[PROVINCE_NAME_EN[this.province]];

                if (historyList == null) {
                    return null;
                } else {
                    return historyList.filter(item => {
                        return (item.status.id == this.page + 1);
                    });
                }
            },
        },
        data: () => {
            return {
                DEBUG, APP_NAME, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
            };
        },
        methods: {
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
