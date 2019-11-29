import imageListNakhonPathom from '../../assets/images/screen_map/ic_list_nakhon_pathom.png';
import imageAlertNakhonPathom from '../../assets/images/screen_map/ic_alert_nakhon_pathom.png';
import imageListYasothon from '../../assets/images/screen_map/ic_list_yasothon.png';
import imageAlertYasothon from '../../assets/images/screen_map/ic_alert_yasothon.png';
import buttonAddNakhonPathom from '../../assets/images/bottom_nav/button_add_nakhon_pathom.png';
import buttonAddYasothon from '../../assets/images/bottom_nav/button_add_yasothon.png';
import bgBottomNavNakhonPathom from '../../assets/images/bottom_nav/bg_tab_bar_nakhon_pathom.png';
import bgBottomNavYasothon from '../../assets/images/bottom_nav/bg_tab_bar_yasothon.png';

export const DEBUG = true;

export const PROVINCE_NAME_TH = ['นครปฐม', 'ยโสธร'];
export const PROVINCE_NAME_EN = ['Nakhon Pathom', 'Yasothon'];
export const MAP_HEADER = {
    height: 118,
    title: [
        PROVINCE_NAME_TH[0],
        PROVINCE_NAME_TH[1],
    ],
    background: [
        {
            startColor: '#09097e',
            endColor: '#4041da',
        },
        {
            startColor: '#ed4100',
            old_endColor: '#ff7946',
            endColor: '#f47442',
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
            endColor: '#4041da',
        },
        {
            startColor: '#d93d00',
            old_endColor: '#ff7946',
            endColor: '#f47442',
        },
    ],
    filterTypeTextColor: [
        '#2cc3f8',
        '#ffd668'
    ],
    sliderColor: [
        '#4041da',
        '#ff7946'
    ]
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