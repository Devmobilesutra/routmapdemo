import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  ActivityIndicator, AsyncStorage,
  DeviceEventEmitter, NativeAppEventEmitter, Platform, Vibration
} from "react-native";
//import MapScreen from "./MapScreen";
import PolylineDirection from '@react-native-maps/polyline-direction';
import axios from "axios";
import TimeDistancess from "./timeDistance"
import haversine from "haversine"
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import { NavigationEvents } from 'react-navigation';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'

const GOOGLE_MAPS_APIKEY = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw'
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];
export default class RoadMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMapPermission: true,
      userLatitude: 18.4995289,
      userLongitude: 73.8107656,
      // 
      coordinates: [
        [18.50737, 73.80767],
        [18.50775, 73.80787],
        [18.50787, 73.80844],
        [18.50826, 73.80925],
        [18.50838, 73.81012],
        [18.50902, 73.81107],
        [18.50943, 73.81178],
        [18.50954, 73.81263],
      ],

   ///*  
   newarr:[],
//      coordinates:[ 
//        [24.771891, 46.779722],
//      [24.770298, 46.780829],
//      [24.767267, 46.783101],
//      [24.764658, 46.785037],
//      [24.764626, 46.785056],
//      [24.764626, 46.785056],
//      [24.764429, 46.785162],
//      [24.764389, 46.785126],
//      [24.762272, 46.781747],
//      [24.761208, 46.780051],
//      [24.760184, 46.778384],    
//      [24.756952, 46.773162],
//      [24.755906, 46.77143],
//      [24.754869, 46.769754],
//      [24.754283, 46.769098],
//      [24.754178, 46.76913],
//      [24.753171, 46.769786],
//      [24.753088, 46.769741],
//      [24.752075, 46.768083],
//      [24.750992, 46.766323],
//      [24.749939, 46.764602],
//      [24.748898, 46.762912],
//      [24.746805, 46.759517],
//      [24.745794, 46.757837],
//      [24.744741, 46.756163],
//      [24.743715, 46.754509],
//      [24.741587, 46.751046],
//      [24.740488, 46.749222],
//      [24.739446, 46.747472],
//      [24.737827, 46.744954],
//      [24.73772, 46.744941],
//      [24.737618, 46.745027],
//      [24.737589, 46.745082],
//      [24.7376, 46.745232],
//      [24.738664, 46.746954],
//      [24.739533, 46.748454],
//      [24.739491, 46.748592],
//      [24.739296, 46.748749],
//      [24.735994, 46.750701],
//      [24.734318, 46.751574],
//      [24.732608, 46.752445],
//      [24.730843, 46.753338],
 
