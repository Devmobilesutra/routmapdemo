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


const EventEmitter = Platform.select({
  ios: () => NativeAppEventEmitter,

  android: () => DeviceEventEmitter,
})();
var coordinates = [
  [24.771891, 46.779722],
  [24.770298, 46.780829],
  [24.767267, 46.783101],
  [24.764658, 46.785037],
  [24.764626, 46.785056],
  [24.764626, 46.785056],
  [24.764429, 46.785162],
  [24.764389, 46.785126],
  [24.762272, 46.781747],
  [24.761208, 46.780051],
  [24.760184, 46.778384],
  [24.756952, 46.773162],
  [24.755906, 46.77143],
  [24.754869, 46.769754],
  [24.754283, 46.769098],
  [24.754178, 46.76913],
  [24.753171, 46.769786],
  [24.753088, 46.769741],
  [24.752075, 46.768083],
  [24.750992, 46.766323],
  [24.749939, 46.764602],
  [24.748898, 46.762912],
  [24.746805, 46.759517],
  [24.745794, 46.757837],
  [24.744741, 46.756163],
  [24.743715, 46.754509],
  [24.741587, 46.751046],
  [24.740488, 46.749222],
  [24.739446, 46.747472],
  [24.737827, 46.744954],
  [24.73772, 46.744941],
  [24.737618, 46.745027],
  [24.737589, 46.745082],
  [24.7376, 46.745232],
  [24.738664, 46.746954],
  [24.739533, 46.748454],
  [24.739491, 46.748592],
  [24.739296, 46.748749],
  [24.735994, 46.750701],
  [24.734318, 46.751574],
  [24.732608, 46.752445],
  [24.730843, 46.753338],

  [24.727408, 46.755078],
  [24.725634, 46.755974],
  [24.722184, 46.757718],
  [24.720533, 46.758557],
  [24.71879, 46.759434],
  [24.717093, 46.760285],
  [24.715384, 46.761162],
  [24.71371, 46.762141],
  [24.712086, 46.763302],
  [24.70892, 46.765562],
  [24.707325, 46.766698],
  [24.705762, 46.767811],
  [24.704174, 46.768931],
  [24.702605, 46.76991],
  [24.699056, 46.771619],
  [24.697229, 46.772346],
  [24.695371, 46.773094],
  [24.693531, 46.773834],
  [24.691741, 46.774557],
  [24.689936, 46.775226],
  [24.686262, 46.776272],
  [24.684325, 46.776646],
  [24.682534, 46.776931],
  [24.68067, 46.777248],
  [24.678821, 46.777562],
  [24.675216, 46.778694],
  [24.673467, 46.779562],
  [24.671883, 46.780582],
  [24.670357, 46.781795],
  [24.668755, 46.783062],
  [24.665714, 46.785392],
  [24.664072, 46.78648],
  [24.662362, 46.787411],
  [24.6606, 46.788262],
  [24.658928, 46.789046],
  [24.657203, 46.789875],
  [24.655432, 46.790634],
  [24.653747, 46.791392],
  [24.653594, 46.791453],
  [24.653514, 46.791418],
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
  [24.616154, 46.706954],
  [24.617966, 46.706736],
  [24.619838, 46.706483],
  [24.62168, 46.70623],
  [24.622246, 46.706134],
  [24.622322, 46.706048],
  [24.622349, 46.705952],
  [24.622306, 46.705789],
  [24.622234, 46.705722],
  [24.622082, 46.705693],
  [24.618374, 46.706211],
  [24.616514, 46.706429],
  [24.614667, 46.706506],
  [24.61097, 46.706624],
  [24.609165, 46.706662],
  [24.607328, 46.706694],
  [24.605485, 46.706467],
  [24.603698, 46.705872],
  [24.600504, 46.70375],
  [24.59868, 46.703018],
  [24.596779, 46.702877],
  [24.594982, 46.703235],
  [24.591277, 46.704125],
  [24.589506, 46.704589],
  [24.587757, 46.70536],
  [24.586741, 46.706605],
  [24.585861, 46.708438],
  [24.585102, 46.710384],
  [24.585013, 46.71255],
  [24.585597, 46.716835],
  [24.586046, 46.718944],
  [24.586566, 46.720944],
  [24.587198, 46.722995],
  [24.587925, 46.725018],
  [24.58868, 46.72688],
  [24.589509, 46.728704],
  [24.591382, 46.732214],
  [24.592413, 46.734026],
  [24.593427, 46.735878],
  [24.594379, 46.737648],
  [24.595318, 46.739357],
  [24.596395, 46.741286],
  [24.598381, 46.744909]
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

export default class Buttons extends Component {
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


    };
    this.locationWatchId = null;
    this.map = React.createRef();
  }



  componentWillMount() {
    this.requestFineLocation()
    this.requestBatteryPermission()
  }
  async requestBatteryPermission(){
    RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then((isEnabled)=>{
      if(isEnabled){
       // RNDisableBatteryOptimizationsAndroid.enableBackgroundServicesDialogue();

          RNDisableBatteryOptimizationsAndroid.openBatteryModal();
      }
  });
  // await PermissionsAndroid.request(
  //   PermissionsAndroid.PERMISSIONS.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,

  // );
 
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


  async getUserPosition() {
    this.setState({ hasMapPermission: true });
  // alert(this.state.ms)
    // this.locationWatchId = Geolocation.watchPosition(
    Geolocation.getCurrentPosition(
      pos => {
         console.log(pos.coords.latitude)
        this.setState({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude
        });
        console.log(this.state.userLatitude)
        const result = [];
        result.push({
          latitude: this.state.userLatitude,
          longitude: this.state.userLongitude
        }
        )
        console.log(result)
        result.forEach(obj => {
          if (!newArray.some(o => o[0] === obj.latitude)) {
            newArray.push([
              obj.latitude,
              obj.longitude
            ]);
          }
        });
        console.log("destarray=", JSON.stringify(newArray))
      },
      err => console.warn(err),
      {
        //maximumage: 15000,timeout:15000,distanceFilter:15,15000   timeout: 15000, maximumAge: 10000
      enableHighAccuracy: false,
       //  maximumAge:0,
      //   timeout:0,
         // distanceFilter: this.state.sec,     
         enableHighAccuracy: true, timeout: 10000, maximumAge:0
      }
    );

  }

  StartGeoLocation = () => {
   // this.setState({ isgeoLoc: true })
    if (this.state.ms) {
      console.log("vbhjhvjhgjhgjhgj", this.state.ms)
      this.setState({ isgeoLoc: true })
      alert("Started getting location")
      BackgroundTimer.runBackgroundTimer(() => {
        console.log('tac');
        Vibration.vibrate(500);
        this.requestFineLocation();
      }, this.state.ms);
    } else {
      alert("Please select Time in Second First!!!")
    }
    /////////////////////////////////////////////////////////
    //       BackgroundGeolocation.configure({
    //         desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    //         stationaryRadius: 50,
    //         distanceFilter: 50,
    //         notificationTitle: 'Background tracking',
    //         notificationText: 'enabled',
    //         //debug: true,
    //         startOnBoot: false,
    //         stopOnTerminate: true,
    //         locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, // DISTANCE_FILTER_PROVIDER for
    //         interval: 10000,
    //         fastestInterval: 5000,
    //         activitiesInterval: 10000,
    //         stopOnStillActivity: false,
    //         url: 'http://192.168.81.15:3000/location',
    //         httpHeaders: {
    //           'X-FOO': 'bar',
    //         },
    //         // customize post properties
    //         postTemplate: {
    //           lat: '@latitude',
    //           lon: '@longitude',
    //           foo: 'bar', // you can also add your own properties
    //         },
    //      });   

    //       BackgroundGeolocation.on('location', (location) => {
    //            // handle stationary locations here
    // // {"accuracy": 20, "altitude": 517.5, "bearing": 180.9255828857422, "id": 87, "isFromMockProvider": false, "latitude": 18.4941995,
    // // "locationProvider": 1, "longitude": 73.8100013, "mockLocationsEnabled": false, "provider": "fused", "speed": 0.3230378329753876,
    // // "time": 1595832221178}
    //           console.log("locationssssssssssssss1",location.latitude)
    //           console.log("locationssssssssssssss2",location.longitude)

    //           this.setState({
    //               userLatitude: location.latitude,
    //               userLongitude:location.longitude
    //             });
    //            // console.log(this.state.userLatitude)
    //             const result = [];
    //             if(location.latitude!=0){
    //               result.push({
    //                 latitude: location.latitude,
    //                  longitude: location.longitude}
    //               )
    //             }

    //          result.forEach(obj => {
    //            if (!newArray.some(o => o[0] === obj.latitude )) {
    //             newArray.push([
    //                obj.latitude,
    //                obj.longitude
    //              ]);
    //            }     
    //          });
    //                 console.log("destarray=",JSON.stringify(newArray))


   
  }
  StopGeoLocation = () => {
    this.setState({ isgeoLoc: false })
    alert("stop getting location")
    Vibration.vibrate(0)
    BackgroundTimer.stopBackgroundTimer();
    // Geolocation.clearWatch(this.locationWatchId);
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
  
    // NativeModules.PowerManager.isIgnoringBatteryOptimizations(function (isIgnoringBatteryOptimizations) {
    //   PermissionsAndroid.check('android.permission.ACCESS_COARSE_LOCATION').then((granted) => {
    //     // PushNotification.cancelAllLocalNotifications()
    //     // TASK 1: Check Location Permission if granted
    //     if (!granted) {
        
    //       PushNotification.localNotification(appNotifications.grant_location_permissions)
    //     }
  
    //     // TASK 2: Check Battery Optimazation Permission
    //     if (!isIgnoringBatteryOptimizations) {
    //       PushNotification.localNotification(appNotifications.ignore_battery_optimization)
    //       IntentLauncher.startActivity({
    //         action: 'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
    //         data: 'package:com.xxxxxx.driverapp'
    //       })
    //     }
        
    //   })
    // })

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      isInternet = state.isConnected
      console.log("Is connected?Out", isInternet);

    });

    if (!isInternet) {
      alert("Please Check Your Internet Connection")
    } else {
      if (newArray && newArray.length >= 2) {
       console.log("aaaaaaaaaaaaaaaaaa",newArray)
        this.props.navigation.navigate('Mapss', { destinationCoords: newArray })
       // this.props.navigation.navigate('Mapss', { destinationCoords: this.state.destinationCoords }) 
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
        //  dropdownPosition={-5.4}
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
