<template>
    <view class="container"
          :style="{marginBottom: BOTTOM_NAV.height}">
        <flat-list
                class="list"
                v-if="!loadingNews && newsList && newsList.length > 0"
                :data="newsList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <pr-item
                        :item="args.item"
                        :index="args.index"/>
            </view>
            <!--<view render-prop="ListEmptyComponent"
                  :style="{width: '100%', height: '100%', borderWidth: 1, borderColor: 'blue'}">
                <view :style="{flex: 1, borderWidth: 1, borderColor: 'red'}">
                    <text>ไม่มีข้อมูล</text>
                </view>
            </view>-->
            <!--<view render-prop="ListHeaderComponent">
                <filter-panel-header/>
            </view>-->
        </flat-list>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="loadingNews"/>

        <view v-if="newsList && newsList.length === 0"
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
    import PrItem from './PrItem';

    export default {
        components: {PrItem},
        props: {},
        computed: {
            province() {
                return store.state.province;
            },
            loadingNews() {
                return store.state.loadingNews;
            },
            newsList() {
                return store.state.newsList;
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
            if (!this.newsList) {
                store.dispatch('FETCH_NEWS', {
                    province: this.province,
                    callback: (success, message) => {
                        if (success) {

                        } else {
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

    .label {
        font-family: DBHeavent;
        font-size: 24;
        color: #333333;
    }
</style>