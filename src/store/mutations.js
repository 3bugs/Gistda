import {PROVINCE_NAME_EN} from '../constants/index';
import {getLocalCategoryData, setLocalCategoryData} from './db';

export function SET_PROVINCE(state, {province}) {
    state.province = province;
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
                checked: true,
                opacity: 1,
                cachedCoordinateList: [],
                lastUpdated: ''
            }*/

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

export function SET_COORDINATES(state, {coordinateList}) {
    coordinateList.forEach(item => {
        state.coordinateCategoryList[PROVINCE_NAME_EN[state.province]].forEach(categoryTypeItem => {
            categoryTypeItem.list.forEach(categoryItem => {
                if (item.properties.CATEGORY === categoryItem.id) {
                    if (!categoryItem.markerList) {
                        categoryItem.markerList = [];
                    }
                    categoryItem.markerList.push(item);
                }
            });
        });
    });
    state.loadingCoordinates = false;
    state.loadingMessage = null;
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

function getLoadingMessage(message) {
    return /*'รอสักครู่\n' +*/ message;
}
/*
export function SET_LOADING_MESSAGE(state, {message}) {
    state.loadingMessage = message;
}*/
