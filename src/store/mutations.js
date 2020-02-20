import {PROVINCE_NAME_EN, INCIDENT_FORM_DATA, HEATMAP_CATEGORY_ID_RISK, HEATMAP_CATEGORY_ID_DISEASE} from '../constants/index';
import {getLocalCategoryData, setLocalCategoryData, getSeenAlarmList, setSeenAlarmList} from './db';
import {getSubDistrictDataList} from '../data/sub_district.geo';
import {getDistance} from 'geolib';

export function SET_PROVINCE(state, {province}) {
    state.province = province;
}

export function SUBMITTING_INCIDENT_FORM_DATA(state, {isSubmitting}) {
    state.submittingFormData = isSubmitting;
}

export function FETCHING_SINGLE_COORDINATE(state, {isFetching}) {
    state.loadingSingleCoordinate = isFetching;
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

    // เอา link รูปภาพเก็บเป็น sparse array ไว้ใช้ตอนปักหมูด search result
    state.categoryData = [];
    coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            /*{
                "id": 1,
                "name": "ตำแหน่งอุบัติเหตุ",
                "description": "",
                "image": "https://fenrir.studio/d/gistda_dev/uploads/1rk1576090326.png",
                "default": false,
                "last_update_35": "2020-01-17 11:29:48",
                "last_update_73": "2020-01-24 15:14:38"
            }*/
            state.categoryData[category.id] = category;
        });
    });

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

            category.wmsList = null;
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

export async function SET_COORDINATES(state, {province, coordinateList, wmsList, callback}) {
    const coordinateSparseArray = [];
    const heatMapSparseArray = [];

    coordinateList.forEach(coordinate => {
        const categoryId = coordinate.properties.CATEGORY;

        if (categoryId === HEATMAP_CATEGORY_ID_RISK || categoryId === HEATMAP_CATEGORY_ID_DISEASE) {
            if (coordinate.geometry.coordinates === null) {
                //console.log(`BEFORE: ${JSON.stringify(coordinate)}`);
                findLatLng(province, coordinate);
                //console.log(`AFTER: ${JSON.stringify(coordinate)}`);
            }

            if (!heatMapSparseArray[categoryId]) {
                heatMapSparseArray[categoryId] = [];
            }
            heatMapSparseArray[categoryId].push(coordinate);
        } else {
            if (!coordinateSparseArray[categoryId]) {
                coordinateSparseArray[categoryId] = [];
            }
            coordinateSparseArray[categoryId].push(coordinate);
        }

        //addHeatMapPoint(state, coordinate);

        /*ถ้าเป็น category โรคระบาด และ level = 0 ไม่ต้องเก็บ (จะได้ไม่แสดงในหน้า list)*/
        /*if (!(coordinate.properties.CATEGORY === HEATMAP_CATEGORY_ID_RISK
            || coordinate.properties.CATEGORY === HEATMAP_CATEGORY_ID_DISEASE)
            || coordinate.properties.LEVEL !== 0) {
            coordinateSparseArray[categoryId].push(coordinate);
        }*/
    });

    createHeatMapPointList(state, heatMapSparseArray);

    //todo: ข้อมูล wms
    const wmsSparseArray = [];
    wmsList.forEach(wms => {
        const category = parseInt(wms.CATEGORY);
        if (!wmsSparseArray[category]) {
            wmsSparseArray[category] = [];
        }
        wmsSparseArray[category].push(wms);
    });

    console.log('***** WMS Sparse array ****************************************');
    console.log(JSON.stringify(wmsSparseArray));

    // แคชไว้ใน local storage
    for (let i = 0; i < coordinateSparseArray.length; i++) {
        const markerList = coordinateSparseArray[i];
        if (markerList) {
            await setLocalCategoryData(
                province,
                i,
                {
                    markerList,
                }
            );
        }
    }

    state.coordinateCategoryList[PROVINCE_NAME_EN[province]].forEach(categoryTypeItem => {
        categoryTypeItem.list.forEach(categoryItem => {
            if (coordinateSparseArray[categoryItem.id]) {
                //coords
                categoryItem.markerList = coordinateSparseArray[categoryItem.id];
            }
            if (wmsSparseArray[categoryItem.id]) {
                //wms
                categoryItem.wmsList = wmsSparseArray[categoryItem.id];
            }
        });
    });

    console.log("----- SET_COORDINATES -----");
    console.log(JSON.stringify(state.coordinateCategoryList[PROVINCE_NAME_EN[province]]));
    console.log("----- SET_COORDINATES -----");

    state.loadingCoordinates = false;
    state.loadingMessage = null;

    callback();
}

