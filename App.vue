<!--Coded by Promlert Lovichit (promlert@gmail.com)-->

<template>
    <menu-provider>
        <app-container></app-container>
    </menu-provider>
</template>

<script>
    import {
        createAppContainer,
        createSwitchNavigator,
        createStackNavigator,
        createBottomTabNavigator,
        createMaterialTopTabNavigator,
    } from "vue-native-router";
    import {MenuProvider} from 'react-native-popup-menu';

    import Splash from './src/screens/splash/Splash';
    import Province from './src/screens/province/Province';
    import Map from './src/screens/map/Map';
    import News from './src/screens/news/News';
    import NewsDetails from './src/screens/news/NewsDetails';
    import Login from './src/screens/login/Login';
    import Register from './src/screens/login/Register';
    import Profile from './src/screens/profile/Profile';
    import EditProfile from './src/screens/profile/EditProfile';
    import ChangePassword from './src/screens/profile/ChangePassword';
    import ForgotPassword from './src/screens/profile/ForgotPassword';
    import History from './src/screens/incident-report/History';
    import IncidentForm from './src/screens/incident-report/IncidentForm';
    import SettingsScreen from './src/screens/map/SettingsScreen';
    import TabBar from './src/components/TabBar';

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
        methods: {}
    }
</script>

<style>
</style>
