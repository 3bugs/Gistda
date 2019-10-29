<template>
    <app-container></app-container>
</template>

<script>
    import {
        createAppContainer,
        createSwitchNavigator,
        createStackNavigator,
        createBottomTabNavigator,
    } from "vue-native-router";

    import Splash from './screens/splash/Splash';
    import Home from './screens/home/Home';
    //import Main from './screens/main/Main';
    import MainIndex from './screens/main/Index';
    import SettingsScreen from './screens/main/SettingsScreen';
    import TabBar from './screens/main/TabBar';

    const bottomTabNavigator = createBottomTabNavigator(
        {
            MainIndex: {
                screen: MainIndex,
                navigationOptions: {

                }
            },
            Settings: SettingsScreen,
        },
        {
            initialRouteName: 'MainIndex',
            tabBarComponent: TabBar,
        }
    );

    const stackNavigator = createStackNavigator(
        {
            Home: {
                screen: Home,
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
        },
        {
            initialRouteName: 'Home',
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
        components: {AppContainer, TabBar},
        data: () => {
            return {};
        },
        methods: {}
    }
</script>

<style>
</style>
