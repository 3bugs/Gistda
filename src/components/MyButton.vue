<template>
    <view>
        <touchable-opacity
                :on-press="handleClick"
                :active-opacity="0.6"
                :style="{

                }">
            <card-view :card-elevation="4"
                       :card-maxElevation="4"
                       :corner-radius="28"
                       :style="{
                            flexDirection: 'row',
                            backgroundColor: bgColor,
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }">
                <image v-if="icon"
                       :source="icon"
                       :style="{
                            width: 26,
                            height: 26,
                            marginRight: 10,
                       }"
                       resize-mode="contain"/>
                <text :style="{
                    fontFamily: 'DBHeavent-Med',
                    fontSize: 22,
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
            icon: {
                type: Number
            },
            bgColor: {
                type: String
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