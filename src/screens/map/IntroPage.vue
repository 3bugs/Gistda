<template>
    <view
            v-if="visible && imageUrl && imageWidth && imageHeight"
            class="container"
            :style="{padding: INTRO_MARGIN}">
        <touchable-opacity
                :on-press="handleCloseIntro">
            <image :source="imageCloseIntro"
                   :style="{width: 37, height: 37, alignSelf: 'flex-end', marginBottom: 10}"
                   resize-mode="contain"/>
        </touchable-opacity>
        <image
                :source="{uri: imageUrl}"
                :style="{width: INTRO_DISPLAY_WIDTH, height: INTRO_DISPLAY_HEIGHT}"
                resize-mode="contain"/>
    </view>
</template>

<script>
    import store from '../../store';
    import {DEBUG} from '../../constants';
    import {fetchSplash} from '../../store/fetch';
    import ImageLoader from '../../components/ImageLoader';

    import {Dimensions, Image} from 'react-native';

    import imageCloseIntro from '../../../assets/images/ic_close_intro.png';

    const INTRO_MARGIN = 30;
    const INTRO_DISPLAY_WIDTH = Dimensions.get('window').width - (2 * INTRO_MARGIN);

    export default {
        components: {Image, ImageLoader},
        props: {},
        computed: {
            province() {
                return store.state.province;
            },
        },
        data: () => {
            return {
                DEBUG,
                Dimensions,
                INTRO_MARGIN,
                INTRO_DISPLAY_WIDTH,
                INTRO_DISPLAY_HEIGHT: 0,
                imageUrl: null,
                imageWidth: null,
                imageHeight: null,
                visible: false,
                imageCloseIntro,
            };
        },
        methods: {
            handleCloseIntro: function () {
                this.visible = false;
                store.dispatch('SET_IS_SPLASH_SHOWING', {
                    province: this.province,
                    isShowing: false,
                });
            },
        },
        mounted: async function () {
            const apiResult = await fetchSplash(this.province);
            if (apiResult.success) {
                this.imageUrl = apiResult.data.image;
                Image.getSize(
                    this.imageUrl,
                    (width, height) => {
                        this.imageWidth = width;
                        this.imageHeight = height;

                        this.INTRO_DISPLAY_HEIGHT = this.imageHeight * INTRO_DISPLAY_WIDTH / this.imageWidth;
                        this.visible = true;
                        store.dispatch('SET_IS_SPLASH_SHOWING', {
                            province: this.province,
                            isShowing: true,
                        });
                    },
                    (error) => {
                        console.log('Error get splash image dimension: ' + error);
                    }
                );
            }
        },
    }
</script>

<style>
    .container {
        position: absolute;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
    }
</style>
