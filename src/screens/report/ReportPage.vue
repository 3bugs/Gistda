<template>
    <view class="container"
          :style="{

          }">
        <view :style="{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: DIMENSION.horizontal_margin,
            paddingRight: DIMENSION.horizontal_margin,
            paddingTop: DIMENSION.horizontal_margin * 1.5,
            paddingBottom: DIMENSION.horizontal_margin * 1.5,
        }">
            <view :style="{
                flex: 1,
            }">
                <text class="title">
                    {{graphType === 0 ? `สรุปผลตามเหตุ` : `สรุปผลตามช่วงเวลา`}}
                </text>
                <text class="body">
                    {{`รวมทั้งหมด ${totalAlarms} เหตุ`}}
                </text>
            </view>
            <my-button
                    :style="{
                        width: 150,
                    }"
                    text="ดาวน์โหลด"
                    :font-size="20"
                    :icon="imageDownload"
                    :icon-size="20"
                    :bg-color="FORM.buttonColor[province]"
                    :padding="12"
                    :corner-radius="24"
                    :on-click="onClickDownload"/>
        </view>
        <view :style="{
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#999999'
        }"/>
        <scroll-view>
            <view :style="{
                paddingLeft: DIMENSION.horizontal_margin,
                paddingRight: DIMENSION.horizontal_margin,
                borderWidth: 0,
                borderColor: 'green',
            }">
                <pie-chart
                        v-if="graphType === 0"
                        :data="reportData"
                        :width="Dimensions.get('window').width"
                        :height="PIE_SIZE"
                        :chart-config="pieChartConfig"
                        accessor="value"
                        background-color="transparent"
                        :padding-left="70"
                        :padding-right="0"
                        :has-legend="false"
                        absolute
                        :style="{
                            borderWidth: 0,
                            borderColor: 'red',
                        }"/>
                <BarChart
                        v-if="graphType === 1"
                        :data="reportData"
                        :width="Dimensions.get('window').width"
                        :height="BAR_SIZE"
                        y-axis-label=""
                        :chart-config="barChartConfig"
                        :verticalLabel-rotation="reportData.datasets[0].data.length > 4 ? 90 : 0"
                        :from-zero="true"
                        :show-bar-tops="true"
                        _y-axis-suffix=" เหตุ"
                        absolute
                        :style="{
                            marginTop: 25,
                        }"/>
                <!--<pie-chart
                        :data="testData2"
                        :style="{
                            height: 250,
                        }"/>-->
                <!--label กราฟวงกลม-->
                <view
                        v-for="(data, index) in reportData"
                        v-if="(graphType === 0) && (data.value > 0)"
                        :style="{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20,
                        }">
                    <view :style="{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }">
                        <view :style="{
                            width: 20,
                            height: 20,
                            marginRight: 10,
                            backgroundColor: data.color,
                        }"/>
                        <text class="body">
                            {{data.name}}
                        </text>
                    </view>
                    <text class="body">
                        {{`${data.value} เหตุ`}}
                    </text>
                </view>

                <!--label กราฟแท่ง-->
                <view
                        v-for="(label, index) in reportData.labels"
                        v-if="graphType === 1"
                        :style="{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20,
                        }">
                    <view :style="{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }">
                        <text class="body">
                            {{label}}
                        </text>
                    </view>
                    <text class="body">
                        {{`${reportData.datasets[0].data[index]} เหตุ`}}
                    </text>
                </view>
            </view>

            <view :style="{height: BOTTOM_NAV.height + 30}"/>
        </scroll-view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, FORM, DIMENSION, PROVINCE_NAME_EN, BOTTOM_NAV} from '../../constants';
    import MyButton from '../../components/MyButton';
    import {requestAndroidPermissions} from '../../constants/utils';

    import {Dimensions, StyleSheet, Alert, PermissionsAndroid, Platform} from 'react-native';
    //import {PieChart} from 'react-native-svg-charts'
    import {PieChart, BarChart} from "react-native-chart-kit";
    import RNFetchBlob from 'rn-fetch-blob';
    import Share from 'react-native-share';

    import imageDownload from '../../../assets/images/screen_report/ic_download.png';

    const PIE_SIZE = 280;
    const BAR_SIZE = 280;
    const testData = [
        {
            name: "Seoul",
            value: 21500000,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Toronto",
            value: 2800000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
    ];
    const testData2 = [
        {
            key: "Seoul",
            value: 10,
            svg: {
                fill: '#00ff00',
                onPress: () => console.log('test1'),
            }
        },
        {
            key: "Toronto",
            value: 20,
            svg: {
                fill: '#ff0000',
                onPress: () => console.log('test2'),
            }
        },
    ];

    export default {
        components: {MyButton, PieChart, BarChart},
        props: {
            graphType: {
                type: Number
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            totalAlarms() {
                const reportData = store.state.reportData[PROVINCE_NAME_EN[this.province]];
                return reportData ? reportData.totalAlarms : 'N/A';
            },
            reportData() {
                const colors = [
                    '#FFABAB', //แดง
                    '#AFCBFF', //ฟ้า
                    '#6EB5FF', //ฟ้าเข้ม
                    '#FBE4FF', //ชมพูอ่อน
                    '#FFF5BA', //เหลือง
                    '#E7FFAC', //เขียวเหลือง
                    '#F6A6FF', //ม่วง
                    '#AFF8DB', //เขียว
                ];

                const reportData = store.state.reportData[PROVINCE_NAME_EN[this.province]];
                if (reportData) {
                    switch (this.graphType) {
                        case 0: //กราฟวงกลม
                            const totalAlarmsByCategories = reportData.totalAlarmsByCategories;
                            totalAlarmsByCategories.map((item, index) => {
                                item.color = colors[index % colors.length];
                                item.legendFontColor = '#999999';
                                item.legendFontSize = 15;
                            });
                            return totalAlarmsByCategories;

                        case 1: //กราฟแท่ง
                            const data = {
                                labels: [],
                                datasets: [
                                    {
                                        data: [],
                                    }
                                ],
                            };
                            const totalAlarmsByMonths = reportData.totalAlarmsBymonth;
                            totalAlarmsByMonths.forEach((item, index) => {
                                const month = item.month.trim().length < 2
                                    ? `0${item.month.trim()}`
                                    : item.month.trim();
                                data.labels.push(`${month}/${item.year}`);
                                data.datasets[0].data.push(item.value);
                            });
                            return data;
                    }
                } else {
                    return this.graphType === 0 ? [] : {labels: [], datasets: [{data: []}]};
                }
            },
        },
        data: () => {
            return {
                DEBUG, FORM, DIMENSION, PROVINCE_NAME_EN, BOTTOM_NAV,
                Dimensions, StyleSheet,
                PIE_SIZE, BAR_SIZE, testData, testData2,
                imageDownload,
                pieChartConfig: {
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 0
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                },
                barChartConfig: {
                    backgroundColor: "white",
                    backgroundGradientFrom: "white",
                    backgroundGradientTo: "white",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
                    style: {
                        borderRadius: 0
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                },
            };
        },
        methods: {
            onClickDownload: function () {
                store.dispatch('GET_REPORT_DOWNLOAD_LINK', {
                    callback: (success, message) => {
                        if (success) {
                            //Alert.alert("สำเร็จ", store.state.reportDownloadUrl[PROVINCE_NAME_EN[this.province]]);
                            if (Platform.OS === 'android') { // android
                                requestAndroidPermissions({
                                    permission: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                    title: this.APP_NAME,
                                    requestMessage: 'แอปจำเป็นต้องบันทึกไฟล์รายงานลงในพื้นที่จัดเก็บ',
                                    denyMessage: 'แอปไม่ได้รับอนุญาตจากผู้ใช้ จึงไม่สามารถดาวน์โหลดและบันทึกไฟล์รายงานได้',
                                    callback: (success, message) => {
                                        if (success) {
                                            const url = store.state.reportDownloadUrl[PROVINCE_NAME_EN[this.province]];
                                            this.doDownload(url);
                                        } else {
                                            Alert.alert('ผิดพลาด', message);
                                        }
                                    }
                                });
                            } else { // ios
                                const url = store.state.reportDownloadUrl[PROVINCE_NAME_EN[this.province]];
                                this.doDownload(url);
                            }
                        } else {
                            Alert.alert("ผิดพลาด", message);
                        }
                    }
                });
            },
            doDownload: function (url) {
                const date = new Date();
                let extension = this.getExtension(url);
                extension = "." + extension[0];
                const {config, fs} = RNFetchBlob;
                const dir = fs.dirs.DownloadDir;
                const path = dir + "/report_" + Math.floor(date.getTime() + date.getSeconds() / 2) + extension;
                let options = {
                    fileCache: true,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: path,
                        description: 'รายงานสรุปการแจ้งเหตุ'
                    }
                };
                config(options).fetch('GET', url)
                    .then(res => {
                        Alert.alert('สำเร็จ', 'ดาวน์โหลดสำเร็จ');

                        if (Platform.OS === 'ios') {
                            const shareOptions = {
                                title: 'รายงานสรุปการแจ้งเหตุ',
                                subject: 'รายงานสรุปการแจ้งเหตุ',
                                message: 'รายงานสรุปการแจ้งเหตุ',
                                url: 'file://' + path,
                            };
                            Share.open(shareOptions)
                                .then((res) => { console.log(res) })
                                .catch((err) => { err && console.log(err); });
                        }
                    })
                    .catch(error => {
                        Alert.alert('ผิดพลาด', error);
                    });
            },
            getExtension: function(filename) {
                return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
            },
        },
        created: function () {
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .title {
        font-family: DBHeavent-Bold;
        font-size: 24;
        color: #333333;
    }

    .body {
        font-family: DBHeavent;
        font-size: 22;
        color: #626B80;
    }
</style>