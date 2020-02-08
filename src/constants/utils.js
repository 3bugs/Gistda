import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export async function requestAndroidPermissions({permission, title, requestMessage, denyMessage, callback}) {
    try {
        const granted = await PermissionsAndroid.request(
            permission,
            {
                title: this.APP_NAME,
                message: requestMessage,
                buttonNegative: 'ยกเลิก',
                buttonPositive: 'ตกลง',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            callback(true, null);
        } else {
            callback(false, denyMessage);
        }
    } catch (err) {
        callback(false, err);
    }
}

export function getCurrentLocation({callback}) {
    if (Platform.OS === 'android') { // android
        requestAndroidPermissions({
            permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            title: this.APP_NAME,
            requestMessage: 'แอปจำเป็นต้องขอข้อมูลตำแหน่งปัจจุบันของคุณ',
            denyMessage: 'แอปไม่ได้รับอนุญาตจากผู้ใช้ จึงไม่สามารถตรวจสอบตำแหน่งปัจจุบันได้',
            callback: (success, message) => {
                if (success) {
                    doGetCurrentLocation(callback);
                } else {
                    Alert.alert('ผิดพลาด', message);
                }
            }
        });
    } else { // ios
        doGetCurrentLocation(callback);
    }
}

function doGetCurrentLocation(callback) {
    try {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords);

                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.log(`Error getting location: ${error.message}`);
                Alert.alert('ผิดพลาด', 'เกิดปัญหาในการตรวจสอบตำแหน่งปัจจุบันของคุณ');
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    } catch (e) {
        console.log('Error get current position: ' + e);
        Alert.alert('ผิดพลาด', 'เกิดปัญหาในการตรวจสอบตำแหน่งปัจจุบันของคุณ: ' + e);
    }
}