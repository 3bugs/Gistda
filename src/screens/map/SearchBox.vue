<template>
    <view class="container">
        <menu
                ref="searchMenu"
                :renderer="Popover"
                :rendererProps="{preferredPlacement: 'bottom'}"
                :style="{
                    flex: 1,
                    width: '100%',
                    flexDirection: 'column',
                }">
            <menu-trigger :custom-styles="{TriggerTouchableComponent: null}">
                <card-view
                        :card-elevation="4"
                        :card-maxElevation="4"
                        :corner-radius="25"
                        :style="{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: 6,
                            paddingBottom: 6,
                            paddingLeft: 15,
                            paddingRight: 15,
                            height: 50,
                            backgroundColor: '#fff'
                        }">
                    <text-input
                            class="search-input"
                            v-model="searchTerm"
                            return-key-type="search"
                            :on-submit-editing="handleClickSearch"
                            :on-touch-start="() => this.$refs['searchMenu'].open()"
                            _placeholder="mapCurrentRegion ? `${mapCurrentRegion.latitude.toFixed(6)}, ${mapCurrentRegion.longitude.toFixed(6)}` : ''"
                            placeholder="ค้นหา"
                            placeholder-text-color="#aaa"
                            :editable="false"/>
                    <view class="divider"/>

                    <touchable-opacity
                            v-if="!isSearching"
                            class="list-icon-touchable"
                            :on-press="handleClickSearch">
                        <!--MAP_HEADER.listIcon[province]-->
                        <image :source="imageSearch"
                               class="list-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>

                    <!--<touchable-opacity
                            v-if="!isSearching && showSearchResult"
                            class="list-icon-touchable"
                            :on-press="handleClickClearSearch">
                        <image :source="imageClose"
                               class="list-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>-->

                    <activity-indicator
                            v-if="isSearching"
                            :style="{alignSelf: 'center'}"
                            size="small"
                            :color="COLOR_PRIMARY[province]"/>
                </card-view>
            </menu-trigger>
            <menu-options :style="{padding: 10}">
                <menu-option
                        v-for="(item, index) in menuOptionList"
                        class="menu-option"
                        :on-select="() => handleClickSearch(index)"
                        :custom-styles="{OptionTouchableComponent: TouchableOpacity}">
                    <text class="menu-option-text">
                        {{item}}
                    </text>
                </menu-option>
            </menu-options>
        </menu>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG, COLOR_PRIMARY, MAP_HEADER, PROVINCE_NAME_EN, PROVINCE_NAME_TH} from '../../constants';
    import {requestAndroidPermissions, getCurrentLocation} from '../../constants/utils'

    import {Dimensions, TouchableOpacity, Keyboard, Alert} from 'react-native';
    import {Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
    import CardView from 'react-native-cardview';
    import {doSearchLocal} from "../../store/fetch";

    import imageSearch from '../../../assets/images/ic_search.png';

    const {Popover} = renderers;

    export default {
        components: {
            Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger,
            CardView,
        },
        props: {
            navigation: {
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            isSearching() {
                return store.state.searching;
            },
        },
        data: () => {
            return {
                DEBUG, COLOR_PRIMARY, MAP_HEADER, PROVINCE_NAME_TH,
                Dimensions, TouchableOpacity, imageSearch,
                Popover,
                _menuOptionList: [
                    'ค้นหา',
                    'ค้นหาภายในรัศมี 1 กม.',
                    'ค้นหาภายในรัศมี 5 กม.',
                    'ค้นหาภายในรัศมี 10 กม.',
                    'ค้นหาภายในรัศมี 50 กม.',
                    `ค้นหาตำบล อำเภอ ใน จ.${PROVINCE_NAME_TH[store.state.province]}`,
                    `ค้นหาจากพิกัด (ละติจูด, ลองจิจูด)`,
                ],
                menuOptionList: [
                    'ค้นหาจากข้อมูลของแอป',
                    'ค้นหาจากข้อมูล Google Maps',
                    'ค้นหาด้วยพิกัด (ละติจูด, ลองจิจูด)',
                ],
                searchTerm: '',
            };
        },
        methods: {
            handleClickSearch: function (index) {
                getCurrentLocation({
                    callback: coord => {
                        const currentLocation = {
                            latitude: coord.latitude,
                            longitude: coord.longitude
                        };

                        switch (index) {
                            case 0:
                                this.navigation.navigate('Search', {
                                    searchType: 'backend',
                                    currentLocation
                                });
                                break;
                            case 1:
                                this.navigation.navigate('Search', {
                                    searchType: 'google',
                                    currentLocation
                                });
                                break;
                            case 2:
                                this.navigation.navigate('Search', {
                                    searchType: 'latlng',
                                    currentLocation
                                });
                                break;
                        }
                    }
                });
            },
            _handleClickSearch: function (index) {
                if (this.searchTerm && this.searchTerm.trim().length > 0) {
                    Keyboard.dismiss();

                    let radius = null;
                    switch (index) {
                        case 0:
                            this.doSearchApi({});
                            break;
                        case 1:
                            if (!radius) radius = 1;
                        case 2:
                            if (!radius) radius = 5;
                        case 3:
                            if (!radius) radius = 10;
                        case 4:
                            if (!radius) radius = 50;

                            getCurrentLocation({
                                callback: coord => {
                                    const currentLocation = {
                                        latitude: coord.latitude,
                                        longitude: coord.longitude
                                    };
                                    this.doSearchApi({currentLocation, radius});
                                }
                            });
                            break;
                        case 5:
                            this.doSearchLocal();
                            break;
                        case 6:
                            const COMMA = ',';
                            const searchTerm = this.searchTerm.trim();
                            const part = searchTerm.split(COMMA);

                            if (searchTerm.indexOf(COMMA) === -1
                                || part.length !== 2
                                || isNaN(parseFloat(part[0]))
                                || isNaN(parseFloat(part[1]))) {
                                Alert.alert('ผิดพลาด', 'รูปแบบไม่ถูกต้อง ให้กรอกค่าในรูปแบบ "ละติจูด , ลองจิจูด" เช่น\n\n15.7810 , 104.1192');
                            } else {
                                const latLng = {
                                    latitude: Math.floor(parseFloat(part[0]) * 1000) / 1000,
                                    longitude: Math.floor(parseFloat(part[1]) * 1000) / 1000
                                };
                                this.doSearchApi({latLng});
                            }
                            break;
                    }
                } else {
                    Alert.alert('ผิดพลาด', 'กรอกคำที่ต้องการค้นหา');
                }
            },
            doSearchApi: function ({currentLocation = null, radius = null, latLng = null}) {
                store.dispatch('SEARCH', {
                    province: this.province,
                    searchTerm: this.searchTerm.trim(),
                    currentLocation, radius, latLng,
                    callback: (success, message) => {
                        if (success) {
                            if (store.state.searchResultList[PROVINCE_NAME_EN[this.province]].length === 0) {
                                Alert.alert('ผลการค้นหา', 'ไม่พบข้อมูล');
                            } else {
                                this.navigation.navigate('SearchResult');
                            }
                        } else {
                            Alert.alert('ผิดพลาด', message);
                        }
                    },
                });
            },
            /*ค้นหาตำบล อำเภอ*/
            doSearchLocal: function () {
                store.dispatch('SEARCH_LOCAL', {
                    province: this.province,
                    searchTerm: this.searchTerm,
                    callback: (success, message) => {
                        if (success) {
                            if (store.state.searchResultList[PROVINCE_NAME_EN[this.province]].length === 0) {
                                Alert.alert('ผลการค้นหา', 'ไม่พบข้อมูล');
                            } else {
                                this.navigation.navigate('SearchResult');
                            }
                        } else {
                            Alert.alert('ผิดพลาด', message);
                        }
                    },
                });
            },
        },
    }
</script>

<style>
    .container {
        flex: 1;
    }

    .search-input {
        flex: 1;
        align-self: center;
        font-family: DBHeaventt-Light;
        padding-top: 0;
        padding-bottom: 0;
        color: black;
        font-size: 22;
        border-width: 0;
        border-color: orangered;
    }

    .divider {
        width: 1;
        background-color: #d0d0d0;
        margin-left: 10;
        margin-right: 10;
    }

    .list-icon-touchable {
        align-self: center;
        padding: 0;
    }

    .list-icon {
        width: 24;
        height: 24;
    }

    .menu-option {
        width: 100%;
    }

    .menu-option-text {
        width: 100%;
        font-family: DBHeavent;
        font-size: 22;
    }
</style>
