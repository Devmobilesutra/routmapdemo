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
  ToastAndroid,
  Linking
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
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

import { database1 } from './database1';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
// var db = new database1();
var c = 0;
const MinimumDistance = 0.1;
class StartScreen extends React.Component {
  accuracy = 0;
  subscriptions = [];
  flag=false;
  // numberOfTimeFetch = 0;
  numberOfTimeFetch1 = 0;
  FailureCount = 0;
  collecting = false;
  sqliteDb = new SqliteDB();
  prevLatLong = null;
  // db=new database1();
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
        travalingobject:[],
        numberOfTimeFetch:0,
        
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
    
    // ReactNativeForegroundService.remove_all_tasks();
    
    this.requestBatteryPermission()
    this.requestFineLocation()
    this.unsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange
    );
    // let db = new database1();
  }
  componentWillUnmount() {
  
      // unregister all event listeners
      
      BackgroundGeolocation.removeAllListeners();
    
      // this.subscriptions.forEach((subscription) => subscription.remove());
      ReactNativeForegroundService.stop();
      ReactNativeForegroundService.remove_all_tasks();
    this.unsubscribe();
  }
  handleConnectivityChange = (state) => {
    // global.isInternet = state.isConnected;
    console.log('isInternet Connected',state.isConnected)
   if(!state.isConnected){
    Alert.alert('Please chake your Internet Connection');
   }
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
    //Determines the great-circle distance between two points on a sphere given their longitudes and latitudes
    return haversine(this.prevLatLong, newLatLng) || 0;
  };

  updateStatus() {
    var st = (this.collecting ? "Started New Route" : "Stopped") + "\n" +
      (this.state.check ? "Internet: ON" : "Internet OFF") +
      (this.accuracy == 0 ? "" : ", Accuracy: " + Number(this.accuracy).toFixed(0))+"\nnumber of times fetch location : "+this.state.numberOfTimeFetch;
    this.setState({
      status: st
    });
  }

  updateUserPosition() {
    //do not do anything if start button is not clicked
    if (!this.collecting)
      {
        // console.log('Ajit',this.state.routeCoordinates);
        return;
      }
    try {
      
      if(this.state.routeCoordinates.length==0 || this.flag){
        Geolocation.getCurrentPosition(
          position => {
            const { coordinate, routeCoordinates } = this.state;
            const { latitude, longitude } = position.coords;
            const newCoordinate = {
              latitude,
              longitude
            };
            if(position.coords){
              c=c+1;
              this.state.numberOfTimeFetch+=1;
            }
          
            this.accuracy = position.coords.accuracy;
           let date=new Date();
           let time = date.getHours() +"-" +date.getMinutes() +"-"+ date.getSeconds();
          //  console.log('time',time);
           
            console.log('Ajit',newCoordinate,"accuracy",position.coords.accuracy);
            if(position.coords.accuracy <= 30 || this.state.routeCoordinates.length > 4  ){
              var d = this.calcDistance(newCoordinate);
              this.FailureCount=0;
              this.flag=false;
              BackgroundTimer.stopBackgroundTimer();
            console.log('distance',d)
            if (d > 0.01 || this.state.routeCoordinates.length==0) {
              this.prevLatLong = newCoordinate;
              this.state.travalingobject.push({  
                latitude,
                longitude,
                time
                
              });
              this.setState({
                routeCoordinates: routeCoordinates.concat([newCoordinate]),
                distanceTravelled: this.state.distanceTravelled + d
              },()=>{
                console.log("call back ", this.state.routeCoordinates,'distance',d)
              });
            }
          }
          else{
            this.FailureCount+=1;
            if(this.FailureCount==100){
              this.FailureCount=0;
              Alert.alert('something went wrong','Accuracy continuously high');
              // BackgroundTimer.stopBackgroundTimer();
            }
            else{
            // BackgroundTimer.setTimeout(()=>{
            //   this.requestFineLocation();
            // },1000);
            this.requestFineLocation();
          }
            
            // setTimeout(() => {
            //   this.requestFineLocation();
            // }, 1000);
            // this.requestFineLocation();
          }
          
            
            
            this.updateStatus();
          },
          error => console.log("Error getCurrentPositio (updateUserPosition)", error),
          {  accuracy: {
              android: 'high',
              ios: 'best',
            },
            enableHighAccuracy: true,
            forceRequestLocation:true,
            
            maximumAge: 1000,
            distanceFilter: 1,
            // timeout:10000 
          }
        
        
        );
      }
      else{
      Geolocation.getCurrentPosition(
        position => {
          const { coordinate, routeCoordinates } = this.state;
          const { latitude, longitude } = position.coords;
          const newCoordinate = {
            latitude,
            longitude
          };
          if(position.coords){
            c=c+1;
            this.state.numberOfTimeFetch+=1;
          }
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
         let date=new Date();
         let time = date.getHours() +"-" +date.getMinutes() +"-"+ date.getSeconds();
        //  console.log('time',time,position.coords.accuracy);
         
         
         
          // ToastAndroid.show(newCoordinate, ToastAndroid.LONG);
          // var d = this.calcDistance(newCoordinate);
          console.log('Ajit',newCoordinate,"accuracy",position.coords.accuracy);
          if(position.coords.accuracy <= 30){
            var d = this.calcDistance(newCoordinate);
            this.FailureCount=0;
            this.flag=false;
          console.log('distance',d)
          if (d > 0.01 || this.state.routeCoordinates.length==0) {
            this.prevLatLong = newCoordinate;
            this.state.travalingobject.push({  
              latitude,
              longitude,
              time
              
            });
            this.setState({
              routeCoordinates: routeCoordinates.concat([newCoordinate]),
              distanceTravelled: this.state.distanceTravelled + d
            },()=>{
              console.log("call back ", this.state.routeCoordinates,'distance',d)
            });
          }
        }
        else{
          this.FailureCount+=1;
          if(this.FailureCount==10){
            this.flag=true;
            this.FailureCount=0;
            Alert.alert('something went wrong','Accuracy continuously high')
            // Vibration.vibrate(500)
            // ToastAndroid.show('Your Accuracy is consistently high',ToastAndroid.LONG)
          }
        }
        
          
          
          this.updateStatus();
        },
        error => console.log("Error getCurrentPositio (updateUserPosition)", error),
        { enableHighAccuracy: true, maximumAge: 100, distanceFilter: 1,forceRequestLocation:true }
      
        //timeout:- number of milliseconds before the request timeout.
        //enableHighAccuracy :- boolean value T/F, requires a position with highest level of Accuracy.
        //maximumAge :- to set maximum age of position  cached by the browser.Don't set older then set amount of milliseconds.
        //Default: 10. The minimum distance (measured in meters) a device must move horizontally before an update event is generated.
      );
      }
    }catch (error) {
      console.log('updateUserPosition' + error);
    }
    
    // console.log('updateUserPosition');
  }
  demo(){
    
      this.exit_function();
      Linking.openSettings();
      
    
  }
  createTwoButtonAlert = () =>
    Alert.alert(
      "Please allow background location",
      "This app wants to access your background location go to setting Permissions->Location->Allow all the time and restart your app",
      [
        
        { text: "OK", onPress: () => this.demo() }
      ]
    );
  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(async s => {
          if (s) {
           
            // console.log("permission granted--", s);
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION).then(
              async s => {
                if (s){
                  
                  this.updateUserPosition();
                }
                else{
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                  )
                  // console.log(granted);
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.updateUserPosition();
                  }
                  else if(granted === 'never_ask_again'){
                    // this.updateUserPosition();
                    this.createTwoButtonAlert();

                  }
                  else {
                    // this.requestFineLocation();
                    this.exit_function();
      
                  }
                }
              }
            )
            // Linking.openSettings(`Location permission`);
            // Linking.openURL('app-settings:')
            //  this.updateUserPosition()
          }
          else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION).then(
              async s => {
                if (s){
                  
                  this.updateUserPosition();
                }
                else{
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                  )
                  console.log(granted);
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.updateUserPosition();
                  }
                  else if(granted === 'never_ask_again'){
                    // this.updateUserPosition();
                    this.createTwoButtonAlert();
                  }
                  else {
                    // this.requestFineLocation();
                    this.exit_function();
      
                  }
                }
              }
            )
            // Linking.openSettings();
            // console.log("granted", granted);
           
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
      distanceTravelled: 0,
      numberOfTimeFetch: 0,
      travalingobject: [],
    });
    this.prevLatLong = null;
    this.accuracy = 0;
    // this.numberOfTimeFetch = 0;
    // this.numberOfTimeFetch1 = 0;
    this.FailureCount = 0;
   
   
  }

  start = () => {
    //in case start button is clicked twice then do nothing(return)

    if (this.collecting)
      return;
      // this.numberOfTimeFetch = 0;
      // this.numberOfTimeFetch1 = 0;
    this.clear();
    ReactNativeForegroundService.start({
      id: 144,
      title: "Accessing Background location",
      message: "Location Service activated!",
    });

    this.collecting = true;
    this.setState({ started: true });
    // this.requestFineLocation();
    Vibration.vibrate(500);
    ReactNativeForegroundService.add_task(
      () => {
        // console.log('I am Being Tested')
      // this.numberOfTimeFetch1+=1;
      // console.log('Ajit',this.numberOfTimeFetch1,this.numberOfTimeFetch);
        this.requestFineLocation();
    },
      {
        delay: 10000,
        onLoop: true,
        taskId: 'taskid',
        onError: (e) => console.log(`Error logging:`, e),
      },
    )
    // BackgroundTimer.runBackgroundTimer(() => { 
    //   //Emit event periodically (even when app is in the background).
    //   console.log('ajit....');
    //   this.requestFineLocation();
    // }, this.state.intervalMsec);

    // //Every location recorded by the SDK is provided to your callback,
    // // including those from [[onMotionChange]], [[getCurrentPosition]] and [[watchPosition]].
    // this.subscriptions.push(BackgroundGeolocation.onLocation(this.onLocation, this.onError));

    // //Android [[MotionActivityEvent.confidence]] always reports 100%.
    // this.subscriptions.push(BackgroundGeolocation.onActivityChange(this.onActivityChange));
    // BackgroundGeolocation.ready({
    //   // desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    //   // distanceFilter: 10,
    //   // logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    //   // stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
    //   // startOnBoot: false,        // <-- Auto start tracking when device is powered-up.
    //   // notificationTitle: "Accessing Background location."

    //    // Geolocation Config
    //    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    //    distanceFilter: 10,
    //    // Activity Recognition
    //    stopTimeout: 5,
    //    // Application config
    //    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    //    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    //    stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
    //    startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
    //    // HTTP / SQLite config
    //    url: 'http://yourserver.com/locations',
    //    batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
    //    autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
    //    headers: {              // <-- Optional HTTP headers
    //      "X-FOO": "bar"
    //    },
    //    params: {               // <-- Optional HTTP params
    //      "auth_token": "maybe_your_server_authenticates_via_token_YES?"
    //    }
    // }, (state) => {
    //   console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);


    //   if (!state.enabled) {
    //     BackgroundGeolocation.start(function () {
    //       console.log("start success--");
    //     });
    //   }
    // });
    // this.onClickStartTracking();
  }

  onClickStartTracking() {
    // Initiate tracking while app is in foreground.
    // When provided a value of true,
    // the plugin will engage location-services and begin aggressively tracking the device's location immediately,
    // bypassing stationary monitoring.
    BackgroundGeolocation.changePace(true);  // <-- Location-services ON ("moving" state)
  }

  onLocation = (location) => {
    console.log("[latitude]", location.coords.latitude);
    console.log("[longitude]", location.coords.longitude);
    this.updateUserPosition();
    // const { latitude, longitude } = location.coords;
    // const newCoordinate = {
    //   latitude,
    //   longitude
    // };
    // console.log(newCoordinate.latitude);
    // console.log(newCoordinate.longitude);

    // this.state.routeCoordinates.concat(newCoordinate);
  }

  onError(error) {
    console.warn('[location] ERROR -', error);
  }
  onActivityChange=(event)=> {

    console.log('[activitychange] -', event)
     // eg: 'on_foot', 'still', 'in_vehicle'
    Alert.alert('activitychange',event)
  }

  saveReport=()=> {
    if (this.state.distanceTravelled < MinimumDistance){
      Alert.alert("coordinate not store" ,"for storeing coordinate travel more");
      return false;
    }
      
      
    // try {
    //   // await this.sqliteDb.writeCoordinates(this.state.routeCoordinates,
    //   await this.sqliteDb.newWriteCoordinates(this.state.routeCoordinates,
    //     this.state.distanceTravelled)
    //     .then(d => { Alert.alert("Saved"+d) })
    //     .catch(e => { Alert.alert("Not saved",e) });
    // }
    // catch (error) {
    //   console.log("Got error", error);
    // }
    try {
      let db = new database1();
      db.saveDatabaseReport({travalingobject:this.state.travalingobject , distance :this.state.distanceTravelled});
    } catch (error) {
      console.log('save report Start Screen',error);
      Alert.alert("Error" ,"somthing error to Save coordinates in sqlite ");
      return false;
    }
  }
  
  stop = () => {
    if (!this.collecting)
      return;
    this.updateUserPosition();
    ReactNativeForegroundService.stop();
    ReactNativeForegroundService.remove_all_tasks();
    // console.log('this.subscriptions',this.subscriptions);
    BackgroundGeolocation.removeAllListeners();
    // this.subscriptions.forEach((subscription) => subscription.remove());
    this.collecting = false;
    
    this.setState({ started: false ,collecting:false});
    this.updateStatus();
    BackgroundTimer.stopBackgroundTimer();
   const flag = this.saveReport();

    this.prevLatLong = null;
    var todayDate = moment(new Date()).format('DD MMM YYYY')
    console.log("todayDate is ---", todayDate, ' time ', moment(new Date()).format('hh:mm:ss a'));

    console.log(this.state.routeCoordinates);
    coords = JSON.stringify(this.state.travalingobject);
    // Alert.alert(coords);
   if(flag==false){

   }else{
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
   }
      ToastAndroid.show(this.state.routeCoordinates.length+' Coordinates store in db',ToastAndroid.LONG)
      // this.resetCount();
    // BackgroundGeolocation.removeAllListeners();
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

    if (this.state.distanceTravelled < MinimumDistance )
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
  // try_it = async () => {
  //   // if (this.state.distanceTravelled < MinimumDistance)
  //   //   return;
  //   try {
  //     await this.sqliteDb.writeCoordinates(this.state.routeCoordinates,
  //       2.27740086944202)
  //       .then(d => { Alert.alert("Saved") })
  //       .catch(e => { Alert.alert("Not saved") });
  //   }
  //   catch (error) {
  //     console.log("Got error", error);
  //   }
  // }

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
        {this.collecting?
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MapView
            showsUserLocation
            followsUserLocation
          >

          </MapView>
        </View>
        :
        null
        }
      
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
