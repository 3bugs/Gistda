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

    import Splash from './src/screens/splash/Splash';
    import Home from './src/screens/home/Home';
    //import Main from './src/screens/main/Main';
    import MainIndex from './src/screens/main/Index';
    import SettingsScreen from './src/screens/main/SettingsScreen';
    import TabBar from './src/screens/main/TabBar';

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
