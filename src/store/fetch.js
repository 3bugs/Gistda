import ApiResult from '../model/ApiResult';
import {GOOGLE_MAPS, OPEN_WEATHER, STATIC_MAP_DIMENSION} from '../constants/index';
import {add} from "react-native-reanimated";
import {getDistrictDataList} from '../data/district.geo';
import {getSubDistrictDataList} from '../data/sub_district.geo';

//export const baseURL = 'https://fenrir.studio/d/gistda_dev';
export const baseURL = 'https://safesafe.ngis.go.th/gapi';
export const provinceCode = [
    73, // นครปฐม
    35, // ยโสธร
];

export function doSearchLocal(province, searchTerm) {
    const districtList = getDistrictDataList(province).filter(
        district => district.properties.NAME_T.indexOf(searchTerm) !== -1
    );
    const subDistrictList = getSubDistrictDataList(province).filter(
        subDistrict => subDistrict.properties.NAME_T.indexOf(searchTerm) !== -1
    );
    return districtList.concat(subDistrictList);
}

export async function doCallGoogleApi({endPoint, params}) {
    let queryParam = '';
    for (const prop in params) {
        if (Object.prototype.hasOwnProperty.call(params, prop)) {
            queryParam += `&${prop}=${params[prop]}`;
        }
    }

    const url = `https://maps.googleapis.com/maps/api/${endPoint}/json?key=${GOOGLE_MAPS.geocodingApiKey}&language=th${queryParam}`;

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        console.log('Response JSON:');
        console.log(responseJson);
        console.log(JSON.stringify(responseJson));

        if (responseJson.status === 'OK') {
            return new ApiResult(
                true,
                '',
                responseJson
            );
        } else {
            return new ApiResult(
                false,
                `เกิดข้อผิดพลาดในการเชื่อมต่อ Google Maps API`,
                null
            );
        }
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

//https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCrBhuovlx9Wk2v7mQNvCg4JIL_affg0ks&language=th&origin=13.7563,100.5018&input=%E0%B8%9A%E0%B8%B2%E0%B8%87
export async function doGetPlaceAutocomplete(searchTerm, latitude, longitude) {
    return await doCallGoogleApi({
        endPoint: 'place/autocomplete',
        params: {
            origin: `${latitude},${longitude}`,
            input: searchTerm,
        }
    });
}

//https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyCrBhuovlx9Wk2v7mQNvCg4JIL_affg0ks&language=th&fields=name,formatted_address,geometry,photo&place_id=ChIJEeyoKxG1AjER8AcmAwZliuc
export async function doGetPlaceDetails(placeId) {
    return await doCallGoogleApi({
        endPoint: 'place/details',
        params: {
            place_id: placeId,
            fields: 'name,formatted_address,geometry',
        }
    });
}

//https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyCrBhuovlx9Wk2v7mQNvCg4JIL_affg0ks&language=th&query=%E0%B8%95.%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B8%99%20%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9B%E0%B8%90%E0%B8%A1
export async function doPlaceTextSearch(query, latitude, longitude, radius) {
    const params = {query};
    if (latitude != null && longitude != null && radius != null) {
        params.location = `${latitude},${longitude}`;
        params.radius = radius;
    }

    return await doCallGoogleApi({
        endPoint: 'place/textsearch',
        params
    });
}

//https://maps.googleapis.com/maps/api/geocode/json?latlng=13.7563,100.5018&key=AIzaSyCrBhuovlx9Wk2v7mQNvCg4JIL_affg0ks&language=th
export async function doGetAddress(latitude, longitude) {
    return await doCallGoogleApi({
        endPoint: 'geocode',
        params: {
            latlng: `${latitude},${longitude}`,
        }
    });
}

export async function doGetAddressFromCoord(latitude, longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS.geocodingApiKey}&language=th`;

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        console.log('Response JSON:');
        console.log(responseJson);
        console.log(JSON.stringify(responseJson));

        if (responseJson.results.length > 0) {
            const address = responseJson.results[0].formatted_address;
            console.log(`Address of ${latitude}, ${longitude}: ${address}`);

            return new ApiResult(
                true,
                '',
                {address}
            );
        } else {
            return new ApiResult(
                false,
                `N/A`,
                null
            );
        }
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

export async function doGetStaticMapsWithDirections(origin, destination) {
    const WIDTH = STATIC_MAP_DIMENSION.width;
    const HEIGHT = STATIC_MAP_DIMENSION.height;

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS.geocodingApiKey}&language=th`;

    try {
        const response = await fetch(directionsUrl);
        const responseJson = await response.json();

        console.log('Response JSON:');
        console.log(responseJson);
        console.log(JSON.stringify(responseJson));

        if (responseJson.routes.length > 0) {
            const distanceText = responseJson.routes[0].legs[0].distance.text;
            const durationText = responseJson.routes[0].legs[0].duration.text;
            const encodedPolyline = responseJson.routes[0].overview_polyline.points;
            console.log(`Encoded polyline: ${encodedPolyline}`);

            const marker = `&markers=color:red%7C${destination.latitude},${destination.longitude}`;
            const staticMapsUrl = `https://maps.googleapis.com/maps/api/staticmap?size=${WIDTH}x${HEIGHT}${marker}&path=enc%3A${encodedPolyline}&key=${GOOGLE_MAPS.geocodingApiKey}&language=th`;
            console.log(`Static maps: ${staticMapsUrl}`);

            return new ApiResult(
                true,
                '',
                {
                    distanceText,
                    durationText,
                    staticMapsUrl
                }
            );
        } else {
            return new ApiResult(
                false,
                `N/A`,
                null
            );
        }
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

export async function doGetWeather(province) {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${OPEN_WEATHER.cityId[province]}&APPID=${OPEN_WEATHER.apiKey}&lang=th&units=metric`;

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        console.log('Response JSON:');
        console.log(responseJson);
        console.log(JSON.stringify(responseJson));

        const provinceName = responseJson.name;
        const temperature = responseJson.main.temp.toFixed(1);

        let description = '';
        if (responseJson.weather.length > 0) {
            description = responseJson.weather[0].description;
        }

        console.log(`Temperature of ${provinceName}: ${temperature}`);

        return new ApiResult(
            true,
            '',
            {temperature, description}
        );
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

async function _fetch(method, path, bodyData, headerData = null) {
    const url = `${baseURL}/${path}`;

    console.log(`_fetch(\n\t${method}\n\t${url}\n\t${JSON.stringify(bodyData)}\n)`);

    try {
        const params = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        if (method === 'POST') {
            /*params['headers'] = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };*/
            params['body'] = JSON.stringify(bodyData);
        }
        if (headerData) {
            for (let prop in headerData) {
                if (Object.prototype.hasOwnProperty.call(headerData, prop)) {
                    params['headers'][prop] = headerData[prop];
                }
            }
            //params['headers'] = headerData;
        }

        const response = await fetch(url, params);
        const responseJson = await response.json();

        console.log('Response JSON:');
        console.log(responseJson);
        console.log(JSON.stringify(responseJson));

        const statusCode = responseJson.result.status_code;
        const message = responseJson.result.description;
        const data = responseJson.result.data;

        if (statusCode === 200 || statusCode === 201) {
            return new ApiResult(
                true,
                message,
                data
            );
        } else {
            return new ApiResult(
                false,
                `[${statusCode}]: ${message}`,
                null
            );
        }
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

export async function submitFormData(userToken, formData) {
    const url = `${baseURL}/alarms/send`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(formData)
        });

        console.log('Response raw:');
        console.log(response);
        const responseJson = await response.json();

        console.log('Response JSON:');
        console.log(responseJson);
        console.log(JSON.stringify(responseJson));

        const statusCode = responseJson.result.status_code;
        const message = responseJson.result.description;

        if (statusCode === 200) {
            return new ApiResult(
                true,
                message,
                null
            );
        } else {
            return new ApiResult(
                false,
                `[${statusCode}]: ${message}`,
                null
            );
        }
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

export async function fetchCoordinateCategories(province) {
    //todo: รเบุ province
    return await _fetch('GET', `coords/categories`, null);
}

export async function fetchCoordinates({province, idList, coordId = null, searchTerm, latLng}) {
    let paramIdList = '';
    let search = '';

    if (idList && idList.length > 0) {
        paramIdList = '&cat_id=';
        idList.forEach(id => {
            paramIdList += `${id},`;
        });
        paramIdList = paramIdList.slice(0, -1);
    }

    if (latLng) {
        search = `&lat=${latLng.latitude}&lng=${latLng.longitude}`;
    } else if (searchTerm && searchTerm.trim().length > 0) {
        search = `&search=${searchTerm}`;
    }

    let url;
    if (coordId == null) {
        url = `${baseURL}/coords/?province_code=${provinceCode[province]}${paramIdList}${search}`;
    } else {
        url = `${baseURL}/coords/${coordId}`;
    }
    console.log(`Fetching ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const responseJson = await response.json();
        const data = responseJson;

        return new ApiResult(
            true,
            '',
            data
        );
    } catch (error) {
        return new ApiResult(
            false,
            `เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย - ${error}`,
            null
        );
    }
}

export async function doLogin(email, password) {
    return await _fetch('POST', 'users/login', {
        email, password
    });

    //return await fakeLogin();
}

export async function doRegister(formData) {
    return await _fetch('POST', 'users/register', formData);
}

export async function doLoginSocial(socialType, formData) {
    return await _fetch('POST', `users/login/${socialType}`, formData);
}

export async function doGetProfile(userToken) {
    return await _fetch('GET', 'users/profile', null, {
        Authorization: `Bearer ${userToken}`,
    });
}

export async function doUpdateProfile(userToken, formData) {
    return await _fetch('POST', 'users/update', formData, {
        Authorization: `Bearer ${userToken}`,
    });
}

export async function doChangePassword(userToken, formData) {
    return await _fetch('POST', 'users/changepassword', formData, {
        Authorization: `Bearer ${userToken}`,
    });
}

export async function doGetReport(province) {
    return await _fetch('GET', `reports/?province_code=${provinceCode[province]}`, null);
}

export async function doGetReportDownloadLink(province) {
    return await _fetch('GET', `reports/download/?province_code=${provinceCode[province]}`, null);
}

async function fakeLogin() {
    await timeout(2000);

    return new ApiResult(
        true,
        '',
        {
            name: 'Promlert Lovichit',
            token: 'Ejk4xGtC1LTtUwEs2QcAiwP2KVWS9q'
        }
    );
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function fetchCoordinates_old() {
    return [
        {
            "type": "Feature",
            "id": 1194,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    100.1178728,
                    14.1181364
                ]
            },
            "properties": {
                "NAME_T": "สถานีขนส่งบางหลวง",
                "LOCATION_T": "",
                "CATEGORY": 1,
                "P_CODE": 73,
                "IMAGES": []
            }
        },
        {
            "type": "Feature",
            "id": 1193,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    100.0641947,
                    13.8148658
                ]
            },
            "properties": {
                "NAME_T": "สถานีขนส่งผู้โดยสาร จ.นครปฐม",
                "LOCATION_T": "",
                "CATEGORY": 1,
                "P_CODE": 73,
                "IMAGES": []
            }
        },
        {
            "type": "Feature",
            "id": 1192,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    100.2885255,
                    13.790154
                ]
            },
            "properties": {
                "NAME_T": "สถานีขนส่งสินค้าพุทธมณฑล",
                "LOCATION_T": "",
                "CATEGORY": 2,
                "P_CODE": 73,
                "IMAGES": []
            }
        },

        /*{
            category_id: 1,
            list: [
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
            category_id: 2,
            list: [
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
        }*/
    ];
}

