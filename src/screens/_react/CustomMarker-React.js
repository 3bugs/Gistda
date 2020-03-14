import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';

export default class CustomMarkerReact extends PureComponent {
    constructor() {
        super();
        this.state = {
            tracksViewChanges: true,
        };
    }

    stopTrackingViewChanges = () => {
        this.setState(() => ({
            tracksViewChanges: false,
        }));
    };

    render() {
        const {tracksViewChanges} = this.state;
        const {marker} = this.props;
        return (
            <Marker
                coordinate={{
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0]
                }}
                anchor={{x: 0.5, y: 0.77}}
                title={marker.properties.NAME_T}
                tracksViewChanges={tracksViewChanges}>
                <Image
                    style={{
                        width: 40, //42, //36,
                        height: 43.33, //45.5, //39,
                    }}
                    source={{uri: 'https://safesafe.ngis.go.th/gapi/uploads/cat_12.png'}}
                    resizeMode="contain"
                    onLoad={this.stopTrackingViewChanges}
                    fadeDuration={0}
                />
            </Marker>
        );
    }
}
