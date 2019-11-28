<template>
    <app-navigator></app-navigator>
</template>

<script>
    import {
        createAppContainer,
        createStackNavigator,
        createMaterialTopTabNavigator,
        createBottomTabNavigator,
    } from "vue-native-router";

    import Home from './SelectProvince';

    /*const MaterialTopTabNavigator = createMaterialTopTabNavigator(
        {
            Details: Maps,
            Settings: SettingsScreen
        }
    );

    const BottomTabNavigator = createBottomTabNavigator(
        {
            Details: Maps,
            Settings: SettingsScreen
        }
    );*/

    const stackNavigator = createStackNavigator(
        {
            Home: {
                screen: Home,
                navigationOptions: {
                    header: null,
                }
            }
        },
        {
            initialRouteName: 'Home',
        }
    );

    const AppNavigator = createAppContainer(stackNavigator);

    export default {
        components: {AppNavigator},
        data: () => {
            return {

            };
        },
        methods: {

        }
    }
</script>

<style>
</style>