export async function doGetNews(province) {
    //news/pr?province_code=35&limit=20&offset=0
    const LIMIT = 100;
    const OFFSET = 0;
    return await _fetch(
        'GET',
        `news/pr?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`,
        null
    );
}

export async function doGetNewsDetails(newsId) {
    //news/1
    return await _fetch('GET', `news/${newsId}`, null);
}

export async function doGetEr(province) {
    //er?province_code=35
    const LIMIT = 100;
    const OFFSET = 0;
    return await _fetch(
        'GET',
        `er?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`,
        null
    );
}

export async function doGetSuggest(province) {
    //news/suggest?province_code=35&limit=20&offset=0
    const LIMIT = 100;
    const OFFSET = 0;
    return await _fetch(
        'GET',
        `news/suggest?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`,
        null
    );
}

export async function doGetHistory(province, userToken) {
    //news/alarms?province_code=35&limit=20&offset=0
    const LIMIT = 100;
    const OFFSET = 0;
    return await _fetch(
        'GET',
        `alarms?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`,
        null,
        {
            Authorization: `Bearer ${userToken}`,
        }
    );
}

export async function doGetAlarm(province) {
    //news/alarms?province_code=35&limit=20&offset=0
    const LIMIT = 100;
    const OFFSET = 0;
    return await _fetch(
        'GET',
        `alarms?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`,
        null,
        null
    );
}

export async function doGetAlarmDetails(id) {
    return await _fetch(
        'GET',
        `alarms/${id}`,
        null,
        null
    );
}
