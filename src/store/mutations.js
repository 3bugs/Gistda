/*
export function SET_POSTS(state, {posts}) {
    state.loadingPosts = false;
    state.posts = posts;
}

export function FETCHING_LISTS(state) {
    state.loadingPosts = true;
}

export function LOGGING_IN(state, status) {
    state.logging_in = status;
}

export function LOGIN_SUCCESFULL(state, {userObj}) {
    state.userObj = userObj;
    state.logging_in = false;
}
*/

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

export function SET_MARKER_OPACITY(state, {id, opacity}) {
    state.coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            if (category.id === id) {
                category.markerOpacity = opacity;
            }
        });
    });
}

export function SET_MARKER_VISIBILITY(state, {id, visibility}) {
    state.coordinateCategoryList.forEach(categoryType => {
        categoryType.list.forEach(category => {
            if (category.id === id) {
                category.markerVisibility = visibility;
            }
        });
    });
}

export function SET_DRAWER_OPEN(state, {drawerOpen}) {
    state.drawerOpen = drawerOpen;
}