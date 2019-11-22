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
                    :data="mapDataList"
                    :keyExtractor="(item, index) => index.toString()"
                    :contentContainerStyle="{margin: 0}">
                <view render-prop-fn="renderItem">
                    <filter-item
                            :item="args.item"
                            :index="args.index"/>
                </view>
            </flat-list>
        </linear-gradient>
    </view>
</template>

<script>
    import store from '../../store';

    import LinearGradient from 'react-native-linear-gradient';
    import FilterItem from './FilterItem';

    import imageFilterAccident from '../../../assets/ic_filter/ic_filter_geo_accident.png';

    export default {
        components: {LinearGradient, FilterItem},
        props: {
            onChangeOpacity: {
                type: Function
            }
        },
        computed: {
            mapDataList() {
                return store.state.mapDataList;
            }
        },
        data: () => {
            return {
                //imageFilterGeoAccident,
                filterDataList: [
                    {key: 'a', title: 'ตำแหน่งอุบัติเหตุ', icon: imageFilterAccident},
                    {key: 'b', title: 'พื้นที่เสี่ยงบนท้องถนน', icon: imageFilterAccident},
                    {key: 'c', title: 'เส้นทางคมนาคม', icon: imageFilterAccident},
                    {key: 'd', title: 'จุดตัดถนน จุดสัญญาณไฟจราจร', icon: imageFilterAccident},
                    {key: 'e', title: 'หน่วยบริการประชาขน สถานีตำรวจ สถานีดับเพลิง', icon: imageFilterAccident},
                    {key: 'f', title: 'จุดเสี่ยงภัยบนนถนน', icon: imageFilterAccident},
                ],
            };
        },
        methods: {
            /*test: function (data) {

            },*/
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
        margin-top: 20;
        border-width: 0;
        border-color: yellow;
    }
</style>