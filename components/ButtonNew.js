import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  Button, 
  TouchableOpacity, AsyncStorage,
  TouchableWithoutFeedback,
   PermissionsAndroid, NativeModules,
  DeviceEventEmitter, NativeAppEventEmitter, Platform, Vibration,
} from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';
import haversine from "haversine"
import RoadMaps from "./RoadMaps";
import Mapss from './mapss'
import abc from "./abc"
import axios from "axios";
import RNFS from 'react-native-fs'
//import PlaceInput from "./components/PlaceInput";
import Global from "./Global"
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
import NetInfo from "@react-native-community/netinfo";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
var isInternet = true
import { size } from "lodash";
let newArray = []
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];


var coordinates = [
  [24.653467, 46.791328],
    [24.652752, 46.789472],
    [24.651981, 46.787632],
    [24.651203, 46.785722],
    [24.650688, 46.784253],
    [24.650768, 46.784192],
    [24.651362, 46.783811],
    [24.65132, 46.783638],
    [24.649979, 46.780458],
    [24.649915, 46.780442],
    [24.649795, 46.780509],
    [24.649208, 46.780829],
    [24.649117, 46.780803],
    [24.649085, 46.780765],
    [24.647461, 46.777024],
    [24.646678, 46.775216],
    [24.646106, 46.774006],
    [24.642701, 46.775725],
    [24.640992, 46.776557],
    [24.639336, 46.777373],
    [24.635904, 46.779072],
    [24.634282, 46.779942],
    [24.632662, 46.780838],
    [24.631006, 46.781786],
    [24.627483, 46.783245],
    [24.626557, 46.78344],
    [24.626509, 46.783408],
    [24.626488, 46.78337],
    [24.626123, 46.781293],
    [24.625594, 46.77937],
    [24.624086, 46.775654],
    [24.623011, 46.774003],
    [24.621797, 46.772499],
    [24.620475, 46.771043],
    [24.617502, 46.768605],
    [24.615765, 46.767632],
    [24.614091, 46.76656],
    [24.612358, 46.765232],
    [24.610827, 46.763888],
    [24.608168, 46.761069],
    [24.606987, 46.75952],
    [24.605874, 46.757843],
    [24.604837, 46.75607],
    [24.603811, 46.754182],
    [24.602774, 46.75233],
    [24.601768, 46.750518],
    [24.599696, 46.746845],
    [24.598738, 46.745082],
    [24.597805, 46.743347],
    [24.596802, 46.741555],
    [24.595835, 46.739789],
    [24.594811, 46.737933],
    [24.593781, 46.73608],
    [24.592787, 46.734272],
    [24.59085, 46.730774],
    [24.589942, 46.72905],
    [24.589083, 46.727203],
    [24.588331, 46.725299],
    [24.587587, 46.723373],
    [24.586958, 46.721344],
    [24.585987, 46.717386],
    [24.585659, 46.715334],
    [24.585462, 46.713258],
    [24.58548, 46.711142],
    [24.58588, 46.709078],
    [24.588002, 46.705846],
    [24.58972, 46.705085],
    [24.591546, 46.70457],
    [24.593323, 46.704112],
    [24.595067, 46.703629],
    [24.59868, 46.703434],
    [24.600472, 46.704118],
    [24.601926, 46.705379],
    [24.603453, 46.706445],
    [24.605195, 46.707114],
    [24.606554, 46.707408],
    [24.606901, 46.708077],
    [24.606933, 46.708086],
    [24.608176, 46.707856],
    [24.608176, 46.707856],
    [24.608176, 46.707856],
    [24.608176, 46.707856],
    [24.608176, 46.707856],
    [24.608176, 46.707856],
    [24.606816, 46.707971],
    [24.60653, 46.707408],
    [24.60653, 46.707357],
    [24.606547, 46.707328],
    [24.606605, 46.707312],
    [24.610453, 46.707248],
    [24.614214, 46.707139],
     
];

let data = [ {
  value: '10',
}, {
  value: '15',
}, {
  value: '20',
}, {
  value: '25',
},
{
  value: '30',
},];

