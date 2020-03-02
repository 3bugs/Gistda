<!--Coded by Promlert Lovichit (promlert@gmail.com)-->

<template>
    <menu-provider :back-handler="true">
        <app-container></app-container>
    </menu-provider>
</template>

<script>
    import store from './src/store';
    import {PROVINCE_NAME_EN, SPEED_MONITOR_THRESHOLD, SPEED_ALERT_MIN_INTERVAL, MONITOR_INTERVAL} from './src/constants/index';

    import Splash from './src/screens/splash/Splash';
    import Province from './src/screens/province/Province';
    import Map from './src/screens/map/Map';
    import News from './src/screens/news/News';
    import Search from './src/screens/search-result/Search';
    import SearchResult from './src/screens/search-result/SearchResult';
    import SearchResultGoogle from './src/screens/search-result/SearchResultGoogle';
    import MarkerDetails from './src/screens/map/MarkerDetails';
    import CategoryInfo from './src/screens/map/CategoryInfo';
    //import MapsPage from './src/screens/search-result/MapsPage'; //todo: ****************
    import Report from './src/screens/report/Report';
    import NewsDetails from './src/screens/news/NewsDetails';
    import Login from './src/screens/login/Login';
    import Register from './src/screens/login/Register';
    import Profile from './src/screens/profile/Profile';
    import Alarm from './src/screens/profile/Alarm';
    import EditProfile from './src/screens/profile/EditProfile';
    import ChangePassword from './src/screens/profile/ChangePassword';
    import ForgotPassword from './src/screens/profile/ForgotPassword';
    import History from './src/screens/incident-report/History';
    import IncidentForm from './src/screens/incident-report/IncidentForm';
    import SettingsScreen from './src/screens/map/SettingsScreen';
    import TabBar from './src/components/TabBar';

    import {
        createAppContainer,
        createSwitchNavigator,
        createStackNavigator,
        createBottomTabNavigator,
        createMaterialTopTabNavigator,
    } from "vue-native-router";
    import {Alert} from 'react-native';
    import {MenuProvider} from 'react-native-popup-menu';
    import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
    import Toast from 'react-native-simple-toast';
    import {getDistance} from 'geolib';
    import firebase from 'react-native-firebase';
    //import type { Notification } from 'react-native-firebase';

    const newsNavigator = createMaterialTopTabNavigator(
        {
            Settings: SettingsScreen,
            Settings2: SettingsScreen,
            Settings3: SettingsScreen,
            Settings4: SettingsScreen,
        },
        {
            initialRouteName: 'Settings',
            backBehavior: 'none',
            swipeEnabled: true,
            tabBarOptions: {
                labelStyle: {
                    color: 'black',
                    fontFamily: 'DBHeavent',
                    fontSize: 16,
                },
                style: {
                    backgroundColor: 'white',
                }
            }
        }
    );

    const bottomTabNavigator = createBottomTabNavigator(
        {
            Map: {
                screen: Map,
            },
            News: {
                screen: News,
            },
            Cctv: {
                screen: SettingsScreen,
            },
            Report: {
                screen: Report,
            },
            News2: {
                screen: newsNavigator,
            },
        },
        {
            initialRouteName: 'Map',
            tabBarComponent: TabBar,
        }
    );

    const stackNavigator = createStackNavigator(
        {
            Province: {
                screen: Province,
                navigationOptions: {
                    header: null,
                }
            },
            BottomTabNavigator: {
                screen: bottomTabNavigator,
                navigationOptions: {
                    header: null,
                }
            },
            NewsDetails: {
                screen: NewsDetails,
                navigationOptions: {
                    header: null,
                }
            },
            IncidentForm: {
                screen: IncidentForm,
                navigationOptions: {
                    header: null,
                }
            },
            Login: {
                screen: Login,
                navigationOptions: {
                    header: null,
                }
            },
            Register: {
                screen: Register,
                navigationOptions: {
                    header: null,
                }
            },
            Profile: {
                screen: Profile,
                navigationOptions: {
                    header: null,
                }
            },
            Alarm: {
                screen: Alarm,
                navigationOptions: {
                    header: null,
                }
            },
            EditProfile: {
                screen: EditProfile,
                navigationOptions: {
                    header: null,
                }
            },
            ChangePassword: {
                screen: ChangePassword,
                navigationOptions: {
                    header: null,
                }
            },
            ForgotPassword: {
                screen: ForgotPassword,
                navigationOptions: {
                    header: null,
                }
            },
            History: {
                screen: History,
                navigationOptions: {
                    header: null,
                }
            },
            Search: {
                screen: Search,
                navigationOptions: {
                    header: null,
                }
            },
            SearchResult: {
                screen: SearchResult,
                navigationOptions: {
                    header: null,
                }
            },
            SearchResultGoogle: {
                screen: SearchResultGoogle,
                navigationOptions: {
                    header: null,
                }
            },
            MarkerDetails: {
                screen: MarkerDetails,
                navigationOptions: {
                    header: null,
                }
            },
            CategoryInfo: {
                screen: CategoryInfo,
                navigationOptions: {
                    header: null,
                }
            },
        },
        {
            initialRouteName: 'Province',
        }
    );

    const switchNavigator = createSwitchNavigator(
        {
            Splash: {
                screen: Splash,
                navigationOptions: {
                    header: null,
                }
            },
            StackNavigator: stackNavigator,
        },
        {
            initialRouteName: 'Splash',
        }
    );

    const AppContainer = createAppContainer(switchNavigator);

    export default {
        components: {AppContainer, TabBar, MenuProvider},
        data: () => {
            return {};
        },
        methods: {
            getHeatMap: async function () {
                await store.dispatch('FETCH_COORDINATES', {
                    province: 0,
                    idList: [11], //todo: hardcoded is bad!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    callback: (success, message) => {
                        const heatMapPointList = store.state.heatMapPointListDisease[PROVINCE_NAME_EN[0]];
                        console.log('**********\n**********\n**********\nHEATMAP POINT LIST PROVINCE 0: ', JSON.stringify(heatMapPointList));

                        //const count = heatMapPointList.reduce((count, item) => item.weight > 0 ? count + 1 : count, 0);
                    },
                });
                await store.dispatch('FETCH_COORDINATES', {
                    province: 1,
                    idList: [11],
                    callback: (success, message) => {
                        const heatMapPointList = store.state.heatMapPointListDisease[PROVINCE_NAME_EN[1]];
                        console.log('**********\n**********\n**********\nHEATMAP POINT LIST PROVINCE 1: ', JSON.stringify(heatMapPointList));
                    },
                });
            },
            setupBackgroundGeolocation: function () {
                BackgroundGeolocation.configure({
                    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
                    stationaryRadius: 1,
                    distanceFilter: 1,
                    notificationTitle: 'ตรวจจับความเร็ว และตรวจสอบการเข้าเขตโรคระบาด/พื้นที่เสี่ยงบนท้องถนน',
                    notificationText: 'ทำงาน',
                    debug: false,
                    startOnBoot: true,
                    stopOnTerminate: false,
                    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
                    interval: MONITOR_INTERVAL * 1000,
                    fastestInterval: MONITOR_INTERVAL * 1000,
                    activitiesInterval: MONITOR_INTERVAL * 1000,
                    stopOnStillActivity: false,
                    url: 'http://3bugs.com/safesafe/api.php/add_user_tracking',
                    httpHeaders: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    // customize post properties
                    postTemplate: {
                        device_token: 'foo_token',
                        latitude: '@latitude',
                        longitude: '@longitude',
                        client_timestamp: '@time',
                        speed: '@speed',
                    },
                });

                BackgroundGeolocation.on('location', (location) => {
                    console.log('BACKGROUND TRACKING: ', JSON.stringify(location));

                    // handle your locations here
                    // to perform long running operation on iOS
                    // you need to create background task
                    BackgroundGeolocation.startTask(taskKey => {
                        // execute long running task
                        // eg. ajax post location
                        // IMPORTANT: task has to be ended by endTask

                        //Date.now(), Date.getTime() returns a unix timestamp in milliseconds.
                        const now = new Date();
                        console.log(
                            `Timestamp: ${now.getTime()}`,
                            `[${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`,
                            `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`
                        );

                        const heatMapPointListAll = store.state.heatMapPointListDisease[PROVINCE_NAME_EN[0]].concat(
                            store.state.heatMapPointListDisease[PROVINCE_NAME_EN[1]]
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
                            const elapsedTimeInSeconds = (now.getTime() - global.lastTimestamp) / 1000;
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
                                //Alert.alert('คุณกำลังเข้าใกล้เขตโรคระบาด');
                            }

                            if (speedKmPerHour > SPEED_MONITOR_THRESHOLD) {
                                //แจ้งเตือนขับเร็วเกินไป
                                if (!global.lastAlertTimestamp || ((now.getTime() - global.lastAlertTimestamp) / 1000) > SPEED_ALERT_MIN_INTERVAL) {
                                    //Alert.alert('แจ้งเตือน', `คุณขับรถเร็วเกินไป (${speedKmPerHour} กม./ชม.)`);
                                    global.lastAlertTimestamp = now.getTime();
                                }
                            }
                        } else {
                            Toast.show('เริ่มตรวจจับความเร็ว และการเข้าเขตโรคระบาด', Toast.LONG);
                        }

                        global.lastLocation = location;
                        global.lastTimestamp = now.getTime();

                        //console.log('BACKGROUND TRACKING: ', JSON.stringify(location));

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
                BackgroundGeolocation.start();
            }
        },
        created: async function() {
            console.log('APP - CREATED');

            this.getHeatMap();
            this.setupBackgroundGeolocation();

            const fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                console.log('Token: ' + fcmToken);
                //alert('Token: ' + fcmToken);
            } else {
                // user doesn't have a device token yet
                console.log('NO TOKEN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                //alert('NO token!!!');
            }

            const enabled = await firebase.messaging().hasPermission();
            if (enabled) {
                // user has permissions
            } else {
                // user doesn't have permission
                try {
                    await firebase.messaging().requestPermission();
                    // User has authorised
                } catch (error) {
                    // User has rejected permissions
                }
            }
        },
        mounted: function () {
            console.log('APP - MOUNTED');

            /*this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
                // Process your notification as required
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            });
            this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
                // Process your notification as required
            });*/
        },
        beforeDestroy: function () {
            console.log('APP - BEFORE_DESTROY');

            //BackgroundGeolocation.stop();
            BackgroundGeolocation.removeAllListeners();
            global.lastLocation = null;
            global.lastTimestamp = null;
        },
        destroyed: function () {
            console.log('APP - DESTROYED');
        },
        beforeUpdate: function () {
            console.log('APP - BEFORE_UPDATE');
        },
        updated: function () {
            console.log('APP - UPDATED');
        },
    }
</script>

<style>
</style>
