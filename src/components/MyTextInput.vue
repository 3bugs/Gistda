<template>
    <view class="container"
          :style="{
                marginTop: this.props.marginTop ? this.props.marginTop : 0,
                marginBottom: this.props.marginBottom ? this.props.marginBottom : 0,
          }">
        <text class="label"
              :style="{
                    color: FORM.labelTextColor[province]
              }">
            {{label}}
        </text>
        <text-input
            class="text-input"
            :value="formData[name]"
            :secure-text-entry="secure"
            :keyboard-type="keyboardType"
            :multiline="multiline === undefined ? false : multiline"
            :editable="editable === undefined ? true : editable"
            :on-focus="handleFocus"
            :on-blur="handleBlur"
            :on-change-text="handleTextChange"
        />
    </view>
</template>

<script>
    import store from '../store';
    import {FORM} from '../constants';

    export default {
        components: {},
        props: {
            label: {
                type: String
            },
            name: {
                type: String
            },
            formData: {
                type: Object
            },
            onChangeText: {
                type: Function
            },
            marginTop: {
                type: Number
            },
            marginBottom: {
                type: Number
            },
            multiline: {
                type: Boolean
            },
            editable: {
                type: Boolean
            },
            secure: {
                type: Boolean
            },
            keyboardType: {
                type: String,
                default: 'default'
            },
            notAllowSpace: {
                type: Boolean
            }
        },
        data: () => {
            return {
                FORM,
                isFocused: false,
            };
        },
        computed: {
            province() {
                return store.state.province;
            },
            /*textContent() {
            }*/
        },
        methods: {
            handleFocus: function () {
                this.isFocused = true;
            },
            handleBlur: function () {
                this.isFocused = false;
            },
            handleTextChange: function (text) {
                this.formData[this.name] = text == null
                    ? ''
                    : (this.notAllowSpace ? text.trim() : text);
            },
        },
        created: function () {
        }
    }
</script>

<style>
    .container {

    }

    .label {
        font-family: DBHeavent;
        font-size: 22;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 3;
    }

    .text-input {
        font-family: DBHeavent;
        font-size: 22;
        color: #666666;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 5;
        margin-bottom: 0;
        border-bottom-width: 1;
        border-bottom-color: #adadad;
    }
</style>