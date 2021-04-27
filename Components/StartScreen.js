/*

Start will clear and restart always
Stop will always save if > 0.1 km 
ShowRoute can be done only if stopped 

There is no need of clear



*/


import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  PermissionsAndroid,
  Vibration,
  BackHandler,
  Alert,
  ToastAndroid
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import NetInfo from "@react-native-community/netinfo";
import Geolocation from 'react-native-geolocation-service';
import haversine from "haversine"
import BackgroundTimer from 'react-native-background-timer'
import { TabRouter } from 'react-navigation';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import RNFS from 'react-native-fs'
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';
import SQLite from 'react-native-sqlite-storage';
import { SqliteDB } from './database';
import BackgroundGeolocation from "react-native-background-geolocation";
import { version } from 'react';
import moment from 'moment';

const MinimumDistance = 0.1;
class StartScreen extends React.Component {
  accuracy = 0;
  collecting = false;
  sqliteDb = new SqliteDB();
  prevLatLong = null;

  constructor(props) {
    super();
    global.isInternet = false;
    SQLite.DEBUG = true;
    coords = [],
      this.state = {
        started: false,
        intervalMsec: 10000,
        routeCoordinates: [],
        distanceTravelled: 0,
        status: "",
        check: false,
        /* For IOS showing current position, does not work
        coordinate: new AnimatedRegion({
             latitude: 0.0,
             longitude: 0.0
        })*/
      }

    // a base class feature
    this.unsubscribe = null;
  }

