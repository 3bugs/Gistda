<template>
    <view class="container">
        <Menu :renderer="Popover"
              :rendererProps="{preferredPlacement: 'bottom'}">
            <MenuTrigger :custom-styles="{TriggerTouchableComponent: TouchableOpacity}">
                <text :style="{
                                backgroundColor: '#343434',
                                borderRadius: 14,
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 20,
                                color: 'white',
                                paddingTop: 2,
                                paddingBottom: 2,
                                paddingLeft: 12,
                                paddingRight: 12,
                            }">{{measureTextList[0]}}
                </text>
            </MenuTrigger>
            <MenuOptions :style="{padding: 8}">
                <MenuOption
                        v-for="(item, index) in measureTextList"
                        class="menu-option"
                        :on-select="null">
                    <Text class="menu-option-text">
                        {{item}}
                    </Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';

    import {Dimensions, TouchableOpacity} from 'react-native';
    import {Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';

    const {Popover} = renderers;

    export default {
        components: {
            Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger,
        },
        props: {
            measureValue: {
                type: Number
            },
            measureType: {
                type: Number // 0 = distance, 1 = area
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            measureTextList() {
                const list = [];

                if (this.measureType === 0) {
                    //const km = Math.round(((this.measureValue / 1000) + Number.EPSILON) * 100) / 100;
                    const m = this.measureValue;
                    const km = (m / 1000).toFixed(2);
                    const mile = (m * 0.621371 / 1000).toFixed(2);
                    list.push(`${this.numberWithCommas(km)} กม.`);
                    list.push(`= ${this.numberWithCommas(m)} เมตร`);
                    list.push(`= ${this.numberWithCommas(mile)} ไมล์`);
                } else {
                    //const sqKm = Math.round(((this.measureValue / 1000000) + Number.EPSILON) * 100) / 100;
                    const sqM = Math.floor(this.measureValue);
                    const sqKm = (sqM / 1000000).toFixed(2);
                    list.push(`${this.numberWithCommas(sqKm)} ตร.กม.`);
                    list.push(`= ${this.numberWithCommas(sqM)} ตร.ม.`);

                    const rai = Math.floor(sqM / 1600);
                    let remainder = sqM % 1600;
                    const ngan = Math.floor(remainder / 400);
                    remainder = remainder % 400;
                    const wa = Math.floor(remainder / 4);
                    list.push(`= ${this.numberWithCommas(rai)} ไร่, ${ngan} งาน, ${wa} ตร.วา`);
                }

                return list;
            },
        },
        data: () => {
            return {
                DEBUG, Popover,
                Dimensions, TouchableOpacity,
            };
        },
        methods: {
            numberWithCommas: function (num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .menu-option {
    }

    .menu-option-text {
        font-family: DBHeavent;
        font-size: 22;
    }
</style>