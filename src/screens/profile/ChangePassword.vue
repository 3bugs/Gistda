<template>
    <view class="container">
        <form-header
                title="เปลี่ยนรหัสผ่าน"
                header-text="เปลี่ยนรหัสผ่าน"
                sub-header-text="สำหรับใช้งาน"
                button-text="บันทึก"
                :on-click-back="handleClickBack"
                :on-click-close="handleClickClose"
                :on-click-button="handleClickButton">
            <view>
                <my-text-input
                        label="รหัสผ่านเดิม"
                        name="oldPassword"
                        keyboard-type="default"
                        :form-data="formData"
                        :secure="true"
                        :margin-top="25"
                        :editable="true"
                        :not-allow-space="true"/>
                <my-text-input
                        label="รหัสผ่านใหม่"
                        name="newPassword"
                        keyboard-type="default"
                        :form-data="formData"
                        :secure="true"
                        :margin-top="25"
                        :margin-bottom="15"
                        :editable="true"
                        :not-allow-space="true"/>
                <my-text-input
                        label="รหัสผ่านใหม่อีกครั้ง"
                        name="confirmNewPassword"
                        keyboard-type="default"
                        :form-data="formData"
                        :secure="true"
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
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
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
                                this.formData.oldPassword = '';
                                this.formData.newPassword = '';
                                this.formData.confirmNewPassword = '';
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
                    store.dispatch('CHANGE_PASSWORD', {
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
                    });
                }
            },
            isFormValid: function () {
                let valid = true;
                let reason = '';

                this.formData.oldPassword = this.formData.oldPassword.trim();
                this.formData.newPassword = this.formData.newPassword.trim();
                this.formData.confirmNewPassword = this.formData.confirmNewPassword.trim();

                if (this.formData.oldPassword.length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกรหัสผ่านเดิม\n';
                }

                if (this.formData.newPassword.length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกรหัสผ่านใหม่\n';
                } else if (this.formData.newPassword !== this.formData.confirmNewPassword) {
                    valid = false;
                    reason += '- ต้องกรอกรหัสผ่านใหม่อีกครั้งให้ตรงกัน\n';
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