<template>
    <image-background :source="bg"
                      :style="{width: '100%', height: '100%'}"
                      resize-mode="cover">
        <status-bar
                 :hidden="true"
        />
        <view class="main-container">
            <view class="logo-container" :style="{paddingBottom: bottomPadding}">
                <image class="logo"
                       :source="logo"
                       resize-mode="contain"/>
                <text class="title">{{title}}</text>
            </view>
            <text class="powered-by">{{poweredBy}}</text>
        </view>
    </image-background>
</template>

<script>
    import store from '../../store';
    import {Dimensions} from 'react-native';
    import bg from '../../../assets/images/screen_splash/bg_splash.jpg';
    import logo from '../../../assets/images/screen_splash/ic_logo.png';

    const delayInMilliseconds = 1000;
    const title = 'ระบบภูมิสารสนเทศ\nด้านความปลอดภัยจังหวัด';
    const poweredBy = 'POWERED BY GISTDA';
    const {height, width} = Dimensions.get('window');

    export default {
        props: {
            navigation: {
                type: Object
            }
        },
        data: () => {
            return {
                bg,
                logo,
                title,
                poweredBy,
                bottomPadding: height / 6,
            };
        },
        created: function () {
            // อ่าน user จาก local storage มาเก็บลง vuex store
            store.dispatch('GET_LOGGED_USER', {});
            this.startHomeDelay();
        },
        methods: {
            startHomeDelay: function () {
                const self = this;
                setTimeout(function () {
                    self.navigation.navigate('StackNavigator');
                }, delayInMilliseconds);
            },
            loadData: function () {

            }
        }
    }
</script>

<style>
    .main-container {
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .logo-container {
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .logo {
        width: 250;
        height: 250;
    }

    .title {
        text-align: center;
        font-family: DBHeavent;
        font-size: 28;
        color: #333333;
        margin-top: 15;
    }

    .powered-by {
        text-align: center;
        font-family: DBHeavent;
        font-size: 22;
        color: #9f6f0f;
        margin-bottom: 20;
    }
</style>
    