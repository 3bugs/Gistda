<template>
    <view class="container">
        <form-header
                title="ข้อมูลส่วนตัว"
                :header-text="headerText"
                :sub-header-text="subHeaderText"
                :button-text="null"
                :override-scroll-view="true"
                :no-close-button="true"
                :on-click-back="handleClickBack"
                :on-click-close="handleClickClose">
            <view>
                <flat-list
                        :data="dataList"
                        :keyExtractor="(item, index) => index.toString()">
                    <view render-prop-fn="renderItem">
                        <profile-action-item
                                :title="args.item.title"
                                :index="args.index"
                                :on-click="handleClickItem"/>
                    </view>
                    <view render-prop-fn="ItemSeparatorComponent">
                        <view :style="{
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: '#cccccc'
                        }"/>
                    </view>
                </flat-list>
                <view :style="{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
                }"/>
            </view>
        </form-header>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';
    import FormHeader from '../../components/FormHeader';
    import ProfileActionItem from '../../screens/profile/ProfileActionItem';

    import {Dimensions, StyleSheet, Alert} from 'react-native';

    export default {
        components: {FormHeader, ProfileActionItem},
        props: {
            navigation: {
                type: Object
            },
        },
        computed: {
            province() {
                return store.state.province;
            },
            headerText() {
                return `${store.state.userDisplayName}`;
            },
            subHeaderText() {
                return store.state.userEmail ? store.state.userEmail : '';
            },
        },
        data: () => {
            return {
                DEBUG,
                Dimensions, StyleSheet,
                dataList: [
                    {
                        title: 'แก้ไขข้อมูลส่วนตัว',
                    },
                    {
                        title: 'เปลี่ยนรหัสผ่าน',
                    },
                    {
                        title: 'ประวัติการแจ้งเหตุ',
                    },
                ],
            };
        },
        methods: {
            handleClickBack: function () {
                this.navigation.goBack();
            },
            handleClickClose: function () {
            },
            handleClickItem: function (index) {
                switch (index) {
                    case 0:
                        this.navigation.navigate('EditProfile');
                        break;
                    case 1:
                        this.navigation.navigate('ChangePassword');
                        break;
                    case 2:
                        this.navigation.navigate('History');
                        break;
                }
            }
        },
        created: function () {
            store.dispatch('GET_PROFILE', {});
        }
    }
</script>

<style>
    .container {
        flex: 1;
    }
</style>