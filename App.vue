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
    import SelectProvince from './src/screens/select_province/SelectProvince';
    import Home from './src/screens/home/Home';
    import SettingsScreen from './src/screens/home/SettingsScreen';
    import TabBar from './src/screens/home/TabBar';

    const bottomTabNavigator = createBottomTabNavigator(
        {
            Home: {
                screen: Home,
                navigationOptions: {

                }
            },
            Settings: SettingsScreen,
        },
        {
            initialRouteName: 'Home',
            tabBarComponent: TabBar,
        }
    );

    const stackNavigator = createStackNavigator(
        {
            SelectProvince: {
                screen: SelectProvince,
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
            initialRouteName: 'SelectProvince',
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