function findLatLng(provinceIndex, coordinate) {
    const location = coordinate.properties.LOCATION_T;
    if (location) {
        const part = location.trim().split(/\s+/);
        if (part.length === 3) {
            const subDistrict = part[0];
            const district = part[1];
            const province = part[2];

            const subDistrictList = getSubDistrictDataList(provinceIndex);
            for (let i = 0; i < subDistrictList.length; i++) {
                if (subDistrictList[i].properties.TAMBON_T.trim() === subDistrict
                    && subDistrictList[i].properties.AMPHOE_T.trim() === district
                    && subDistrictList[i].properties.CHANGWAT_T.trim() === province) {
                    coordinate.geometry.coordinates = subDistrictList[i].geometry.coordinates;

                    console.log(`${coordinate.properties.NAME_T} - Lat: ${coordinate.geometry.coordinates[1]}, Lng: ${coordinate.geometry.coordinates[0]}`);
                    return;
                }
            }
            console.log(`${coordinate.properties.NAME_T} - NOT FOUND !!!!!!!!!!!!!!!!!!!!!!!!!`);
        }
    }
}

function addHeatMapPoint_not_used(state, coordinate) {
    if (coordinate.properties.CATEGORY === HEATMAP_CATEGORY_ID_RISK
        || coordinate.properties.CATEGORY === HEATMAP_CATEGORY_ID_DISEASE) { // category ที่เป็น heatmap
        const part = coordinate.properties.NAME_T.trim().split(/\s+/);
        const subDistrict = part[0];
        const district = part[1];
        const province = part[2];
        coordinate.properties.NAME_T = `ต.${subDistrict} อ.${district} (พื้นที่เสี่ยงหรือมีโรคระบาด)`;

        const latitude = coordinate.geometry.coordinates[1];
        const longitude = coordinate.geometry.coordinates[0];
        const weight = coordinate.properties.LEVEL;

        console.log('CATEGORY: ', coordinate.properties.CATEGORY);

        const heatMapPointList = coordinate.properties.CATEGORY === HEATMAP_CATEGORY_ID_RISK
            ? state.heatMapPointListRisk[PROVINCE_NAME_EN[state.province]]
            : state.heatMapPointListDisease[PROVINCE_NAME_EN[state.province]];

        if (true /*weight > 0*/) {
            heatMapPointList.push({
                latitude, longitude, weight
            });
        }
    }
}

function createHeatMapPointList(state, heatMapSparseArray) {
    if (heatMapSparseArray[HEATMAP_CATEGORY_ID_RISK]) {
        state.heatMapPointListRisk[PROVINCE_NAME_EN[state.province]]
            = getHeatMapPointList(heatMapSparseArray[HEATMAP_CATEGORY_ID_RISK]);
    }
    if (heatMapSparseArray[HEATMAP_CATEGORY_ID_DISEASE]) {
        state.heatMapPointListDisease[PROVINCE_NAME_EN[state.province]]
            = getHeatMapPointList(heatMapSparseArray[HEATMAP_CATEGORY_ID_DISEASE]);
    }
}

function getHeatMapPointList(array) {
    const heatMapPointList = [];

    array.forEach(coordinate => {
        const latitude = coordinate.geometry.coordinates[1];
        const longitude = coordinate.geometry.coordinates[0];
        const weight = coordinate.properties.LEVEL;

        heatMapPointList.push({
            latitude, longitude, weight
        });
    });

    return heatMapPointList;
}

export function SEARCHING(state) {
    state.searching = true;
    state.loadingMessage = getLoadingMessage('Searching...');
}

