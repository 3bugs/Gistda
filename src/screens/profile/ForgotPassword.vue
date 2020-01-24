<template>
    <view class="container">
        <form-header
                title="ลืมรหัสผ่าน"
                header-text="ลืมรหัสผ่าน"
                sub-header-text="ระบบจะให้คุณตั้งรหัสผ่านใหม่อีกครั้ง"
                button-text="ต่อไป"
                :on-click-back="handleClickBack"
                :on-click-close="handleClickClose"
                :on-click-button="handleClickButton">
            <view>
                <my-text-input
                        label="อีเมลที่ใช้สมัคร"
                        name="email"
                        keyboard-type="email-address"
                        :form-data="formData"
                        :margin-top="25"
                        :margin-bottom="15"
                        :editable="true"
                        :not-allow-space="true"/>
            </view>
        </form-header>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';
    import FormHeader from '../../components/FormHeader';
    import MyTextInput from '../../components/MyTextInput';

    import {Dimensions, Alert} from 'react-native';

    export default {
        components: {FormHeader, MyTextInput},
        props: {
            navigation: {
                type: Object
            },
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
                formData: {
                    email: '',
                },
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickClose: function () {
                Alert.alert(
                    'ล้างข้อมูล',
                    'ยืนยันล้างข้อมูลที่กรอก?',
                    [
                        {
                            text: 'ล้างข้อมูล',
                            onPress: () => {
                                this.formData.email = '';
                            }
                        },
                        {
                            text: 'ยกเลิก',
                            onPress: () => {
                            },
                            style: 'cancel'
                        },
                    ],
                    {cancelable: true}
                );
            },
            handleClickButton: function () {
                if (this.isFormValid()) {
                    /*store.dispatch('CHANGE_PASSWORD', {
                        formData: this.formData,
                        callback: (success, message) => {
                            if (success) {
                                Alert.alert(
                                    'สำเร็จ',
                                    'เปลี่ยนรหัสผ่านสำเร็จ',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                this.navigation.goBack();
                                            }
                                        }
                                    ],
                                    {cancelable: false}
                                );
                            } else {
                                Alert.alert(
                                    'ผิดพลาด',
                                    message
                                );
                            }
                        }
                    });*/
                }
            },
            isFormValid: function () {
                let valid = true;
                let reason = '';

                this.formData.email = this.formData.email.trim();

                if (this.formData.email.length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกอีเมล\n';
                } else if (!this.validateEmail(this.formData.email)) {
                    valid = false;
                    reason += '- รูปแบบอีเมลไม่ถูกต้อง\n';
                }

                if (!valid) {
                    Alert.alert(
                        'ผิดพลาด',
                        `กรุณากรอกข้อมูลให้ครบ\n\n${reason}`,
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                }
                            }
                        ],
                        {cancelable: false}
                    );
                }

                return valid;
            },
            validateEmail: function (value) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>