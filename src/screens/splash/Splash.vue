<template>
    <image-background :source="bg"
                      :style="{width: '100%', height: '100%'}"
                      resize-mode="cover">
        <status-bar
                 :hidden="true"
        />
        <view class="main-container">
            <view class="logo-container" :style="{paddingBottom: bottomPadding}">
                <image class="logo" :source="logo"/>
                <text class="title">{{title}}</text>
            </view>
            <text class="powered-by">{{poweredBy}}</text>
        </view>
    </image-background>
</template>

<script>
    import {Dimensions} from 'react-native';
    import bg from '../../../assets/splash/bg_splash.jpg';
    import logo from '../../../assets/splash/ic_logo.png';

    const delayInMilliseconds = 3000;
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
        resize-mode: contain;
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
    