import {PROVINCE_NAME_EN, INCIDENT_FORM_DATA} from '../constants/index';
import {getLocalCategoryData, setLocalCategoryData} from './db';

export function SET_PROVINCE(state, {province}) {
    state.province = province;
}

export function SUBMITTING_INCIDENT_FORM_DATA(state, {isSubmitting}) {
    state.submittingFormData = isSubmitting;
}

export function FETCHING_COORDINATE_CATEGORIES(state) {
    state.loadingCoordinateCategories = true;
    state.loadingMessage = getLoadingMessage('Loading filter data');
}

export async function SET_COORDINATE_CATEGORIES(state, {coordinateCategoryList, callback}) {
    await loadMapDataPref(state.province, coordinateCategoryList);
    state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]] = coordinateCategoryList;

    state.loadingCoordinateCategories = false;
    state.loadingMessage = null;

    console.log("----- SET_COORDINATE_CATEGORIES -----");
    console.log(JSON.stringify(state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]]));
    console.log("----- SET_COORDINATE_CATEGORIES -----");

    callback();
}

//todo: load map data pref
async function loadMapDataPref(province, coordinateCategoryList) {
    /*coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(async category => {
            const localCategoryData = await getLocalCategoryData(province, category.id);

            category.markerOpacity = 1;
            if (localCategoryData.opacity) {
                category.markerOpacity = localCategoryData.opacity;
            }

            category.markerVisibility = category.default;
            if (localCategoryData.checked) {
                category.markerVisibility = localCategoryData.checked;
            }

            category.markerList = null;
            if (localCategoryData.cachedCoordinateList) {
                category.markerList = localCategoryData.cachedCoordinateList;
            }
        });
    });*/

    for (let i = 0; i < coordinateCategoryList.length; i++) {
        const categoryType = coordinateCategoryList[i];
        for (let j = 0; j < categoryType.list.length; j++) {
            const category = categoryType.list[j];

            const localCategoryData = await getLocalCategoryData(province, category.id);

            /*{
                markerVisibility: true,
                markerOpacity: 1,
                markerList: [],
                lastUpdated: ''
            }*/

            category.markerOpacity = 1;
            if (localCategoryData && (localCategoryData.markerOpacity != null)) {
                category.markerOpacity = localCategoryData.markerOpacity;
            }

            category.markerVisibility = category.default;
            if (localCategoryData && (localCategoryData.markerVisibility != null)) {
                category.markerVisibility = localCategoryData.markerVisibility;
            }

            category.markerList = null;
            if (localCategoryData && localCategoryData.markerList) {
                category.markerList = localCategoryData.markerList;
            }
        }
    }
}

//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
/*async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }
}*/

export function FETCHING_COORDINATES(state) {
    state.loadingCoordinates = true;
    state.loadingMessage = getLoadingMessage('Loading maps data');
}

export async function SET_COORDINATES(state, {coordinateList, callback}) {
    const coordinateSparseArray = [];
    coordinateList.forEach(coordinate => {
        const category = coordinate.properties.CATEGORY;
        if (!coordinateSparseArray[category]) {
            coordinateSparseArray[category] = [];
        }
        coordinateSparseArray[category].push(coordinate);
    });

    // แคชไว้ใน local storage
    for (let i = 0; i < coordinateSparseArray.length; i++) {
        const markerList = coordinateSparseArray[i];
        if (markerList) {
            await setLocalCategoryData(
                state.province,
                i,
                {
                    markerList,
                }
            );
        }
    }

    state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]].forEach(categoryTypeItem => {
        categoryTypeItem.list.forEach(categoryItem => {
            if (coordinateSparseArray[categoryItem.id]) {
                categoryItem.markerList = coordinateSparseArray[categoryItem.id];
            }
        });
    });

    console.log("----- SET_COORDINATES -----");
    console.log(JSON.stringify(state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]]));
    console.log("----- SET_COORDINATES -----");

    state.loadingCoordinates = false;
    state.loadingMessage = null;

    callback();
}

export function FETCHING_NEWS(state) {
    state.loadingNews[PROVINCE_NAME_EN[state.province]] = true;
}

export function SET_NEWS(state, {dataList}) {
    state.newsList[PROVINCE_NAME_EN[state.province]] = dataList;
    state.loadingNews[PROVINCE_NAME_EN[state.province]] = false;
}

export function FETCHING_ER(state) {
    state.loadingEr[PROVINCE_NAME_EN[state.province]] = true;
}

export function SET_ER(state, {dataList}) {
    state.erList[PROVINCE_NAME_EN[state.province]] = dataList;
    state.loadingEr[PROVINCE_NAME_EN[state.province]] = false;
}

export function FETCHING_SUGGEST(state) {
    state.loadingSuggest[PROVINCE_NAME_EN[state.province]] = true;
}

export function SET_SUGGEST(state, {dataList}) {
    state.suggestList[PROVINCE_NAME_EN[state.province]] = dataList;
    state.loadingSuggest[PROVINCE_NAME_EN[state.province]] = false;
}

export function FETCHING_HISTORY(state) {
    state.loadingHistory[PROVINCE_NAME_EN[state.province]] = true;
}

export function SET_HISTORY(state, {dataList}) {
    state.historyList[PROVINCE_NAME_EN[state.province]] = dataList;
    state.loadingHistory[PROVINCE_NAME_EN[state.province]] = false;
}

