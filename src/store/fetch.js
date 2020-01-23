import ApiResult from '../model/ApiResult';

const baseURL = 'https://fenrir.studio/d/gistda_dev';
export const provinceCode = [
    73, // นครปฐม
    35, // ยโสธร
];

async function _fetch(method, path, bodyData, headerData) {
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

export async function fetchCoordinates(province, idList) {
    let paramIdList = '';

    if (idList && idList.length > 0) {
        paramIdList = 'cat_id=';
        idList.forEach(id => {
            paramIdList += `${id},`;
        });
        paramIdList = paramIdList.slice(0, -1);
    }

    const url = `${baseURL}/coords/?province_code=${provinceCode[province]}&${paramIdList}`;
    console.log(`Fetching ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const responseJson = await response.json();

        const data = responseJson.features;

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