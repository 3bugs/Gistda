<template>
    <view class="container"
          :style="{marginBottom: BOTTOM_NAV.height}">
        <flat-list
                class="list"
                v-if="!isLoading && dataList && dataList.length > 0"
                :data="dataList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <news-item
                        v-if="page === 0 || page === 2"
                        :item="args.item"
                        :index="args.index"/>
                <er-item
                        v-if="page === 1"
                        :item="args.item"
                        :index="args.index"/>
            </view>
            <!--<view render-prop="ListEmptyComponent"
                  :style="{width: '100%', height: '100%', borderWidth: 1, borderColor: 'blue'}">
                <view :style="{flex: 1, borderWidth: 1, borderColor: 'red'}">
                    <text>ไม่มีข้อมูล</text>
                </view>
            </view>-->
            <view render-prop="ListHeaderComponent"
                  v-if="page === 1">
                <view :style="{height: 15}"/>
            </view>
            <view render-prop="ListFooterComponent"
                  v-if="true">
                <view :style="{height: 50}"/>
            </view>
        </flat-list>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isLoading"/>

        <view v-if="dataList && dataList.length === 0"
              :style="{flex: 1, justifyContent: 'center', alignItems: 'center'}">
            <text :style="{fontFamily: 'DBHeaventt-Light', fontSize: 24, color: '#333333'}">
                ไม่มีข้อมูล
            </text>
        </view>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, BOTTOM_NAV, COLOR_PRIMARY} from '../../constants';
    import NewsItem from './NewsItem';
    import ErItem from './ErItem';

    export default {
        components: {NewsItem, ErItem},
        props: {
            page: {
                type: Number
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            isLoading() {
                switch (this.page) {
                    case 0: // News
                        return store.state.loadingNews;
                    case 1: // ER
                        return store.state.loadingEr;
                    case 2: // Suggest
                        return store.state.loadingSuggest;
                }
            },
            dataList() {
                switch (this.page) {
                    case 0: // News
                        return store.state.newsList;
                    case 1: // Er
                        return store.state.erList;
                    case 2: // Suggest
                        return store.state.suggestList;
                }
            },
        },
        data: () => {
            return {
                DEBUG, BOTTOM_NAV, COLOR_PRIMARY
            };
        },
        methods: {
        },
        created: function () {
            let storeAction = null;

            switch (this.page) {
                case 0: // News
                    storeAction = 'FETCH_NEWS';
                    break;
                case 1: // ER
                    storeAction = 'FETCH_ER';
                    break;
                case 2: // Suggest
                    storeAction = 'FETCH_SUGGEST';
                    break;
            }

            if (!this.dataList && storeAction) {
                store.dispatch(storeAction, {
                    province: this.province,
                    callback: (success, message) => {
                        if (!success) {
                            alert(message);
                        }
                    }
                });
            }
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .list {
        flex: 1;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>