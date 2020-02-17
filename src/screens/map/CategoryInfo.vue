<template>
    <view class="container">
        <form-header
                title="คำอธิบายสัญลักษณ์"
                :show-header="false"
                :override-scroll-view="true"
                :on-click-back="handleClickBack">

            <!--<flat-list
                    class="list"
                    v-if="dataList && dataList.length > 0"
                    :data="dataList"
                    :keyExtractor="(item, index) => index.toString()"
                    :contentContainerStyle="{margin: 0}"
                    :style="{
                        marginTop: DIMENSION.horizontal_margin * 1.5,
                    }">
                <view render-prop-fn="renderItem">
                    <text>
                        {{args.name}}
                    </text>
                </view>
                <view render-prop="ListFooterComponent"
                      v-if="true">
                    <view :style="{height: 50}"/>
                </view>
            </flat-list>-->

            <scroll-view
                    :style="{
                        paddingTop: DIMENSION.horizontal_margin * 1.5,
                        paddingLeft: DIMENSION.horizontal_margin,
                        paddingRight: DIMENSION.horizontal_margin,
                    }">
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>
                <text class="text" :style="{marginBottom: 10}">รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด รายละเอียด </text>

                <view :style="{height: 50}"/>
            </scroll-view>

            <!--<no-data v-if="dataList && dataList.length === 0"/>

            <activity-indicator
                    class="progress"
                    size="large"
                    :color="COLOR_PRIMARY[province]"
                    v-if="isLoading"/>-->

        </form-header>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, PROVINCE_NAME_EN, COLOR_PRIMARY, DIMENSION} from '../../constants';
    import {addSeenAlarm} from '../../store/db';
    import FormHeader from '../../components/FormHeader';
    import NoData from '../../components/NoData';
    import ListItem from '../../components/ListItem';

    import {Dimensions, StyleSheet, Alert} from 'react-native';

    import imageBack from '../../../assets/images/ic_back.png';

    export default {
        components: {FormHeader, NoData, ListItem},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            dataList() {
                return store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]];
            },
        },
        data: () => {
            return {
                DEBUG, COLOR_PRIMARY, DIMENSION,
                Dimensions, StyleSheet,
                imageBack,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickItem: function (item) {
            },
        },
        created: function () {
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .text {
        font-family: DBHeavent;
        font-size: 20;
        letter-spacing: 0;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>