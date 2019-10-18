<template>
    <app-navigator></app-navigator>
</template>

<script>
    import {
        createAppContainer,
        createSwitchNavigator,
    } from "vue-native-router";

    import Splash from './screens/splash/Splash';
    import HomeIndex from './screens/home/Index';

    const switchNavigator = createSwitchNavigator(
        {
            Splash: {
                screen: Splash,
                navigationOptions: {
                    header: null,
                }
            },
            HomeIndex: {
                screen: HomeIndex,
                navigationOptions: {
                    header: null,
                }
            }
        },
        {
            initialRouteName: 'Splash',
        }
    );

    const AppNavigator = createAppContainer(switchNavigator);

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
