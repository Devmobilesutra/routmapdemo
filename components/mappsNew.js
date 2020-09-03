import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  ActivityIndicator, AsyncStorage,
  TouchableOpacity,
  DeviceEventEmitter, NativeAppEventEmitter, Platform, Vibration
} from "react-native";
import RNFS from 'react-native-fs'
//import MapScreen from "./MapScreen";
import PolylineDirection from '@react-native-maps/polyline-direction';
import axios from "axios";
import TimeDistancess from "./timeDistance"
import haversine from "haversine"
import haversines from 's-haversine';
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import { NavigationEvents } from 'react-navigation';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw'
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];
var newarrssfinal = []
var a = []
var finalArray = []
var coordinatesss = []

var userLatitudes = 0
var userLongitudes = 0

export default class mappsNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMapPermission: true,
      userLatitude: 18.4995289,
      userLongitude: 73.8107656,
      markers: [],
      // 
      // coordinates: [
      //   [18.50737, 73.80767],
      //   [18.50775, 73.80787],
      //   [18.50787, 73.80844],
      //   [18.50826, 73.80925],
      //   [18.50838, 73.81012],
      //   [18.50902, 73.81107],
      //   [18.50943, 73.81178],
      //   [18.50954, 73.81263],
      // ],

      ///*  
      newarr: [],
      //  coordinates:this.props.navigation.getParam('destinationCoords'),
      coords: [],
      destinationCoordsNew: [],
      finalCoords: [],
      latitudeArr: [],
      longitudeArr: [],
      newLatitude: 0,
      newLongitude: 0,
      Hours: '',
      minutes: '',
      Km: 0,
      meter: 0,
      isLoading: true,
      snappedCoords: [],
      coordinatesnew: [],
      aaa: ''

    };
    coordinatesss = this.props.navigation.getParam('destinationCoords')
    console.log("sgfdgf=", this.props.navigation.getParam('destinationCoords'))
    this.locationWatchId = null;

  }
  getStoredArray() {
    console.log(finalArray)
    var fileName = `GoogleCoordinates${Math.floor(Math.random() * 100)}.txt`;

    var path = RNFS.ExternalDirectoryPath + fileName;
    console.log(path)

    RNFS.writeFile(path, JSON.stringify(finalArray), 'utf8')
      .then((success) => {
        alert(path);
      })
      .catch((err) => {
        console.log(err.message);
      });

  }
  componentWillMount = async () => {

    console.log("lenghttttissssss...", coordinatesss.length)
    var chunkSize = 100;
    var arr = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15], [16], [17]];
    var groups = coordinatesss.map((e, i) => {
      return i % chunkSize === 0 ? coordinatesss.slice(i, i + chunkSize) : null;
    }).filter(e => { return e });
    console.log("Groups", JSON.stringify(groups))
    for (var i = 0; i < groups.length; i++) {
      var coordinatesnews = []
      coordinatesnews = JSON.stringify(groups[i].join('|'))
      this.calculatePath(coordinatesnews)
    }


    try {
      await new Promise((resolve, reject) => {
        setTimeout(function () {
          this.setState({ isLoading: false })
        }.bind(this), 1000)
      });

    } catch (err) {

    }

    this.setState({
      aaa: 'true'
    })

    this.forceUpdate()

  }

  calculatePath = (newarrs) => {

    console.log("newarrlen.../////////////////.....2", JSON.parse(newarrs))

    axios.get(
      `https://roads.googleapis.com/v1/snapToRoads?path=${JSON.parse(newarrs)}&interpolate=true&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw `
    ).then(resp => {

      var datas = resp.data
      // console.log("resp=",JSON.stringify(datas));
      // console.log("len=",JSON.parse(datas.snappedPoints[0]))


      var datanew = JSON.stringify(datas);
      for (var i = 0; i < JSON.parse(datanew).snappedPoints.length; i++) {
        this.state.finalCoords.push({
          latitude: JSON.parse(datanew).snappedPoints[i].location.latitude,
          longitude: JSON.parse(datanew).snappedPoints[i].location.longitude
        })

      }
      console.log("latlnkhhhhkhkg==", JSON.stringify(this.state.finalCoords))
      // this.setState({
      //  
      //  
      // })
      userLatitudes = 0
      userLongitudes = 0
      userLatitudes = this.state.finalCoords[0].latitude,
        userLongitudes = this.state.finalCoords[0].longitude


    })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {

    const {
      finalCoords,
      destinationCoords,
      coordinates,
      userLatitude,
      userLongitude,
      hasMapPermission,
      Hours, minutes, Km, meter
    } = this.state;

    if (this.state.isLoading) {
      return (
        <View style={[styles.containers, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    let polyline = null;
    let polyline1 = null;
    let marker = null;

    if (finalCoords.length > 0) {
      for (var i = 0; i < finalCoords.length; i++) {
        this.state.markers.push(finalCoords[0])
        this.state.markers.push(finalCoords[finalCoords.length - 1])
      }

      polyline = (
        <Polyline
          coordinates={finalCoords}
          strokeWidth={2}
          strokeColor="red"
          geodesic={true}


        />
      );


      // polyline = (
      //   this.state.finalCoords.map((coords,index)=>{
      //     <Polyline  
      //     key={index}  
      //     index={index}   
      //     coordinates={coords}
      //     strokeWidth={2}
      //     strokeColor="blue"
      //     geodesic={true}          
      //   />
      //   })       

      // );

      marker = (

        <Marker coordinate={finalCoords[finalCoords.length - 1]} style={{
          height: 50,
          width: 50,
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

              // this.setState({
              //   userLatitude: this.state.finalCoords[0].latitude,
              //   userLongitude: this.state.finalCoords[0].longitude
              // })
              region={{
                latitude: this.state.finalCoords[0].latitude,
                longitude: this.state.finalCoords[0].longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
              }}
            >
              {/* {polyline}

            
              {marker} */}
          
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
              />
            </MapView>

            <Text style={{ fontWeight: 'bold', color: 'black' }} >
              {parseFloat(this.props.distance).toFixed(2)} km
            </Text>

            <TouchableOpacity style={styles.buttonContainer12} onPress={this.getStoredArray}>
              <Text style={{ fontWeight: 'bold', color: 'black' }} > WriteGoogleCordsFile </Text>
            </TouchableOpacity>

          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  container1: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }, buttonContainer12: {
    padding: 5,
    height: 40,
    width: 100,
    marginLeft: '75%',

    backgroundColor: '#34DDDD', textAlign: 'center',
    justifyContent: 'center',


  },
});

