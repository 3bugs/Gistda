<template>
    <app-navigator></app-navigator>
</template>

<script>
    import {
        createAppContainer,
        createStackNavigator,
    } from "vue-native-router";

    //import Splash from './screens/Splash';

    const StackNavigator = createStackNavigator(
        {
            //Splash: Splash,
            //Home: Home,
        },
        {
            //initialRouteName: 'Splash',
        }
    );

    const AppNavigator = createAppContainer(StackNavigator);

    export default {
        components: { AppNavigator },
        data: () => {
            return {
                a: 1,
            };
        },
        methods: {
            test: function () {
                alert('ok');
            },
        }
    }
</script>

<style>
</style>
