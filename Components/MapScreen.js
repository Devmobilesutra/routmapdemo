import React, { Component } from 'react';
import { View,StyleSheet ,Text, Image,TouchableOpacity} from 'react-native';
import MapView ,{ Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions } from 'react-native';

import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw';

class MapScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            // coordinates: [
            //   {
            //     latitude: 37.3317876,
            //     longitude: -122.0054812,
            //   },
            //   {
            //     latitude: 37.771707,
            //     longitude: -122.4053769,
            //   },
            // ],
            coordinates:this.props.Coordinates,
            markers:[],
          };
      
          this.mapView = null;
        }
        
        componentDidMount(){
            // LATITUDE = this.props.Coordinates[0].latitude;
            // LONGITUDE = this.props.Coordinates[0].longitude;
            // LATITUDE_DELTA = 0.0922;
            // LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
            console.log('ajit',(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): undefined)
            // console.log(this.props)
            if (this.state.coordinates.length > 0) {
                  
              this.state.markers.push(this.state.coordinates[0]);
              this.state.markers.push(this.state.coordinates[this.state.coordinates.length - 1]);
              this.setState({},()=>console.log(this.state.markers))
           
         }

        }
        onMapPress = (e) => {
          this.setState({
            coordinates: [
              ...this.state.coordinates,
              e.nativeEvent.coordinate,
            ],
          });
        }
      
        render() {
         
          return (
            <MapView
              initialRegion={{
                latitude: this.props.Coordinates[0].latitude?this.props.Coordinates[0].latitude:LATITUDE,
                longitude: this.props.Coordinates[0].longitude?this.props.Coordinates[0].longitude:LONGITUDE,
                // latitude: LATITUDE,
                // longitude: LONGITUDE,
                
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              style={StyleSheet.absoluteFill}
              ref={c => this.mapView = c}
              showsUserLocation
              followsUserLocation
              onPress={this.onMapPress}
            >
             {
                         this.state.markers.map((CoordinatePoints,index)=>
                         <Marker
                             coordinate={{
                                 latitude: CoordinatePoints.latitude,
                                 longitude: CoordinatePoints.longitude,
                         }}
                        key={index}
                         // title={CoordinatePoints.shopname}
                         // description={CoordinatePoints.time}
                         // image={require('../Assets/pngwing.png')}
                         pinColor={'#1E90FF'}
                       
                         />
                        )
                      }
              {/* {this.state.coordinates.map((coordinate, index) =>
                <Marker key={`coordinate_${index}`} coordinate={coordinate} />
              )} */}
              {(this.state.coordinates.length >= 1) && (
                 this.state.coordinates.map((coordinate, index) =>
                <View
                    Key={`coordinate_${index}`}
                >
                    {(this.state.coordinates.length > index+1 )&&(
                         <MapViewDirections
                            origin={coordinate}
                            waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): undefined}
                            destination={this.state.coordinates[index+1]}
                            apikey={'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw'}
                            resetOnChange={false}
                            strokeWidth={4}
                             strokeColor='#1E90FF'
                            optimizeWaypoints={true}
                        //   onStart={(params) => {
                        //     console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        //   }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
            
                            this.mapView.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                                right: (width / 20),
                                bottom: (height / 20),
                                left: (width / 20),
                                top: (height / 20),
                            }
                            });
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT AN ERROR');
                        }}
                        />      
                    )} 

                 {/* <MapViewDirections
                  origin={this.state.coordinates[0]}
                  waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): undefined}
                  destination={this.state.coordinates[this.state.coordinates.length-1]}
                  apikey={'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw'}
                  strokeWidth={3}
                  strokeColor="hotpink"
                  optimizeWaypoints={true}
                  onStart={(params) => {
                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                  }}
                  onReady={result => {
                    console.log(`Distance: ${result.distance} km`)
                    console.log(`Duration: ${result.duration} min.`)
      
                    this.mapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: (width / 20),
                        bottom: (height / 20),
                        left: (width / 20),
                        top: (height / 20),
                      }
                    });
                  }}
                  onError={(errorMessage) => {
                    console.log('GOT AN ERROR');
                  }}
                />  */}
                 </View>
                 )
              )}
            </MapView>
            
          );
        }
      
}

export default MapScreen;