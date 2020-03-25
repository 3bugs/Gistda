<template>
    <linear-gradient class="container"
                     :colors="[
                         SCREEN_LOGIN.background[province].startColor,
                         SCREEN_LOGIN.background[province].endColor
                     ]">
        <scroll-view
                class="content-container"
                keyboard-should-persist-taps="handled"
                :style="{
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                }">
            <view :style="{marginBottom: 90}"/>

            <image :source="imageLogo"
                   class="logo"
                   resize-mode="contain"/>
            <view :style="{marginBottom: 25}"/>

            <text class="title">{{'ระบบภูมิสารสนเทศ\nด้านความปลอดภัยจังหวัด'}}</text>
            <view :style="{marginBottom: 30}"/>

            <card-view :card-elevation="0"
                       :card-maxElevation="0"
                       :corner-radius="28"
                       :style="{
                            backgroundColor: 'rgba(20, 15, 38, 0.648579)',
                            paddingTop: 2,
                            paddingBottom: 2,
                            paddingLeft: 25,
                            paddingRight: 25,
                            justifyContent: 'center',
                        }">
                <text-input
                        class="text-input"
                        keyboard-type="email-address"
                        placeholder="EMAIL"
                        placeholder-text-color="rgba(255, 255, 255, 0.3)"
                        v-model="emailContent"/>
            </card-view>
            <view :style="{marginBottom: 15}"/>

            <card-view :card-elevation="0"
                       :card-maxElevation="0"
                       :corner-radius="28"
                       :style="{
                            flexDirection: 'row',
                            backgroundColor: 'rgba(20, 15, 38, 0.648579)',
                            paddingTop: 2,
                            paddingBottom: 2,
                            paddingLeft: 25,
                            paddingRight: 25,
                            alignItems: 'center',
                        }">
                <text-input
                        :style="{
                            flex: 1,
                        }"
                        class="text-input"
                        keyboard-type="default"
                        :secure-text-entry="!showPassword"
                        placeholder="PASSWORD"
                        placeholder-text-color="rgba(255, 255, 255, 0.3)"
                        v-model="passwordContent"/>
                <touchable-opacity :on-press="handleClickShowHidePassword">
                    <text class="action-show">
                        {{showPassword ? 'HIDE' : 'SHOW'}}
                    </text>
                </touchable-opacity>
            </card-view>
            <view :style="{marginBottom: 15}"/>

            <my-button
                    text="LOGIN"
                    :icon="null"
                    bg-color="#A573FF"
                    :on-click="handleClickLogin"/>
            <view :style="{marginBottom: 20}"/>

            <view :style="{
                flexDirection: 'row',
                alignItems: 'center',
            }">
                <view :style="{
                    flex: 1,
                    borderBottomWidth: 2,
                    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                }"/>
                <text class="or">OR</text>
                <view :style="{
                    flex: 1,
                    borderBottomWidth: 2,
                    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                }"/>
            </view>
            <view :style="{marginBottom: 20}"/>

            <my-button
                    text="LOGIN WITH FACEBOOK"
                    :icon="imageFacebook"
                    bg-color="#465AB1"
                    :on-click="handleClickLoginFacebook"/>
            <view :style="{marginBottom: 15}"/>

            <my-button
                    text="LOGIN WITH LINE"
                    :icon="imageLine"
                    bg-color="#00B900"
                    :on-click="handleClickLoginLine"/>
            <view :style="{marginBottom: 15}"/>

            <my-button
                    text="LOGIN WITH GOOGLE"
                    :icon="imageGoogle"
                    bg-color="#DD4B39"
                    :on-click="handleClickLoginGoogle"/>
            <view :style="{marginBottom: 25}"/>

            <view :style="{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }">
                <touchable-opacity :on-press="handleClickForgotPassword">
                    <!--<text class="action">FORGOT PASSWORD</text>-->
                </touchable-opacity>
                <touchable-opacity :on-press="handleClickSignUp">
                    <text class="action">SIGN UP</text>
                </touchable-opacity>
            </view>
            <view :style="{marginBottom: 40}"/>
        </scroll-view>

        <view :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
        }">
            <header :title="null"
                    :transparent="true"
                    :left-icon="{
                        icon: imageBack,
                        width: 24,
                        height: 18,
                        callback: handleClickBack
                    }"
                    :right-icon="{
                        icon: null,
                        width: 14,
                        height: 16.5,
                        callback: null
                    }"/>
        </view>

        <activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isLoading"/>
    </linear-gradient>
</template>

