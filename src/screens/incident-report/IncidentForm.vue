<template>
    <view class="container">
        <form-header
                :title="formType === 0 ? 'ข้อมูลจุดแจ้งเหตุ' : 'ข้อมูลร้านอาหารปลอดภัย'"
                :header-text="formType === 0 ? 'เพิ่มข้อมูลจุดเกิดเหตุ' : 'เพิ่มข้อมูลร้านอาหารปลอดภัย'"
                sub-header-text="กรุณากรอกข้อมูลให้ครบ"
                :button-text="null"
                :on-click-back="handleClickBack"
                :on-click-close="handleClickClose">
            <view>
                <text v-if="formType === 0"
                      class="label"
                      :style="{
                            color: FORM.labelTextColor[province]
                      }">หมวดหมู่ของเหตุ</text>
                <picker v-if="formType === 0"
                        :selected-value="incidentCategoryValue"
                        :on-value-change="handleIncidentCategoryChange"
                        :item-style="{
                            fontFamily: 'DBHeavent',
                            fontSize: 22,
                            color: '#666666',
                            padding: 0,
                            margin: 0,
                        }">
                    <picker-item
                            v-for="(item, index) in incidentCategories"
                            :label="item"
                            :value="index"/>
                </picker>

                <incident-form-text-input
                        :name="INCIDENT_FORM_DATA.KEY_DETAILS"
                        label="รายละเอียด"
                        :margin-top="formType === 0 ? 10 : 25"
                        :multiline="true"
                        :editable="true"/>

                <text class="label"
                      :style="{
                            color: FORM.labelTextColor[province]
                      }">{{formType === 0 ? 'พิกัดจุดเกิดเหตุ' : 'พิกัดร้านอาหาร'}}</text>
                <view :style="{
                    height: (Dimensions.get('window').width - (2 * DIMENSION.horizontal_margin)) * 0.67,
                    marginTop: 15,
                }">
                    <map-view
                            :provider="PROVIDER_GOOGLE"
                            ref="mapView"
                            :style="{
                                width: '100%',
                                height: '100%',
                            }"
                            :initial-region="{
                                latitude: (PROVINCE_DIMENSION[province].minLatitude + PROVINCE_DIMENSION[province].maxLatitude) / 2,
                                longitude: (PROVINCE_DIMENSION[province].minLongitude + PROVINCE_DIMENSION[province].maxLongitude) / 2,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }"
                            :on-region-change-complete="handleRegionChange">

                    </map-view>

                    <view :style="{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            marginLeft: -20,
                            marginTop: -20
                        }">
                        <image :style="{
                                    width: 40,
                                    height: 40,
                                }"
                               :source="imageMarker"
                               resize-mode="contain"/>
                    </view>
                </view>

                <!--<incident-form-text-input
                        :name="INCIDENT_FORM_DATA.KEY_ADDRESS"
                        label="ที่อยู่"
                        :margin-top="25"
                        :multiline="true"
                        :editable="true"/>-->

                <incident-form-text-input
                        :name="INCIDENT_FORM_DATA.KEY_PROVINCE"
                        label="จังหวัด"
                        :margin-top="25"
                        :editable="false"/>

                <!--<incident-form-text-input name="district" label="อำเภอ" :marginTop="25"/>-->
                <!--<incident-form-text-input name="subDistrict" label="ตำบล" :marginTop="25"/>-->

                <!--<text class="label">อำเภอ</text>
                <picker :selected-value="districtValue"
                        :on-value-change="handleDistrictChange"
                        :item-style="{
                            fontFamily: 'DBHeavent',
                            fontSize: 22,
                            color: '#666666',
                            padding: 0,
                            margin: 0,
                        }">
                    <picker-item
                            label="&#45;&#45; เลือกอำเภอ &#45;&#45;"
                            :value="-1"/>
                    <picker-item
                            v-for="(item, index) in DISTRICT_DATA[province]"
                            :label="item.district"
                            :value="index"/>
                </picker>

                <text class="label" :style="{marginTop: 10}">ตำบล</text>
                <picker :selected-value="subDistrictValue"
                        :on-value-change="handleSubDistrictChange"
                        :item-style="{
                            fontFamily: 'DBHeavent',
                            fontSize: 22,
                            color: '#666666',
                            padding: 0,
                            margin: 0,
                        }">
                    <picker-item
                            label="&#45;&#45; เลือกตำบล &#45;&#45;"
                            :value="-1"/>
                    <picker-item
                            v-for="(item, index) in subDistricts"
                            :label="item"
                            :value="index"/>
                </picker>-->

                <incident-form-text-input
                        :name="INCIDENT_FORM_DATA.KEY_REPORTER"
                        label="ผู้แจ้ง"
                        :margin-top_old="10"
                        :margin-top="25"
                        :editable="true"/>
                <incident-form-text-input
                        :name="INCIDENT_FORM_DATA.KEY_EMAIL"
                        label="อีเมล"
                        :margin-top="25"
                        :editable="true"
                        keyboard-type="email-address"/>
                <incident-form-text-input
                        :name="INCIDENT_FORM_DATA.KEY_PHONE"
                        label="เบอร์โทร"
                        :margin-top="25"
                        :editable="true"
                        keyboard-type="phone-pad"/>

                <text :style="{
                        fontFamily: 'DBHeaventt-Light',
                        fontSize: 22,
                        color: '#626B80',
                        marginTop: 25,
                        marginBottom: 6,
                        borderWidth: 0,
                        borderColor: 'blue',
                    }">อัพโหลดรูปภาพ
                </text>

                <view :style="{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }">
                    <touchable-opacity
                            :on-press="handleClickAddImage">
                        <view :style="{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: THUMB_IMAGE_SIZE,
                                height: THUMB_IMAGE_SIZE,
                                marginTop: 8, marginRight: 8,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                borderColor: '#999999',
                                borderRadius: 10,
                            }">
                            <image :source="imageAdd"
                                   :style="{
                                            width: 19,
                                            height: 20,
                                        }"/>
                        </view>
                    </touchable-opacity>

                    <touchable-opacity
                            v-for="(data, index) in incidentImages"
                            :on-press="() => handleClickDeleteImage(index)">
                        <image :style="{
                                    width: THUMB_IMAGE_SIZE,
                                    height: THUMB_IMAGE_SIZE,
                                    marginTop: 8, marginRight: 8,
                                    borderRadius: 10,
                               }"
                               :source="{ uri: `${data}`}"/>
                    </touchable-opacity>
                </view>

                <view :style="{marginBottom: 25}"/>

                <my-button
                        :text="formType === 0 ? 'แจ้งเหตุ' : 'ส่งข้อมูล'"
                        :bg-color="FORM.buttonColor[province]"
                        :on-click="handleClickSubmitButton"/>

                <view :style="{marginBottom: 25}"/>
            </view>
        </form-header>

        <view>
            <dialog-container :visible="showImageDialog"
                              :on-backdrop-press="() => {showImageDialog = false}">
                <view :style="{alignItems: 'center'}">
                    <image :style="{
                                width: 200,
                                height: 200,
                                margin: 5,
                            }"
                           :source="{uri: `${selectedImageData}`}"
                           resize-mode="contain"/>
                </view>
                <dialog-button
                        label="ลบรูป"
                        :on-press="deleteImage"
                        :style="{
                            fontFamily: 'DBHeavent-Med',
                            fontSize: 22,
                            color: COLOR_PRIMARY_DARK[province],
                        }"/>
                <dialog-button
                        label="ปิด"
                        :on-press="() => {showImageDialog = false}"
                        :style="{
                            fontFamily: 'DBHeavent-Med',
                            fontSize: 22,
                            color: COLOR_PRIMARY_DARK[province],
                        }"/>
            </dialog-container>
        </view>

        <!--<activity-indicator
                class="progress"
                size="large"
                :color="COLOR_PRIMARY[province]"
                v-if="isSubmitting"/>-->
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, FORM, PROVINCE_NAME_TH, DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, INCIDENT_FORM_DATA, PROVINCE_DIMENSION} from '../../constants';
    import {DISTRICT_DATA} from '../../constants/district';
    import FormHeader from '../../components/FormHeader';
    import IncidentFormTextInput from '../../components/IncidentFormTextInput';
    import MyButton from '../../components/MyButton';
    import {requestAndroidPermissions, getCurrentLocation} from '../../constants/utils';
    import {doGetAddressFromCoord} from '../../store/fetch';

    import {Alert, Platform, PermissionsAndroid, Dimensions, Picker} from 'react-native';
    import CardView from 'react-native-cardview';
    import ImagePicker from 'react-native-image-picker';
    import ImageResizer from 'react-native-image-resizer';
    import ImgToBase64 from 'react-native-image-base64';
    import Dialog from "react-native-dialog";
    import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
    import Geolocation from 'react-native-geolocation-service';

    import imageBack from '../../../assets/images/ic_back.png';
    import imageClose from '../../../assets/images/ic_close.png';
    import imageAdd from '../../../assets/images/ic_add.png';
    import imageMarker from '../../../assets/images/ic_marker.png';

    const THUMB_IMAGE_SIZE = 100;

    export default {
        components: {
            FormHeader, CardView, Picker, PickerItem: Picker.Item,
            ImagePicker, ImageResizer, ImgToBase64, IncidentFormTextInput, MyButton,
            DialogContainer: Dialog.Container,
            DialogTitle: Dialog.Title,
            DialogButton: Dialog.Button,
            DialogDescription: Dialog.Description,
            MapView,
        },
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            incidentCategoryValue() {
                /*const incidentFormData = store.state.incidentFormData;
                if (incidentFormData == null) {
                    console.log('AAA');
                    return 0;
                } else {
                    console.log('BBB');
                    return incidentFormData[this.KEY_INCIDENT_CATEGORY] != null
                        ? incidentFormData[this.KEY_INCIDENT_CATEGORY]
                        : 0;
                }*/

                return store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY];
            },
            districtValue() {
                /*const incidentFormData = store.state.incidentFormData;
                if (incidentFormData == null) {
                    console.log('CCC');
                    return -1;
                } else {
                    console.log('DDD');
                    return incidentFormData[this.KEY_DISTRICT] != null
                        ? incidentFormData[this.KEY_DISTRICT]
                        : -1;
                }*/

                return store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_DISTRICT];
            },
            subDistrictValue() {
                /*const incidentFormData = store.state.incidentFormData;
                if (!incidentFormData) {
                    return 0;
                } else {
                    return incidentFormData[this.KEY_SUB_DISTRICT]
                        ? incidentFormData[this.KEY_SUB_DISTRICT]
                        : 0;
                }*/

                return store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_SUB_DISTRICT];
            },
            incidentImages() {
                return store.state.incidentImages;
            },
            selectedImageData() {
                return this.selectedImageIndex != null
                    ? store.state.incidentImages[this.selectedImageIndex]
                    : null;
            },
            subDistricts() {
                return this.districtValue === -1
                    ? []
                    : this.DISTRICT_DATA[this.province][this.districtValue].subDistricts;
            },
            isSubmitting() {
                return store.state.submittingFormData;
            }
        },
        data: () => {
            return {
                PROVIDER_GOOGLE,
                DEBUG, PROVINCE_NAME_TH, DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
                DISTRICT_DATA, INCIDENT_FORM_DATA, PROVINCE_DIMENSION, FORM,
                Dimensions,
                imageBack, imageClose, imageAdd, imageMarker,
                incidentCategories: [
                    '-- เลือกหมวดหมู่ของเหตุ --',
                    'อุบัติเหตุ', 'รถเสีย', 'การชุมนุม', 'คำเตือน', 'โรคระบาด', 'สุขลักษณะสถานที่จำหน่ายอาหาร', 'อื่นๆ'
                ],
                THUMB_IMAGE_SIZE,
                selectedImageIndex: null,
                showImageDialog: false,
                formType: 0, // 0 = แจ้งเหตุ, 1 = ร้านอาหารปลอดภัย
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
                                store.dispatch('CLEAR_INCIDENT_FORM_DATA_AND_IMAGES', {
                                    formType: this.formType,
                                });
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
            handleIncidentCategoryChange: function (value, index) {
                store.dispatch('SET_INCIDENT_FORM_DATA', {
                    formData: {
                        [INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY]: value,
                    },
                });
            },
            handleDistrictChange: function (value, index) {
                store.dispatch('SET_INCIDENT_FORM_DATA', {
                    formData: {
                        [INCIDENT_FORM_DATA.KEY_DISTRICT]: value,
                    },
                });
            },
            handleSubDistrictChange: function (value, index) {
                store.dispatch('SET_INCIDENT_FORM_DATA', {
                    formData: {
                        [INCIDENT_FORM_DATA.KEY_SUB_DISTRICT]: value,
                    },
                });
            },
            handleClickAddImage: function () {
                const options = {
                    title: 'ถ่ายรูปหรือเลือกรูปภาพ',
                    takePhotoButtonTitle: 'ถ่ายรูป...',
                    chooseFromLibraryButtonTitle: 'เลือกจากคลังภาพ...',
                    cancelButtonTitle: 'ยกเลิก',
                    customButtons: [],
                    storageOptions: {
                        skipBackup: true,
                        path: 'images',
                    },
                };

                ImagePicker.showImagePicker(options, (response) => {
                    console.log('Response = ', response);

                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    } else {
                        // You can also display the image using data:
                        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                        //this.formData.pickedImages.push(response);
                        //return;

                        ImageResizer.createResizedImage(response.uri, 1000, 1000, 'JPEG', 80).then(response => {
                            // response.uri is the URI of the new image that can now be displayed, uploaded...
                            // response.path is the path of the new image
                            // response.name is the name of the new image with the extension
                            // response.size is the size of the new image
                            console.log('*** RESIZED IMAGE ***');
                            console.log(`URI: ${response.uri}\nPath: ${response.path}\nName: ${response.name}\nSize: ${response.size}`);

                            ImgToBase64.getBase64String(response.uri)
                                .then(base64String => {
                                    console.log(`Base64 length: ${base64String.length}`);
                                    store.dispatch('ADD_INCIDENT_IMAGE', {
                                        imageData: `data:image/jpeg;base64,${base64String}`,
                                    });
                                })
                                .catch(err => {
                                    console.log('Error converting image to Base64: ' + err)
                                });
                        }).catch(err => {
                            console.log('Error resizing image: ' + err);
                        });
                    }
                });
            },
            handleClickDeleteImage: function (index) {
                console.log(`handleClickDeleteImage(${index})`);

                this.selectedImageIndex = index;
                this.showImageDialog = true;
            },
            deleteImage: function () {
                console.log(`deleteImage(${this.selectedImageIndex})`);

                store.dispatch('DELETE_INCIDENT_IMAGE', {
                    imageIndex: this.selectedImageIndex,
                });
                this.showImageDialog = false;
            },
            handleRegionChange: async function (region) {
                await store.dispatch('SET_INCIDENT_FORM_DATA', {
                    formData: {
                        [INCIDENT_FORM_DATA.KEY_LATITUDE]: region.latitude,
                        [INCIDENT_FORM_DATA.KEY_LONGITUDE]: region.longitude,
                    },
                });

                const apiResult = await doGetAddressFromCoord(region.latitude, region.longitude);
                if (apiResult.success) {
                    const address = apiResult.data.address;
                    await store.dispatch('SET_INCIDENT_FORM_DATA', {
                        formData: {
                            [INCIDENT_FORM_DATA.KEY_ADDRESS]: address,
                        },
                    });
                }
            },
            handleClickSubmitButton: function () {
                if (this.isSubmitting) return;

                if (this.isFormValid()) {
                    store.dispatch('SUBMIT_INCIDENT_FORM_DATA', {
                        callback: (success, message) => {
                            if (success) {
                                Alert.alert(
                                    'สำเร็จ',
                                    'ส่งข้อมูลสำเร็จ',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                store.dispatch('CLEAR_INCIDENT_FORM_DATA_AND_IMAGES', {});
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
                        },
                    });
                }
            },
            isFormValid: function () {
                let valid = true;
                let reason = '';

                const incidentCategory = store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY];
                if (incidentCategory === 0) {
                    valid = false;
                    reason += '- ต้องเลือกหมวดหมู่ของเหตุ\n';
                }

                const details = store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_DETAILS];
                if (!details || details.trim().length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกรายละเอียด\n';
                }

                const reporter = store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_REPORTER];
                if (!reporter || reporter.trim().length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกชื่อผู้แจ้ง\n';
                }

                const email = store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_EMAIL];
                if (!email || email.trim().length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกอีเมลของผู้แจ้ง\n';
                }

                const phone = store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_PHONE];
                if (!phone || phone.trim().length === 0) {
                    valid = false;
                    reason += '- ต้องกรอกเบอร์โทรของผู้แจ้ง\n';
                } else if (phone.replace(/\D/g,'').length < 9) {
                    valid = false;
                    reason += '- เบอร์โทรต้องเป็นตัวเลข 9 หลักขึ้นไป\n';
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
            }
        },
        created: function () {
            store.dispatch('SET_INCIDENT_FORM_DATA', {
                formData: {
                    [INCIDENT_FORM_DATA.KEY_REPORTER]: store.state.userDisplayName,
                    [INCIDENT_FORM_DATA.KEY_EMAIL]: store.state.userEmail,
                    [INCIDENT_FORM_DATA.KEY_PHONE]: store.state.userPhone,
                    [INCIDENT_FORM_DATA.KEY_PROVINCE]: this.PROVINCE_NAME_TH[this.province],
                },
            });

            const formType = this.navigation.getParam('formType');
            if (formType === 1) {
                this.handleIncidentCategoryChange(8);
            } else if (formType === 0
                && store.state.incidentFormData[INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY] === 8) {
                this.handleIncidentCategoryChange(0);
            }
            this.formType = formType;

            getCurrentLocation({
                callback: async coord => {
                    try {
                        this.$refs['mapView'].animateToRegion({
                            latitude: coord.latitude,
                            longitude: coord.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        });
                    } catch (e) {
                        console.log('Error animate to region: ' + e);
                    }
                }
            });
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .label {
        font-family: DBHeavent;
        font-size: 22;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 25;
        margin-bottom: 0;
    }
</style>