export function FETCHING_NEWS_DETAILS(state) {
    state.loadingNewsDetails[PROVINCE_NAME_EN[state.province]] = true;
}

export function SET_NEWS_DETAILS(state, {newsDetails}) {
    // กรณี fetch แล้ว error, action จะส่ง newsDetails เป็น null มา
    if (newsDetails) {
        let arr = state.newsDetailsList[PROVINCE_NAME_EN[state.province]];
        // ถ้ามี news details id นั้นอยู่แล้ว จะลบทิ้ง แล้วค่อย add ใหม่ (กรณีบังคับ reload data)
        arr = arr.filter(item => {
            return item.id !== newsDetails.id;
        });
        arr.push(newsDetails);
        state.newsDetailsList[PROVINCE_NAME_EN[state.province]] = arr;
    }

    state.loadingNewsDetails[PROVINCE_NAME_EN[state.province]] = false;
}

export function SET_MARKER_OPACITY(state, {id, index, typeIndex, opacity}) {
    state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]]
        [typeIndex].list[index].markerOpacity = opacity;

    /*state.coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            if (category.id === id) {
                category.markerOpacity = opacity;
            }
        });
    });*/
}

export function SET_MARKER_VISIBILITY(state, {id, index, typeIndex, visibility}) {
    state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]]
        [typeIndex].list[index].markerVisibility = visibility;

    /*state.coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            if (category.id === id) {
                category.markerVisibility = visibility;
            }
        });
    });*/
}

export function SET_DRAWER_OPEN(state, {drawerOpen}) {
    state.drawerOpen = drawerOpen;
}

export function SET_INCIDENT_FORM_DATA(state, {formData}) {
    if (!state.incidentFormData) {
        state.incidentFormData = {};
    }

    Object.keys(formData).forEach(propertyName => {
        state.incidentFormData[propertyName] = formData[propertyName];
    });

    logObjectProperties('incidentFormData', state.incidentFormData);
}

export function CLEAR_INCIDENT_FORM_DATA_AND_IMAGES(state, {}) {
    state.incidentFormData[INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY] = 0;
    state.incidentFormData[INCIDENT_FORM_DATA.KEY_DETAILS] = '';
    //state.incidentFormData[INCIDENT_FORM_DATA.KEY_PROVINCE] = '';
    //state.incidentFormData[INCIDENT_FORM_DATA.KEY_DISTRICT] = -1;
    //state.incidentFormData[INCIDENT_FORM_DATA.KEY_SUB_DISTRICT] = -1;
    //state.incidentFormData[INCIDENT_FORM_DATA.KEY_REPORTER] = state.userDisplayName;
    state.incidentFormData[INCIDENT_FORM_DATA.KEY_EMAIL] = '';
    state.incidentFormData[INCIDENT_FORM_DATA.KEY_PHONE] = '';
    state.incidentFormData[INCIDENT_FORM_DATA.KEY_LATITUDE] = null;
    state.incidentFormData[INCIDENT_FORM_DATA.KEY_LONGITUDE] = null;
    state.incidentImages = [];

    logObjectProperties('incidentFormData', state.incidentFormData);
    console.log(`Incident images count: ${state.incidentImages.length}`);
}

export function ADD_INCIDENT_IMAGE(state, {imageData}) {
    state.incidentImages.push(imageData);

    console.log(`Incident images count: ${state.incidentImages.length}`);
}

export function DELETE_INCIDENT_IMAGE(state, {imageIndex}) {
    state.incidentImages.splice(imageIndex, 1);

    console.log(`Incident images count: ${state.incidentImages.length}`);
}

export function LOGGING_IN(state) {
    state.loggingIn = true;

    console.log(`Logging in...`);
}

export function REGISTERING(state) {
    state.submittingFormData = true;

    console.log(`Registering...`);
}

export function GETTING_PROFILE(state) {
    state.submittingFormData = true;

    console.log(`Getting profile...`);
}

export function UPDATING_PROFILE(state) {
    state.submittingFormData = true;

    console.log(`Updating profile...`);
}

export function CHANGING_PASSWORD(state) {
    state.submittingFormData = true;

    console.log(`Changing password...`);
}

export function FINISH_CHANGING_PASSWORD(state) {
    state.submittingFormData = false;
}

export function SET_USER(state, {userDisplayName, userPhone, userEmail, userToken}) {
    state.loggingIn = false; // กรณี login
    state.submittingFormData = false; // กรณี register, get profile

    state.userDisplayName = userDisplayName;
    state.userPhone = userPhone;
    state.userEmail = userEmail;
    state.userToken = userToken;

    console.log(`Set user:`);
    console.log(`Display name: ${userDisplayName}, Token: ${userToken}`);
}

function logObjectProperties(objectName, object) {
    console.log(`Properties of ${objectName}:`);
    if (object) {
        Object.keys(object).forEach(propertyName => {
            console.log(`   - ${propertyName} = ${object[propertyName]}`);
        });
    } else {
        console.log(`${objectName} is NULL!`);
    }
    console.log('.');
}

function getLoadingMessage(message) {
    return /*'รอสักครู่\n' +*/ message;
}
/*
export function SET_LOADING_MESSAGE(state, {message}) {
    state.loadingMessage = message;
}*/
