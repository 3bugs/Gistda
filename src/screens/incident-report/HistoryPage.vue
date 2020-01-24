<template>
    <view class="container"
          :style="{_marginBottom: BOTTOM_NAV.height}">
        <flat-list
                class="list"
                v-if="dataList && dataList.length > 0"
                :data="dataList"
                :keyExtractor="(item, index) => index.toString()"
                :contentContainerStyle="{margin: 0}">
            <view render-prop-fn="renderItem">
                <news-item
                        :item="args.item"
                        :index="args.index"
                        titlePropName="detail"
                        detailsPropName="detail"
                        :show-date="false"
                        :on-click="handleClickItem"/>
            </view>
            <!--<view render-prop="ListEmptyComponent"
                  :style="{width: '100%', height: '100%', borderWidth: 1, borderColor: 'blue'}">
                <view :style="{flex: 1, borderWidth: 1, borderColor: 'red'}">
                    <text>ไม่มีข้อมูล</text>
                </view>
            </view>-->
            <view render-prop="ListFooterComponent"
                  v-if="true">
                <view :style="{height: 50}"/>
            </view>
        </flat-list>

        <no-data v-if="dataList && dataList.length === 0"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, APP_NAME, PROVINCE_NAME_EN, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK} from '../../constants';
    import NoData from '../../components/NoData';
    import NewsItem from '../news/NewsItem';

    import {Platform, PermissionsAndroid, Linking} from 'react-native';

    export default {
        components: {
            NewsItem, NoData
        },
        props: {
            navigation: {
                type: Object
            },
            page: {
                type: Number
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            dataList() {
                const historyList = store.state.historyList[PROVINCE_NAME_EN[this.province]];

                if (historyList == null) {
                    return null;
                } else {
                    return historyList.filter(item => {
                        return (item.status.id == this.page + 1);
                    });
                }
            },
        },
        data: () => {
            return {
                DEBUG, APP_NAME, BOTTOM_NAV, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
            };
        },
        methods: {
            handleClickItem: function (item) {
                /*let cachedItem = null;
                this.newsDetailsList.forEach(newsDetails => {
                    if (item.id === newsDetails.id) {
                        cachedItem = newsDetails;
                    }
                });

                if (cachedItem) {
                    this.navigation.navigate(
                        'NewsDetails',
                        {
                            item: cachedItem
                        }
                    );
                } else {
                    store.dispatch('FETCH_NEWS_DETAILS', {
                        newsId: item.id,
                        callback: (success, data) => {
                            if (success) {
                                this.navigation.navigate(
                                    'NewsDetails',
                                    {
                                        item: data
                                    }
                                );
                            } else {
                                alert(data); // data คือ error message
                            }
                        }
                    });
                }*/
            },
        },
        created: function () {
        }
    }
</script>

<style>
    .container {
        flex: 1;
        background-color: #f4f6fa;
    }

    .list {
        flex: 1;
    }
</style>