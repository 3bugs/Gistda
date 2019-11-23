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

export function FETCHING_MAP_DATA(state) {
    state.loadingMapDataList = true;
}

export function SET_MAP_DATA(state, {mapDataList}) {
    state.mapDataList = mapDataList;
    state.loadingMapDataList = false;
}

export function SET_MARKER_OPACITY(state, {key, opacity}) {
    state.mapDataList[key].markerOpacity = opacity;
}

export function SET_MARKER_VISIBILITY(state, {key, visibility}) {
    state.mapDataList[key].markerVisibility = visibility;
}

export function SET_DRAWER_OPEN(state, {drawerOpen}) {
    state.drawerOpen = drawerOpen;
}