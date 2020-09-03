import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  DeviceEventEmitter, NativeAppEventEmitter, Platform ,Vibration
} from "react-native";
import MapScreen from "./MapScreen";
import axios from "axios";
import PlaceInput from "./components/PlaceInput";
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];


export default class Appsssssssss extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      hasMapPermission: false,
      userLatitude: 18.4995289,
      userLongitude: 73.8107656,
    
      destinationCoords:[],
      finalCoords:[],
      
      finalCoords:[],
      latitudeArr:[],
      longitudeArr:[],
      newLatitude: 0,
      newLongitude: 0,
    };
    this.locationWatchId = null;
     this.map = React.createRef();
     
//   this.requestCurrentLocation();
  
  }
  


  componentDidMount() {
       BackgroundTimer.runBackgroundTimer(() => { 
        //  console.log('tac');
        Vibration.vibrate(1000);
          this.requestFineLocation();
      },180000);
    
  }

  componentWillUnmount() {
    BackgroundTimer.stopBackgroundTimer(); 
  Geolocation.clearWatch(this.locationWatchId);
  }
 
  async showDirectionsOnMap(newLatitude,newLongitude) {
    const { userLatitude, userLongitude } = this.state;
    console.log("src1",userLatitude)
    console.log("src2",userLongitude)
    console.log("dest1",newLatitude)
    console.log("dest2",newLongitude)
    try {
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${newLatitude},${newLongitude}&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw`
      );
      console.log("datasDirection==",JSON.stringify(result.data))
      const points = PolyLine.decode(
        result.data.routes[0].overview_polyline.points );
      console.log("Points==",points)
      const latLng = points.map(point => ({
        latitude: point[0],
        longitude: point[1]
      }));
      this.setState({ destinationCoords: latLng });
      this.map.current.fitToCoordinates(latLng, {
        edgePadding: { top: 40, bottom: 40, left: 40, right: 40 }
      });

     // this.state.finalCoords=this.state.destinationCoords
     var joined = this.state.finalCoords.concat(this.state.destinationCoords);
     this.setState({ finalCoords: joined })
      console.log("latlong1=",JSON.stringify( this.state.destinationCoords ));
      console.log("latlong=",JSON.stringify( this.state.finalCoords ));
     alert(JSON.stringify( this.state.finalCoords )) 

     this.setState({ userLatitude: newLatitude,userLongitude:newLongitude });
    } catch (err) {
      console.error(err);
    }
  }

  hideKeyboard() {
    Keyboard.dismiss();
  }

  getUserPosition() {
     this.setState({ hasMapPermission: true });
  //  alert("getting user location......")
    this.locationWatchId = Geolocation.getCurrentPosition(
      pos => {
        this.showDirectionsOnMap(pos.coords.latitude,pos.coords.longitude)
        this.setState({
          newLatitude: pos.coords.latitude,
          newLongitude: pos.coords.longitude
        });
            
      },
      err => console.warn(err),
      {
        enableHighAccuracy: true
      }
    );
   
  }

async getCurrentPosition(){
this.setState({ hasMapPermission: true });
//alert(" constr getting current location......")
    this.locationWatchId = Geolocation.getCurrentPosition(
      pos => {
          this.setState({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude
        });
     
      },
      err => console.warn(err),
      {
        enableHighAccuracy: true
      }
    );
   
  }

  async requestCurrentLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getCurrentPosition;
        }
      } else {
        this.getCurrentPosition();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getUserPosition();
        }
      } else {
        this.getUserPosition();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    const {
      finalCoords,
      destinationCoords,
      userLatitude,
      userLongitude,
      hasMapPermission
    } = this.state;
    let polyline = null;
    let marker = null;
   
    if (finalCoords.length > 0) {
    //  alert(finalCoords)
     console.log("abc=",JSON.stringify(finalCoords))
      polyline = (
        <Polyline
          coordinates={finalCoords}
          strokeWidth={4}
          strokeColor="#000"
          geodesic={true}
        />
      );
      marker = (
        <Marker coordinate={finalCoords[finalCoords.length - 1]}  style={{ 
          height: 50,
          width: 50,
          // transform: [{
          // rotate: '270deg'
          // }]
        }} />
      );
    }
    if (hasMapPermission) {
      return (
        <TouchableWithoutFeedback onPress={this.hideKeyboard}>
          <View style={styles.container}>
            <MapView
              ref={this.map}
              showsUserLocation
              followsUserLocation
              style={styles.map}
              region={{
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta:  0.2,
                longitudeDelta:  0.2
              }}
            >
              {polyline}
              {marker}
            </MapView>
            {/* <PlaceInput
              showDirectionsOnMap={this.showDirectionsOnMap}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
            /> */}
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});