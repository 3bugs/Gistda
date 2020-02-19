<template>
    <image-background :source="bg"
                      :style="{width: '100%', height: '100%'}"
                      resize-mode="cover">
        <status-bar
                :hidden="true"
        />
        <view class="main-container">
            <view class="logo-container" :style="{paddingBottom: bottomPadding}">
                <image class="logo"
                       :source="logo"
                       resize-mode="contain"/>
                <text class="title">{{title}}</text>
            </view>
            <text class="powered-by">{{poweredBy}}</text>
        </view>
    </image-background>
</template>

<script>
    import store from '../../store';
    import {baseURL} from '../../store/fetch'
    import {SPEED_MONITOR_THRESHOLD, SPEED_ALERT_MIN_INTERVAL, MONITOR_INTERVAL} from '../../constants/index';

    import {Dimensions, Alert} from 'react-native';
    import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
    import {getDistance} from 'geolib';
    import Toast from 'react-native-simple-toast';

    import bg from '../../../assets/images/screen_splash/bg_splash.jpg';
    import logo from '../../../assets/images/screen_splash/ic_logo.png';
    import {PROVINCE_NAME_EN} from "../../constants";

    const delayInMilliseconds = 0;
    const title = 'ระบบภูมิสารสนเทศ\nด้านความปลอดภัยจังหวัด';
    const poweredBy = 'POWERED BY GISTDA';
    const {height, width} = Dimensions.get('window');

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        data: () => {
            return {
                bg,
                logo,
                title,
                poweredBy,
                bottomPadding: height / 6,
            };
        },
        methods: {
            startHomeDelay: function () {
                const self = this;
                setTimeout(function () {
                    self.navigation.navigate('StackNavigator');
                }, delayInMilliseconds);
            },
            loadData: function () {
            },
            getHeatMap: async function () {
                await store.dispatch('FETCH_COORDINATES', {
                    province: 0,
                    idList: [11],
                    callback: (success, message) => {
                        const heatMapPointList = store.state.heatMapPointList[PROVINCE_NAME_EN[0]];
                        //console.log('HEATMAP POINT LIST: ', JSON.stringify(heatMapPointList));
                        const count = heatMapPointList.reduce((count, item) => item.weight > 0 ? count + 1 : count, 0);
                    },
                });
                await store.dispatch('FETCH_COORDINATES', {
                    province: 1,
                    idList: [11],
                    callback: (success, message) => {
                    },
                });
            }
        },
        created: function () {
            if (baseURL.indexOf('dev') !== -1) {
                alert(baseURL);
            }

            this.getHeatMap();

            // อ่าน user จาก local storage มาเก็บลง vuex store
            store.dispatch('GET_LOGGED_USER', {
                callback: (success, message) => {
                    if (success) {
                        if (store.state.userToken) {
                            store.dispatch('GET_PROFILE', {});
                        }
                    }
                }
            });

            store.dispatch('FETCH_ALARM', {
                province: 0,
                callback: (success, data) => {
                    if (!success) {
                        console.log('Fetch alarm province 0 failed!');
                    }

                    store.dispatch('FETCH_ALARM', {
                        province: 1,
                        callback: (success, data) => {
                            if (!success) {
                                console.log('Fetch alarm province 1 failed!');
                            }

                            this.startHomeDelay();
                        }
                    });
                }
            });
        },
        mounted: function () {
            BackgroundGeolocation.configure({
                desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
                stationaryRadius: 50,
                distanceFilter: 50,
                notificationTitle: 'ตรวจจับความเร็ว และตรวจสอบการเข้าเขตโรคระบาด',
                notificationText: 'ทำงาน',
                debug: false,
                startOnBoot: false,
                stopOnTerminate: true,
                locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
                interval: MONITOR_INTERVAL * 1000,
                fastestInterval: MONITOR_INTERVAL * 1000,
                activitiesInterval: MONITOR_INTERVAL * 1000,
                stopOnStillActivity: false,
                /*url: 'http://192.168.81.15:3000/location',
                httpHeaders: {
                    'X-FOO': 'bar'
                },
                // customize post properties
                postTemplate: {
                    lat: '@latitude',
                    lon: '@longitude',
                    foo: 'bar' // you can also add your own properties
                }*/
            });

            BackgroundGeolocation.on('location', (location) => {
                // handle your locations here
                // to perform long running operation on iOS
                // you need to create background task
                BackgroundGeolocation.startTask(taskKey => {
                    // execute long running task
                    // eg. ajax post location
                    // IMPORTANT: task has to be ended by endTask

                    //Date.now() returns a unix timestamp in milliseconds.
                    const now = Date.now();
                    console.log('NOW: ', now);

                    const heatMapPointListAll = store.state.heatMapPointList[PROVINCE_NAME_EN[0]].concat(
                        store.state.heatMapPointList[PROVINCE_NAME_EN[1]]
                    );

                    let leastDistance = null;
                    heatMapPointListAll.forEach(point => {
                        if (point.weight > 0) {
                            const distance = getDistance(
                                {latitude: point.latitude, longitude: point.longitude},
                                {latitude: location.latitude, longitude: location.longitude}
                            );
                            if (leastDistance === null || leastDistance > distance) {
                                leastDistance = distance;
                            }
                        }
                    });

                    let distanceMessage = null;
                    if (leastDistance === null) {
                        distanceMessage = 'ไม่มีเขตโรคระบาด';
                    } else {
                        distanceMessage = `คุณอยู่ห่างจากเขตโรคระบาดที่ใกล้ที่สุด ${(leastDistance / 1000).toFixed(1)} กม.`;
                    }

                    if (global.lastLocation && global.lastTimestamp) {
                        const elapsedTimeInSeconds = (now - global.lastTimestamp) / 1000;
                        const distanceInMeters = getDistance(
                            {latitude: location.latitude, longitude: location.longitude},
                            {latitude: global.lastLocation.latitude, longitude: global.lastLocation.longitude}
                        );

                        // 1 m/s = 3.6 km/h
                        const speedKmPerHour = ((distanceInMeters * 3.6) / elapsedTimeInSeconds).toFixed(1);
                        const speedMessage = `ระยะทาง ${distanceInMeters} เมตร\nเวลา ${elapsedTimeInSeconds} วินาที\nความเร็ว ${speedKmPerHour} กม./ชม.`;

                        const message = `${distanceMessage}\n\n${speedMessage}`;

                        Toast.show(message, Toast.LONG);
                        console.log(message);

                        if (leastDistance !== null && leastDistance < 1000) { // 1 กม.
                            Alert.alert('คุณกำลังเข้าใกล้เขตโรคระบาด');
                        }

                        if (speedKmPerHour > SPEED_MONITOR_THRESHOLD) {
                            //แจ้งเตือนขับเร็วเกินไป
                            if (!global.lastAlertTimestamp || ((now - global.lastAlertTimestamp) / 1000) > SPEED_ALERT_MIN_INTERVAL) {
                                Alert.alert('แจ้งเตือน', `คุณขับรถเร็วเกินไป (${speedKmPerHour} กม./ชม.)`);
                                global.lastAlertTimestamp = now;
                            }
                        }
                    } else {
                        Toast.show('เริ่มตรวจจับความเร็ว และการเข้าเขตโรคระบาด', Toast.LONG);
                    }

                    global.lastLocation = location;
                    global.lastTimestamp = now;

                    console.log('BACKGROUND TRACKING: ', JSON.stringify(location));

                    BackgroundGeolocation.endTask(taskKey);
                });
            });

            BackgroundGeolocation.on('stationary', (stationaryLocation) => {
                // handle stationary locations here
                //Actions.sendLocation(stationaryLocation);
            });

            BackgroundGeolocation.on('error', (error) => {
                console.log('[ERROR] BackgroundGeolocation error:', error);
            });

            BackgroundGeolocation.on('start', () => {
                console.log('[INFO] BackgroundGeolocation service has been started');
            });

            BackgroundGeolocation.on('stop', () => {
                console.log('[INFO] BackgroundGeolocation service has been stopped');
            });

            BackgroundGeolocation.on('authorization', (status) => {
                console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
                if (status !== BackgroundGeolocation.AUTHORIZED) {
                    // we need to set delay or otherwise alert may not be shown
                    setTimeout(() => {
                        /*Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                            {text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings()},
                            {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}
                        ]);*/

                        Alert.alert('แจ้งเตือน', 'แอปจำเป็นต้องขอข้อมูลตำแหน่งปัจจุบันของคุณ');
                    }, 1000);
                }
            });

            BackgroundGeolocation.on('background', () => {
                console.log('[INFO] App is in background');
            });

            BackgroundGeolocation.on('foreground', () => {
                console.log('[INFO] App is in foreground');
            });

            BackgroundGeolocation.on('abort_requested', () => {
                console.log('[INFO] Server responded with 285 Updates Not Required');

                // Here we can decide whether we want stop the updates or not.
                // If you've configured the server to return 285, then it means the server does not require further update.
                // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
                // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
            });

            BackgroundGeolocation.on('http_authorization', () => {
                console.log('[INFO] App needs to authorize the http requests');
            });

            BackgroundGeolocation.checkStatus(status => {
                console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
                console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
                console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

                // you don't need to check status before start (this is just the example)
                if (!status.isRunning) {
                    //BackgroundGeolocation.start(); //triggers start on start event
                }
            });

            // you can also just start without checking for status
            //BackgroundGeolocation.start();
        },
        beforeDestroy: function () {
            //BackgroundGeolocation.stop();
            //BackgroundGeolocation.removeAllListeners();
        },
    }
</script>

<style>
    .main-container {
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .logo-container {
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .logo {
        width: 250;
        height: 250;
    }

    .title {
        text-align: center;
        font-family: DBHeavent;
        font-size: 28;
        color: #333333;
        margin-top: 15;
    }

    .powered-by {
        text-align: center;
        font-family: DBHeavent;
        font-size: 22;
        color: #9f6f0f;
        margin-bottom: 20;
    }
</style>
    