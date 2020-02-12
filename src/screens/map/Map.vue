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
                    :provider="PROVIDER_GOOGLE"
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

                <view v-if="!isMeasureToolOn && !isMarkerToolOn"
                      v-for="(categoryType, categoryTypeIndex) in mapDataList">
                    <view v-for="(category, categoryIndex) in categoryType.list">
                        <!--wms-->
                        <w-m-s-tile
                                v-for="(wms, wmsIndex) in category.wmsList"
                                v-if="category.markerVisibility"
                                :url-template="getWmsLink(wms)"
                                :_z-index="100"
                                :opacity="1"
                                :tile-size="512"
                        />
                        <!--จุด-->
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
                        <!--เส้น-->
                        <polyline
                                v-for="(marker, markerIndex) in category.markerList"
                                v-if="category.markerVisibility && marker.geometry.type === 'Linestring'"
                                :coordinates="getPolylineCoordinates(marker.geometry.coordinates)"
                                :title="marker.properties.NAME_T"
                                :strokeColor="'#45b3ff'"
                                :strokeWidth="marker.active ? 4 : 2"
                                :tappable="true"
                                :on-press="() => handlePressPolyline(marker)"/>

                        <!--heatmap-->
                        <heatmap
                                v-if="category.id === HEATMAP_CATEGORY_ID && category.markerVisibility"
                                :points="heatMapPointList"/>
                    </view>
                </view>

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
                    <image :source="imageMapToolCurrentLocation"
                           class="map-tools-icon"
                           resize-mode="contain"/>
                </touchable-opacity>
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
                    pointer-events="none"
                    :style="{
                        position: 'absolute',
                        alignSelf: 'center',
                        width: 0, height: 20,
                        bottom: ((screenHeight - MAP_HEADER.height) / 2) - 10,
                        borderRightWidth: 1,
                        borderRightColor: '#333333',
                    }"/>
            <view
                    pointer-events="none"
                    :style="{
                        position: 'absolute',
                        alignSelf: 'center',
                        width: 20, height: 0,
                        bottom: ((screenHeight - MAP_HEADER.height) / 2),
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
                    <search-box :navigation="navigation"/>
                </view>
            </view>

            <!--<marker-details
                    ref="markerDetails"
                    :snap-points="[
                        screenHeight - statusBarHeight - BOTTOM_NAV.height,
                        (screenHeight - 140 - BOTTOM_NAV.height) / 2,
                        0
                    ]"
                    :android-initial-snap="2"
                    :coord="activeMarker ? {
                        latitude: activeMarker.geometry.coordinates[1],
                        longitude: activeMarker.geometry.coordinates[0],
                    } : null"
                    :on-open="handleOpenBottomSheet"
                    :on-close="handleCloseBottomSheet"
                    :on-click-navigate="null"
                    :on-click-close-button="handleClickCloseBottomSheet"
                    :title-font-size="26"
                    :title="activeMarker ? activeMarker.properties.NAME_T : ''"
                    :show-category="true"
                    :category-image-url="activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].image : null"
                    :category-name="activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''"
                    :image-list="activeMarker ? activeMarker.properties.IMAGES : []"
                    :description="(activeMarker && activeMarker.properties.DESCRIPTION_T) ? activeMarker.properties.DESCRIPTION_T.trim() : ''"
                    :location="(activeMarker && activeMarker.properties.LOCATION_T) ? activeMarker.properties.LOCATION_T.trim() : ''"/>-->
        </view>

        <!--<bottom-sheet
                ref="bottomSheet"
                :snap-points="[screenHeight - statusBarHeight, '45%', '0%']"
                :initial-snap="2"
                :enabled-inner-scrolling="true"
                :enabled-content-tap-interaction="false"
                :enabled-content-gesture-interaction="false"
                :on-open-start="handleOpenBottomSheet"
                :on-close-end="handleCloseBottomSheet">
            <view render-prop-fn="renderContent"
                  :style="{
                        height: '100%',
                  }">
                <scroll-view :style="{
                    flexDirection: 'column',
                    flex: 1,
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: DIMENSION.horizontal_margin,
                    paddingBottom: DIMENSION.horizontal_margin,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderWidth: 0,
                    borderColor: 'red',
                }">
                    <scroll-view
                            v-if="activeMarker && activeMarker.properties.IMAGES.length > 0"
                            :horizontal="true"
                            :style="{
                                padding: 0,
                                marginBottom: 15,
                                borderWidth: 0,
                                borderColor: 'red',
                            }">
                        <touchable-opacity
                                v-for="(item, index) in activeMarker ? activeMarker.properties.IMAGES : []"
                                :on-press="null"
                                :active-opacity="0.6">
                            <card-view
                                    :style="{
                                        width: 150,
                                        height: 100,
                                        marginRight: 10,
                                    }"
                                    :card-elevation="5"
                                    :card-maxElevation="5"
                                    :corner-radius="10">
                                <image :source="{uri: item}"
                                       :style="{
                                            width: 150,
                                            height: 100,
                                       }"
                                       resize-mode="cover"/>
                            </card-view>
                        </touchable-opacity>
                    </scroll-view>

                    &lt;!&ndash;<flat-list
                            :data="activeMarker ? activeMarker.properties.IMAGES : []"
                            :key-extractor="(item, index) => index.toString()">
                        <view render-prop-fn="renderItem">
                            <card-view
                                    :style="{
                                        width: 200,
                                        height: 112,
                                        marginTop: 5,
                                        marginRight: 15,
                                    }"
                                    :card-elevation="10"
                                    :card-maxElevation="10"
                                    :corner-radius="10"
                                    :style="{}">
                                <image :source="{uri: args.item}"
                                       :style="{
                                            flex: 1,
                                       }"
                                       resize-mode="cover"/>
                            </card-view>
                        </view>
                    </flat-list>&ndash;&gt;

                    <view v-if="activeMarker && activeMarker.properties.DESCRIPTION_T && activeMarker.properties.DESCRIPTION_T.trim().length > 0"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">รายละเอียด
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">{{activeMarker ? activeMarker.properties.DESCRIPTION_T : ''}}
                        </text>
                    </view>

                    <view v-if="activeMarker && activeMarker.properties.LOCATION_T && activeMarker.properties.LOCATION_T.trim().length > 0"
                          :style="{marginBottom: 15}">
                        <text :style="{
                            fontFamily: 'DBHeavent-Med',
                            color: '#333333',
                            fontSize: 22,
                            marginBottom: 5,
                        }">ตำแหน่ง
                        </text>
                        <text :style="{
                            fontFamily: 'DBHeavent',
                            color: '#333333',
                            fontSize: 22,
                        }">{{activeMarker ? activeMarker.properties.LOCATION_T : ''}}
                        </text>
                    </view>

                    <touchable-opacity
                            :on-press="handleClickNavigate"
                            :active-opacity="0.4">
                        <view :style="{
                            backgroundColor: '#F0F6FF',
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 28,
                        }">
                            <text :style="{
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 22,
                                color: '#435582',
                            }">
                                {{'นำทาง'}}
                            </text>
                        </view>
                    </touchable-opacity>

                    <text v-for="item in new Array(20)"
                          v-if="false"
                          :style="{
                                marginBottom: 10,
                          }">{{'Hello: ' + item}}
                    </text>

                    <view :style="{
                        height: BOTTOM_NAV.height,
                        marginBottom: 30,
                    }"/>
                </scroll-view>
            </view>
            <view render-prop-fn="renderHeader">
                <view :style="{
                    flexDirection: 'row',
                    paddingLeft: DIMENSION.horizontal_margin,
                    paddingRight: DIMENSION.horizontal_margin,
                    paddingTop: 10,
                    paddingBottom: DIMENSION.horizontal_margin - 10,
                    backgroundColor: 'rgba(255, 255, 255, 240)',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }">
                    <view :style="{
                        flex: 1,
                        marginRight: 5,
                    }">
                        <touchable-opacity>
                            <view :style="{
                                alignSelf: 'center',
                                backgroundColor: '#e0e0e0',
                                width: 30,
                                height: 6,
                                marginLeft: 53,
                                marginBottom: 8,
                                borderRadius: 2,
                            }"/>
                        </touchable-opacity>

                        <text :style="{
                            fontFamily: 'DBHeavent-Bold',
                            color: '#333333',
                            fontSize: point ? 24 : 26,
                            marginBottom: 5,
                        }">
                            {{(point && pointAddress) ? pointAddress : (activeMarker ? activeMarker.properties.NAME_T : '')}}
                        </text>
                        <view v-if="!point"
                              :style="{
                                    flexDirection: 'row',
                              }">
                            <image :source="{uri: (activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].image : null)}"
                                   :style="{
                                        width: 35,
                                        height: 38,
                                   }"
                                   resize-mode="contain"/>
                            <text :style="{
                                flex: 1,
                                fontFamily: 'DBHeavent',
                                color: '#aaaaaa',
                                fontSize: 22,
                                marginTop: 2,
                            }">
                                {{activeMarker ? store.state.categoryData[activeMarker.properties.CATEGORY].name : ''}}
                            </text>
                        </view>
                    </view>
                    <view>
                        <touchable-opacity
                                :on-press="handleClickCloseBottomSheet"
                                :style="{
                                marginTop: 0,
                            }">
                            <image :source="imageClose"
                                   :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                        </touchable-opacity>
                        <touchable-opacity
                                :on-press="handleClickNavigate"
                                :style="{
                                marginTop: 0,
                            }">
                            <image :source="imageNavigate"
                                   :style="{
                                   width: 48,
                                   height: 48,
                                   padding: 0,
                               }"/>
                        </touchable-opacity>
                    </view>
                </view>

                &lt;!&ndash;<touchable-opacity
                        :on-press="handleClickNavigate"
                        :active-opacity="0.4">
                    <view :style="{
                            backgroundColor: '#F0F6FF',
                            paddingTop: 14,
                            paddingBottom: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 28,
                        }">
                        <text :style="{
                                fontFamily: 'DBHeavent-Med',
                                fontSize: 22,
                                color: '#435582',
                            }">นำทาง</text>
                    </view>
                </touchable-opacity>&ndash;&gt;

                <view :style="{
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#cccccc'
                }"/>
            </view>
        </bottom-sheet>-->
    </drawer>
