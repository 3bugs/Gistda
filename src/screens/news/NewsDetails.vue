<template>
    <view class="container">
        <header title="ประชาสัมพันธ์"
                :left-icon="{
                    icon: imageBack,
                    width: 24,
                    height: 18,
                    callback: handleClickBack
                }"
                :right-icon="{
                    icon: null,
                    width: 24,
                    height: 18,
                    callback: null
                }"/>

        <!--todo: Compose UI-->

        <text>ID: {{item.id}}</text>
        <text>Title: {{item.title}}</text>
        <text>Caption: {{item.caption}}</text>
        <text>Image URL: {{item.image}}</text>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';
    import Header from '../../components/Header';

    import {Dimensions} from 'react-native';

    import imageBack from '../../../assets/ic_back.png';

    export default {
        components: {Header},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            item() {
                return this.navigation.getParam('item');
            }
        },
        data: () => {
            return {
                DEBUG,
                Dimensions,
                imageBack,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
        },
        created: function () {
            //alert(this.item.id);
            //todo: Get details by ID (this.item.id) from API

        }
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>