//https://medium.com/@buchereli/performant-custom-map-markers-for-react-native-maps-ddc8d5a1eeb0
//https://blog.bam.tech/developer-news/four-tips-optimize-react-native-map-performance-user-experience

import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';

export default class CustomMarker extends PureComponent {
    constructor() {
        super();
        this.state = {
            tracksViewChanges: true,
        };
    }

    /*componentWillReceiveProps(nextProps) {
        if (this.shouldUpdate(nextProps)) {
            this.setState(() => ({
                tracksViewChanges: true,
            }), () => {
                this.stopTrackingViewChanges();
            });
        }
    }

    shouldUpdate = nextProps => {
        return true;
    };*/

    stopTrackingViewChanges = () => {
        this.setState(() => ({
            tracksViewChanges: false,
        }));
    };

    render() {
        const {tracksViewChanges} = this.state;
        const {marker, onPress} = this.props;
        return (
            <Marker
                coordinate={{
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0]
                }}
                anchor={{x: 0.5, y: 0.77}}
                title={marker.properties.NAME_T}
                opacity={marker.opacity}
                tracksViewChanges={tracksViewChanges}
                onPress={onPress}>
                <Image
                    style={{
                        width: 38, //36, //40, //42,
                        height: 41.17, //39, //43.33, //45.5,
                    }}
                    source={{uri: marker.image}}
                    resizeMode="contain"
                    fadeDuration={0}
                    onLoad={this.stopTrackingViewChanges}
                />
            </Marker>
        );
    }
}