export default class ButtonNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isgeoLoc: false,
      hasMapPermission: true,
      userLatitude: 0,
      userLongitude: 0,
      myKey: '',
      ms: 0,
      sec: 0,
     // destinationCoords: [],

     newArraydestinationCoords: [
        {lat:18.50737,long:73.80767},
        {lat:18.50775,long:73.80787},
        {lat:18.50787,long:73.80844},
        {lat:18.50826,long:73.80925},
        {lat:18.50838,long:73.81012},
        {lat:18.50902,long:73.81107},
        {lat:18.50943,long:73.81178},
        {lat:18.50954,long:73.81263},
        {lat:18.50737,long:73.80767},
        {lat:18.50775,long:73.80787},
        {lat:18.50787,long:73.80844},
        {lat:18.50826,long:73.80925},
        {lat:18.50838,long:73.81012},
        {lat:18.50902,long:73.81107},
        {lat:18.50943,long:73.81178},
        {lat:18.50954,long:73.81263},
      ],    

      latitude: 0,
      longitude: 0,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
    }
    this.locationWatchId = null;
 
  }



  componentWillMount() {
    this.requestBatteryPermission()
    this.requestFineLocation()
  }

  async requestBatteryPermission(){
    RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then((isEnabled)=>{
      if(isEnabled){  
          RNDisableBatteryOptimizationsAndroid.openBatteryModal();
      }
  });
  
} 

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,       

        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getUserPosition();
        }
        else { this.requestFineLocation() }

      } else {
        this.getUserPosition();
      }
    } catch (err) {
      console.warn(err);
    }
  }

   getUserPosition() {
    this.setState({ hasMapPermission: true }); 
    // Geolocation.getCurrentPosition(
    //   pos => {
    //      console.log(pos.coords.latitude)
    //     this.setState({
    //       userLatitude: pos.coords.latitude,
    //       userLongitude: pos.coords.longitude
    //     });
    //     console.log(this.state.userLatitude)
    //     const result = [];
    //     result.push({
    //       latitude: this.state.userLatitude,
    //       longitude: this.state.userLongitude
    //     }
    //     )
    //     console.log(result)
    //     result.forEach(obj => {
    //       if (!newArray.some(o => o[0] === obj.latitude)) {
    //         newArray.push([
    //           obj.latitude,
    //           obj.longitude
    //         ]);
    //       }
    //     });
    //   //  console.log("destarray=", JSON.stringify(newArray))
    //   },
    //   err => console.warn(err),
    //   {        
    //   enableHighAccuracy: false,      
    //      enableHighAccuracy: true, timeout: 10000, maximumAge:0
    //   }
    // );


  // this.locationWatchId =  Geolocation.watchPosition(
    Geolocation.getCurrentPosition(
        position => {
            console.log(position.coords)
          const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
      
          const { latitude, longitude } = position.coords;
        //   console.log("@@@@=", position.coords)
        //   alert("")
          const newCoordinate = {
            latitude,
            longitude
          };
          if (Platform.OS === "android") {
            if (this.marker) {
              this.marker._component.animateMarkerToCoordinate(
                newCoordinate,
                500
              );
             }
           } else {
          coordinate.timing(newCoordinate).start();
           }
           this.setState({
             latitude,
             longitude,
             routeCoordinates: routeCoordinates.concat([newCoordinate]),
             distanceTravelled:
             distanceTravelled + this.calcDistance(newCoordinate),
             prevLatLng: newCoordinate
           });
           console.log("myArrrr1=",JSON.stringify(this.state.routeCoordinates))
         },
         error => console.log(error),
         
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
           //  enableHighAccuracy: true, timeout: 10000, maximumAge: 1000
             
      );

  }



  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };
  componentDidMount() {
  
  }
 

  StartGeoLocation = () => {
   // this.setState({ isgeoLoc: true })
    if (this.state.ms) {
      console.log("vbhjhvjhgjhgjhgj", this.state.ms)
      this.setState({ isgeoLoc: true })
      alert("Started getting location")
      BackgroundTimer.runBackgroundTimer(() => {
        console.log('tac');
        this.requestFineLocation();
        Vibration.vibrate(500);
      
      }, this.state.ms);
    } else {
       alert("Please select Time in Second First!!!")
     }
 
   
  }
  StopGeoLocation = () => {
    this.setState({ isgeoLoc: false })
    alert("stop getting location")
    Vibration.vibrate(0)
    BackgroundTimer.stopBackgroundTimer();
 Geolocation.clearWatch(this.locationWatchId);
    this.locationWatchId = null
    this.setState({ isgeoLoc: false })
    //   BackgroundGeolocation.removeAllListeners();
  }

  getStoredArray() {
    var fileName = `GpsCoordinates${Math.floor(Math.random() * 100)}.txt`;
    var path = RNFS.ExternalDirectoryPath + fileName;
    console.log(path)
    RNFS.writeFile(path, JSON.stringify(coordinates), 'utf8')
      .then((success) => {
        alert(path);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }


  ShowRoute = () => {  
    console.log("myArrrr122222222222=",JSON.stringify(this.state.routeCoordinates))
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      isInternet = state.isConnected
      console.log("Is connected?Out", isInternet);

    });

    if (!isInternet) {
      alert("Please Check Your Internet Connection")
    } else {
    if (this.state.routeCoordinates && this.state.routeCoordinates.length >= 2) {     
    
       this.state.routeCoordinates.forEach(obj => {
          if (!newArray.some(o => o[0] === obj.latitude)) {
            newArray.push([
              obj.latitude,
              obj.longitude
            ]);
          }
        });
       console.log("destarray=", JSON.stringify(newArray))

        this.props.navigation.navigate('Mapss', { destinationCoords: newArray ,distance:this.state.distanceTravelled})     
     }
      else {
         alert("You Dont Have an Route Cordinates")
     }
    }
  }
  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      alert("true")
      this.getActivitiesAndNotifications()
    }
    else {
      alert("False")
    }
  };
  onChangeHandlerEntity(value) {

    var a
    a = value
    a = a * (1000)
    this.setState({ ms: a })
    this.setState({ sec: value })

  }

  render() {
    return (
      <View style={styles.container1}>


         <Dropdown
    
        dropdownOffset={{ top: 18, left: 18, }}
        animationDuration={0}
        itemCount={4}
        label='Select Time in Seconds'
        data={data}
        containerStyle={styles.dropDownContainer}
        pickerStyle={{ width:'87.3%' }}
        rippleCentered={true}
        itemColor='#ADA2A2'
        rippleOpacity={0}
        inputContainerStyle={{ borderBottomColor: 'transparent' }}      
        onChangeText={(value) => { this.onChangeHandlerEntity(value) }}
      /> 
        <View style={styles.container}>
          <TouchableOpacity onPress={this.StartGeoLocation} style={[styles.buttonContainer, this.state.isgeoLoc ? { backgroundColor: "grey" } : { backgroundColor: '#46BE50' }]} disabled={this.state.isgeoLoc}>
            <Text onPress={this.StartGeoLocation} style={[this.state.isgeoLoc ? { backgroundColor: "grey" } : { backgroundColor: '#46BE50' }, { fontWeight: 'bold' }]}> Start  </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer1} onPress={this.StopGeoLocation}>
            <Text style={{ backgroundColor: '#46BE50', fontWeight: 'bold' }} > Stop  </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer1} onPress={this.ShowRoute}>
            <Text style={{ backgroundColor: '#46BE50', fontWeight: 'bold' }}  > ShowRoute </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.buttonContainer12} onPress={this.getStoredArray}>
          <Text style={{ fontWeight: 'bold', color: 'black' }}  > writeGpsCoordsToFile </Text>
        </TouchableOpacity>
      </View>

    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    padding: 15,
    margin: '2%',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonContainer1: {
    padding: 15,
    margin: '2%',
    flex: 1,
    backgroundColor: '#46BE50', textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',


  },
  buttonContainer12: {
    padding: 15,
    margin: '5%',

    backgroundColor: 'grey', textAlign: 'center',
    justifyContent: 'center',


  },
  dropDownContainer: {
    borderWidth: 0.5,
    borderColor: '#E6DFDF',

    width: '88%',
    height: '9%',
    marginTop: '10%',
    marginVertical: '3%',
    marginHorizontal: '1%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: '2%',
    alignSelf: 'center',
    padding: -1,
  },
});
