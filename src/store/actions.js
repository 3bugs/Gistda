import {provinceCode, fetchNewsDetails, fetchPosts, fetchSuggest, submitFormData} from './fetch';
import {INCIDENT_FORM_DATA} from '../constants/index';
import {DISTRICT_DATA} from '../constants/district';
import {AsyncStorage} from 'react-native';

// ensure data for rendering given list type
/*
export function FETCH_LIST_DATA({commit, dispatch}, {type}) {
    commit('FETCHING_LISTS');
    return fetchPosts(type)
        .then(posts => {
            return commit('SET_POSTS', {posts})
        });
}

export function LOGIN({commit, state}, {userObj, navigate}) {
    commit('LOGGING_IN', true);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            commit('LOGIN_SUCCESFULL', {userObj});
            AsyncStorage.setItem('email', userObj.email);
            navigate('Home');
            resolve();
        }, 1000);
    })
}

export function SET_USER({commit, state}, {userObj}) {
    return commit('LOGIN_SUCCESFULL', {userObj});
}

export function LOGOUT({commit, state}, callback) {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem('email').then(() => {
            callback();
            resolve();
        });
    })
}
*/

import {
    fetchCoordinateCategories,
    fetchCoordinates,
    fetchCoordinates_old,
    fetchNews,
    fetchEr,
} from './fetch';

import imageFilterGeoAccident from '../../assets/images/sidebar/ic_filter_geo_accident.png';
import imageFilterGeoRiskArea from '../../assets/images/sidebar/ic_filter_geo_risk_area.png';
import imageFilterGeoRoute from '../../assets/images/sidebar/ic_filter_geo_route.png';

export async function SET_PROVINCE({commit, state}, {province, callback}) {
    commit('SET_PROVINCE', {province});
    commit('FETCHING_COORDINATE_CATEGORIES');

    //todo: รเบุ province
    const apiResult = await fetchCoordinateCategories(province);
    if (apiResult.success) {
        const coordinateCategoryList = apiResult.data.list;
        commit('SET_COORDINATE_CATEGORIES', {
            coordinateCategoryList,
            callback: async () => {
                // ตรงจุดนี้ coordinateCategoryList จะมีข้อมูลตามที่ดึงจาก API + ที่แคชไว้ใน local storage

                const idList = [];
                coordinateCategoryList.forEach(categoryType => {
                    categoryType.list.forEach(category => {
                        // ถ้า category ถูกเลือกไว้ และยังไม่มีข้อมูลแคช ก็จะดึง coords จาก api
                        if (category.markerVisibility && !category.markerList) {
                            idList.push(category.id);
                        }
                    });
                });

                if (idList.length > 0) {
                    await FETCH_COORDINATES({commit, state}, {
                        province,
                        idList,
                        callback: (success, message) => {
                            if (success) {
                                callback(true, null);
                            } else {
                                callback(false, message);
                            }
                        }
                    });
                }
            }
        });
    } else {
        commit('SET_COORDINATE_CATEGORIES', {
            coordinateCategoryList: [],
            callback: () => {
                callback(false, apiResult.message);
            }
        });
    }
}

export async function FETCH_COORDINATES({commit, state}, {province, idList, callback}) {
    commit('FETCHING_COORDINATES');

    const apiResult = await fetchCoordinates(province, idList);
    if (apiResult.success) {
        commit('SET_COORDINATES', {
            coordinateList: apiResult.data,
            callback: () => {
                callback(true, null);
            }
        });
    } else {
        commit('SET_COORDINATES', {
            coordinateList: [],
            callback: () => {
                callback(false, apiResult.message);
            }
        });
    }
}

