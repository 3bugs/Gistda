import {fetchPosts} from './fetch';
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

import imageFilterGeoAccident from '../../assets/ic_filter/ic_filter_geo_accident.png';
import imageFilterGeoRiskArea from '../../assets/ic_filter/ic_filter_geo_risk_area.png';
import imageFilterGeoRoute from '../../assets/ic_filter/ic_filter_geo_route.png';

export function FETCH_MAP_DATA({commit, state}, {province}) {
    commit('FETCHING_MAP_DATA');
    commit('SET_MAP_DATA', {
        mapDataList: [
            {
                filterTitle: 'ตำแหน่งอุบัติเหตุ',
                filterIcon: imageFilterGeoAccident,
                markerOpacity: 1,
                markerVisibility: false,
                markerList: [
                    {
                        coordinate: {
                            latitude: 13.8100,
                            longitude: 100.04427,
                        },
                        title: 'ทดสอบ 1',
                        description: 'รายละเอียด ทดสอบ 1',
                    },
                    {
                        coordinate: {
                            latitude: 13.8200,
                            longitude: 100.05627,
                        },
                        title: 'ทดสอบ 2',
                        description: 'รายละเอียด ทดสอบ 2',
                    },
                    {
                        coordinate: {
                            latitude: 13.8300,
                            longitude: 100.04227,
                        },
                        title: 'ทดสอบ 3',
                        description: 'รายละเอียด ทดสอบ 3',
                    },
                ]
            },
            {
                filterTitle: 'พื้นที่เสี่ยงบนท้องถนน',
                filterIcon: imageFilterGeoRiskArea,
                markerOpacity: 1,
                markerVisibility: true,
                markerList: [
                    {
                        coordinate: {
                            latitude: 13.8400,
                            longitude: 100.01427,
                        },
                        title: 'ทดสอบ 4',
                        description: 'รายละเอียด ทดสอบ 4',
                    },
                    {
                        coordinate: {
                            latitude: 13.8000,
                            longitude: 100.02627,
                        },
                        title: 'ทดสอบ 5',
                        description: 'รายละเอียด ทดสอบ 5',
                    },
                    {
                        coordinate: {
                            latitude: 13.7900,
                            longitude: 100.03227,
                        },
                        title: 'ทดสอบ 6',
                        description: 'รายละเอียด ทดสอบ 6',
                    },
                ]
            },
            {
                filterTitle: 'เส้นทางคมนาคม',
                filterIcon: imageFilterGeoRoute,
                markerOpacity: 0.5,
                markerVisibility: true,
                markerList: [
                    {
                        coordinate: {
                            latitude: 13.8450,
                            longitude: 100.01827,
                        },
                        title: 'ทดสอบ 4',
                        description: 'รายละเอียด ทดสอบ 4',
                    },
                    {
                        coordinate: {
                            latitude: 13.8050,
                            longitude: 100.02127,
                        },
                        title: 'ทดสอบ 5',
                        description: 'รายละเอียด ทดสอบ 5',
                    },
                    {
                        coordinate: {
                            latitude: 13.7950,
                            longitude: 100.02727,
                        },
                        title: 'ทดสอบ 6',
                        description: 'รายละเอียด ทดสอบ 6',
                    },
                ]
            },
        ], // mapDataList
    });
}

export function SET_MARKER_OPACITY({commit, state}, {key, opacity}) {
    commit('SET_MARKER_OPACITY', {
        key, opacity
    });
}

export function SET_MARKER_VISIBILITY({commit, state}, {key, visibility}) {
    commit('SET_MARKER_VISIBILITY', {
        key, visibility
    });
}