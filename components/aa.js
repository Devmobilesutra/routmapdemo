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
//import MapScreen from "./MapScreen";
import axios from "axios";
//import PlaceInput from "./components/PlaceInput";
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];


export default class aa extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      hasMapPermission: true,
      userLatitude: 18.4995289,
      userLongitude: 73.8107656,
    
      destinationCoords:[{"latitude":18.49916,"longitude":73.81067},{"latitude":18.49916,"longitude":73.81067},{"latitude":18.49916,"longitude":73.81067}],
destinationCoordsNew:[],
      finalCoords:[],
    
      latitudeArr:[],
      longitudeArr:[],
      newLatitude: 0,
      newLongitude: 0,
    };
    this.locationWatchId = null;
     this.map = React.createRef();
//this.showDirectionsOnMap=this.showDirectionsOnMap.bind(this)

  }
  


  async componentDidMount() {
    //("in component did")
   var SourceLat,SourceLong;
   var DestLat,DestLong;
   var a=0;
   alert(this.state.destinationCoords.length)
    for(var i=0;i<=this.state.destinationCoords.length;i++){
      console.log("infor",a++)
      SourceLat=this.state.destinationCoords[i].latitude
      SourceLong=this.state.destinationCoords[i].longitude
      console.log("sourceLat=",SourceLat)
      console.log("source long=",SourceLong)
    //  for(var j=i+1;j<=this.state.destinationCoords.length;j++){
        DestLat=this.state.destinationCoords[i+1].latitude
        DestLong=this.state.destinationCoords[i+1].longitude
        console.log("Destlat=",  DestLat)
        console.log("Destlong=",  DestLong)
      const result = await axios.get(
      
          `https://maps.googleapis.com/maps/api/directions/json?origin=${SourceLat},${SourceLong}&destination=${DestLat},${DestLong}&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw`
          );
          console.log("datasDirection==",JSON.stringify(result.data))
          const points = PolyLine.decode(
            result.data.routes[0].overview_polyline.points );
        //  console.log("Points==",JSON.stringify(points))
          const latLng = points.map(point => ({
            latitude: point[0],
            longitude: point[1]
          }));
          this.setState({ destinationCoordsNew: latLng });
        //  console.log("latlong1=",JSON.stringify( this.state.destinationCoordsNew ));
         
          
          var joined = this.state.finalCoords.concat(this.state.destinationCoordsNew);
     this.setState({ finalCoords: joined })
      // this.map.current.fitToCoordinates(latLng, {
      //       edgePadding: { top: 40, bottom: 40, left: 40, right: 40 }
      //     });
         // this.state.finalCoords=this.state.destinationCoords
        
          console.log("finalCoords=",JSON.stringify( this.state.finalCoords ));
       

  //    }
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
          transform: [{
          rotate: '270deg'
          }]
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