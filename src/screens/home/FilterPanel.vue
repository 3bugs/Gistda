<template>
    <view class="container">
        <linear-gradient
                class="gradient-background"
                old_colors="['#09097e', '#4041da']"
                :colors="['#090963', '#4041da']">
            <flat-list
                    class="list"
                    :data="coordinateCategoryList"
                    :keyExtractor="(item, index) => index.toString()"
                    :contentContainerStyle="{margin: 0}">
                <view render-prop-fn="renderItem">
                    <filter-type
                            :item="args.item"
                            :typeIndex="args.index"/>
                </view>
                <view render-prop="ListHeaderComponent">
                    <filter-panel-header/>
                </view>
            </flat-list>
        </linear-gradient>
    </view>
</template>

<script>
    import store from '../../store';

    import LinearGradient from 'react-native-linear-gradient';
    import FilterPanelHeader from './FilterPanelHeader';
    import FilterType from './FilterType';

    export default {
        components: {LinearGradient, FilterPanelHeader, FilterType},
        props: {
            onChangeOpacity: {
                type: Function
            }
        },
        computed: {
            coordinateCategoryList() {
                return store.state.coordinateCategoryList;
            },
        },
        data: () => {
            return {
            };
        },
        methods: {
        },
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
        padding-left: 0;
        padding-right: 0;
        margin-top: 0;
    }
</style>