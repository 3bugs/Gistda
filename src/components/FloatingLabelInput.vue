<template>
    <view class="container"
          :style="{
                marginTop: this.props.marginTop ? this.props.marginTop : 0,
                marginBottom: this.props.marginBottom ? this.props.marginBottom : 0,
          }">
        <text class="label">
            {{label}}
        </text>
        <text-input
            class="text-input"
            :multiline="multiline === undefined ? false : multiline"
            :editable="editable === undefined ? true : editable"
            v-model="textContent"
            :on-focus="handleFocus"
            :on-blur="handleBlur"
            :on-change-text="handleTextChange"
        />
    </view>
</template>

<script>
    import store from '../store';

    export default {
        components: {},
        props: {
            name: {
                type: String
            },
            label: {
                type: String
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
            }
        },
        data: () => {
            return {
                isFocused: false,
            };
        },
        computed: {
            textContent() {
                const incidentFormData = store.state.incidentFormData;
                if (!incidentFormData) {
                    return '';
                } else {
                    return incidentFormData[this.name]
                        ? incidentFormData[this.name]
                        : '';
                }
            }
        },
        methods: {
            handleFocus: function () {
                this.isFocused = true;
            },
            handleBlur: function () {
                this.isFocused = false;
            },
            handleTextChange: function (text) {
                store.dispatch('SET_INCIDENT_FORM_DATA', {
                    formData: {
                        [this.name]: text,
                    },
                });
            },
        },
        created: function () {
            /*const incidentFormData = store.state.incidentFormData;
            if (!incidentFormData) {
                this.textContent = '';
            } else {
                this.textContent = incidentFormData[this.name]
                    ? incidentFormData[this.name]
                    : '';
            }*/
        }
    }
</script>

<style>
    .container {

    }

    .label {
        font-family: DBHeavent;
        font-size: 22;
        color: #1665D8;
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