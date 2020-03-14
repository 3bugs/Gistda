import React, {Component, PureComponent} from 'react';
import {Text, View, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
//import MapView from 'react-native-map-clustering';

import {PROVINCE_DIMENSION} from '../../constants';
import {dataList} from './data';
import CustomMarkerReact from './CustomMarker-React';

export default class MapReact extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext): boolean {
        console.log('shouldComponentUpdate()');
    }

    componentDidUpdate(prevProps, prevState, snapshot): void {
        console.log('componentDidUpdate()');
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapView
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: (PROVINCE_DIMENSION[0].minLatitude + PROVINCE_DIMENSION[0].maxLatitude) / 2,
                        longitude: (PROVINCE_DIMENSION[0].minLongitude + PROVINCE_DIMENSION[0].maxLongitude) / 2,
                        latitudeDelta: PROVINCE_DIMENSION[0].maxLatitude - PROVINCE_DIMENSION[0].minLatitude,
                        longitudeDelta: PROVINCE_DIMENSION[0].maxLongitude - PROVINCE_DIMENSION[0].minLongitude,
                    }}>
                    {
                        dataList.map((coord, index) => (
                            <CustomMarkerReact
                                key={index}
                                coordinate={{
                                    latitude: coord.geometry.coordinates[1],
                                    longitude: coord.geometry.coordinates[0]
                                }}
                                marker={coord}/>
                        ))
                    }
                </MapView>
            </View>
        );
    }
}
