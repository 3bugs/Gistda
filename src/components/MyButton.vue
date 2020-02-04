<template>
    <view>
        <touchable-opacity
                :on-press="handleClick"
                :active-opacity="0.6"
                :style="{

                }">
            <card-view :card-elevation="4"
                       :card-maxElevation="4"
                       :corner-radius="cornerRadius"
                       :style="{
                            flexDirection: 'row',
                            backgroundColor: bgColor,
                            paddingTop: padding,
                            paddingBottom: padding,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }">
                <image v-if="icon"
                       :source="icon"
                       :style="{
                            width: iconSize,
                            height: iconSize,
                            marginRight: 10,
                       }"
                       resize-mode="contain"/>
                <text :style="{
                    fontFamily: 'DBHeavent-Med',
                    fontSize: fontSize,
                    color: 'white',
                }">{{text}}</text>
            </card-view>
        </touchable-opacity>
    </view>
</template>

<script>
    import store from '../store';
    import {DEBUG} from '../constants';

    import {Dimensions} from 'react-native';
    import CardView from 'react-native-cardview';

    export default {
        components: {CardView},
        props: {
            text: {
                type: String
            },
            fontSize: {
                type: Number,
                default: 22
            },
            icon: {
                type: Number
            },
            iconSize: {
                type: Number,
                default: 26
            },
            bgColor: {
                type: String
            },
            padding: {
                type: Number,
                default: 14
            },
            cornerRadius: {
                type: Number,
                default: 28
            },
            onClick: {
                type: Function
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG,
                Dimensions,
            };
        },
        methods: {
            handleClick: function () {
                this.onClick();
            }
        },
    }
</script>

<style>
</style>