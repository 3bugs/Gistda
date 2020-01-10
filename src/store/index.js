/**
 * reference
 * https://github.com/weexteam/weex-hackernews/tree/master/src/store
 */

import Vue from 'vue-native-core';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';

import {PROVINCE_NAME_TH, PROVINCE_NAME_EN, INCIDENT_FORM_DATA} from '../constants/index';

Vue.use(Vuex);

const store = new Vuex.Store({
    actions,
    mutations,

    //todo: แยก state สำหรับแต่ละจังหวัด
    state: {
        province: 0,
        drawerOpen: false,
        loadingMessage: null,
        loadingCoordinateCategories: false,
        submittingFormData: false,

        incidentFormData: {
            [INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY]: 0,
            [INCIDENT_FORM_DATA.KEY_DETAILS]: 'ทดสอบรายละเอียด',
            [INCIDENT_FORM_DATA.KEY_PROVINCE]: '',
            [INCIDENT_FORM_DATA.KEY_DISTRICT]: -1,
            [INCIDENT_FORM_DATA.KEY_SUB_DISTRICT]: -1,
            [INCIDENT_FORM_DATA.KEY_REPORTER]: 'Promlert Lovichit', //todo: ***
            [INCIDENT_FORM_DATA.KEY_EMAIL]: 'promlert@gmail.com',
            [INCIDENT_FORM_DATA.KEY_PHONE]: '085-058-1776',
            [INCIDENT_FORM_DATA.KEY_LATITUDE]: null,
            [INCIDENT_FORM_DATA.KEY_LONGITUDE]: null,
        },
        incidentImages: [],

        /*incidentFormData: {
            category: null,
            details: null,
            province: null,
            district: null,
            subDistrict: null,
            reporter: null,
            email: null,
            phone: null,
            pickedImages: [],
        },*/

        //กำหนดเป็น array แล้วมีปัญหากับ data binding, view ไม่อัพเดท
        coordinateCategoryList: {
            [PROVINCE_NAME_EN[0]]: [],
            [PROVINCE_NAME_EN[1]]: [],
        },

        loadingCoordinates: false,

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

        loadingNewsDetails: {
            [PROVINCE_NAME_EN[0]]: false,
            [PROVINCE_NAME_EN[1]]: false,
        },
        newsDetailsList: {
            [PROVINCE_NAME_EN[0]]: [],
            [PROVINCE_NAME_EN[1]]: [],
        },
    }
});

export default store;
