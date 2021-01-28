import React from 'react'
import {
   TouchableOpacity, StyleSheet, Text, View, TouchableWithoutFeedback,
   ActivityIndicator,
   Alert
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import axios from "axios";
import MapView, { Polyline, Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import RNFS from 'react-native-fs'
import { interpolate } from 'react-native-reanimated';

var interval = 0;
const GOOGLE_MAPS_APIKEY = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw';

class RouteScreen extends React.Component {
   routeCoordinates = [];
   constructor(props) {
      super();
      global.isInternet = false;

      this.state = {
         tryRender: ".",
         roadCoordinates: [],
         isLoading: true,
         markers: []
      }

      //store route coordinates coming in from StartScreen
      this.routeCoordinates = props.routeCoordinates;
   }

   tryRendering() {
      if (this.state.tryRender == ".")
         this.setState({ tryRender: ".." });
      else
         this.setState({ tryRender: "." });
      if (!this.state.isLoading)
         clearInterval(interval);
   }

   componentDidMount() {
      interval = setInterval(this.tryRendering.bind(this), 1000);
      this.convertToRoadCoordinates();
   }

   // Convert route coordinates to snapped coordinates for road drawing
   convertToRoadCoordinates() {
      var chunkSize = 100;
      var groups = this.routeCoordinates.map((e, i) => {
         return i % chunkSize === 0 ? this.routeCoordinates.slice(i, i + chunkSize) : null;
      }).filter(e => { return e });
      for (var i = 0; i < groups.length; i++) {
         var chunkedCoordinates = [];

         var path = '';
         for (var j = 0; j < groups[i].length; j++) {
            path = path + groups[i][j].latitude + "," + groups[i][j].longitude + "|";
         }
         // Remove ending |
         path = path.slice(0, -1);
         this.snapToRoadCoordinates(path, i == groups.length - 1);
      }

      
      // var chunkSize = 100;
      // var path1 = [];
      // var cnt = 0;
      // var length;
      // if (this.routeCoordinates.length > 100) {
      //    length = 99;
      // } else {
      //    length = this.routeCoordinates.length;
      // }
      // for (var i = 0; i < this.routeCoordinates.length; i++) {
      //       cnt++; 
      //    if (cnt === length) { 
      //       cnt = 0;
      //       var path = '';
      //       for (var j = 0; j < path1.length; j++) {
      //          path = path + path1[j].latitude + "," + path1[j].longitude + "|";
      //       }
      //       // Remove ending |
      //       path = path.slice(0, -1);
      //       this.snapToRoadCoordinates(path, i == path1.length - 1);
      //       path1 = [];
      //       // pass 100 data to roadapi
      //    } 
      //    // else {
      //    //    // push to new array
      //    //    path1.push(this.routeCoordinates[i]);
      //    //    cnt++;
      //    // }
      // // }
      // // this.snapToRoadCoordinates(path,i == groups.length-1);
      // }
   }

   // called by above in a loop. gets final snapped coordiantes in 
   // roadCoordinates 
   snapToRoadCoordinates(apath, isLast) {
      axios.get(
         "https://roads.googleapis.com/v1/snapToRoads?path="
         + apath
         + "&interpolate=true&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw"


      ).then(response => {
         var data = response.data;
         for (var i = 0; i < data.snappedPoints.length; i++) {
            this.state.roadCoordinates.push({
               latitude: data.snappedPoints[i].location.latitude,
               longitude: data.snappedPoints[i].location.longitude

            })
         }

         if (isLast)
            this.setState({ isLoading: false });
      })
         .catch(function (error) {
            console.log("axios error", error);
         });
   }

   goToHome = () => {
      Actions.StartScreen()
   }
   render() {
      const {
         roadCoordinates
      } = this.state;

      let polyline = null;
      let marker = null;

      if (this.state.isLoading) {
         return (
            <View style={[styles.containers, styles.horizontal]}>
               <Text>{"Loading" + this.state.tryRender}</Text>
               <ActivityIndicator size="large" color="#0000ff" />
            </View>
         )
      }

      if (roadCoordinates.length > 0) {
         for (var i = 0; i <= roadCoordinates.length; i++) {
            this.state.markers.push(roadCoordinates[0]);
            this.state.markers.push(roadCoordinates[roadCoordinates.length - 1]);
         }

         polyline = (
            <Polyline
               coordinates={roadCoordinates}
               strokeWidth={3}
               strokeColor="red"
               geodesic={true}
            />
         );

         return (
            <TouchableWithoutFeedback onPress={this.hideKeyboard}>
               <View style={styles.container}>
                  <MapView
                     ref={this.map}
                     showsUserLocation
                     followsUserLocation
                     // origin={origin}
                     style={styles.map}

                     region={{
                        latitude: this.state.roadCoordinates[0].latitude,
                        longitude: this.state.roadCoordinates[0].longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.01
                     }}
                  >

                     {polyline}
                  </MapView>

                  <Text style={{ fontWeight: 'bold', color: 'black' }} >
                     {parseFloat(this.props.distance).toFixed(1)} km
                </Text>

                  <TouchableOpacity style={styles.buttonContainer12} onPress={this.saveReport.bind(this)}>
                     <Text style={{ fontWeight: 'bold', color: 'black' }} > Save Report </Text>
                  </TouchableOpacity>
               </View>
            </TouchableWithoutFeedback>
         );
      }
      // else {
      //    return (
      //       <View>
      //          <Text>{"No Data yet. Working."}</Text>
      //       </View>
      //    )
      // }
   }

   saveReport() {
      var fileName = `GoogleCoordinates${Math.floor(Math.random() * 100)}.txt`;

      var path = RNFS.ExternalDirectoryPath + fileName;

      var currentdate = new Date();
      var str = currentdate.toDateString();
      str = str + "\n" + "Distance traveled (Km): " + this.props.distance.toFixed(1);
      str = str + "\n\n" + "---------coordinates collected: " + JSON.stringify(this.routeCoordinates);

      RNFS.writeFile(path, str, 'utf8')
         .then((success) => {
            alert("Successfully saved to " + path);
         })
         .catch((err) => {
            console.log("Error saving file", err.message);
         });
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


export default RouteScreen