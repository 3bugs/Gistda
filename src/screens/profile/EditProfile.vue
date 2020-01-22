<template>
    <view class="container">
        <form-header
                title="แก้ไขข้อมูลส่วนตัว"
                header-text="แก้ไขข้อมูลส่วนตัว"
                sub-header-text="สำหรับใช้งาน"
                button-text="บันทึก"
                :on-click-back="handleClickBack"
                :on-click-close="handleClickClose"
                :on-click-button="handleClickButton">
            <view>
                <my-text-input
                        label="ชื่อ นามสกุล"
                        name="name"
                        keyboard-type="default"
                        :form-data="formData"
                        :margin-top="25"
                        :editable="true"/>
                <my-text-input
                        label="เบอร์โทร"
                        name="phone"
                        keyboard-type="phone-pad"
                        :form-data="formData"
                        :margin-top="25"
                        :editable="true"/>
                <my-text-input
                        label="อีเมล"
                        name="email"
                        keyboard-type="email-address"
                        :form-data="formData"
                        :margin-top="25"
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
                    name: store.state.userDisplayName,
                    phone: store.state.userPhone,
                    email: store.state.userEmail,
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
                                this.formData.name = '';
                                this.formData.phone = '';
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
                    store.dispatch('UPDATE_PROFILE', {
                        formData: this.formData,
                        callback: (success, message) => {
                            if (success) {
                                Alert.alert(
                                    'สำเร็จ',
                                    'แก้ไขข้อมูลส่วนตัวสำเร็จ',
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
                    });
                }
            },
            isFormValid: function () {
                let valid = true;
                let reason = '';

                this.formData.name = this.formData.name.trim();
                this.formData.phone = this.formData.phone.trim();
                this.formData.email = this.formData.email.trim();

                if (this.formData.name.length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกชื่อ นามสกุล\n';
                }

                if (this.formData.phone.length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกเบอร์โทร\n';
                }

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