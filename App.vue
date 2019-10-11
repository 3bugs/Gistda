<template>
    <view class="container">
        <text class="text-color-primary">{{message}}</text>
        <button v-bind:title="message" v-bind:on-press="handleButtonPress"/>
    </view>
</template>

<script>
    export default {
        data: () => {
            return {
                message: 'Hello Vue Native',
            };
        },
        methods: {
            handleButtonPress: function() {
                this.message = 'Promlert';
                alert('Button pressed');
            },
        }
    }
</script>

<style>
    .container {
        background-color: white;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    .text-color-primary {
        color: blue;
    }
</style>
