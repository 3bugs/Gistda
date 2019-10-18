<template>
    <view class="container">
        <text class="title">BMI Calculator</text>

        <text>ส่วนสูง (cm)</text>
        <text-input v-model="height"
                    :style="{height: 40, width: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 10}"/>

        <text>น้ำหนัก (kg)</text>
        <text-input v-model="weight"
                    :style="{height: 40, width: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 20}"/>

        <button title="คำนวณ BMI" v-bind:on-press="handleButtonPress"
                class="button"
                :style="{height: 40, width: 200, marginBottom: 20}"/>

        <text class="text-color-primary">{{resultText}}</text>
    </view>
</template>

<script>
    export default {
        data: () => {
            return {
                resultText: '',
                height: '',
                weight: '',
            };
        },
        methods: {
            handleButtonPress: function() {
                let bmi =  this.weight / Math.pow(this.height / 100, 2);
                let text = '';
                if (bmi < 18.5) {
                    text = 'ผอม';
                } else if (bmi < 25) {
                    text = 'ปกติ';
                } else if (bmi < 30) {
                    text = 'ท้วม';
                } else if (bmi >= 30) {
                    text = 'อ้วน';
                }
                let resultText = 'ค่า BMI ของคุณคือ ' + bmi + '\nเกณฑ์: ' + text;
                this.resultText = resultText;
                alert(resultText);
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
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 30;
    }

    .text-color-primary {
        text-align: center;
        color: blue;
        margin-bottom: 20;
    }

    .button {
        width: 150;
        margin-bottom: 20;
    }
</style>
