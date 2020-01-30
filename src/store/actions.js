import {
    provinceCode,
    fetchCoordinateCategories,
    fetchCoordinates,
    fetchCoordinates_old,
    doGetNews,
    doGetEr,
    doGetNewsDetails,
    fetchPosts,
    doGetSuggest,
    doGetHistory,
    submitFormData,
    doLogin,
    doRegister,
    doLoginFacebook,
    doGetProfile,
    doUpdateProfile,
    doChangePassword,
    doGetWeather,
} from './fetch';

import {INCIDENT_FORM_DATA, PROVINCE_NAME_EN} from '../constants/index';
import {DISTRICT_DATA} from '../constants/district';
import User from '../model/User';
import {setUser, getUser} from '../store/db';
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
                        if (category.markerVisibility /*&& !category.markerList*/) {
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
                } else {
                    callback(true, null);
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
            coordinateList: apiResult.data.features,
            wmsList: apiResult.data.wms,
            callback: () => {
                callback(true, null);
            }
        });
    } else {
        commit('SET_COORDINATES', {
            coordinateList: [],
            wmsList: [],
            callback: () => {
                callback(false, apiResult.message);
            }
        });
    }
}

export async function SEARCH({commit, state}, {province, searchTerm, callback}) {
    commit('SEARCHING');

    const apiResult = await fetchCoordinates(province, null, searchTerm);
    if (apiResult.success) {
        commit('SET_SEARCH_RESULT', {
            coordinateList: apiResult.data.features,
            wmsList: apiResult.data.wms,
            callback: () => {
                callback(true, null);
            }
        });
    } else {
        commit('SET_SEARCH_RESULT', {
            coordinateList: [],
            wmsList: [],
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
        /*subdistrict: DISTRICT_DATA[state.province][state.incidentFormData[INCIDENT_FORM_DATA.KEY_DISTRICT]]
            .subDistricts[state.incidentFormData[INCIDENT_FORM_DATA.KEY_SUB_DISTRICT]],
        district: DISTRICT_DATA[state.province][state.incidentFormData[INCIDENT_FORM_DATA.KEY_DISTRICT]].district,*/
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

    const apiResult = await submitFormData(state.userToken, formData);
    commit('SUBMITTING_INCIDENT_FORM_DATA', {isSubmitting: false});

    if (apiResult.success) {
        callback(true, null);
    } else {
        callback(false, apiResult.message);
    }
}

export async function FETCH_NEWS({commit, state}, {province, callback}) {
    commit('FETCHING_NEWS');

    const apiResult = await doGetNews(province);
    if (apiResult.success) {
        console.log(`News list count: ${apiResult.data.list.length}`);

        commit('SET_NEWS', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        console.log(`Error get news list`);

        commit('SET_NEWS', {
            dataList: null
        });
        callback(false, apiResult.message);
    }
}

export async function FETCH_NEWS_DETAILS({commit, state}, {newsId, callback}) {
    commit('FETCHING_NEWS_DETAILS');

    const apiResult = await doGetNewsDetails(newsId);
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

    const apiResult = await doGetEr(province);
    if (apiResult.success) {
        console.log(`Er list count: ${apiResult.data.list.length}`);

        commit('SET_ER', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        console.log(`Error get er list`);

        commit('SET_ER', {
            dataList: null
        });
        callback(false, apiResult.message);
    }
}

export async function FETCH_SUGGEST({commit, state}, {province, callback}) {
    commit('FETCHING_SUGGEST');

    const apiResult = await doGetSuggest(province);
    if (apiResult.success) {
        console.log(`Suggest list count: ${apiResult.data.list.length}`);

        commit('SET_SUGGEST', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        console.log(`Error get suggest list`);

        commit('SET_SUGGEST', {
            dataList: null
        });
        callback(false, apiResult.message);
    }
}

export async function FETCH_HISTORY({commit, state}, {province, callback}) {
    commit('FETCHING_HISTORY');

    //const userToken = 'FqpKh7GbRPsBoH1nPGmMaPfCOyNjUg';
    const userToken = state.userToken;

    const apiResult = await doGetHistory(province, userToken);
    if (apiResult.success) {
        console.log(`History list count: ${apiResult.data.list.length}`);

        commit('SET_HISTORY', {
            dataList: apiResult.data.list
        });
        callback(true, null);
    } else {
        console.log(`Error get history list`);

        commit('SET_HISTORY', {
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

export async function LOGIN({commit, state}, {email, password, callback}) {
    commit('LOGGING_IN');

    const apiResult = await doLogin(email, password);
    if (apiResult.success) {
        await setUser(new User(
            apiResult.data.name,
            apiResult.data.token
        ));
        commit('SET_USER', {
            userDisplayName: apiResult.data.name,
            userToken: apiResult.data.token,
        });
        callback(true, null);
    } else {
        commit('SET_USER', {
            userDisplayName: null,
            userToken: null,
        });
        callback(false, apiResult.message);
    }
}

export async function REGISTER({commit, state}, {formData, callback}) {
    commit('REGISTERING');

    const apiResult = await doRegister(formData);
    if (apiResult.success) {
        await setUser(new User(
            apiResult.data.name,
            apiResult.data.token
        ));
        commit('SET_USER', {
            userDisplayName: apiResult.data.name,
            userToken: apiResult.data.token,
            userPhone: null,
            userEmail: null,
        });
        callback(true, null);
    } else {
        commit('SET_USER', {
            userDisplayName: null,
            userToken: null,
            userPhone: null,
            userEmail: null,
        });
        callback(false, apiResult.message);
    }
}

export async function LOGIN_FACEBOOK({commit, state}, {formData, callback}) {
    commit('LOGGING_IN');

    const apiResult = await doLoginFacebook(formData);
    if (apiResult.success) {
        await setUser(new User(
            apiResult.data.name,
            apiResult.data.token
        ));
        commit('SET_USER', {
            userDisplayName: apiResult.data.name,
            userToken: apiResult.data.token,
            userPhone: null,
            userEmail: null,
        });
        callback(true, null);
    } else {
        commit('SET_USER', {
            userDisplayName: null,
            userToken: null,
            userPhone: null,
            userEmail: null,
        });
        callback(false, apiResult.message);
    }
}

export async function GET_PROFILE({commit, state}, {}) {
    commit('GETTING_PROFILE');

    const apiResult = await doGetProfile(state.userToken);
    if (apiResult.success) {
        await setUser(new User(
            apiResult.data.name,
            state.userToken
        ));
        commit('SET_USER', {
            userDisplayName: apiResult.data.name,
            userToken: state.userToken,
            userPhone: apiResult.data.phone,
            userEmail: apiResult.data.email,
        });
        //callback(true, null);
    } else {
        commit('SET_USER', {
            userDisplayName: state.userDisplayName,
            userToken: state.userToken,
            userPhone: state.userPhone,
            userEmail: state.userEmail,
        });
        //callback(false, apiResult.message);
    }
}

export async function UPDATE_PROFILE({commit, state}, {formData, callback}) {
    commit('UPDATING_PROFILE');

    const apiResult = await doUpdateProfile(state.userToken, formData);
    if (apiResult.success) {
        await setUser(new User(
            formData.name,
            state.userToken
        ));
        commit('SET_USER', {
            userDisplayName: formData.name,
            userToken: state.userToken,
            userPhone: formData.phone,
            userEmail: formData.email,
        });
        callback(true, null);
    } else {
        commit('SET_USER', {
            userDisplayName: state.userDisplayName,
            userToken: state.userToken,
            userPhone: state.userPhone,
            userEmail: state.userEmail,
        });
        callback(false, apiResult.message);
    }
}

export async function CHANGE_PASSWORD({commit, state}, {formData, callback}) {
    commit('CHANGING_PASSWORD');

    const apiResult = await doChangePassword(state.userToken, {
        old_password: formData.oldPassword,
        password: formData.newPassword,
    });
    if (apiResult.success) {
        commit('FINISH_CHANGING_PASSWORD');
        callback(true, null);
    } else {
        commit('FINISH_CHANGING_PASSWORD');
        callback(false, apiResult.message);
    }
}

export async function LOGOUT({commit, state}, {callback}) {
    await setUser(new User(
        null,
        null
    ));
    commit('SET_USER', {
        userDisplayName: null,
        userToken: null,
    });
    callback();
}

export async function GET_LOGGED_USER({commit, state}, {callback}) {
    console.log('Get logged user');

    const user = await getUser();
    if (user) {
        commit('SET_USER', {
            userDisplayName: user.displayName,
            userToken: user.token,
            userPhone: null,
            userEmail: null,
        });
        callback(true, null);
    } else {
        commit('SET_USER', {
            userDisplayName: null,
            userToken: null,
            userPhone: null,
            userEmail: null,
        });
        callback(false, null);
    }
}

export async function GET_WEATHER({commit, state}, {province, callback}) {
    commit('FETCHING_TEMPERATURE');

    const apiResult = await doGetWeather(province);
    if (apiResult.success) {
        commit('SET_TEMPERATURE', {
            province,
            temperature: apiResult.data.temperature,
            description: apiResult.data.description,
        });
        callback(true, null);
    } else {
        commit('SET_TEMPERATURE', {
            province,
            temperature: state.temperature[PROVINCE_NAME_EN[province]],
            description: state.weatherDescription[PROVINCE_NAME_EN[province]],
        });
        callback(false, null);
    }
}

/*
export function SET_LOADING_MESSAGE({commit, state}, {message}) {
    commit('SET_LOADING_MESSAGE', {
        message
    });
}*/