//      [24.727408, 46.755078],
//      [24.725634, 46.755974],
//      [24.722184, 46.757718],
//      [24.720533, 46.758557],
//      [24.71879, 46.759434],
//      [24.717093, 46.760285],
//      [24.715384, 46.761162],
//      [24.71371, 46.762141],
//      [24.712086, 46.763302],
//      [24.70892, 46.765562],
//      [24.707325, 46.766698],
//      [24.705762, 46.767811],
//      [24.704174, 46.768931],
//      [24.702605, 46.76991],
//      [24.699056, 46.771619],
//      [24.697229, 46.772346],
//      [24.695371, 46.773094],
//      [24.693531, 46.773834],
//      [24.691741, 46.774557],
//      [24.689936, 46.775226],
//      [24.686262, 46.776272],
//      [24.684325, 46.776646],
//      [24.682534, 46.776931],
//      [24.68067, 46.777248],
//      [24.678821, 46.777562],
//      [24.675216, 46.778694],
//      [24.673467, 46.779562],
//      [24.671883, 46.780582],
//      [24.670357, 46.781795],
//      [24.668755, 46.783062],
//      [24.665714, 46.785392],
//      [24.664072, 46.78648],
//      [24.662362, 46.787411],
//      [24.6606, 46.788262],
//      [24.658928, 46.789046],
//      [24.657203, 46.789875],
//      [24.655432, 46.790634],
//      [24.653747, 46.791392],
//      [24.653594, 46.791453],
//      [24.653514, 46.791418],
//      [24.653467, 46.791328],
//      [24.652752, 46.789472],
//      [24.651981, 46.787632],
//      [24.651203, 46.785722],
//      [24.650688, 46.784253],
//      [24.650768, 46.784192],
//      [24.651362, 46.783811],
//      [24.65132, 46.783638],
//      [24.649979, 46.780458],
//      [24.649915, 46.780442],
//      [24.649795, 46.780509],
//      [24.649208, 46.780829],
//      [24.649117, 46.780803],
//      [24.649085, 46.780765],
//      [24.647461, 46.777024],
//      [24.646678, 46.775216],
//      [24.646106, 46.774006],     
//      [24.642701, 46.775725],
//      [24.640992, 46.776557],
//      [24.639336, 46.777373],
//      [24.635904, 46.779072],
//      [24.634282, 46.779942],
//      [24.632662, 46.780838],
//      [24.631006, 46.781786],
//      [24.627483, 46.783245],
//      [24.626557, 46.78344],
//      [24.626509, 46.783408],
//      [24.626488, 46.78337],
//      [24.626123, 46.781293],
//      [24.625594, 46.77937],
//      [24.624086, 46.775654],
//      [24.623011, 46.774003],
//      [24.621797, 46.772499],
//      [24.620475, 46.771043],
//      [24.617502, 46.768605],
//      [24.615765, 46.767632],
//      [24.614091, 46.76656],
//      [24.612358, 46.765232],
//      [24.610827, 46.763888],
//      [24.608168, 46.761069],
//      [24.606987, 46.75952],
// [24.605874, 46.757843],
// [24.604837, 46.75607],
// [24.603811, 46.754182],
// [24.602774, 46.75233],
// [24.601768, 46.750518],
// [24.599696, 46.746845],
// [24.598738, 46.745082],
// [24.597805, 46.743347],
// [24.596802, 46.741555],
// [24.595835, 46.739789],
// [24.594811, 46.737933],
// [24.593781, 46.73608],
// [24.592787, 46.734272],
// [24.59085, 46.730774],
// [24.589942, 46.72905],
// [24.589083, 46.727203],
// [24.588331, 46.725299],
// [24.587587, 46.723373],
// [24.586958, 46.721344],
// [24.585987, 46.717386],
// [24.585659, 46.715334],
// [24.585462, 46.713258],
// [24.58548, 46.711142],
// [24.58588, 46.709078],
// [24.588002, 46.705846],
// [24.58972, 46.705085],
// [24.591546, 46.70457],
// [24.593323, 46.704112],
// [24.595067, 46.703629],
// [24.59868, 46.703434],
// [24.600472, 46.704118],
// [24.601926, 46.705379],
// [24.603453, 46.706445],
// [24.605195, 46.707114],
// [24.606554, 46.707408],
// [24.606901, 46.708077],
// [24.606933, 46.708086],
// [24.608176, 46.707856],
// [24.608176, 46.707856],
// [24.608176, 46.707856],
// [24.608176, 46.707856],
// [24.608176, 46.707856],
// [24.608176, 46.707856],
// [24.606816, 46.707971],
// [24.60653, 46.707408],
// [24.60653, 46.707357],
// [24.606547, 46.707328],
// [24.606605, 46.707312],
// [24.610453, 46.707248],
// [24.614214, 46.707139],
// [24.616154, 46.706954],
// [24.617966, 46.706736],
// [24.619838, 46.706483],
// [24.62168, 46.70623],
// [24.622246, 46.706134],
// [24.622322, 46.706048],
// [24.622349, 46.705952],
// [24.622306, 46.705789],
// [24.622234, 46.705722],
// [24.622082, 46.705693],
// [24.618374, 46.706211],
// [24.616514, 46.706429],
// [24.614667, 46.706506],
// [24.61097, 46.706624],
// [24.609165, 46.706662],
// [24.607328, 46.706694],
// [24.605485, 46.706467],
// [24.603698, 46.705872],
// [24.600504, 46.70375],
// [24.59868, 46.703018],
// [24.596779, 46.702877],
// [24.594982, 46.703235],
// [24.591277, 46.704125],
// [24.589506, 46.704589],
// [24.587757, 46.70536],
// [24.586741, 46.706605],
// [24.585861, 46.708438],
// [24.585102, 46.710384],
// [24.585013, 46.71255],
// [24.585597, 46.716835],
// [24.586046, 46.718944],
// [24.586566, 46.720944],
// [24.587198, 46.722995],
// [24.587925, 46.725018],
// [24.58868, 46.72688],
// [24.589509, 46.728704],
// [24.591382, 46.732214],
// [24.592413, 46.734026],
// [24.593427, 46.735878],
// [24.594379, 46.737648],
// [24.595318, 46.739357],
// [24.596395, 46.741286],
// [24.598381, 46.744909]
  //  ],
  //  */

      // coordinates:this.props.navigation.getParam('destinationCoords'),
      coords: [],
      destinationCoordsNew: [],
      finalCoords: [],
      latitudeArr: [],
      longitudeArr: [],
      newLatitude: 0,
      newLongitude: 0,
      Hours: '',
      minutes: '',
      Km: '',
      meter: '',
      isLoading: true,
      snappedCoords: []
    };
    this.locationWatchId = null;
    // this.state.coordinates=this.props.navigation.getParam('destinationCoords');
  }

  componentWillMount() {
    console.log("lenghttttissssss...",this.state.coordinates.length)
    //  
   //  console.log("Join=", this.state.coordinates);
///////////////////////////////////////////////////////////////////////////////////////

// var i,j,temparray,chunk = 10;
// for (i=0,j=array.length; i<j; i+=chunk) {
//     temparray = array.slice(i,i+chunk);
//     // do whatever
// }


var x=this.state.coordinates.length //240
var count=x/100  //2
console.log("count...",count)
var mode=x%100   //40 
console.log("mod...",mode) 
for(var i=0;i<count;i++){
  var k=(i+1)*100
  console.log("k1...",k) 
  if(k>x){
    k=(i*100)+mode
    console.log("k2...",k) 
  }
  var newarr=[]
  
  for(var j=(i*100);j<k;j++){
    console.log(this.state.coordinates[j])
 // newarr=this.state.coordinates[j]
  newarr.push(this.state.coordinates[j])
    //
   

  }
  this.calculatePath(newarr)
  
  
  
  
}
 
     
  }

 async calculatePath(newarrs){
    console.log("newarrlen...",newarrs.length)
    console.log("newarr...",newarrs)
    newarrs = newarrs.join('|')  
    console.log("newarrlen...",this.state.newarr.length)
    await axios.get(
      `https://roads.googleapis.com/v1/snapToRoads?path=${newarrs}&interpolate=true&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw `
    ).then(resp => {
      var datas = resp.data
    //  
       var datanew = JSON.stringify(datas);
         for (var i = 0; i < JSON.parse(datanew).snappedPoints.length; i++) {
           this.state.finalCoords.push({
          latitude: JSON.parse(datanew).snappedPoints[i].location.latitude,
          longitude: JSON.parse(datanew).snappedPoints[i].location.longitude
        })
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa",JSON.stringify( this.state.finalCoords))
        //  var latlng=data.snappedPoints[i].location
      }
      this.setState({
        userLatitude: this.state.finalCoords[0].latitude,
        userLongitude: this.state.finalCoords[0].longitude
      })
      this.calculateDistance() 
      this.setState({ isLoading: false })
      
    
    
    
    

    })
      .catch(function (error) {
        console.log(error);
      });
  }

  calculateDistance = () => {
    //  alert("in calc....");
    console.log("RAjaniDAta=", JSON.stringify(this.state.finalCoords))

    var dist = 0
    var dest1 = 0;
    for (var i = 0; i < this.state.finalCoords.length; i++) {
      try {
        dist = haversine(this.state.finalCoords[i], this.state.finalCoords[i + 1], { unit: 'meter' })
      } catch (err) {
        // handle error here
      }
      // dist=Math.round(dist,2)
      dist = Number(dist.toFixed(2));
      //console.log("distancr1=", dist)
      dest1 += dist
      //console.log("newDistance=", dest1)


      var Km = Math.floor(dest1 / 1000)
      var meter = dest1 % 1000
      Km = Number(Km.toFixed(0));
      meter = Number(meter.toFixed(0));
      //console.log("TimeDistanceKm=", Km, meter)
      this.setState({ Km: Km });
      this.setState({ meter: meter });

    }

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
      //alert(JSON.stringify(finalCoords))
      //console.log("abc=", JSON.stringify(finalCoords))
      // function drawSnappedPolyline() {
      //   var snappedPolyline = new google.maps.Polyline({
      //     path: snappedCoordinates,
      //     strokeColor: 'black',
      //     strokeWeight: 3
      //   });

      //   snappedPolyline.setMap(map);
      //   polylines.push(snappedPolyline);
      //}

      polyline = (
        <Polyline
          coordinates={finalCoords}
          strokeWidth={3}
          strokeColor="#000"
          geodesic={true}
        />

      );
      polyline1 = (
        <Polyline
          coordinates={this.state.coordinates}
          strokeWidth={2}
          strokeColor="red"
          geodesic={true}
        />

      );
      marker = (
        <Marker coordinate={finalCoords[finalCoords.length - 1]} style={{
          height: 50,
          width: 50,
        }} />
      );
    }
    if (hasMapPermission) {
      // alert(JSON.parse(finalCoords[0]))
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
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
              }}
            >
               {polyline} 
             
              {/* {this.state.finalCoords.map(polyline => (
        <MapView.Polyline
          key={polyline.id}
          coordinates={this.state.finalCoords}
          strokeColor="#000"
          fillColor="rgba(255,0,0,0.5)"
          strokeWidth={1}/>
      ))} */}
              {marker}
              {/* <Polyline
                strokeWidth={3}
                strokeColor="red"
                coordinates={[this.state.finalCoords.map((value, index) => { return { latitude: value.latitude, longitude: value.longitude } })]}
              /> */}
            </MapView>
            <TimeDistancess
              Hours={Hours}
              minutes={minutes}
              Km={Km}
              meter={meter}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }
}


// const mapStateToProps = (state) => {
//   return {
//     createOrder: state.createOrder
//     // isLogged: state.login.isLogged,
//     // hasError : state.login.hasError,
//     // isLoading: state.login.isLoading,
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   orderValue: (val) => {
//     dispatch(TOTAL_ORDER_VALUE(val));

//   },
// })
// export default connect(mapStateToProps, mapDispatchToProps)(RoadMaps)

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  }
});