<script>
    import store from '../../store';
    import {DEBUG, DIMENSION, SCREEN_LOGIN, COLOR_PRIMARY} from '../../constants';
    import Header from '../../components/Header';
    import MyButton from '../../components/MyButton';

    import {Alert, Dimensions, Platform} from 'react-native';
    import LinearGradient from 'react-native-linear-gradient';
    import CardView from 'react-native-cardview';
    import {LoginManager, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
    import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
    import LineLogin from 'react-native-line-sdk';
    //import {LoginManager as LineLoginManager} from 'react-native-line-login';

    import imageBack from '../../../assets/images/ic_back.png';
    import imageLogo from '../../../assets/images/screen_login/ic_logo.png';
    import imageFacebook from '../../../assets/images/screen_login/ic_facebook.png';
    import imageLine from '../../../assets/images/screen_login/ic_line_2.png';
    import imageGoogle from '../../../assets/images/screen_login/ic_google.png';

    export default {
        components: {Header, MyButton, LinearGradient, CardView},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            isLoading() {
                return store.state.loggingIn;
            },
            isLoggedIn() {
                return store.state.userToken !== null;
            },
        },
        data: () => {
            return {
                DEBUG, DIMENSION, SCREEN_LOGIN, COLOR_PRIMARY,
                Dimensions,
                imageBack, imageLogo, imageFacebook, imageLine, imageGoogle,
                emailContent: DEBUG ? 'promlert3@safesafe.com' : '',
                passwordContent: DEBUG ? '12345678' : '',
                showPassword: false,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleEmailChange: function () {

            },
            handlePasswordChange: function () {

            },
            handleClickLogin: function () {
                console.log(`Email: ${this.emailContent}, Password: ${this.passwordContent}`);
                if (this.emailContent && this.passwordContent) {
                    if (this.validateEmail(this.emailContent)) {
                        store.dispatch('LOGIN', {
                            email: this.emailContent,
                            password: this.passwordContent,
                            callback: (success, message) => {
                                this.handleLoginResponse(success, message);
                            }
                        });
                    } else {
                        Alert.alert('ผิดพลาด', 'รูปแบบอีเมลไม่ถูกต้อง');
                    }
                } else {
                    Alert.alert('ผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่าน');
                }
            },
            handleClickShowHidePassword: function () {
                this.showPassword = !this.showPassword;
            },
            handleClickLoginFacebook: function () {
                const self = this;

                // Attempt a login using the Facebook login dialog,
                // asking for default permissions.
                LoginManager.logInWithPermissions(['public_profile', 'email']).then(
                    function(result) {
                        if (result.isCancelled) {
                            Alert.alert('แจ้งเตือน', 'การเข้าระบบด้วย Facebook ถูกยกเลิก');
                        } else {
                            console.log(`เข้าระบบด้วย Facebook สำเร็จ: ${result.grantedPermissions.toString()}`);
                            console.log(result);

                            self.requestFacebookProfile();
                        }
                    },
                    function(error) {
                        Alert.alert('ผิดพลาด', 'เกิดปัญหาในการเข้าระบบด้วย Facebook\n-----\n' + error);
                    }
                );
            },
            requestFacebookProfile: function () {
                const req = new GraphRequest('/me', {
                    httpMethod: 'GET',
                    version: 'v2.5',
                    parameters: { //https://developers.facebook.com/docs/graph-api/reference/user
                        fields: {
                            string : 'name,email,picture'
                        }
                    }
                }, (error, result) => {
                    if (error) {
                        Alert.alert('ผิดพลาด', 'เกิดปัญหาในการอ่านข้อมูลบัญชีผู้ใช้ Facebook\n-----\n' + error);
                        console.log(`Error fetching facebook profile: ${JSON.stringify(error)}`);
                    } else {
                        console.log(`Success fetching data: ${JSON.stringify(result)}`);

                        const {id, email, name, picture} = result;

                        store.dispatch('LOGIN_SOCIAL', {
                            formData: {
                                facebook_id: id,
                                email, name
                            },
                            callback: (success, message) => {
                                this.handleLoginResponse(success, message);
                            }
                        });
                    }
                });

                new GraphRequestManager().addRequest(req).start();
            },
            handleClickLoginLine: function () {
                const loginPromise = Platform.OS === 'android'
                    ? LineLogin.login()
                    : LineLogin.loginWithPermissions(['profile']);

                loginPromise
                    .then(async user => {
                        /*{
                            "pictureURL": "https://profile.line-scdn.net/ch/v2/p/u6409759e5ac25edddec978180b8ae04a/1356411236084",
                            "statusMessage": "3bugs OSK111",
                            "userID": "U0b50028793ec6d03f6464ce142e28907",
                            "displayName": "Promlert Lovichit"
                        }*/
                        //let msg = `ชื่อ: ${user.profile.displayName}\nข้อความสเตตัส: ${user.profile.statusMessage}`;
                        //Alert.alert('สำเร็จ', `เข้าระบบด้วย LINE สำเร็จ แต่การทำงานยังไม่สมบูรณ์ รอปรับ API หลังบ้าน!\n-----\n${msg}`);
                        console.log(JSON.stringify(user));

                        await store.dispatch('LOGIN_SOCIAL', {
                            formData: {
                                line_id: user.profile.userID,
                                email: '',
                                name: user.profile.displayName,
                            },
                            callback: (success, message) => {
                                this.handleLoginResponse(success, message);
                            }
                        });
                    })
                    .catch(err => {
                        //Alert.alert('ผิดพลาด', 'เกิดปัญหาในการเข้าระบบด้วย LINE: ' + err);
                    });

                /*LineLoginManager.login()
                    .then(user => {
                        alert(JSON.stringify(user));
                        console.log(user);
                    })
                    .catch(err => {
                        alert(JSON.stringify(err));
                        console.log(err);
                    });*/
            },
            handleClickLoginGoogle: async function () {
                //Alert.alert('Under Construction', 'ส่วนนี้อยู่ระหว่างการพัฒนา');

                try {
                    await GoogleSignin.hasPlayServices();
                    const userInfo = await GoogleSignin.signIn();

                    console.log('userInfo: ', JSON.stringify(userInfo));
                    /*
                        {
                          idToken: string,
                          serverAuthCode: string,
                          scopes: Array<string>, // on iOS this is empty array if no additional scopes are defined
                          user: {
                            email: string,
                            id: string,
                            givenName: string,
                            familyName: string,
                            photo: string, // url
                            name: string // full name
                          }
                        }
                    */

                    /*const {accessToken} = await GoogleSignin.getTokens();
                    console.log('accessToken: ', accessToken);

                    let msg = `ชื่อ: ${userInfo.user.name}\nอีเมล: ${userInfo.user.email}`;
                    Alert.alert('Alert', `เข้าระบบด้วย Google สำเร็จ แต่การทำงานยังไม่สมบูรณ์ รอปรับ API หลังบ้าน!\n-----\n${msg}`);
                    return;*/

                    await store.dispatch('LOGIN_SOCIAL', {
                        formData: {
                            google_id: userInfo.user.id,
                            email: userInfo.user.email,
                            name: userInfo.user.name,
                        },
                        callback: (success, message) => {
                            this.handleLoginResponse(success, message);
                        }
                    });
                } catch (error) {
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        Alert.alert('แจ้งเตือน', 'การเข้าระบบด้วย Google ถูกยกเลิก');
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                        // operation (e.g. sign in) is in progress already
                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        Alert.alert('ผิดพลาด', 'Google Play Services ไม่พร้อมใช้งานหรือเป็นรุ่นเก่าเกินไป');
                    } else {
                        Alert.alert('ผิดพลาด', 'เกิดปัญหาที่ไม่ทราบสาเหตุในการเข้าระบบด้วย Google:\n-----\n' + error);
                    }
                }
            },
            handleLoginResponse: function (success, message) {
                if (success) {
                    Alert.alert(
                        'สำเร็จ',
                        'เข้าสู่ระบบสำเร็จ',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (store.state.userToken) {
                                        store.dispatch('GET_PROFILE', {
                                            callback: (success, message) => { // ไม่ต้องสนใจว่าจะ get profile สำเร็จหรือเปล่า
                                                this.navigation.goBack();

                                                const nextScreen = this.navigation.getParam('forward');
                                                if (nextScreen) {
                                                    const params = this.navigation.getParam('params');
                                                    this.navigation.navigate(nextScreen, params);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        ],
                        {cancelable: false}
                    );
                } else {
                    Alert.alert('ผิดพลาด', message);
                }
            },
            handleClickForgotPassword: function () {
                this.navigation.navigate('ForgotPassword');
            },
            handleClickSignUp: function () {
                const nextScreen = this.navigation.getParam('forward');
                this.navigation.navigate('Register', {
                    forward: nextScreen
                });
            },
            validateEmail: function (value) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
        },
        created: function () {
            //configure needs to be called only once, after your app starts. In the native layer, this is a synchronous call.
            GoogleSignin.configure();
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .content-container {
        flex: 1;
        border-width: 0;
        border-color: yellow;
    }

    .logo {
        width: 100%;
        height: 90;
    }

    .title {
        text-align: center;
        font-family: DBHeavent;
        font-size: 28;
        color: white;
    }

    .or {
        text-align: center;
        font-family: DBHeavent;
        font-size: 22;
        color: white;
        margin-left: 50;
        margin-right: 50;
    }

    .action {
        font-family: DBHeavent;
        font-size: 22;
        color: rgba(255, 255, 255, 0.3);
        margin-left: 0;
        margin-right: 0;
    }

    .action-show {
        font-family: DBHeavent;
        font-size: 16;
        color: white;
        padding-left: 8;
        padding-right: 8;
        padding-top: 5;
        padding-bottom: 5;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .text-input {
        font-family: DBHeavent;
        font-size: 22;
        color: white;
        padding-top: 12;
        padding-bottom: 12;
        border-bottom-width: 0;
        border-bottom-color: #adadad;
    }

    .progress {
        position: absolute;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: yellow;
    }
</style>
