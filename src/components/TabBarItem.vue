<template>
    <touchable-opacity class="item-container-touchable"
                       :on-press="handleClick">
        <view class="item-container">
            <image :source="icon"
                   :style="{width: iconSize, height: iconSize}"
                   resize-mode="contain"/>
            <text :class="textClass">
                {{text}}
            </text>
        </view>
        <view :style="{
            borderBottomColor: lineColor,
            borderBottomWidth: 2.5,
            marginTop: 6,
            alignSelf: 'stretch',
            }"/>
    </touchable-opacity>
</template>

<script>
    import store from '../store';
    import {DEBUG, BOTTOM_NAV} from '../constants';

    import icHomeOff from '../../assets/images/bottom_nav/ic_home_off.png';
    import icNewsOff from '../../assets/images/bottom_nav/ic_news_off.png';
    import icCctvOff from '../../assets/images/bottom_nav/ic_cctv_off.png';
    import icReportOff from '../../assets/images/bottom_nav/ic_report_off.png';
    import icHomeOn from '../../assets/images/bottom_nav/ic_home_on.png';
    import icNewsOn from '../../assets/images/bottom_nav/ic_news_on.png';
    import icCctvOn from '../../assets/images/bottom_nav/ic_cctv_on.png';
    import icReportOn from '../../assets/images/bottom_nav/ic_report_on.png';

    const iconSize = 20;
    const dataList = [
        {
            text: 'HOME',
            iconOn: icHomeOn,
            iconOff: icHomeOff,
        },
        {
            text: 'NEWS',
            iconOn: icNewsOn,
            iconOff: icNewsOff,
        },
        {
            text: 'CCTV',
            iconOn: icCctvOn,
            iconOff: icCctvOff,
        },
        {
            text: 'REPORT',
            iconOn: icReportOn,
            iconOff: icReportOff,
        },
    ];

    export default {
        components: {},
        props: {
            itemIndex: {
                type: Number
            },
            state: {
                type: Boolean
            },
            callback: {
                type: Function
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            text() {
                return dataList[this.itemIndex].text;
            },
            textClass() {
                return this.state
                    ? 'item-text-on'
                    : 'item-text-off';
            },
            lineColor() {
                return this.state
                    ? BOTTOM_NAV.lineColor[this.province]
                    : 'rgba(255, 255, 255, 0)';
            },
            icon() {
                return this.state
                    ? dataList[this.itemIndex].iconOn
                    : dataList[this.itemIndex].iconOff;
            }
        },
        data: () => {
            return {
                DEBUG, BOTTOM_NAV,
                iconSize,
            };
        },
        methods: {
            handleClick: function () {
                this.callback(this.itemIndex);
            }
        },
    }
</script>

<style>
    .item-container-touchable {
        flex: 1;
        justify-content: flex-end;
        align-items: center;
        border-width: 0;
        border-color: yellow;
    }

    .item-container {
        justify-content: center;
        align-items: center;
        padding-bottom: 0;
        border-width: 0;
        border-color: red;
    }

    .item-text-off {
        margin-top: 3;
        font-family: DBHeaventt-Light;
        color: rgba(255, 255, 255, 0.5);
        font-size: 16;
    }

    .item-text-on {
        margin-top: 3;
        font-family: DBHeavent;
        color: rgba(255, 255, 255, 1);
        font-size: 16;
    }
</style>