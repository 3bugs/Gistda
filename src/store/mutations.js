export function SET_PROVINCE(state, {province}) {
    state.province = province;
}

export function FETCHING_COORDINATE_CATEGORIES(state) {
    state.loadingCoordinateCategories = true;
}

export function SET_COORDINATE_CATEGORIES(state, {coordinateCategoryList}) {
    loadMapDataPref(coordinateCategoryList);
    state.coordinateCategoryList = coordinateCategoryList;
    state.loadingCoordinateCategories = false;
}

//todo: load map data pref
function loadMapDataPref(coordinateCategoryList) {
    coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            category.markerOpacity = 1;
            category.markerVisibility = true;
        });
    });
}

export function FETCHING_COORDINATES(state) {
    state.loadingCoordinates = true;
}

export function SET_COORDINATES(state, {coordinateList}) {
    coordinateList.forEach(item => {
        state.coordinateCategoryList.forEach(categoryTypeItem => {
            categoryTypeItem.list.forEach(categoryItem => {
                if (item.category_id === categoryItem.id) {
                    categoryItem.markerList = item.list;
                }
            });
        });
    });
    state.loadingCoordinates = false;
}

export function FETCHING_NEWS(state) {
    state.loadingNews = true;
}

export function SET_NEWS(state, {dataList}) {
    state.newsList = dataList;
    state.loadingNews = false;
}

export function FETCHING_ER(state) {
    state.loadingEr = true;
}

export function SET_ER(state, {dataList}) {
    state.erList = dataList;
    state.loadingEr = false;
}

export function FETCHING_SUGGEST(state) {
    state.loadingSuggest = true;
}

export function SET_SUGGEST(state, {dataList}) {
    state.suggestList = dataList;
    state.loadingSuggest = false;
}

export function SET_MARKER_OPACITY(state, {id, index, typeIndex, opacity}) {
    state.coordinateCategoryList[typeIndex].list[index].markerOpacity = opacity;

    /*state.coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            if (category.id === id) {
                category.markerOpacity = opacity;
            }
        });
    });*/
}

export function SET_MARKER_VISIBILITY(state, {id, index, typeIndex, visibility}) {
    state.coordinateCategoryList[typeIndex].list[index].markerVisibility = visibility;

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