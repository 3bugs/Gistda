<template>
    <bottom-tab-navigator/>
</template>

<script>
    import {
        createBottomTabNavigator,
    } from "vue-native-router";

    import Map from '../screens/map/Map';
    import SettingsScreen from '../screens/map/SettingsScreen';
    import TabBar from '../components/TabBar';

    const BottomTabNavigator = createBottomTabNavigator(
        {
            Map: {
                screen: Map,
            },
            Settings: {
                screen: SettingsScreen,
            },
        },
        {
            initialRouteName: 'Map',
            tabBarComponent: TabBar,
        }
    );

    export default {
        components: {BottomTabNavigator},
        props: {},
        data: () => {
            return {

            };
        },
        methods: {

        },
    }
</script>

<style>

</style>