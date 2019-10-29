<template>
    <view class="container">
        <map-view class="map-view"
                  :initial-region="{
            latitude: 13.8196,
            longitude: 100.04427,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }"/>
        <view class="header-container">
            <linear-gradient class="header"
                             :colors="['#09097e', '#4041da']">
                <touchable-opacity class="menu-icon-touchable">
                    <image :source="icMenuNakhonPathom"
                           class="menu-icon"
                           resize-mode="contain"/>
                </touchable-opacity>

                <text class="province-name">นครปฐม</text>

                <touchable-opacity class="alert-icon-touchable">
                    <image :source="icAlertNakhonPathom"
                           class="alert-icon"
                           resize-mode="contain"/>
                </touchable-opacity>
            </linear-gradient>
            <view class="search-input-container">
                <image-background :style="{
                flexDirection: 'row',
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 15,
                paddingRight: 15,
                height: 50,
                backgroundColor: '#fff',
                shadowColor: '#808080',
                shadowRadius: 5,
                shadowOffset: { height: 0, width: 0},
                shadowOpacity: 0.75,
                elevation: 1,
                borderWidth: 1,
                borderRadius: 28,
                borderColor: '#e0e0e0'}">
                    <text-input class="search-input"
                                placeholder="Search"
                                placeholder-text-color="#aaa"/>
                    <view class="divider"/>
                    <touchable-opacity class="list-icon-touchable">
                        <image :source="icListNakhonPathom"
                               class="list-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>
                </image-background>
            </view>
        </view>
    </view>
</template>

<script>
    import MapView from 'react-native-maps';
    import LinearGradient from 'react-native-linear-gradient';

    import icListNakhonPathom from '../../assets/ic_list_nakhon_pathom.png';
    import icMenuNakhonPathom from '../../assets/ic_menu_nakhon_pathom.png';
    import icAlertNakhonPathom from '../../assets/ic_alert_nakhon_pathom.png';

    export default {
        components: {MapView, LinearGradient},
        data: () => {
            return {
                icListNakhonPathom, icMenuNakhonPathom, icAlertNakhonPathom
            };
        },
        methods: {},
    }
</script>

<style>
    .container {
        flex: 1;
        margin-bottom: 64;
        border-width: 0;
        border-color: red;
    }

    .header-container {
        position: absolute;
        height: 136;
        width: 100%;
        top: 0;
        left: 0;
        justify-content: flex-start;
        border-width: 0;
        border-color: red;
    }

    .header {
        flex-direction: row;
        height: 111;
        align-items: center;
        padding-left: 20;
        padding-right: 20;
    }

    .province-name {
        flex: 1;
        text-align: center;
        font-family: DBHeavent-Bold;
        color: white;
        font-size: 24;
        border-width: 0;
        border-color: yellow;
    }

    .search-input-container {
        position: absolute;
        width: 100%;
        height: 100%;
        justify-content: flex-end;
        padding-left: 20;
        padding-right: 20;
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
        background-color: #e0e0e0;
        margin-left: 10;
        margin-right: 10;
    }

    .list-icon-touchable {
        align-self: center;
        padding: 5;
    }

    .menu-icon-touchable {
        align-self: center;
        padding-left: 0;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
    }

    .alert-icon-touchable {
        align-self: center;
        padding: 0;
    }

    .list-icon {
        width: 20;
        height: 20;
    }

    .menu-icon {
        width: 20;
        height: 20;
    }

    .alert-icon {
        width: 40;
        height: 40;
    }

    .map-view {
        flex: 1;
        margin-top: 111;
        border-width: 0;
        border-color: orangered;
    }
</style>