export async function SET_SEARCH_RESULT(state, {coordinateList, wmsList, currentLocation, radius, callback}) {
    state.searching = false;
    state.loadingMessage = null;

    // filter lat, lng ที่ไม่ได้อยู่ในประเทศไทยออกไป (เผื่อ lat, lng ผิด)
    let filteredCoordList = coordinateList.filter(coord => {
        const type = coord.geometry.type;
        if (type.toLowerCase() !== 'point') return false;

        const lat = coord.geometry.coordinates[1];
        const lng = coord.geometry.coordinates[0];
        return (lat > 5) && (lat < 21)
            && (lng > 97) && (lng < 106);
    });

    // เอาเฉพาะภายในรัศมีที่กำหนด
    if (currentLocation && radius) {
        filteredCoordList = filteredCoordList.filter(coord => {
            const lat = coord.geometry.coordinates[1];
            const lng = coord.geometry.coordinates[0];
            return getDistance({lat, lng}, currentLocation) <= radius * 1000;
        });
    }

    calculateDistance(filteredCoordList, currentLocation);
    sortDataListByDistance(filteredCoordList);
    state.searchResultList[PROVINCE_NAME_EN[state.province]] = filteredCoordList;

    callback();
}

function calculateDistance(dataList, currentLocation) {
    const originLatitude = currentLocation.latitude;
    const originLongitude = currentLocation.longitude;

    dataList.forEach(item => {
        const destinationLatitude = item.geometry.coordinates[1];
        const destinationLongitude = item.geometry.coordinates[0];

        const distanceMeters = getDistance(
            {latitude: originLatitude, longitude: originLongitude},
            {latitude: destinationLatitude, longitude: destinationLongitude}
        );
        item.distance = distanceMeters;
    });
}

function sortDataListByDistance(dataList) {
    dataList.sort((item1, item2) => {
        return item1.distance > item2.distance ? 1 : -1;
    });
}

export function GETTING_REPORT(state) {
    state.loadingReport = true;
    state.loadingMessage = getLoadingMessage('Loading...');
}

export async function SET_REPORT(state, {data}) {
    state.loadingReport = false;
    state.loadingMessage = null;
    state.reportData[PROVINCE_NAME_EN[state.province]] = data;
}

export function GETTING_REPORT_DOWNLOAD_LINK(state) {
    state.loadingReport = true;
    state.loadingMessage = getLoadingMessage('Loading...');
}

export async function SET_REPORT_DOWNLOAD_LINK(state, {data}) {
    state.loadingReport = false;
    state.loadingMessage = null;
    state.reportDownloadUrl[PROVINCE_NAME_EN[state.province]] = data.url;
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

export function FETCHING_ALARM(state, {province}) {
    state.loadingAlarm[PROVINCE_NAME_EN[province]] = true;
}

export function FETCHING_ALARM_DETAILS(state, {isFetching}) {
    state.loadingAlarmDetails[PROVINCE_NAME_EN[state.province]] = isFetching;
}

export async function SET_ALARM(state, {province, dataList}) {
    dataList.forEach(item => {
        item.seen = false;
    });

    const seenAlarmList = await getSeenAlarmList();
    if (seenAlarmList !== null) {
        dataList.forEach(item => {
            item.seen = seenAlarmList.includes(item.id);
        });
    }

    state.alarmList[PROVINCE_NAME_EN[province]] = dataList;
    state.loadingAlarm[PROVINCE_NAME_EN[province]] = false;
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

export function CLEAR_INCIDENT_FORM_DATA_AND_IMAGES(state, {formType}) {
    if (formType === 0) {
        state.incidentFormData[INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY] = 0;
    }
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

export function FETCHING_TEMPERATURE(state) {
    state.loadingTemperature = true;
}

export function SET_TEMPERATURE(state, {province, temperature, description}) {
    state.loadingTemperature = false;

    state.temperature[PROVINCE_NAME_EN[province]] = temperature;
    state.weatherDescription[PROVINCE_NAME_EN[province]] = description;

    console.log(`Set temperature ${PROVINCE_NAME_EN[province]}: ${temperature}`);
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
