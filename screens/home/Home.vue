<template>
    <image-background :source="bg"
                      :style="{width: '100%', height: '100%'}"
                      resizeMode="stretch">
        <status-bar
                background-color="transparent"
                translucent
        />
    </image-background>
</template>

<script>
    import bg from '../../assets/bg_yasothon.jpg';

    export default {
        props: {
            navigation: { // stack navigator
                type: Object
            }
        },
        data: () => {
            return {
                bg,
            };
        },
        methods: {

        }
    }
</script>

<style>
</style>