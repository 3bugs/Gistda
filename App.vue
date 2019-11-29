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
    import Province from './src/screens/province/Province';
    import Map from './src/screens/map/Map';
    import SettingsScreen from './src/screens/map/SettingsScreen';
    import TabBar from './src/components/TabBar';

    const bottomTabNavigator = createBottomTabNavigator(
        {
            Map: {
                screen: Map,
                navigationOptions: {

                }
            },
            Settings: SettingsScreen,
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
        components: {AppContainer, TabBar},
        data: () => {
            return {};
        },
        methods: {}
    }
</script>

<style>
</style>