export async function SUBMIT_INCIDENT_FORM_DATA({commit, state}, {callback}) {
    commit('SUBMITTING_INCIDENT_FORM_DATA', {isSubmitting: true});

    //todo: validate form data first!!!

    const formData = {
        type: state.incidentFormData[INCIDENT_FORM_DATA.KEY_INCIDENT_CATEGORY],
        detail: state.incidentFormData[INCIDENT_FORM_DATA.KEY_DETAILS],
        address: '',
        subdistrict: DISTRICT_DATA[state.province][state.incidentFormData[INCIDENT_FORM_DATA.KEY_DISTRICT]]
            .subDistricts[state.incidentFormData[INCIDENT_FORM_DATA.KEY_SUB_DISTRICT]],
        district: DISTRICT_DATA[state.province][state.incidentFormData[INCIDENT_FORM_DATA.KEY_DISTRICT]].district,
        province_code: provinceCode[state.province],
        lat: state.incidentFormData[INCIDENT_FORM_DATA.KEY_LATITUDE],
        lng: state.incidentFormData[INCIDENT_FORM_DATA.KEY_LONGITUDE],
        name: state.incidentFormData[INCIDENT_FORM_DATA.KEY_REPORTER],
        email: state.incidentFormData[INCIDENT_FORM_DATA.KEY_EMAIL],
        phone: state.incidentFormData[INCIDENT_FORM_DATA.KEY_PHONE],
        images: state.incidentImages,
    };

    console.log(`Request Body JSON:`);
    console.log(formData);
    console.log(JSON.stringify(formData));

    const apiResult = await submitFormData(formData);
    commit('SUBMITTING_INCIDENT_FORM_DATA', {isSubmitting: false});

    if (apiResult.success) {
        callback(true, null);
    } else {
        callback(false, apiResult.message);
    }
}

export async function FETCH_NEWS({commit, state}, {province, callback}) {
    commit('FETCHING_NEWS');

    const apiResult = await fetchNews(province);
    if (apiResult.success) {
        commit('SET_NEWS', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        commit('SET_NEWS', {
            dataList: null
        });
        callback(false, apiResult.message);
    }
}

export async function FETCH_NEWS_DETAILS({commit, state}, {newsId, callback}) {
    commit('FETCHING_NEWS_DETAILS');

    const apiResult = await fetchNewsDetails(newsId);
    if (apiResult.success) {
        const newsDetails = apiResult.data;
        // ใส่ id เพิ่มเข้าไปเอง เพื่อจำ id ของแต่ละ news details (api ไม่ได้ส่ง id กลับมาให้)
        newsDetails.id = newsId;

        commit('SET_NEWS_DETAILS', {
            newsDetails
        });
        callback(true, newsDetails);
    } else {
        commit('SET_NEWS_DETAILS', {
            newsDetails: null
        });
        callback(false, apiResult.message);
    }
}

export async function FETCH_ER({commit, state}, {province, callback}) {
    commit('FETCHING_ER');

    const apiResult = await fetchEr(province);
    if (apiResult.success) {
        commit('SET_ER', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        commit('SET_ER', {
            dataList: null
        });
        callback(false, apiResult.message);
    }
}

export async function FETCH_SUGGEST({commit, state}, {province, callback}) {
    commit('FETCHING_SUGGEST');

    const apiResult = await fetchSuggest(province);
    if (apiResult.success) {
        commit('SET_SUGGEST', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        commit('SET_SUGGEST', {
            dataList: null
        });
        callback(false, apiResult.message);
    }
}

export function SET_MARKER_OPACITY({commit, state}, {id, index, typeIndex, opacity}) {
    commit('SET_MARKER_OPACITY', {
        id, index, typeIndex, opacity
    });
}

export function SET_MARKER_VISIBILITY({commit, state}, {id, index, typeIndex, visibility}) {
    commit('SET_MARKER_VISIBILITY', {
        id, index, typeIndex, visibility
    });
}

export function OPEN_DRAWER({commit, state}, {}) {
    commit('SET_DRAWER_OPEN', {
        drawerOpen: true
    });
}

export function CLOSE_DRAWER({commit, state}, {}) {
    commit('SET_DRAWER_OPEN', {
        drawerOpen: false
    });
}

export function SET_INCIDENT_FORM_DATA({commit, state}, {formData}) {
    commit('SET_INCIDENT_FORM_DATA', {
        formData
    });
}

export function CLEAR_INCIDENT_FORM_DATA_AND_IMAGES({commit, state}, {}) {
    commit('CLEAR_INCIDENT_FORM_DATA_AND_IMAGES', {});
}

export function ADD_INCIDENT_IMAGE({commit, state}, {imageData}) {
    commit('ADD_INCIDENT_IMAGE', {
        imageData
    });
}

export function DELETE_INCIDENT_IMAGE({commit, state}, {imageIndex}) {
    commit('DELETE_INCIDENT_IMAGE', {
        imageIndex
    });
}

/*
export function SET_LOADING_MESSAGE({commit, state}, {message}) {
    commit('SET_LOADING_MESSAGE', {
        message
    });
}*/
