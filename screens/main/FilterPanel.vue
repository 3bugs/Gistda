<template>
    <view class="container">
        <linear-gradient
                class="gradient-background"
                :colors="['#09097e', '#4041da']">
            <text>
                Control Panel
            </text>
            <flat-list
                    class="list"
                    :data="filterDataList">
                <view render-prop-fn="renderItem">
                    <filter-item/>
                    <!--<text>{{args.item.key}}</text>-->
                </view>
            </flat-list>
        </linear-gradient>
    </view>
</template>

<script>
    /*import React, {Component} from 'react';
    import {Text} from 'react-native';*/
    import LinearGradient from 'react-native-linear-gradient';
    import FilterItem from './FilterItem';

    export default {
        components: {LinearGradient, FilterItem},
        props: {},
        data: () => {
            return {
                filterDataList: [
                    {key: 'a'},
                    {key: 'b'},
                ],
            };
        },
        methods: {},
    }
</script>

<style>
    .container {
        width: 100%;
        height: 100%;
        background-color: #4041da;
        border-width: 0;
        border-color: red;
    }

    .gradient-background {
        flex: 1;
    }

    .list {
        flex: 1;
        padding-left: 15;
        padding-right: 15;
        border-width: 0;
        border-color: yellow;
    }
</style>