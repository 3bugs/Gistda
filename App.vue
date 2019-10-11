<template>
    <view class="container">
        <text class="title">BMI Calculator</text>

        <text>ส่วนสูง (cm)</text>
        <text-input v-model="height"
                    :style="{height: 40, width: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 10}"/>

        <text>น้ำหนัก (kg)</text>
        <text-input v-model="weight"
                    :style="{height: 40, width: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 20}"/>

        <!--<text class="text-color-primary">{{bmi}}</text>-->
        <button title="คำนวณ BMI" v-bind:on-press="handleButtonPress"
                :style="{height: 40, width: 200}"/>
    </view>
</template>

<script>
    export default {
        data: () => {
            return {
                bmi: '',
                height: '',
                weight: '',
            };
        },
        methods: {
            handleButtonPress: function() {
                let result =  this.weight / Math.pow(this.height / 100, 2);
                alert('ค่า BMI ของคุณคือ ' + result);
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

    .title {
        color: #666;
        font-size: 20;
        font-weight: bold;
        margin-bottom: 30;
    }

    .text-color-primary {
        color: blue;
        margin-bottom: 20;
    }
</style>
