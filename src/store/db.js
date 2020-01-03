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