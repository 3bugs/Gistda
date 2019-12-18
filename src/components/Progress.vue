<template>
    <view class="progress-container"
          v-if="showIf">
        <activity-indicator
                class="progress"
                size="large"
                :color="color"/>
        <text class="progress-text"
              :style="{color}">
            รอสักครู่
        </text>
        <text class="progress-text-2"
              :style="{color}"
              v-if="message && message !== ''">
            {{message}}
        </text>
    </view>
</template>

<script>
    export default {
        components: {},
        props: {
            message: {
                type: String
            },
            showIf: {
                type: Boolean
            },
            color: {
                type: String
            }
        },
        data: () => {
            return {

            };
        },
        methods: {

        },
    }
</script>

<style>
    .progress-container {
        position: absolute;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-width: 0;
        border-color: cyan;
    }

    .progress {
        border-width: 0;
        border-color: yellow;
    }

    .progress-text {
        text-align: center;
        font-family: DBHeaventt-Light;
        font-size: 24;
        margin-top: 10;
    }

    .progress-text-2 {
        text-align: center;
        font-family: DBHeaventt-Light;
        font-size: 20;
        margin-top: 0;
    }
</style>