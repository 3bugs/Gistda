<template>
    <view class="container">
        <linear-gradient
                class="gradient-background"
                :colors="[
                    SIDEBAR.headerBackground[province].startColor,
                    SIDEBAR.headerBackground[province].endColor
                ]">
            <touchable-opacity class="profile-touchable"
                               :on-press="handleClickProfile">
                <view class="profile-touchable">
                    <view class="profile-image-container">
                        <image :source="profileImage"
                               class="profile-image"
                               resize-mode="contain"/>
                    </view>
                    <view class="profile-name-container">
                        <text class="profile-name">
                            {{userToken ? userDisplayName : 'Hello Guest !'}}
                        </text>
                        <text class="login-text">
                            {{userToken ? 'Logged In' : 'Login / Sign Up'}}
                        </text>
                    </view>
                </view>
            </touchable-opacity>

            <touchable-opacity class="bell-icon-touchable"
                               :on-press="handleClickBell">
                <image :source="imageBell"
                       class="bell-icon"
                       resize-mode="contain"/>
                <text class="badge">
                    {{8}}
                </text>
            </touchable-opacity>
        </linear-gradient>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, SIDEBAR} from '../../constants';

    import LinearGradient from 'react-native-linear-gradient';

    import imageProfilePromlert from '../../../assets/images/sidebar/profile_promlert.jpg';
    import imageProfileDummy from '../../../assets/images/sidebar/ic_profile_dummy.png';
    import imageBell from '../../../assets/images/sidebar/ic_bell.png';
    import imageLogo from '../../../assets/images/sidebar/ic_logo.png';

    export default {
        components: {LinearGradient},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            userDisplayName() {
                return store.state.userDisplayName;
            },
            userToken() {
                return store.state.userToken;
            },
            profileImage() {
                //return this.userToken ? imageProfilePromlert : imageLogo;
                return imageLogo;
            },
            isLoggedIn() {
                return store.state.userToken !== null
            },
        },
        data: () => {
            return {
                SIDEBAR,
                imageProfilePromlert, imageProfileDummy, imageBell, imageLogo,
            };
        },
        methods: {
            handleClickProfile: function () {
                if (this.isLoggedIn) {
                    this.navigation.navigate('Profile');
                } else {
                    this.navigation.navigate('Login');
                }
            },
            handleClickBell: function () {
                this.navigation.navigate('Alarm');
            },
        },
    }
</script>

<style>
    .container {
        width: 100%;
        height: 118;
        border-width: 0;
        border-color: yellow;
    }

    .gradient-background {
        flex: 1;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 20;
        padding-right: 20;
        padding-top: 30;
    }

    .profile-image-container {
        width: 49;
        height: 49;
        border-radius: 24;
        border-width: 0;
        border-color: 'rgba(255, 255, 255, 0.25)';
        overflow: hidden;
    }

    .profile-image {
        width: 100%;
        height: 100%;
    }

    .bell-icon {
        width: 34;
        height: 34;
    }

    .profile-touchable {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .bell-icon-touchable {
        width: 40;
        height: 49;
        justify-content: center;
        align-items: center;
    }

    .badge {
        position: absolute;
        top: 4;
        left: 25;
        font-family: DBHeavent-Med;
        color: white;
        font-size: 16;
        background-color: black;
        padding-left: 6;
        padding-right: 6;
        border-radius: 6;
    }

    .profile-name-container {
        justify-content: center;
        padding-left: 12;
    }

    .profile-name {
        font-family: DBHeavent;
        color: white;
        font-size: 20;
    }

    .login-text {
        font-family: DBHeavent;
        font-size: 18;
        color: 'rgba(255, 255, 255, 0.30)';
        margin-top: 2;
    }
</style>