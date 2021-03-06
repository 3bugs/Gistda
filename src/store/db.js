import {AsyncStorage} from "react-native";

async function saveData() {
    try {
        await AsyncStorage.setItem('_key_', '_value_');
    } catch (error) {
        // Error saving data
    }
}

async function loadData() {
    try {
        const value = await AsyncStorage.getItem('_key_');
        if (value !== null) {
            // Our data is fetched successfully
            console.log(value);
        }
    } catch (error) {
        // Error retrieving data
    }
}

const KEY_USER = 'user';

export async function setUser(user) {
    try {
        await AsyncStorage.setItem(KEY_USER, JSON.stringify(user));
        console.log(`Saving user: ${JSON.stringify(user)}`);

        return true;
    } catch (error) {
        return false;
    }
}

export async function getUser() {
    try {
        const userJson = await AsyncStorage.getItem(KEY_USER);
        if (userJson == null) {
            console.log(`Loading user: NULL`);
            return null;
        }
        const user = JSON.parse(userJson);
        console.log(`Loading user: ${userJson}`);

        return user;
    } catch (error) {
        console.log(`Loading user: NULL (error)`);
        return null;
    }
}

export async function setLocalCategoryData(province, category, data) {
    const KEY = _getCategoryDataMapKey(province, category);

    let categoryData = await getLocalCategoryData(province, category);
    if (!categoryData) {
        categoryData = {};
    }

    Object.keys(data).forEach(propertyName => {
        categoryData[propertyName] = data[propertyName];
    });

    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(categoryData));

        console.log(`Saving cache for ${KEY}: `);
        _logCategoryObject(categoryData);

        return true;
    } catch (error) {
        return false;
    }
}

export async function getLocalCategoryData(province, category) {
    const KEY = _getCategoryDataMapKey(province, category);

    try {
        let categoryData = JSON.parse(await AsyncStorage.getItem(KEY));
        if (!categoryData) {
            categoryData = {};
            await AsyncStorage.setItem(KEY, JSON.stringify(categoryData));
        }

        console.log(`Loading cache for ${KEY}: `);
        _logCategoryObject(categoryData);

        return categoryData;
    } catch (error) {
        return null;
    }
}

function _logCategoryObject(categoryData) {
    if (!categoryData) {
        console.log(`  - NULL`);
    } else {
        Object.keys(categoryData).forEach(propertyName => {
            if (propertyName === 'markerList') {
                console.log(`  - [${propertyName}]: COUNT = ${categoryData[propertyName].length}`);
            } else {
                console.log(`  - [${propertyName}]: ${categoryData[propertyName]}`);
            }
        });
    }
}

function _getCategoryDataMapKey(province, category) {
    return `province-${province}-category-${category}`;
}

/*
* เปลี่ยนใหม่ แบบนี้ดีกว่า (แยก key ไปเลย)
asyncStorage key province.0-category.1
{
    markerVisibility: true,
    markerOpacity: 1.0,
    markerList: [],
    lastUpdated: '',
}
asyncStorage key province.0-category.2
{
    markerVisibility: false,
    markerOpacity: 0.5,
    markerList: [],
    lastUpdated: '',
}
* */

const KEY_SEEN_ALARM_LIST = 'seen-alarm-list';

export async function setSeenAlarmList(seenAlarm) {
    try {
        await AsyncStorage.setItem(KEY_SEEN_ALARM_LIST, JSON.stringify(seenAlarm));
        console.log(`Saving seen alarm: ${JSON.stringify(seenAlarm)}`);

        return true;
    } catch (error) {
        return false;
    }
}

export async function addSeenAlarm(alarmId) {
    const list = await getSeenAlarmList();

    if (list != null) {
        list.push(alarmId);
        await setSeenAlarmList(list);
    }
}

export async function getSeenAlarmList() {
    try {
        const seenAlarmListJson = await AsyncStorage.getItem(KEY_SEEN_ALARM_LIST);
        if (seenAlarmListJson == null) {
            console.log(`Loading seen alarm: NULL`);
            return [];
        }
        const seenAlarmList = JSON.parse(seenAlarmListJson);
        console.log(`Loading seen alarm: ${seenAlarmListJson}`);

        return seenAlarmList;
    } catch (error) {
        console.log(`Loading seen alarm: NULL (error)`);
        return null;
    }
}