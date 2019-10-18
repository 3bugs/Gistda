<template>
    <app-navigator></app-navigator>
</template>

<script>
    import {
        createAppContainer,
        createStackNavigator,
    } from "vue-native-router";

    import Home from './Home';

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
