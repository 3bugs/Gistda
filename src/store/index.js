/**
 * reference
 * https://github.com/weexteam/weex-hackernews/tree/master/src/store
 */

import Vue from 'vue-native-core';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';

import {PROVINCE_NAME_EN} from '../constants/index';

Vue.use(Vuex);

const store = new Vuex.Store({
    actions,
    mutations,

    //todo: แยก state สำหรับแต่ละจังหวัด
    state: {
        province: 0,
        drawerOpen: false,
        loadingCoordinateCategories: false,

        coordinateCategoryList: {
            [PROVINCE_NAME_EN[0]]: [],
            [PROVINCE_NAME_EN[1]]: [],
        },

        loadingCoordinates: {
            [PROVINCE_NAME_EN[0]]: false,
            [PROVINCE_NAME_EN[1]]: false,
        },

        /*loadingMapDataList: false,
        mapDataList: [],*/

        loadingNews: {
            [PROVINCE_NAME_EN[0]]: false,
            [PROVINCE_NAME_EN[1]]: false,
        },
        newsList: {
            [PROVINCE_NAME_EN[0]]: null,
            [PROVINCE_NAME_EN[1]]: null,
        },
        loadingEr: {
            [PROVINCE_NAME_EN[0]]: false,
            [PROVINCE_NAME_EN[1]]: false,
        },
        erList: {
            [PROVINCE_NAME_EN[0]]: null,
            [PROVINCE_NAME_EN[1]]: null,
        },
        loadingSuggest: {
            [PROVINCE_NAME_EN[0]]: false,
            [PROVINCE_NAME_EN[1]]: false,
        },
        suggestList: {
            [PROVINCE_NAME_EN[0]]: null,
            [PROVINCE_NAME_EN[1]]: null,
        },
    }
});

export default store;
