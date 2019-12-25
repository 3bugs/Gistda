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

//todo: รื้อใหม่ ดู comment ข้างล่าง ********************************************
export async function setLocalCategoryData(province, categoryId, data) {
    const KEY = _getCategoryDataMapKey(province);

    let categoryData = JSON.parse(await getCategoryData(province, categoryId));
    if (!categoryData) {
        categoryData = {};
    }

    Object.keys(data).forEach(propertyName => {
        categoryData[propertyName] = data[propertyName];
    });
}

//todo: รื้อใหม่ ดู comment ข้างล่าง ********************************************
export async function getLocalCategoryData(province, category) {
    const KEY = _getCategoryDataMapKey(province, category);

    try {
        const categoryData = await AsyncStorage.getItem(KEY);
        if (!categoryData) {
            await AsyncStorage.setItem(KEY, JSON.stringify({}));
            return {};
        } else {
            return JSON.parse(categoryData);
        }
    } catch (error) {
        return null;
    }
}

function _getCategoryDataMapKey(province, category) {
    return `province-${province}-category-${category}`;
}

// เก็บ categoryDataMap หน้าตาแบบนี้ (สำหรับแต่ละจังหวัด)
const _categoryDataMap = {
    '1': {
        checked: true,
        opacity: 1.0,
        cachedCoordinateList: [],
        lastUpdated: '',
    },
    '2': {
        checked: true,
        opacity: 1.0,
        cachedCoordinateList: [],
        lastUpdated: '',
    },
};

/*
* เปลี่ยนใหม่ แบบนี้ดีกว่า (แยก key ไปเลย)
asyncStorage key province.0-category.1
{
    checked: true,
    opacity: 1.0,
    cachedCoordinateList: [],
    lastUpdated: '',
}
asyncStorage key province.0-category.2
{
    checked: false,
    opacity: 0.5,
    cachedCoordinateList: [],
    lastUpdated: '',
}
* */