</template>

<script>
    import store from '../../store';
    import {
        DEBUG, MAP_HEADER, BOTTOM_NAV, PROVINCE_NAME_EN, DIMENSION,
        PROVINCE_DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, HEATMAP_CATEGORY_ID,
    } from '../../constants';
    import {requestAndroidPermissions, getCurrentLocation} from '../../constants/utils'
    import {doGetAddressFromCoord} from '../../store/fetch';
    import MeasureLabel from './MeasureLabel';
    import SearchBox from './SearchBox';
    //import MarkerDetails from '../map/MarkerDetails';

    import {Dimensions, StyleSheet, Alert, PermissionsAndroid, Platform, BackHandler, Linking, TouchableOpacity} from 'react-native';
    import {Fragment} from 'react';
    import MapView, {PROVIDER_GOOGLE, Marker, Polyline, Polygon, WMSTile, Heatmap} from 'react-native-maps';
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
    const utm = new UTMLatLng();

    import imageMenu from '../../../assets/images/screen_map/ic_menu.png';
    import imageBack from '../../../assets/images/ic_back.png';
    import imageClose from '../../../assets/images/ic_close2.png';
    import imageNavigate from '../../../assets/images/screen_map/ic_navigate_2.png';

    import imageLightOff from '../../../assets/images/sidebar/ic_light_off.png';
    import imageLightOn from '../../../assets/images/sidebar/ic_light_on.png';

    import imageMapToolCurrentLocation from '../../../assets/images/screen_map/ic_map_tool_current_location.png';
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
    import imageDeleteMeasure from '../../../assets/images/screen_map/ic_delete_measure.png';

    import imageDragMarker from '../../../assets/images/screen_map/ic_drag_marker_new.png';
    import imageDragMarkerEnd from '../../../assets/images/screen_map/ic_drag_marker_end_new.png';

    const SCALE_WIDTH = 90;
    const TOOLS_MARGIN_BOTTOM = 35;
    const CLICK_CURRENT_LOCATION_TIMEOUT = 10;

    export default {
        components: {
            Fragment, MapView, Marker, Polyline, Polygon, WMSTile, Heatmap,
            LinearGradient, CardView, Drawer, FilterPanel, Slider, BottomSheet,
            SliderBox, MeasureLabel, SearchBox,
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
            heatMapPointList() {
                return store.state.heatMapPointList[PROVINCE_NAME_EN[this.province]];
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
            }
        },
        data: () => {
            return {
                store, PROVIDER_GOOGLE, SCALE_WIDTH, TOOLS_MARGIN_BOTTOM, PROVINCE_NAME_EN,
                Dimensions, StyleSheet, TouchableOpacity, DEBUG, MAP_HEADER, BOTTOM_NAV, DIMENSION,
                PROVINCE_DIMENSION, COLOR_PRIMARY, COLOR_PRIMARY_DARK, HEATMAP_CATEGORY_ID,
                utm,
                imageMenu, imageBack, imageClose, imageNavigate, imageLightOff, imageLightOn,
                imageMapToolCurrentLocation, imageMapToolMarkerOff, imageMapToolMarkerOn,
                bgMeasureTools, imageMapToolMeasureOn, imageMapToolMeasureOff,
                imageMapToolLineOn, imageMapToolLineOff,
                imageMapToolPolygonOn, imageMapToolPolygonOff,
                imageDragMarker, imageDragMarkerEnd, imageDeleteMeasure,
                imageMapToolZoomIn, imageMapToolZoomOut,

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

                pointList: [
                    /*{longitude: 99.90637622773647, latitude: 13.739281519255695},
                    {longitude: 99.93837732821703, latitude: 13.77968939358877}*/
                ],
                point: null,
                pointAddress: '',
                justClickCurrentLocation: false,
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

            handleMapReady: function () {
                //alert('Map ready!');
            },
            handleClickMap: async function (coord) {
                //console.log(coord);

                if (this.isMeasureToolOn) {
                    const tempList = Object.assign([], this.pointList);
                    tempList.push(coord);
                    this.pointList = tempList;

                    console.log(this.pointList);
                } else if (this.isMarkerToolOn) {
                    const latitudeDelta = this.mapCurrentRegion ? this.mapCurrentRegion.latitudeDelta : 0.005;
                    const longitudeDelta = this.mapCurrentRegion ? this.mapCurrentRegion.longitudeDelta : 0.005;
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
                }
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
                return `${wms.url.replace('GetCapabilities', 'GetMap')}&layers=${wms.layers[0]}&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:900913&format=image/png&transparent=true`;
            },
            /*handleClickClearSearch: function () {
                this.showSearchResult = false;
                this.searchTerm = '';
            },*/
        },
        created: function () {
            //this.navigation.state.params.header = null;
            //this.navigation.navigate('News');

            /*store.dispatch('FETCH_MAP_DATA', {
                province: 0
            });*/

            /*const self = this;
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.isBottomSheetOpen) {
                    this.$refs['markerDetails'].snapTo(2);
                    return true;
                }
                return false;
            });*/
        },
        beforeDestroy: function () {
            /*if (this.backHandler) {
                this.backHandler.remove();
            }*/
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
        border-color: red;
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
</style>