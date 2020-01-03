import ApiResult from '../model/ApiResult';

const baseURL = 'https://fenrir.studio/d/gistda_dev';
const provinceCode = [
    73, // นครปฐม
    35, // ยโสธร
];

export async function _fetch(path) {
    const url = `${baseURL}/${path}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const responseJson = await response.json();

        const statusCode = responseJson.result.status_code;
        const message = responseJson.result.description;
        const data = responseJson.result.data;

        if (statusCode === 200) {
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

export async function fetchCoordinateCategories(province) {
    //todo: รเบุ province
    return await _fetch(`coords/categories`);
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

export async function fetchNews(province) {
    //news/pr?province_code=35&limit=20&offset=0
    const LIMIT = 20;
    const OFFSET = 0;
    return await _fetch(`news/pr?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`);
}

export async function fetchNewsDetails(newsId) {
    //news/1
    return await _fetch(`news/${newsId}`);
}

export async function fetchEr(province) {
    //er?province_code=35
    const LIMIT = 20;
    const OFFSET = 0;
    return await _fetch(`er?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`);
}

export async function fetchSuggest(province) {
    //news/suggest?province_code=35&limit=20&offset=0
    const LIMIT = 20;
    const OFFSET = 0;
    return await _fetch(`news/suggest?province_code=${provinceCode[province]}&limit=${LIMIT}&offset=${OFFSET}`);
}