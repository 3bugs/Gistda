<template>
    <view class="container">
        <header title="ข้อมูลจุดแจ้งเหตุ"
                :left-icon="{
                    icon: imageBack,
                    width: 24,
                    height: 18,
                    callback: handleClickBack
                }"
                :right-icon="{
                    icon: null,
                    width: 22,
                    height: 22,
                    callback: null
                }"/>
        <view class="content-container">
            <view :style="{
                    height: DIMENSION.horizontal_margin + 10,
                    backgroundColor: COLOR_PRIMARY[province],
                }">
            </view>

            <view :style="{
                position: 'absolute',
                width: '100%', height: '100%',
            }">
                <view :style="{
                    backgroundColor: 'white',
                    borderTopLeftRadius: DIMENSION.horizontal_margin * 1.5,
                    borderTopRightRadius: DIMENSION.horizontal_margin * 1.5,
                }">
                    <view :style="{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                marginTop: DIMENSION.horizontal_margin,
                                marginBottom: 15,
                                marginLeft: DIMENSION.horizontal_margin,
                                marginRight: DIMENSION.horizontal_margin,
                                borderWidth: 0,
                                borderColor: 'red',
                          }">
                        <view :style="{
                            flex: 1,
                        }">
                            <text class="title">เพิ่มข้อมูลจุดเกิดเหตุ</text>
                            <text :style="{
                                fontFamily: 'DBHeaventt-Light',
                                fontSize: 22,
                                color: '#626B80',
                                borderWidth: 0,
                                borderColor: 'blue',
                            }">กรุณากรอกข้อมูลให้ครบ
                            </text>
                        </view>
                        <touchable-opacity
                                :on-press="handleClickClose"
                                :style="{
                                    marginTop: 10,
                                }">
                            <image :source="imageClose"
                                   :style="{
                                    width: 24,
                                    height: 24,
                                    padding: 10,
                                }"/>
                        </touchable-opacity>
                    </view>
                    <view :style="{
                        marginTop: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#cccccc'
                    }"/>
                </view>
                <scroll-view
                        class="content"
                        :style="{
                            flex: 1,
                            backgroundColor: 'white',
                            paddingLeft: DIMENSION.horizontal_margin,
                            paddingRight: DIMENSION.horizontal_margin,
                        }">
                    <view :style="{marginBottom: 0}"/>

                    <text class="label">หมวดหมู่ของเหตุ</text>
                    <picker :selected-value="incidentCategoryValue"
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

                    <floating-label-input
                            :name="INCIDENT_FORM_DATA.KEY_DETAILS"
                            label="รายละเอียด"
                            :marginTop="10"
                            :multiline="true"
                            :editable="true"/>

                    <text class="label">พิกัดจุดเกิดเหตุ</text>
                    <map-view
                            ref="mapView"
                            :style="{
                                height: (Dimensions.get('window').width - (2 * DIMENSION.horizontal_margin)) * 0.67,
                                marginTop: 15,
                            }"
                            :initial-region="{
                                latitude: (PROVINCE_DIMENSION[province].minLatitude + PROVINCE_DIMENSION[province].maxLatitude) / 2,
                                longitude: (PROVINCE_DIMENSION[province].minLongitude + PROVINCE_DIMENSION[province].maxLongitude) / 2,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }">

                    </map-view>

                    <floating-label-input
                            :name="INCIDENT_FORM_DATA.KEY_PROVINCE"
                            label="จังหวัด"
                            :marginTop="25"
                            :editable="false"/>

                    <!--<floating-label-input name="district" label="อำเภอ" :marginTop="25"/>-->
                    <!--<floating-label-input name="subDistrict" label="ตำบล" :marginTop="25"/>-->

                    <text class="label">อำเภอ</text>
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
                                label="-- เลือกอำเภอ --"
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
                                label="-- เลือกตำบล --"
                                :value="-1"/>
                        <picker-item
                                v-for="(item, index) in subDistricts"
                                :label="item"
                                :value="index"/>
                    </picker>

                    <floating-label-input
                            :name="INCIDENT_FORM_DATA.KEY_REPORTER"
                            label="ผู้แจ้ง"
                            :marginTop="10"
                            :editable="false"/>
                    <floating-label-input
                            :name="INCIDENT_FORM_DATA.KEY_EMAIL"
                            label="อีเมล"
                            :marginTop="25"
                            :editable="true"/>
                    <floating-label-input
                            :name="INCIDENT_FORM_DATA.KEY_PHONE"
                            label="เบอร์โทร"
                            :marginTop="25"
                            :editable="true"/>

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
                                   :source="{ uri: `data:image/jpeg;base64,${data}`}"/>
                        </touchable-opacity>
                    </view>

                    <view :style="{marginBottom: 20}"/>
                </scroll-view>
            </view>
        </view>

        <view>
            <dialog-container :visible="showImageDialog"
                              :on-backdrop-press="() => {showImageDialog = false}">
                <view :style="{alignItems: 'center'}">
                    <image :style="{
                                width: 200,
                                height: 200,
                                margin: 5,
                            }"
                           :source="{uri: `data:image/jpeg;base64,${selectedImageData}`}"
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
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, PROVINCE_NAME_TH, DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, INCIDENT_FORM_DATA, PROVINCE_DIMENSION} from '../../constants';
    import {DISTRICT_DATA} from '../../constants/district';
    import Header from '../../components/Header';
    import FloatingLabelInput from '../../components/FloatingLabelInput';

    import {Dimensions, Picker} from 'react-native';
    import {StyleSheet} from 'react-native';
    import CardView from 'react-native-cardview';
    import ImagePicker from 'react-native-image-picker';
    import ImageResizer from 'react-native-image-resizer';
    import ImgToBase64 from 'react-native-image-base64';
    import Dialog from "react-native-dialog";
    import MapView from 'react-native-maps';

    import imageBack from '../../../assets/images/ic_back.png';
    import imageClose from '../../../assets/images/ic_close.png';
    import imageAdd from '../../../assets/images/ic_add.png';

    const THUMB_IMAGE_SIZE = 100;

    export default {
        components: {
            Header, CardView, Picker, PickerItem: Picker.Item,
            ImagePicker, ImageResizer, ImgToBase64, FloatingLabelInput,
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
            }
        },
        data: () => {
            return {
                DEBUG, PROVINCE_NAME_TH, DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
                DISTRICT_DATA, INCIDENT_FORM_DATA, PROVINCE_DIMENSION,
                Dimensions, StyleSheet,
                imageBack, imageClose, imageAdd,
                incidentCategories: [
                    '-- เลือกหมวดหมู่ของเหตุ --',
                    'อุบัติเหตุ', 'รถเสีย', 'การชุมนุม', 'คำเตือน', 'โรคระบาด', 'สุขลักษณะสถานที่จำหน่ายอาหาร', 'อื่นๆ'
                ],
                THUMB_IMAGE_SIZE,
                selectedImageIndex: null,
                showImageDialog: false,
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickClose: function () {
                //todo:
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
                this.$refs['mapView'].animateToRegion({
                    latitude: 13.7563,
                    longitude: 100.5018,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });

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
                                        imageData: base64String,
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
        },
        created: function () {
            store.dispatch('SET_INCIDENT_FORM_DATA', {
                formData: {
                    [INCIDENT_FORM_DATA.KEY_PROVINCE]: this.PROVINCE_NAME_TH[this.province],
                },
            });
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
        border-color: red;
    }

    .content {

    }

    .cover-image {
        margin-bottom: 8;
    }

    .date {
        font-family: DBHeavent;
        font-size: 22;
        color: #aaaaaa;
        margin-bottom: 5;
    }

    .title {
        font-family: DBHeavent-Med;
        font-size: 32;
        color: #212529;
        margin-bottom: 0;
        border-width: 0;
        border-color: red;
    }

    .body {
        font-family: DBHeavent;
        font-size: 22;
        color: #333333;
        margin-bottom: 10;
    }

    .label {
        font-family: DBHeavent;
        font-size: 22;
        color: #1665D8;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 25;
        margin-bottom: 0;
    }
</style>