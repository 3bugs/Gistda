/**
 * reference
 * https://github.com/weexteam/weex-hackernews/tree/master/src/store
 */

import Vue from 'vue-native-core';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
    actions,
    mutations,

    state: {
        province: 0,
        coordinateCategoryList: [],

        loadingCoordinateCategories: false,
        loadingCoordinates: false,
        drawerOpen: false,

        /*loadingMapDataList: false,
        mapDataList: [],*/

        loadingNews: false,
        newsList: null,
    }
});

export default store;
