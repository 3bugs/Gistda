<template>
    <ripple class="container"
            :ripple-color="COLOR_PRIMARY[province]"
            :ripple-opacity="0.2"
            :ripple-duration="500"
            :on-press="() => {onClick(index)}"
            :style="{
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: DIMENSION.horizontal_margin,
                paddingRight: DIMENSION.horizontal_margin,
            }">
        <text :style="{
                    flex: 1,
                    fontFamily: 'DBHeaventt-Light',
                    fontSize: 22,
                    color: '#333333',
                    borderWidth: 0,
                    borderColor: 'blue',
               }">
            {{title}}
        </text>
        <image :source="imageArrow"
               resize-mode="contain"
               :style="{
                    width: 14,
                    height: 20,
                    paddingLeft: 2,
                    paddingRight: 2,
               }"/>
    </ripple>
</template>

<script>
    import store from '../../store';
    import {DEBUG, DIMENSION, COLOR_PRIMARY} from '../../constants';

    import {Dimensions} from 'react-native';
    import Ripple from 'react-native-material-ripple';

    import imageArrow from '../../../assets/images/screen_profile/ic_arrow.png';

    export default {
        components: {Ripple},
        props: {
            title: {
                type: String
            },
            index: {
                type: Number
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
                DEBUG, DIMENSION, COLOR_PRIMARY,
                Dimensions,
                imageArrow,
            };
        },
        methods: {

        },
    }
</script>

<style>
    .container {
        flex-direction: row;
        align-items: center;
    }
</style>