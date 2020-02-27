<template>
    <view class="container">
        <view class="title-container"
              :style="{flexDirection: 'row', alignItems: 'center'}">
            <text class="title"
                  :style="{color: SIDEBAR.filterTypeTextColor[province]}">
                {{item.name}}
            </text>

            <touchable-opacity
                    :on-press="handleClickInfo"
                    :style="{
                        padding: 5,
                        marginLeft: 0,
                     }">
                <image :source="imageCategoryInfo"
                       resize-mode="contain"
                       :style="{
                            width: 15,
                            height: 15,
                       }"/>
            </touchable-opacity>
        </view>
        <!--<flat-list
                :data="item.list"
                :keyExtractor="(item, index) => index.toString()">
            <view render-prop-fn="renderItem">
                <filter-item
                        :item="args.item"
                        :index="args.index"/>
            </view>
        </flat-list>-->
        <filter-item
                v-for="(filter, index) in item.list"
                :item="filter"
                :index="index"
                :typeIndex="typeIndex"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, SIDEBAR} from '../../constants';

    import FilterItem from './FilterItem';

    import imageCategoryInfo from '../../../assets/images/sidebar/ic_category_info.png';

    export default {
        components: {FilterItem},
        props: {
            navigation: {
                type: Object
            },
            item: { // filter type item
                type: Object
            },
            typeIndex: {
                type: Number
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG, SIDEBAR,
                imageCategoryInfo,
            };
        },
        methods: {
            handleClickInfo: function () {
                store.dispatch('CLOSE_DRAWER', {});

                this.navigation.navigate('CategoryInfo', {
                    categoryTypeId: this.item.id
                });
            },
        },
    }
</script>

<style>
    .container {
        border-width: 0;
        border-color: greenyellow;
    }

    .title-container {
        margin-top: 20;
        margin-bottom: 15;
        margin-left: 20;
    }

    .title {
        font-family: DBHeavent;
        font-size: 21;
        letter-spacing: 0;
    }
</style>
