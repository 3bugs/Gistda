import imageListNakhonPathom from '../../assets/images/screen_map/ic_list_nakhon_pathom.png';
import imageAlertNakhonPathom from '../../assets/images/screen_map/ic_alert_nakhon_pathom.png';
import imageListYasothon from '../../assets/images/screen_map/ic_list_yasothon.png';
import imageAlertYasothon from '../../assets/images/screen_map/ic_alert_yasothon.png';

import buttonAddNakhonPathom from '../../assets/images/bottom_nav/button_add_nakhon_pathom.png';
import buttonAddYasothon from '../../assets/images/bottom_nav/button_add_yasothon.png';
import bgBottomNavNakhonPathom from '../../assets/images/bottom_nav/bg_tab_bar_nakhon_pathom.png';
import bgBottomNavYasothon from '../../assets/images/bottom_nav/bg_tab_bar_yasothon.png';

import imagePhoneNakhonPathom from '../../assets/images/screen_news/ic_phone_nakhon_pathom.png';
import imagePhoneYasothon from '../../assets/images/screen_news/ic_phone_yasothon.png';

import imageSliderThumbNakhonPathom from '../../assets/images/sidebar/ic_slider_thumb_nakhon_pathom_2.png';
import imageSliderThumbYasothon from '../../assets/images/sidebar/ic_slider_thumb_yasothon_2.png';

export const DEBUG = false;
export const APP_NAME = "SAFE SAFE";
export const APP_VERSION = "1.0";

export const PROVINCE_NAME_TH = ['นครปฐม', 'ยโสธร'];
export const PROVINCE_NAME_EN = ['Nakhon Pathom', 'Yasothon'];

export const COLOR_PRIMARY = ['#4041da', '#f47442'];
export const COLOR_PRIMARY_DARK = ['#09097e', '#ed4100'];

export const HEATMAP_CATEGORY_ID = 11;
export const SPEED_MONITOR_THRESHOLD = 100; // หน่วย km/h
export const SPEED_ALERT_MIN_INTERVAL = 10; // วินาที
export const MONITOR_INTERVAL = 20 // วินาที

export const STATIC_MAP_DIMENSION = {
    width: 600, height: 400
};

export const OPEN_WEATHER = {
    apiKey: '00ad0b84f4b3af86b70cf737f82cba83',
    cityId: [
        '1608533',
        '1604769'
    ]
};

export const GOOGLE_MAPS = {
    geocodingApiKey: 'AIzaSyCrBhuovlx9Wk2v7mQNvCg4JIL_affg0ks',
};

export const INCIDENT_FORM_DATA = {
    KEY_INCIDENT_CATEGORY: 'incidentCategory',
    KEY_DETAILS: 'details',
    KEY_PROVINCE: 'province',
    KEY_DISTRICT: 'district',
    KEY_SUB_DISTRICT: 'subDistrict',
    KEY_REPORTER: 'reporter',
    KEY_EMAIL: 'email',
    KEY_PHONE: 'phone',
    KEY_LATITUDE: 'latitude',
    KEY_LONGITUDE: 'longitude',
};

export const DIMENSION = {
    horizontal_margin: 16,
};
export const PROVINCE_DIMENSION = [
    {
        minLatitude: 13.5978,
        maxLatitude: 14.3090,
        minLongitude: 99.7962,
        maxLongitude: 100.3675,
    },
    {
        minLatitude: 15.1984,
        maxLatitude: 16.5366,
        minLongitude: 103.9440,
        maxLongitude: 104.8504,
    }
];
export const MAP_HEADER = {
    height: 118,
    title: [
        PROVINCE_NAME_TH[0],
        PROVINCE_NAME_TH[1],
    ],
    background: [
        {
            startColor: COLOR_PRIMARY_DARK[0],
            endColor: COLOR_PRIMARY[0],
        },
        {
            startColor: COLOR_PRIMARY_DARK[1],
            old_endColor: '#ff7946',
            endColor: COLOR_PRIMARY[1],
        },
    ],
    alertIcon: [
        imageAlertNakhonPathom,
        imageAlertYasothon
    ],
    listIcon: [
        imageListNakhonPathom,
        imageListYasothon
    ],
};
export const HEADER = {
    height: 93,
};
export const SIDEBAR = {
    headerBackground: [
        {
            startColor: '#38097e',
            endColor: '#11128a',
        },
        {
            startColor: '#ac2e00', //todo:
            endColor: '#c43500', //todo:
        },
    ],
    background: [
        {
            startColor: '#090963',
            endColor: COLOR_PRIMARY[0],
        },
        {
            startColor: '#d93d00',
            old_endColor: '#ff7946',
            endColor: COLOR_PRIMARY[1],
        },
    ],
    filterTypeTextColor: [
        '#2cc3f8',
        '#ffd668'
    ],
    sliderColor: [
        COLOR_PRIMARY[0],
        COLOR_PRIMARY[1]
    ],
    sliderThumb: [
        imageSliderThumbNakhonPathom,
        imageSliderThumbYasothon
    ],
};
export const BOTTOM_NAV = {
    height: 64,
    background: [
        bgBottomNavNakhonPathom,
        bgBottomNavYasothon
    ],
    addIcon: [
        buttonAddNakhonPathom,
        buttonAddYasothon
    ],
    lineColor: [
        '#ea4431',
        '#393abf'
    ],
};
export const SCREEN_NEWS = {
    phoneIcon: [
        imagePhoneNakhonPathom,
        imagePhoneYasothon
    ],
};
export const SCREEN_LOGIN = {
    background: [
        {
            startColor: COLOR_PRIMARY_DARK[0],
            endColor: COLOR_PRIMARY[0],
        },
        {
            startColor: COLOR_PRIMARY_DARK[1],
            endColor: COLOR_PRIMARY[1],
        },
    ],
};
export const FORM = {
    labelTextColor: [
        '#1665D8',
        '#ed4100',
    ],
    buttonColor: [
        COLOR_PRIMARY[0],
        COLOR_PRIMARY[1],
    ]
};