import {PermissionsAndroid} from 'react-native';

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