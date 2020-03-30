<template>
    <!--https://blog.logrocket.com/how-to-use-refs-to-access-your-application-dom-in-vue-js/-->
    <drawer ref="drawer"
            type="displace"
            :openDrawerOffset="80"
            :tapToClose="true"
            :open="drawerOpen"
            :acceptTap="true"
            :on-open="handleOpenFilterPanel"
            :on-close="handleCloseFilterPanel">
        <view render-prop="content">
            <FilterPanel :navigation="navigation"/>
        </view>

        <view class="container"
              :style="{marginBottom: BOTTOM_NAV.height}">
            <map-view
                    :provider="Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_GOOGLE"
                    ref="mapView"
                    class="map-view"
                    :initial-region="{
                        latitude: (PROVINCE_DIMENSION[province].minLatitude + PROVINCE_DIMENSION[province].maxLatitude) / 2,
                        longitude: (PROVINCE_DIMENSION[province].minLongitude + PROVINCE_DIMENSION[province].maxLongitude) / 2,
                        latitudeDelta: PROVINCE_DIMENSION[province].maxLatitude - PROVINCE_DIMENSION[province].minLatitude,
                        longitudeDelta: PROVINCE_DIMENSION[province].maxLongitude - PROVINCE_DIMENSION[province].minLongitude,
                    }"
                    :style="{marginTop: MAP_HEADER.height}"
                    :rotate-enabled="false"
                    :showsTraffic="showsTraffic"
                    :showsUserLocation="watchId !== null"
                    :mapType="mapType"
                    :on-map-ready="handleMapReady"
                    :on-press="e => {handleClickMap(e.nativeEvent.coordinate)}"
                    :on-region-change-complete="handleRegionChange">

                <!--<w-m-s-tile
                        url-template="http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetMap&layers=L14_แนวคลองชลประทานจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                        :z-index="100"
                        :opacity="1"
                        :tile-size="512"
                />-->

                <!--<w-m-s-tile
                    url-template="http://wms.ngis.go.th:8081/geoserver/A_ORCHARD/wms?service=WMS&version=1.1.0&request=GetMap&layers=A_ORCHARD:orchard&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                    _url-template="http://wms.ngis.go.th:8081/geoserver/A_DROUGHT3Y/wms?service=WMS&version=1.1.0&request=GetMap&layers=A_DROUGHT3Y:drought3y_wgs84&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                    __url-template="http://wms.ngis.go.th:8081/geoserver/admin_test/wms?service=WMS&version=1.1.0&request=GetMap&layers=admin_test:L050302_PROVINCE_AREA&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                    :z-index="100"
                    :opacity="1"
                    :tile-size="512"
                />

                <w-m-s-tile
                    url-template="http://wms.ngis.go.th:8081/geoserver/EEC_CHACHOENGSAO/wms?service=WMS&version=1.1.0&request=GetMap&layers=EEC_CHACHOENGSAO:เส้นทางน้ำ&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                    :z-index="100"
                    :opacity="1"
                    :tile-size="512"
                />

                <w-m-s-tile
                    url-template="http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=WMS&request=GetMap&version=1.1.0&layers=L14_แนวคลองชลประทานจังหวัดยโสธร,L14_อ่างเก็บน้ำจังหวัดยโสธร,L14_สถานีสูบน้ำด้วยไฟฟ้าจังหวัดยโสธร,L14_พื้นที่ชลประทานจังหวัดยโสธร,L14_ฝายทดน้ำจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                    :z-index="100"
                    :opacity="1"
                    :tile-size="512"
                />-->

                <!--<w-m-s-tile
                    :urlTemplate="'https://maps-public.geo.nyu.edu/geoserver/sdr/wms?service=WMS&version=1.1.0&request=GetMap&layers=sdr:nyu_2451_36011&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:4326&format=image/png&transparent=true&format_options=dpi:213'"
                    :zIndex="1"
                    :opacity="1"
                    :tileSize="512"
                    epsgSpec="EPSG:4326"
                />-->

                <!--<w-m-s-tile
                        url-template="http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetMap&layers=L14_แนวคลองชลประทานจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                        :_z-index="100"
                        :opacity="1"
                        :tile-size="512"
                />-->

                <!--ภาพไม่แสดง-->
                <!--<w-m-s-tile
                        url-template="http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetMap&layers=L14_อ่างเก็บน้ำจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                        :_z-index="100"
                        :opacity="1"
                        :tile-size="512"
                />

                <w-m-s-tile
                        url-template="http://wms.ngis.go.th:8081/geoserver/admin_test/wms?service=wms&version=1.3.0&request=GetMap&layers=admin_test:L050302_PROVINCE_AREA&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true"
                        :_z-index="100"
                        :opacity="1"
                        :tile-size="512"
                />-->

                <custom-marker
                        v-if="!isMeasureToolOn && !isMarkerToolOn && marker.geometry.type === 'Point' && !drawerOpen"
                        v-for="(marker, markerIndex) in markerList"
                        :coordinate="{
                            latitude: marker.geometry.coordinates[1],
                            longitude: marker.geometry.coordinates[0]
                        }"
                        :marker="marker"
                        :on-press="() => handleClickPoint(marker)"/>

                <!--<marker
                        v-if="!isMeasureToolOn && !isMarkerToolOn && marker.geometry.type === 'Point'"
                        v-for="(marker, markerIndex) in markerList"
                        :coordinate="{
                            latitude: marker.geometry.coordinates[1],
                            longitude: marker.geometry.coordinates[0]
                        }"
                        :anchor="{x: 0.5, y: 0.77}"
                        :title="marker.properties.NAME_T"
                        :description="null"
                        :opacity="marker.opacity"
                        :on-press="() => handleClickPoint(marker)">
                    <image
                            :source="{uri: marker.image}"
                            resize-mode="contain"
                            :style="{
                                width: 40, //42, //36,
                                height: 43.33, //45.5, //39,
                            }"/>
                </marker>-->

                <!--#DB1A8F, #ED9749, #2CC2F7-->
                <polyline
                        v-if="!isMeasureToolOn && !isMarkerToolOn && marker.geometry.type === 'Linestring' && !drawerOpen"
                        v-for="(marker, markerIndex) in markerList"
                        :coordinates="getPolylineCoordinates(marker.geometry.coordinates)"
                        :title="marker.properties.NAME_T"
                        :stroke-color="marker.categoryType === 1 ? `rgba(219,26,143,${marker.opacity})` : (marker.categoryType === 2 ? `rgba(237,151,73,${marker.opacity})` : `rgba(44,194,143,${marker.opacity})`)"
                        :stroke-width="3"
                        :tappable="false"
                        :on-press="() => handlePressPolyline(marker)"/>

                <w-m-s-tile
                        v-if="!isMeasureToolOn && !isMarkerToolOn && !drawerOpen"
                        v-for="(wms, wmsIndex) in wmsList"
                        :url-template="getWmsLink(wms)"
                        :_z-index="100"
                        :opacity="wms.opacity"
                        :tile-size="512"/>

                <!--<w-m-s-tile
                        :url-template="`http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetMap&layers=L14_ฝายทดน้ำจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`"
                        :_z-index="100"
                        :opacity="1"
                        :tile-size="512"/>

                <w-m-s-tile
                        :url-template="`http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetMap&layers=L14_พื้นที่ชลประทานจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`"
                        :_z-index="100"
                        :opacity="1"
                        :tile-size="512"/>

                <w-m-s-tile
                        :url-template="`http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetMap&layers=L14_สถานีสูบน้ำด้วยไฟฟ้าจังหวัดยโสธร&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`"
                        :_z-index="100"
                        :opacity="1"
                        :tile-size="512"/>-->

                <heatmap
                        v-if="!isMeasureToolOn && !isMarkerToolOn && heatMapPointListRisk.length > 0 && !drawerOpen /*HEATMAP_CATEGORY_ID_RISK === category.id && category.markerVisibility && heatMapPointListRisk.length > 0*/"
                        :radius="heatMapRadius"
                        :opacity="heatMapOpacityRisk"
                        :points="heatMapPointListRisk"
                        :gradient="{
                            colors: ['#79BC6A', '#BBCF4C', '#EEC20B', '#F29305', '#E50000'],
                            startPoints: [0.1, 0.25, 0.50, 0.75, 1],
                            colorMapSize: 256,
                        }"/>
                <!--:gradient="{
                colors: ['#8f0301', '#d1681a'],
                startPoints: [0, 0.5],
                }"-->
                <heatmap
                        v-if="!isMeasureToolOn && !isMarkerToolOn && heatMapPointListDisease.length > 0 && !drawerOpen /*HEATMAP_CATEGORY_ID_DISEASE === category.id && category.markerVisibility && heatMapPointListDisease.length > 0*/"
                        :radius="heatMapRadius"
                        :opacity="heatMapOpacityDisease"
                        :points="heatMapPointListDisease"
                        :gradient="{
                            colors: ['#00eef3', '#568df5', '#6900e3', '#762d8b', '#ff0c34'],
                            startPoints: [0.1, 0.25, 0.50, 0.75, 1],
                            colorMapSize: 256,
                        }"/>
                <!--:gradient="{
                colors: ['#3c0044', '#aa1ed9'],
                startPoints: [0.1, 1],
                }"-->

                <!--<view v-if="!isMeasureToolOn && !isMarkerToolOn"
                      v-for="(categoryType, categoryTypeIndex) in mapDataList">
                    <view v-for="(category, categoryIndex) in categoryType.list">
                        &lt;!&ndash;wms&ndash;&gt;
                        <w-m-s-tile
                                v-for="(wms, wmsIndex) in category.wmsList"
                                v-if="category.markerVisibility"
                                :url-template="getWmsLink(wms)"
                                :_z-index="100"
                                :opacity="category.markerOpacity"
                                :tile-size="512"
                        />
                        &lt;!&ndash;จุด&ndash;&gt;
                        <marker
                                v-for="(marker, markerIndex) in category.markerList"
                                v-if="category.markerVisibility && marker.geometry.type === 'Point'"
                                :coordinate="{
                                    latitude: marker.geometry.coordinates[1],
                                    longitude: marker.geometry.coordinates[0]
                                }"
                                :anchor="{x: 0.5, y: 0.77}"
                                :title="marker.properties.NAME_T"
                                :description="null"
                                :image="category.image"
                                :opacity="category.markerOpacity"
                                :on-press="() => handleClickPoint(marker)"/>
                        &lt;!&ndash;เส้น&ndash;&gt;
                        <polyline
                                v-for="(marker, markerIndex) in category.markerList"
                                v-if="category.markerVisibility && marker.geometry.type === 'Linestring'"
                                :coordinates="getPolylineCoordinates(marker.geometry.coordinates)"
                                :title="marker.properties.NAME_T"
                                :strokeColor="'#45b3ff'"
                                :strokeWidth="marker.active ? 4 : 2"
                                :tappable="true"
                                :on-press="() => handlePressPolyline(marker)"/>

                        &lt;!&ndash;heatmap&ndash;&gt;
                        <heatmap
                                v-if="HEATMAP_CATEGORY_ID_RISK === category.id && category.markerVisibility && heatMapPointListRisk.length > 0"
                                :opacity="category.markerOpacity"
                                :points="heatMapPointListRisk"/>
                        <heatmap
                                v-if="HEATMAP_CATEGORY_ID_DISEASE === category.id && category.markerVisibility && heatMapPointListDisease.length > 0"
                                :opacity="category.markerOpacity"
                                :points="heatMapPointListDisease"/>
                    </view>
                </view>-->

                <!--เส้นวัดระยะทาง-->
                <polyline
                        v-if="isLineToolOn"
                        :coordinates="pointList"
                        strokeColor="#831313"
                        :strokeWidth="2"/>

                <!--พื้นที่-->
                <polyline
                        v-if="!isLineToolOn && (pointList.length < 3)"
                        :coordinates="pointList"
                        strokeColor="#831313"
                        :strokeWidth="2"/>
                <polygon
                        v-if="!isLineToolOn && (pointList.length >= 3)"
                        :coordinates="pointList"
                        strokeColor="#831313"
                        fillColor="#FFB1B180"
                        :strokeWidth="2"/>

                <!--จุด drag handle-->
                <marker
                        v-for="(coord, index) in pointList"
                        :coordinate="coord"
                        :anchor="draggedMarker === coord ? {x: 0.5, y: 1} : {x: 0.5, y: 0.5}"
                        :image="draggedMarker === coord ? null : (index === pointList.length - 1 ? imageDragMarkerEnd : imageDragMarker)"
                        :draggable="true"
                        :on-drag-start="e => handleDragMarkerStart(coord)"
                        :on-drag="e => handleDragMarker(coord)"
                        :on-drag-end="e => handleDragMarkerEnd(coord, e.nativeEvent.coordinate)"/>

                <!--marker เดี่ยว-->
                <marker
                        v-if="point"
                        :coordinate="point"
                        :draggable="false"/>

                <marker
                        v-if="searchLatLngPoint"
                        :coordinate="searchLatLngPoint"
                        :draggable="false"
                        :on-press="handleClickLatLngPoint"/>

                <!--marker ตำแหน่งปัจจุบัน-->
                <!--<marker-animated
                        ref="locationMarker"
                        v-if="watchId !== null && currentLocation"
                        :coordinate="currentLocation"
                        :image="imageRedDot"
                        :anchor="{x: 0.5, y: 0.5}"
                        :draggable="false"/>-->
            </map-view>

            <view class="map-tools-container"
                  :style="{
                        right: DIMENSION.horizontal_margin,
                        bottom: TOOLS_MARGIN_BOTTOM,
                  }">
                <touchable-opacity
                        v-if="pointList && pointList.length > 0"
                        class="map-tools-icon-touchable"
                        :on-press="handleClickDeleteMeasure"
                        :style="{
                            marginBottom: 5,
                        }">
                    <view class="map-tools-icon"
                          :style="{
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                          }">
                        <image :source="imageDeleteMeasure"
                               resize-mode="contain"
                               :style="{
                                    width: 26,
                                    height: 26,
                               }"/>
                    </view>
                </touchable-opacity>

                <view class="map-tools-measure-container"
                      :style="{
                            marginBottom: DIMENSION.horizontal_margin,
                      }">
                    <image-background
                            v-if="isMeasureToolOn"
                            :source="bgMeasureTools"
                            class="map-tools-measure-container-background">
                        <touchable-opacity
                                class="map-tools-icon-touchable"
                                :on-press="() => {handleClickLineTool(false)}"
                                :style="{
                                    marginTop: 5,
                                }">
                            <view class="map-tools-icon"
                                  :style="{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                  }">
                                <image :source="isLineToolOn ? imageMapToolPolygonOff : imageMapToolPolygonOn"
                                       resize-mode="contain"
                                       :style="{
                                        width: 23,
                                        height: 20,
                                   }"/>
                            </view>
                        </touchable-opacity>

                        <touchable-opacity
                                class="map-tools-icon-touchable"
                                :on-press="() => {handleClickLineTool(true)}"
                                :style="{
                                    marginTop: 5,
                                }">
                            <view class="map-tools-icon"
                                  :style="{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                  }">
                                <image :source="isLineToolOn ? imageMapToolLineOn : imageMapToolLineOff"
                                       resize-mode="contain"
                                       :style="{
                                        width: 20,
                                        height: 17.5,
                                   }"/>
                            </view>
                        </touchable-opacity>

                        <touchable-opacity
                                class="map-tools-icon-touchable"
                                :on-press="null"
                                :on-press="handleClickMeasureTool">
                            <image :source="imageMapToolMeasureOn"
                                   class="map-tools-icon"
                                   resize-mode="contain"
                                   :style="{
                                   }"/>
                        </touchable-opacity>
                    </image-background>

                    <touchable-opacity
                            v-if="!isMeasureToolOn"
                            class="map-tools-icon-touchable"
                            :on-press="handleClickMeasureTool">
                        <image :source="imageMapToolMeasureOff"
                               class="map-tools-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>
                </view>

                <touchable-opacity
                        class="map-tools-icon-touchable"
                        :on-press="handleClickMarkerTool"
                        :style="{
                            marginBottom: DIMENSION.horizontal_margin,
                        }">
                    <image :source="isMarkerToolOn ? imageMapToolMarkerOn : imageMapToolMarkerOff"
                           class="map-tools-icon"
                           resize-mode="contain"/>
                </touchable-opacity>

                <touchable-opacity class="map-tools-icon-touchable"
                                   :on-press="handleClickCurrentLocationTool">
                    <image :source="watchId === null ? imageMapToolCurrentLocationOff : imageMapToolCurrentLocationOn"
                           class="map-tools-icon"
                           resize-mode="contain"/>
                </touchable-opacity>
            </view>

            <!--legend-->
            <view class="map-tools-container-left"
                  :style="{
                        left: DIMENSION.horizontal_margin,
                        top: MAP_HEADER.height + 50,
                  }">
                <menu
                        ref="legend"
                        v-if="showLegend"
                        :renderer="Popover"
                        :rendererProps="{preferredPlacement: 'bottom'}"
                        :style="{
                            flex: 1,
                            width: '100%',
                            flexDirection: 'column',
                        }">
                    <menu-trigger :custom-styles="{TriggerTouchableComponent: TouchableOpacity}">
                        <image :source="imageMapToolLegend"
                               class="map-tools-icon"
                               resize-mode="contain"/>
                    </menu-trigger>
                    <menu-options :style="{padding: 10}">
                        <menu-option
                                v-for="(categoryType, categoryTypeIndex) in mapDataList"
                                class="menu-option"
                                :on-select="null"
                                :custom-styles="{OptionTouchableComponent: null}">
                            <view v-for="(category, categoryIndex) in categoryType.list"
                                  v-if="category.markerVisibility && category.wmsList && category.wmsList.length > 0">
                                <text class="menu-option-text">
                                    {{category.name}}
                                </text>
                                <!--http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetLegendGraphic&format=image/png&width=40&height=40&layer=L14_แนวคลองชลประทานจังหวัดยโสธร-->
                                <view v-for="(wms, wmsIndex) in category.wmsList">
                                    <image v-for="layerName in wms.layers"
                                           :source="{uri: getLegendImage(wms.url, layerName)}"
                                           resize-mode="contain"
                                           :style="{width: 200, height: 100}"/>
                                </view>
                            </view>
                        </menu-option>
                    </menu-options>
                </menu>
            </view>

            <!--zoom-in/out-->
            <view class="map-tools-container"
                  :style="{
                        right: DIMENSION.horizontal_margin,
                        top: MAP_HEADER.height + 50,
                  }">
                <touchable-opacity
                        class="map-tools-icon-touchable"
                        :on-press="null"
                        :on-press="() => handleClickZoom(0)">
                    <image :source="imageMapToolZoomIn"
                           class="map-tools-zoom-icon"
                           resize-mode="contain"
                           :style="{
                           }"/>
                </touchable-opacity>
                <view :style="{
                    borderBottomWidth: 1,
                    borderBottomColor: '#D6D6D6'
                }"/>
                <touchable-opacity
                        class="map-tools-icon-touchable"
                        :on-press="null"
                        :on-press="() => handleClickZoom(1)">
                    <image :source="imageMapToolZoomOut"
                           class="map-tools-zoom-icon"
                           resize-mode="contain"
                           :style="{
                           }"/>
                </touchable-opacity>
            </view>

            <view class="map-scale-container"
                  pointer-events="none"
                  :style="{
                        left: DIMENSION.horizontal_margin,
                        bottom: TOOLS_MARGIN_BOTTOM,
                  }">
                <view :style="{
                    width: SCALE_WIDTH,
                    borderBottomWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: 'black'
                }">
                    <text class="map-scale-text"
                          :style="{
                                alignSelf: 'center'
                          }">
                        {{scaleText}}
                    </text>
                </view>
                <text class="map-scale-text"
                      v-if="mapCurrentRegion"
                      :style="{
                            marginTop: 4
                      }">
                    {{`GCS : ${mapCurrentRegion.latitude.toFixed(6)}, ${mapCurrentRegion.longitude.toFixed(6)}`}}
                </text>
                <text class="map-scale-text"
                      v-if="mapCurrentRegion"
                      :style="{
                            marginTop: 0
                      }">
                    {{`UTM : ${utmText}`}}
                </text>
            </view>

            <!--แสดงระยะทาง, พื้นที่ที่วัดได้-->
            <view v-if="measureValue >= 0"
                  :style="{
                        position: 'absolute',
                        marginTop: MAP_HEADER.height + 40,
                        width: '100%',
                        alignItems: 'center',
                  }">
                <measure-label
                        :measure-value="measureValue"
                        :measure-type="isLineToolOn ? 0 : 1"/>
            </view>

            <view
                    v-if="watchId === null"
                    pointer-events="none"
                    :style="{
                        position: 'absolute',
                        alignSelf: 'center',
                        width: 0, height: 20,
                        bottom: ((screenHeight - MAP_HEADER.height - BOTTOM_NAV.height) / 2) - 10,
                        borderRightWidth: 1,
                        borderRightColor: '#333333',
                    }"/>
            <view
                    v-if="watchId === null"
                    pointer-events="none"
                    :style="{
                        position: 'absolute',
                        alignSelf: 'center',
                        width: 20, height: 0,
                        bottom: ((screenHeight - MAP_HEADER.height - BOTTOM_NAV.height) / 2),
                        borderBottomWidth: 1,
                        borderBottomColor: '#333333',
                    }"/>

            <!--screen header-->
            <view class="header-container">
                <linear-gradient class="header"
                                 :colors="[
                                    MAP_HEADER.background[province].startColor,
                                    MAP_HEADER.background[province].endColor
                                 ]"
                                 :style="{height: MAP_HEADER.height}">
                    <touchable-opacity class="menu-icon-touchable"
                                       :on-press="handleClickMenu">
                        <image :source="imageMenu"
                               v-if="!drawerOpen"
                               class="menu-icon"
                               resize-mode="contain"/>
                        <image :source="imageBack"
                               v-if="drawerOpen"
                               class="back-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>

                    <text class="province-name">
                        {{MAP_HEADER.title[province]}}
                    </text>

                    <touchable-opacity class="alert-icon-touchable">
                        <!--<image :source="MAP_HEADER.alertIcon[province]"
                               class="alert-icon"
                               resize-mode="contain"/>-->
                        <image :source="null"
                               class="alert-icon"
                               resize-mode="contain"/>
                    </touchable-opacity>
                </linear-gradient>

                <view class="search-input-container">
                    <search-box :navigation="navigation"
                                :on-search-lat-lng="handleSearchLatLng"
                                :on-clear-search-lat-lng="handleClearSearchLatLng"/>
                </view>
            </view>
        </view>

        <intro-page/>
    </drawer>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, MAP_HEADER, BOTTOM_NAV, PROVINCE_NAME_EN, DIMENSION,
        PROVINCE_DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK,
        HEATMAP_CATEGORY_ID_RISK, HEATMAP_CATEGORY_ID_DISEASE, TRAFFIC_CATEGORY_ID,
    } from '../../constants';
    import {requestAndroidPermissions, getCurrentLocation} from '../../constants/utils'
    import {doGetAddressFromCoord} from '../../store/fetch';
    import MeasureLabel from './MeasureLabel';
    import SearchBox from './SearchBox';
    import CustomMarker from './CustomMarker2';
    import IntroPage from './IntroPage';
    //import MarkerDetails from '../map/MarkerDetails';

    import {Dimensions, StyleSheet, Alert, PermissionsAndroid, Platform, BackHandler, Linking, TouchableOpacity, PixelRatio} from 'react-native';
    import {Fragment} from 'react';
    //import MapView from 'react-native-map-clustering';
    import {ClusterMap} from "react-native-cluster-map";
    import MapView, {PROVIDER_GOOGLE, Marker, Polyline, Polygon, WMSTile, Heatmap, AnimatedRegion, MarkerAnimated} from 'react-native-maps';
    import {Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
    import LinearGradient from 'react-native-linear-gradient';
    import CardView from 'react-native-cardview';
    import Drawer from 'react-native-drawer';
    import FilterPanel from './FilterPanel';
    import Slider from '@react-native-community/slider';
    import BottomSheet from 'reanimated-bottom-sheet';
    import {SliderBox} from 'react-native-image-slider-box';
    import {getDistance, getAreaOfPolygon} from 'geolib';
    import Geolocation from 'react-native-geolocation-service';
    import {getStatusBarHeight} from 'react-native-status-bar-height';
    import UTMLatLng from 'utm-latlng';

    const {Popover} = renderers;
    const utm = new UTMLatLng();

    import imageMenu from '../../../assets/images/screen_map/ic_menu.png';
    import imageBack from '../../../assets/images/ic_back.png';
    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    import imageLightOff from '../../../assets/images/sidebar/ic_light_off.png';
    import imageLightOn from '../../../assets/images/sidebar/ic_light_on.png';

    import imageMapToolCurrentLocationOff from '../../../assets/images/screen_map/ic_map_tool_current_location_off.png';
    import imageMapToolCurrentLocationOn from '../../../assets/images/screen_map/ic_map_tool_current_location_on.png';
    import imageMapToolMarkerOff from '../../../assets/images/screen_map/ic_map_tool_marker_off.png';
    import imageMapToolMarkerOn from '../../../assets/images/screen_map/ic_map_tool_marker_on.png';
    import bgMeasureTools from '../../../assets/images/screen_map/bg_measure_tools.png';
    import imageMapToolMeasureOn from '../../../assets/images/screen_map/ic_map_tool_measure_on.png';
    import imageMapToolMeasureOff from '../../../assets/images/screen_map/ic_map_tool_measure_off.png';
    import imageMapToolLineOn from '../../../assets/images/screen_map/ic_map_tool_line_on.png';
    import imageMapToolLineOff from '../../../assets/images/screen_map/ic_map_tool_line_off.png';
    import imageMapToolPolygonOn from '../../../assets/images/screen_map/ic_map_tool_polygon_on.png';
    import imageMapToolPolygonOff from '../../../assets/images/screen_map/ic_map_tool_polygon_off.png';
    import imageMapToolZoomIn from '../../../assets/images/screen_map/ic_map_tool_zoom_in.png';
    import imageMapToolZoomOut from '../../../assets/images/screen_map/ic_map_tool_zoom_out.png';
    import imageMapToolLegend from '../../../assets/images/screen_map/ic_map_tool_legend.png';
    import imageDeleteMeasure from '../../../assets/images/screen_map/ic_delete_measure.png';
    import imageRedDot from '../../../assets/images/screen_map/ic_red_dot.png';

    import imageDragMarker from '../../../assets/images/screen_map/ic_drag_marker_new.png';
    import imageDragMarkerEnd from '../../../assets/images/screen_map/ic_drag_marker_end_new.png';

    const SCALE_WIDTH = 90;
    const TOOLS_MARGIN_BOTTOM = 35;
    const CLICK_CURRENT_LOCATION_TIMEOUT = 10;
    const MAP_TYPE_LIST = ['standard', 'hybrid'];

    export default {
        components: {
            Fragment, MapView, Marker, Polyline, Polygon, WMSTile, Heatmap, MarkerAnimated,
            LinearGradient, CardView, Drawer, FilterPanel, Slider, BottomSheet,
            SliderBox, MeasureLabel, SearchBox, CustomMarker, IntroPage,
            Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger,
        },
        props: {
            navigation: {
                type: Object
            }
        },
        computed: {
            province() {
                return store.state.province;
            },
            mapDataList() {
                return store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]];
            },
            //รวม marker ทั้งหมด ทุก category เพื่อแก้ปัญหาการแสดง marker บน ios
            markerList() {
                console.log('********** markerList() is called. **********');
                return store.state.markerList[PROVINCE_NAME_EN[this.province]];
            },
            wmsList() {
                return store.state.wmsList[PROVINCE_NAME_EN[this.province]];
            },
            heatMapPointListRisk() {
                return store.state.heatMapPointListRisk[PROVINCE_NAME_EN[this.province]];
            },
            heatMapOpacityRisk() {
                return store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]][0].list.filter(
                    category => category.id === HEATMAP_CATEGORY_ID_RISK
                )[0].markerOpacity;
            },
            heatMapPointListDisease() {
                return store.state.heatMapPointListDisease[PROVINCE_NAME_EN[this.province]];
            },
            heatMapOpacityDisease() {
                return store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]][1].list.filter(
                    category => category.id === HEATMAP_CATEGORY_ID_DISEASE
                )[0].markerOpacity;
            },
            heatMapRadius() {
                const radius = PixelRatio.getPixelSizeForLayoutSize(Platform.OS === 'android' ? 6 : 12);
                return radius > 50 ? 50 : radius;
            },
            showsTraffic() {
                if (store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]].length === 0) return false;

                const categoryList = store.state.coordinateCategoryList[PROVINCE_NAME_EN[this.province]][0].list.filter(
                    category => (category.id === TRAFFIC_CATEGORY_ID)
                );
                if (categoryList.length > 0) {
                    // showCategory แสดง/ไม่แสดง category นั้นในแถบเมนู
                    if (categoryList[0].showCategory) {
                        // markerVisibility แสดง/ไม่แสดงเส้นสีจราจร
                        return categoryList[0].markerVisibility;
                    }
                    return false;
                }
                return false;
            },
            drawerOpen() {
                return store.state.drawerOpen;
            },
            /*isSearching() {
                return store.state.searching;
            },*/
            measureValue() {
                const MEASURE_OFF = -1;
                const pointList = this.pointList;

                if (this.isLineToolOn) {
                    if (pointList.length < 2) {
                        return MEASURE_OFF;
                    }

                    let sum = 0;
                    for (let i = 0; i < pointList.length; i++) {
                        if (i === 0) continue;
                        sum += getDistance(pointList[i], pointList[i - 1]);
                    }

                    return sum;
                } else {
                    if (pointList.length < 3) {
                        return MEASURE_OFF;
                    }

                    const areaPoints = [];
                    for (let i = 0; i < pointList.length; i++) {
                        areaPoints.push(pointList[i]);
                    }
                    areaPoints.push(pointList[0]);

                    /*pointList.forEach(point => {
                        areaPoints.push([point.latitude, point.longitude]);
                    });*/

                    return getAreaOfPolygon(areaPoints);
                }
            },
            utmText() {
                const utmObj = this.utm.convertLatLngToUtm(
                    this.mapCurrentRegion.latitude,
                    this.mapCurrentRegion.longitude,
                    2
                );
                return `${utmObj.ZoneNumber}${utmObj.ZoneLetter}, ${utmObj.Easting}, ${utmObj.Northing}`;
            },
            showLegend() {
                let wmsCount = 0;
                this.mapDataList.forEach(categoryType => {
                    categoryType.list.forEach(category => {
                        if (category.markerVisibility && category.wmsList && category.wmsList.length > 0) {
                            wmsCount += category.wmsList.length;
                        }
                    });
                });
                return wmsCount > 0;
            },
        },
        data: () => {
            return {
                store, PROVIDER_GOOGLE, SCALE_WIDTH, TOOLS_MARGIN_BOTTOM, PROVINCE_NAME_EN,
                Platform, Dimensions, StyleSheet, TouchableOpacity, DEBUG, MAP_HEADER, BOTTOM_NAV, DIMENSION,
                PROVINCE_DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, HEATMAP_CATEGORY_ID_RISK, HEATMAP_CATEGORY_ID_DISEASE,
                utm, Popover,
                imageMenu, imageBack, imageClose, imageNavigate, imageLightOff, imageLightOn,
                imageMapToolCurrentLocationOff, imageMapToolCurrentLocationOn,
                imageMapToolMarkerOff, imageMapToolMarkerOn,
                bgMeasureTools, imageMapToolMeasureOn, imageMapToolMeasureOff,
                imageMapToolLineOn, imageMapToolLineOff,
                imageMapToolPolygonOn, imageMapToolPolygonOff,
                imageDragMarker, imageDragMarkerEnd, imageDeleteMeasure,
                imageMapToolZoomIn, imageMapToolZoomOut, imageMapToolLegend, imageRedDot,

                screenHeight: Dimensions.get('window').height,
                statusBarHeight: getStatusBarHeight(),
                activeMarker: null,
                mapCurrentRegion: null,
                isMeasureToolOn: false,
                isMarkerToolOn: false,
                isLineToolOn: true,
                isDragging: false,
                draggedMarker: null,
                searchTerm: '',
                backHandler: null,
                isBottomSheetOpen: false,
                scaleText: null,
                mapType: MAP_TYPE_LIST[0],
                showsUserLocation: false,
                //showsTraffic: false,

                pointList: [
                    /*{longitude: 99.90637622773647, latitude: 13.739281519255695},
                    {longitude: 99.93837732821703, latitude: 13.77968939358877}*/
                ],
                point: null,
                searchLatLngPoint: null,
                pointAddress: '',
                justClickCurrentLocation: false,

                watchId: null,
                currentLocation: null,
                /*currentLatitude: null,
                currentLongitude: null,
                currentCoordinate: new AnimatedRegion({
                    latitude: null,
                    longitude: null,
                    latitudeDelta: null,
                    longitudeDelta: null,
                }),*/
            };
        },
        methods: {
            openFilterPanel: function () {
                this.$refs['drawer'].open();
            },
            closeFilterPanel: function () {
                this.$refs['drawer'].close();
            },
            handleClickMenu: function () {
                //this.openFilterPanel();
                store.dispatch('OPEN_DRAWER', {});
            },
            handleOpenFilterPanel: function () {

            },
            handleCloseFilterPanel: function () {
                store.dispatch('CLOSE_DRAWER', {});
            },
            handleSliderValueChange: function (value) {
                this.markerOpacity = value;
            },
            handleSliderValueChange2: function (value) {
                this.markerOpacity2 = value;
            },
            handleChangeOpacity: function (key, value) {
                //alert('KEY: ' + key + '\nVALUE: ' + value);
                this.mapDataList[key].markerOpacity = value;
            },
            handleClickPoint: function (marker) {
                console.log(JSON.stringify(marker));

                //this.$refs['markerDetails'].snapTo(1);
                this.activeMarker = marker;
                marker.active = true;

                this.navigation.navigate('MarkerDetails', {marker});
            },
            handleSearchLatLng: function (coord) {
                //alert(JSON.stringify(coord));
                const lat = parseFloat(coord.latitude);
                const lng = parseFloat(coord.longitude);

                this.searchLatLngPoint = {
                    latitude: lat,
                    longitude: lng,
                };

                this.$refs['mapView'].animateToRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
            },
            handleClearSearchLatLng: function () {
                this.searchLatLngPoint = null;
            },
            handleClickLatLngPoint: function () {
                this.showPointDetails(this.searchLatLngPoint);
            },
            handleClickCloseBottomSheet: function () {
                this.$refs['markerDetails'].snapTo(2);
            },
            handlePressPolyline: function (marker) {
                //alert(marker.properties.NAME_T);
                marker.active = true;
            },
            getPolylineCoordinates: function (coordinates) {
                const output = [];
                coordinates.forEach(coord => {
                    output.push({
                        latitude: coord[1],
                        longitude: coord[0],
                    });
                });
                return output;
            },
            handleClickZoom: function (zoomType) {
                const SCALE_STEP = 2;
                const scale = zoomType === 1 ? SCALE_STEP : 1 / SCALE_STEP;
                this.$refs['mapView'].animateToRegion({
                    latitude: this.mapCurrentRegion.latitude,
                    longitude: this.mapCurrentRegion.longitude,
                    latitudeDelta: this.mapCurrentRegion.latitudeDelta * scale,
                    longitudeDelta: this.mapCurrentRegion.longitudeDelta * scale,
                });
            },
            handleClickLegend: function () {
                this.mapDataList.forEach(categoryType => {
                    categoryType.list.forEach(category => {
                        /*{
                            "CATEGORY": "12",
                            "url": "http://wms.ngis.go.th:8081/geoserver/FGDS_YASOTHON/wms?service=wms&version=1.3.0&request=GetCapabilities",
                            "layers": [
                                "L14_แนวคลองชลประทานจังหวัดยโสธร"ส่วน
                            ]
                        }*/
                        const wmsList = category.wmsList;
                    })
                });
            },

            handleMapReady: function () {
                //alert('Map ready!');
            },
            handleClickMap: function (coord) {
                //console.log(coord);

                if (this.isMeasureToolOn) {
                    const tempList = Object.assign([], this.pointList);
                    tempList.push(coord);
                    this.pointList = tempList;

                    console.log(this.pointList);
                } else if (this.isMarkerToolOn) {
                    this.showPointDetails(coord);
                }
            },
            showPointDetails: async function (coord) {
                const latitudeDelta = this.mapCurrentRegion ? this.mapCurrentRegion.latitudeDelta : 0.05;
                const longitudeDelta = this.mapCurrentRegion ? this.mapCurrentRegion.longitudeDelta : 0.05;
                this.$refs['mapView'].animateToRegion({
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                    latitudeDelta,
                    longitudeDelta,
                });
                const apiResult = await doGetAddressFromCoord(coord.latitude, coord.longitude);

                //this.$refs['markerDetails'].snapTo(1);
                this.point = coord;
                if (apiResult.success) {
                    this.pointAddress = apiResult.data.address;
                } else {
                    this.pointAddress = `${coord.latitude}, ${coord.longitude}`;
                }

                const title = apiResult.success ? apiResult.data.address : `${coord.latitude.toFixed(6)}, ${coord.longitude.toFixed(6)}`;
                const marker = {
                    type: 'Feature',
                    id: 17678,
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            coord.longitude,
                            coord.latitude
                        ]
                    },
                    properties: {
                        NAME_T: title,
                        DESCRIPTION_T: ``,
                        LOCATION_T: `ละติจูด ${coord.latitude.toFixed(6)}, ลองจิจูด ${coord.longitude.toFixed(6)}`,
                        CATEGORY: 0,
                        P_CODE: 0,
                        IMAGES: []
                    }
                };
                this.navigation.navigate('MarkerDetails', {marker});
            },
            handleRegionChange: function (region) {
                console.log(JSON.stringify(this.mapCurrentRegion));
                this.mapCurrentRegion = region;
                this.calculateScaleDistance(region);
            },
            calculateScaleDistance(region) {
                const screenWidth = Dimensions.get('window').width;
                const scaleLongitudeDelta = (this.SCALE_WIDTH * region.longitudeDelta) / screenWidth;
                const scaleDistance = getDistance( // คำนวณที่มุมล่างซ้ายของ map
                    {
                        latitude: region.latitude - (region.latitudeDelta / 2),
                        longitude: region.longitude - (region.longitudeDelta / 2)
                    },
                    {
                        latitude: region.latitude - (region.latitudeDelta / 2),
                        longitude: region.longitude - (region.longitudeDelta / 2) + scaleLongitudeDelta
                    }
                );
                if (scaleDistance < 1000) {
                    this.scaleText = scaleDistance + ' ม.';
                } else {
                    this.scaleText = this.numberWithCommas((scaleDistance / 1000).toFixed(2)) + ' กม.';
                }
            },
            numberWithCommas: function (num) {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

            handleDragMarkerStart: function (coord) {
                console.log(`Drag Start: ${coord}`);

                this.isDragging = true;
                this.draggedMarker = coord;
            },
            handleDragMarker: function (coord) {
                console.log(`Drag: ${coord}`);
            },
            handleDragMarkerEnd: function (oldCoord, newCoord) {
                console.log(`Drag End: ${newCoord}`);

                this.isDragging = false;
                this.draggedMarker = null;

                const tempList = Object.assign([], this.pointList);
                for (let i = 0; i < tempList.length; i++) {
                    if (tempList[i] === oldCoord) {
                        tempList[i] = newCoord;
                    }
                }
                this.pointList = tempList;
            },

            handleClickMeasureTool: function () {
                this.isMeasureToolOn = !this.isMeasureToolOn;
                if (this.isMeasureToolOn) {
                    this.isMarkerToolOn = false;
                    this.point = null;
                }
            },
            handleClickMarkerTool: function () {
                this.isMarkerToolOn = !this.isMarkerToolOn;
                if (this.isMarkerToolOn) {
                    this.isMeasureToolOn = false;
                } else {
                    this.point = null;
                }
            },
            handleClickCurrentLocationTool: function () {
                if (this.watchId === null) {
                    getCurrentLocation({
                        callback: coord => {
                            // แสดง marker
                            this.currentLocation = coord;

                            try {
                                this.$refs['mapView'].animateToRegion({
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                    latitudeDelta: this.mapCurrentRegion.latitudeDelta,
                                    longitudeDelta: this.mapCurrentRegion.longitudeDelta,
                                });
                            } catch (e) {
                                console.log('Error animate to region: ' + e);
                            }

                            this.watchId = navigator.geolocation.watchPosition(position => {
                                    console.log('TRACKING LOCATION: ', JSON.stringify(position.coords));
                                    const {latitude, longitude} = position.coords;
                                    this.currentLocation = position.coords;

                                    /*if (Platform.OS === 'android') {
                                        if (this.$refs['locationMarker']) {
                                            this.$refs['locationMarker'].animateMarkerToCoordinate(
                                                position.coords,
                                                500
                                            );
                                        }
                                    }*/

                                    this.$refs['mapView'].animateToRegion({
                                        latitude,
                                        longitude,
                                        latitudeDelta: this.mapCurrentRegion.latitudeDelta,
                                        longitudeDelta: this.mapCurrentRegion.longitudeDelta,
                                    });
                                },
                                null,
                                {
                                    maximumAge: 0,
                                    distanceFilter: 1,
                                    timeout: 10000,
                                });
                        }
                    });
                } else {
                    navigator.geolocation.clearWatch(this.watchId);
                    this.watchId = null;
                }
                return;

                //todo: ***********************************************************
                //todo: ***********************************************************
                //todo: ***********************************************************

                if (this.justClickCurrentLocation) {
                    this.point = null;
                } else {
                    this.justClickCurrentLocation = true;
                    setTimeout(() => {
                        this.justClickCurrentLocation = false;
                    }, CLICK_CURRENT_LOCATION_TIMEOUT * 1000);

                    getCurrentLocation({
                        callback: coord => {
                            // แสดง marker
                            this.point = coord;

                            try {
                                this.$refs['mapView'].animateToRegion({
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                });
                            } catch (e) {
                                console.log('Error animate to region: ' + e);
                            }
                        }
                    });
                }
            },
            _handleClickCurrentLocationTool: function () {
                if (Platform.OS === 'android') { // android
                    requestAndroidPermissions({
                        permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        title: this.APP_NAME,
                        requestMessage: 'แอปจำเป็นต้องขอข้อมูลตำแหน่งปัจจุบันของคุณ',
                        denyMessage: 'แอปไม่ได้รับอนุญาตจากผู้ใช้ จึงไม่สามารถตรวจสอบตำแหน่งปัจจุบันได้',
                        callback: (success, message) => {
                            if (success) {
                                this._doGetCurrentLocation();
                            } else {
                                Alert.alert('ผิดพลาด', message);
                            }
                        }
                    });
                } else { // ios
                    this._doGetCurrentLocation();
                }
            },
            _doGetCurrentLocation: function () {
                try {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log(position.coords);

                            // แสดง marker
                            this.point = position.coords;

                            try {
                                this.$refs['mapView'].animateToRegion({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                });
                            } catch (e) {
                                console.log('Error animate to region: ' + e);
                            }
                        },
                        (error) => {
                            console.log(`Error getting location: ${error.message}`);
                            Alert.alert('ผิดพลาด', 'เกิดปัญหาในการตรวจสอบตำแหน่งปัจจุบันของคุณ');
                        },
                        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
                    );
                } catch (e) {
                    console.log('Error get current position: ' + e);
                    Alert.alert('ผิดพลาด', 'เกิดปัญหาในการตรวจสอบตำแหน่งปัจจุบันของคุณ: ' + e);
                }
            },
            handleClickLineTool: function (isLine) {
                if (this.isLineToolOn !== isLine) {
                    //this.pointList = [];
                    this.isLineToolOn = isLine;
                }
            },
            handleClickDeleteMeasure: function () {
                const self = this;
                Alert.alert(
                    'ลบ',
                    'ยืนยันลบการวัดระยะทาง/พื้นที่?',
                    [
                        {
                            text: 'ลบ',
                            onPress: () => {
                                self.pointList = [];
                            }
                        },
                        {
                            text: 'ยกเลิก',
                            onPress: () => {
                            },
                            style: 'cancel'
                        },
                    ],
                    {cancelable: true}
                );
            },
            handleOpenBottomSheet: function () {
                this.isBottomSheetOpen = true;
            },
            handleCloseBottomSheet: function () {
                this.isBottomSheetOpen = false;
            },
            handleClickNavigate: function () {
                let lat = null, lng = null;
                let label = null;

                if (this.point) {
                    lat = this.point.latitude;
                    lng = this.point.longitude;
                    label = this.pointAddress;
                } else if (this.activeMarker) {
                    lat = this.activeMarker.geometry.coordinates[1];
                    lng = this.activeMarker.geometry.coordinates[0];
                    label = this.activeMarker.properties.NAME_T;
                }

                if (lat !== null && lng != null) {
                    const scheme = Platform.select({
                        ios: 'maps:0,0?q=',
                        android: 'geo:0,0?q='
                    });
                    const latLng = `${lat},${lng}`;
                    const url = Platform.select({
                        ios: `${scheme}${label}@${latLng}`,
                        android: `${scheme}${latLng}(${label})`
                    });

                    Linking.openURL(url);
                } else {
                    Alert.alert('ผิดพลาด', 'ไม่สามารถนำทางได้')
                }
            },
            getWmsLink: function (wms) {
                //layers: Layers to display on map. Value is a comma-separated list of layer names.
                if (wms.layers && wms.layers.length > 0) {
                    const allLayers = wms.layers.reduce((total, layer, index) => {
                        const all = index === 1 ? encodeURI(total) : total;
                        return `${all},${encodeURI(layer)}`;
                    });
                    const wmsUrl = `${wms.url.replace('GetCapabilities', 'GetMap')}&layers=${allLayers}&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`;
                    //console.log('WMS URL: ', wmsUrl);
                    return wmsUrl;
                }

                return '';
            },
            getLegendImage: function (url, layerName) {
                const FORMAT = 'image/png';
                const SIZE = 40;

                return url.replace('GetCapabilities', 'GetLegendGraphic')
                    + `&format=${FORMAT}&width=${SIZE}&height=${SIZE}&layer=${layerName}`;
            },

            /*handleClickClearSearch: function () {
                this.showSearchResult = false;
                this.searchTerm = '';
            },*/
        },
        created: function () {
            console.log('++++++++++ MAP - CREATED');
            //this.navigation.state.params.header = null;
            //this.navigation.navigate('News');

            /*store.dispatch('FETCH_MAP_DATA', {
                province: 0
            });*/

            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.drawerOpen) {
                    store.dispatch('CLOSE_DRAWER', {});
                    return true;
                }
                /*if (this.isBottomSheetOpen) {
                    this.$refs['markerDetails'].snapTo(2);
                    return true;
                }*/
                return false;
            });
        },
        beforeDestroy: function () {
            console.log('++++++++++ MAP - BEFORE_DESTROY');

            if (this.watchId !== null) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }

            /*if (this.backHandler) {
                this.backHandler.remove();
            }*/
        },
        beforeMount: function () {
            console.log('++++++++++ MAP - BEFORE_MOUNT');
        },
        mounted: function () {
            console.log('++++++++++ MAP - MOUNTED');
        },
        beforeUpdate: function () {
            console.log('++++++++++ MAP - BEFORE_UPDATE');
        },
        updated: function () {
            console.log('++++++++++ MAP - UPDATED');
        },
        destroyed: function () {
            console.log('++++++++++ MAP - DESTROYED');
            this.backHandler.remove();
        },
    }
