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
  Alert,
  BackHandler
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import haversine from "haversine"
import BackgroundTimer from 'react-native-background-timer'
import { TabRouter } from 'react-navigation';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import RNFS from 'react-native-fs'
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';
import SQLite from 'react-native-sqlite-storage';
import { SqliteDB } from './database';

const MinimumDistance = 0.1;

class StartScreen extends React.Component {
  accuracy = 0;
  collecting = false;
  sqliteDb = new SqliteDB();
  constructor(props) {
    super();
    global.isInternet = false;
    SQLite.DEBUG = true;

    this.state = {
      started: false,
      intervalMsec: 10000,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      status: "",
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
  componentDidMount() {
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
    global.isInternet = state.isConnected;
  }

  async requestBatteryPermission() {
    RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then((isEnabled) => {
      if (isEnabled) {
        RNDisableBatteryOptimizationsAndroid.openBatteryModal();
      }
    });
  }

  calcDistance = newLatLng => {
    const { prevLatLng, started } = this.state;
    if (!prevLatLng.hasOwnProperty("latitude")
      || !prevLatLng.hasOwnProperty("longitude")
    ) {
      this.setState({ prevLatLng: newLatLng })
      return 0;
    }

    return haversine(prevLatLng, newLatLng) || 0;
  };

  updateStatus() {
    var st = (this.collecting ? "Started New Route" : "Stopped") + "\n" +
      (global.isInternet ? "Internet: ON" : "Internet: OFF") +
      (this.accuracy == 0 ? "" : ", Accuracy: " + Number(this.accuracy).toFixed(0));
    this.setState({
      status: st
    });
  }

  updateUserPosition() {
    if (!this.collecting)
      return;
    Geolocation.getCurrentPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;
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

        this.accuracy = position.coords.accuracy;
        var d = this.calcDistance(newCoordinate);

        if (d > 0) {
          this.setState({
            routeCoordinates: routeCoordinates.concat([newCoordinate]),
            distanceTravelled: distanceTravelled + d,
            prevLatLng: newCoordinate
          });
        }

        this.updateStatus();
      },
      error => console.log("Error getCurrentPositio", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000, distanceFilter: 10 }
    );
  }

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.updateUserPosition();
        }
        else { this.requestFineLocation() }

      } else {
        this.updateUserPosition();
      }
    } catch (error) {
      console.warn("Warning requestFineLocation", error);
    }
  }

  clear = () => {
    this.setState({
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {}
    });
  }

  start = () => {
    if (this.collecting)
      return;
    this.clear();
    this.collecting = true;
    this.setState({ started: true });
    this.requestFineLocation();
    Vibration.vibrate(500);
    BackgroundTimer.runBackgroundTimer(() => {
      this.requestFineLocation();
    }, this.state.intervalMsec);
  }

  async saveReport() {
    if (this.state.distanceTravelled < MinimumDistance)
      return;
    try {
      await this.sqliteDb.writeCoordinates(this.state.routeCoordinates,
        this.state.distanceTravelled);
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
    Actions.ListRoutes();
  }

  exit_function = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
    
  }
  

  render() {
    return (
      <View style={styles.container1}>
        <View style={styles.container}>
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
            onPress={this.showRoute}  disabled={this.state.started}>
            <Text style={{ fontWeight: 'bold' }} > Show Route </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer1}
            onPress={this.listRoutes}>
            <Text style={{ fontWeight: 'bold' }} > List Routes  </Text>
          </TouchableOpacity>
          </View>


          <View style={styles.container}>
          <TouchableOpacity style={styles.buttonContainer1}
            onPress={this.exit_function}>
            <Text style={{ fontWeight: 'bold' }} > Exit App  </Text>
          </TouchableOpacity>
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
    marginBottom: 10
  },
  buttonContainer12: {
    padding: 15,
    margin: '25%',
    backgroundColor: 'grey', textAlign: 'center',
    justifyContent: 'center',
  },
})

export default StartScreen