  // this set maintains global.isInternet flag
  componentDidMount = async () => {
    this.requestBatteryPermission()
    this.requestFineLocation()
    this.unsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleConnectivityChange = (state) => {
    // global.isInternet = state.isConnected;
    console.log(state.isConnected)
    this.setState({
      check: state.isConnected
    })
  }

  async requestBatteryPermission() {
    RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then((isEnabled) => {
      if (isEnabled) {
        RNDisableBatteryOptimizationsAndroid.openBatteryModal();
      }
    });
  }

  calcDistance = newLatLng => {
    if (!this.collecting)
      return 0;
    if (this.prevLatLong == null) {
      this.prevLatLong = newLatLng;
      return 0;
    }

    return haversine(this.prevLatLong, newLatLng) || 0;
  };

  updateStatus() {
    var st = (this.collecting ? "Started New Route" : "Stopped") + "\n" +
      (this.state.check ? "Internet: ON" : "Internet OFF") +
      (this.accuracy == 0 ? "" : ", Accuracy: " + Number(this.accuracy).toFixed(0));
    this.setState({
      status: st
    });
  }

  updateUserPosition() {
    //do not do anything if start button is not clicked
    if (!this.collecting)
      return;
    Geolocation.getCurrentPosition(
      position => {
        const { coordinate, routeCoordinates } = this.state;
        const { latitude, longitude } = position.coords;
        const newCoordinate = {
          latitude,
          longitude
        };

        //In case, live location is to be shown on the map then below code is required.
        // if (Platform.OS === "android") {
        //   if (this.marker) {
        //     this.marker._component.animateMarkerToCoordinate(
        //       newCoordinate,
        //       500 // 500 is the duration to animate the marker
        //     );
        //   }
        // } else {
        //   //coordinate.timing(newCoordinate).start();
        // }

        this.accuracy = position.coords.accuracy;

        var d = this.calcDistance(newCoordinate);

        if (d > 0.01) {
          this.setState({
            routeCoordinates: routeCoordinates.concat([newCoordinate]),
            distanceTravelled: this.state.distanceTravelled + d
          });
        }
        this.prevLatLong = newCoordinate;

        this.updateStatus();
      },
      error => console.log("Error getCurrentPositio", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000, distanceFilter: 10 }
      //timeout:- number of milliseconds before the request timeout.
      //enableHighAccuracy :- boolean value T/F, requires a position with highest level of Accuracy.
      //maximumAge :- to set maximum age of position  cached by the browser.Don't set older then set amount of milliseconds.
      //Default: 10. The minimum distance (measured in meters) a device must move horizontally before an update event is generated.
    );

  }

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(async s => {
          if (s) {
            console.log("permission granted--", s);
            this.updateUserPosition();
          }
          else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

            console.log("granted", granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.updateUserPosition();
            }
            else {
              // this.requestFineLocation();
              this.exit_function();

            }
          }
        });

      }
    }
    catch (error) {
      console.warn("Warning requestFineLocation", error);
    }
  }

  clear = () => {
    this.setState({
      routeCoordinates: [],
      distanceTravelled: 0
    });
    this.prevLatLong = null;
  }

  start = () => {
    //in case start button is clicked twice then do nothing(return)
    if (this.collecting)
      return;
    this.clear();
    this.collecting = true;
    this.setState({ started: true });
    this.requestFineLocation();
    Vibration.vibrate(500);
    BackgroundTimer.runBackgroundTimer(() => {  //Emit event periodically (even when app is in the background).
      this.requestFineLocation();
    }, this.state.intervalMsec);

    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    BackgroundGeolocation.onActivityChange(this.onActivityChange);
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: false,        // <-- Auto start tracking when device is powered-up.
      notificationTitle: "Accessing Background location."

    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);


      if (!state.enabled) {
        BackgroundGeolocation.start(function () {
          console.log("start success--");
        });
      }
    });
    this.onClickStartTracking();
  }

  onClickStartTracking() {
    // Initiate tracking while app is in foreground.
    BackgroundGeolocation.changePace(true);
  }

  onLocation = (location) => {
    console.log("[location]", location.coords.latitude);
    console.log("[location]", location.coords.longitude);

    const { latitude, longitude } = location.coords;
    const newCoordinate = {
      latitude,
      longitude
    };
    console.log(newCoordinate.latitude);
    console.log(newCoordinate.longitude);

    this.state.routeCoordinates.concat(newCoordinate);
  }

  onError(error) {
    console.warn('[location] ERROR -', error);
  }
  onActivityChange(event) {

    console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'

  }

  async saveReport() {
    if (this.state.distanceTravelled < MinimumDistance)
      return;
    try {
      // await this.sqliteDb.writeCoordinates(this.state.routeCoordinates,
      await this.sqliteDb.newWriteCoordinates(this.state.routeCoordinates,
        this.state.distanceTravelled)
        .then(d => { Alert.alert("Saved"+d) })
        .catch(e => { Alert.alert("Not saved",e) });
    }
    catch (error) {
      console.log("Got error", error);
    }
  }

  stop = () => {
    if (!this.collecting)
      return;
    this.updateUserPosition();
    this.collecting = false;
    this.setState({ started: false });
    this.updateStatus();
    BackgroundTimer.stopBackgroundTimer();
    this.saveReport();
    this.prevLatLong = null;
    var todayDate = moment(new Date()).format('DD MMM YYYY')
    console.log("todayDate is ---", todayDate, ' time ', moment(new Date()).format('hh:mm:ss a'));

    console.log(this.state.routeCoordinates);
    coords = JSON.stringify(this.state.routeCoordinates);
    Alert.alert(coords);
    var fileName = `GoogleCoordinates${Math.floor(Math.random() * 100)}.txt`;
    var path = RNFS.ExternalDirectoryPath + fileName;
    var currentdate = new Date();
    var str = currentdate.toDateString();
    str = str + "------" + JSON.stringify(coords);
    RNFS.writeFile(path, str, 'utf8')
      .then((success) => {
        alert("Successfully saved to " + path);
      })
      .catch((err) => {
        console.log("Error saving file", err.message);
      });
    BackgroundGeolocation.removeAllListeners();
    // if (this.state.routeCoordinates !== []) { 
    //   Alert.alert(this.state.routeCoordinates.toString());  
    //   this.state.routeCoordinates.forEach(element => {
    //     console.log(element)
    //     Alert.alert(element.latitude.toString() + element.longitude.toString()+"\n");      
    //   });  
    // } else {
    //   Alert.alert('empty');
    // }
  }

  showRoute = () => {

    if (this.state.distanceTravelled < MinimumDistance)
      return;
    Actions.RouteScreen({
      routeCoordinates: this.state.routeCoordinates,
      distance: this.state.distanceTravelled
    });
  }



  listRoutes = () => {
    // this.state.check ?  Actions.ListRoutes() : Alert.alert("Please Check Your Internet Connection")
    Actions.ListRoutes()
  }

  exit_function = () => {
    BackHandler.exitApp();


  }
  try_it = async () => {
    // if (this.state.distanceTravelled < MinimumDistance)
    //   return;
    try {
      await this.sqliteDb.writeCoordinates(this.state.routeCoordinates,
        2.27740086944202)
        .then(d => { Alert.alert("Saved") })
        .catch(e => { Alert.alert("Not saved") });
    }
    catch (error) {
      console.log("Got error", error);
    }
  }

  render() {
    return (
      <View style={styles.container1}>
        <View style={styles.container}>
          <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'red' }}>RouteMap</Text>
          <TouchableOpacity style={styles.buttonContainer1}
            onPress={this.start} style={[styles.buttonContainer, this.state.started ? { backgroundColor: "lightgrey" } : { backgroundColor: 'skyblue' }]} disabled={this.state.started}>
            <Text style={{ fontWeight: 'bold' }} > Start  </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer1}
            onPress={this.stop} style={[styles.buttonContainer, this.state.started ? { backgroundColor: "skyblue" } : { backgroundColor: 'lightgrey' }]} disabled={this.state.stop}>
            <Text style={{ fontWeight: 'bold' }} > Stop </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonContainer1}
            onPress={this.showRoute}  >
            <Text style={{ fontWeight: 'bold' }} > Show Route </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer1}
            // global.isInternet ? "Internet: ON" : Alert.alert("Internet: OFF")
            onPress={this.listRoutes}
          >
            <Text style={{ fontWeight: 'bold' }} > List Routes  </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonContainer1} justifyContent='center' alignItems='center' alignSelf='center' onPress={this.exit_function} >
            <Text style={{ fontWeight: 'bold' }} > Exit App   </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.container}>
          <TouchableOpacity 
          style={styles.buttonContainer1} justifyContent='center' alignItems='center' alignSelf='center' 
          onPress={this.try_it} >
            <Text style={{ fontWeight: 'bold' }} > Try It   </Text>
          </TouchableOpacity>
        </View> */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'red' }}>Routemap</Text>
        </View>



        <View style={styles.container1}>
          <Text style={{ fontSize: 18, marginTop: 10, textAlign: "center" }}>
            {this.state.status}</Text>
          <Text style={{ fontSize: 18, marginTop: 10, textAlign: "center" }}>
            Distance Travelled (Km): {Number(this.state.distanceTravelled).toFixed(1)}
          </Text>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
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
    backgroundColor: '#DDDDDD',
    marginBottom: 10
  },
  buttonContainer1: {
    padding: 15,
    margin: '2%',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
    // marginBottom: 10
  },
  buttonContainer12: {
    padding: 15,
    margin: '25%',
    backgroundColor: 'grey', textAlign: 'center',
    justifyContent: 'center',
  },
})

export default StartScreen