</script>

<style>
    .container {
        flex: 1;
        border-width: 0;
        border-color: red;
    }

    .header-container {
        position: absolute;
        width: 100%;
        height: 142;
        top: 0;
        left: 0;
        justify-content: flex-start;
        border-width: 0;
        border-color: green;
    }

    .header {
        flex-direction: row;
        align-items: center;
        padding-left: 20;
        padding-right: 20;
        border-width: 0;
        border-color: yellow;
    }

    .province-name {
        flex: 1;
        text-align: center;
        font-family: DBHeavent-Bold;
        letter-spacing: 1;
        color: white;
        font-size: 26;
        border-width: 0;
        border-color: yellow;
    }

    .map-scale-container {
        position: absolute;
        align-items: flex-start;
        border-width: 0;
        border-color: red;
    }

    .map-scale-text {
        font-family: DBHeavent;
        padding-top: 0;
        padding-bottom: 0;
        color: #333333;
        font-size: 18;
    }

    .map-tools-container {
        position: absolute;
        align-items: flex-end;
        border-width: 0;
        border-color: greenyellow;
    }

    .map-tools-container-left {
        position: absolute;
        align-items: flex-start;
        border-width: 0;
        border-color: greenyellow;
    }

    .map-tools-measure-container {
    }

    .map-tools-measure-container-background {
        width: 40;
        height: 129;
        justify-content: space-between;
        align-items: center;
    }

    .map-tools-icon-touchable {
        border-color: red;
        border-width: 0;
    }

    .map-tools-icon {
        width: 40;
        height: 40;
    }

    .map-tools-zoom-icon {
        width: 22.5;
        height: 28;
    }

    .search-input-container {
        position: absolute;
        width: 100%;
        bottom: 0;
        justify-content: flex-end;
        padding-left: 20;
        padding-right: 20;
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

    .menu-icon {
        width: 20;
        height: 20;
    }

    .back-icon {
        width: 24;
        height: 18;
    }

    .alert-icon {
        width: 40;
        height: 40;
    }

    .map-view {
        flex: 1;
        border-width: 0;
        border-color: orangered;
    }

    .slider {
        flex: 1;
        padding-left: 0;
        padding-right: 0;
    }

    .image-light {
        width: 10;
        height: 10;
    }

    .image-category {
        width: 35;
        height: 38;
        margin-right: 6;
    }

    .menu-option {
        width: 100%;
    }

    .menu-option-text {
        width: 100%;
        font-family: DBHeavent;
        font-size: 22;
        border-width: 0;
        border-color: blue;
    }
</style>
