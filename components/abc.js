import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  ActivityIndicator,AsyncStorage,
  DeviceEventEmitter, NativeAppEventEmitter, Platform ,Vibration
} from "react-native";
//import MapScreen from "./MapScreen";
import axios from "axios";
import TimeDistancess from "./timeDistance"
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];
export default class abc extends Component {
    constructor(props) {
        super(props);
        this.state = {
           hasMapPermission: true,
          userLatitude: 18.4995289,
          userLongitude: 73.8107656,
          coordinates: [
            [-73.96279335021973, 40.75512452312348],
            [-73.96549701690674, 40.75109332751696],
            [-73.96974563598633, 40.74719193776603],
            [-73.9726209640503, 40.74481848035928],
            [-73.97279262542723, 40.74137193935539]
          ],
        
          destinationCoords:[18.50737,73.80767|18.50749,73.80764|18.50757,73.80787|18.50775,73.80824|
            18.50787,73.80844 |18.5081,73.80889|18.50826,73.80925|18.50843,73.81039|18.50902,73.81107
            |18.50943,73.81178|18.5095,73.81209|18.5097,73.81433|18.5098,73.81475|18.50995,73.81517
            |18.51067,73.81669|18.51081,73.81713|18.51084,73.81725|18.51085,73.81754|18.51084,73.81768
            |18.51084,73.81825|18.5109,73.81858|18.51101,73.81911|18.51098,73.81945|18.51091,73.81964
            |18.51065,73.82012|18.5101,73.82109|18.50961,73.82159|18.50916,73.82204|18.50808,73.82295
            |18.5069,73.82392|18.50653,73.82423|18.50635,73.8244|18.50621,73.82457|18.50616,73.82466
            |18.50605,73.82499|18.506,73.82539|18.50614,73.82596|18.50671,73.82729|18.50693,73.82776
            |18.50699,73.82787|18.50784,73.8284|18.50814,73.82853|18.50893,73.82862|18.50921,73.82856
            |18.50993,73.82867|18.51048,73.82916|18.51067,73.|18.51104,73.82942|18.51336,73.82873],
            
            // {"latitude":18.51386,"longitude":73.82872},{"latitude":18.5143,"longitude":73.82873},
            // {"latitude":18.51461,"longitude":73.82873},{"latitude":18.51483,"longitude":73.82876},
            // {"latitude":18.51525,"longitude":73.82884},{"latitude":18.51543,"longitude":73.82883},
            // {"latitude":18.51671,"longitude":73.8293},{"latitude":18.51743,"longitude":73.82958},{
            //     "latitude":18.51801,"longitude":73.82988},{"latitude":18.51847,"longitude":73.83011},
            //     {"latitude":18.51878,"longitude":73.83025},{"latitude":18.51902,"longitude":73.8303},
            //     {"latitude":18.51977,"longitude":73.83037},{"latitude":18.52018,"longitude":73.83042},
            //     {"latitude":18.52021,"longitude":73.8304},{"latitude":18.52027,"longitude":73.83039},
            //     {"latitude":18.52033,"longitude":73.83042},{"latitude":18.52035,"longitude":73.83049},
            //     {"latitude":18.52032,"longitude":73.83055},{"latitude":18.52018,"longitude":73.83078},
            //     {"latitude":18.52012,"longitude":73.8338},{"latitude":18.52005,"longitude":73.83432},
            //     {"latitude":18.5194,"longitude":73.83619},{"latitude":18.5193,"longitude":73.8365},
            //     {"latitude":18.5193,"longitude":73.8367},{"latitude":18.51935,"longitude":73.83699},
            //     {"latitude":18.51948,"longitude":73.83738},{"latitude":18.5196,"longitude":73.83769},
            //     {"latitude":18.51971,"longitude":73.83787},{"latitude":18.51983,"longitude":73.83804},
            //     {"latitude":18.51987,"longitude":73.83811},{"latitude":18.51986,"longitude":73.83832},
            //     {"latitude":18.51943,"longitude":73.84072},{"latitude":18.51939,"longitude":73.84087},
            //     {"latitude":18.51935,"longitude":73.84131},{"latitude":18.51991,"longitude":73.8412},{"latitude":18.52042,"longitude":73.84115},{"latitude":18.52053,"longitude":73.84113},{"latitude":18.52105,"longitude":73.84106},{"latitude":18.52134,"longitude":73.84103},{"latitude":18.52265,"longitude":73.84091},{"latitude":18.52363,"longitude":73.84112},{"latitude":18.52456,"longitude":73.84132},{"latitude":18.52553,"longitude":73.84158},{"latitude":18.52592,"longitude":73.84169},{"latitude":18.52631,"longitude":73.84186},{"latitude":18.52658,"longitude":73.842},{"latitude":18.52694,"longitude":73.8422},{"latitude":18.52685,"longitude":73.84248},{"latitude":18.52664,"longitude":73.84317},{"latitude":18.52656,"longitude":73.84353},{"latitude":18.52651,"longitude":73.84388},{"latitude":18.52617,"longitude":73.84381}],
          destinationCoordsNew:[],
          finalCoords:[],
          latitudeArr:[],
          longitudeArr:[],
          newLatitude: 0,
          newLongitude: 0,
          Hours:'',
          minutes:'',
          Km:'',
          meter:'',
             isLoading: true,
             snappedCoords:[]
        };
        this.locationWatchId = null;
  
    }
  // componentDidMount() {
    //console.log("in component did")
  //  console.log('array2: ',JSON.stringify(this.state.coordinates[0]));
    // for (var i = 0; i < this.state.coordinates.length; i++) {
    //   console.log('array1: ');
    //     // var coords = [];
       
    //     //   coords.push(this.state.coordinates[i]);
      
    //     console.log('array1: ',coords[0]);
    //     console.log('array2: ',JSON.stringify(coords[1]));
    //   // this.runSnapToRoad(coords);
    //   }
  // }

   
   runSnapToRoad(finalArray){
      // console.log("coordsss=",JSON.stringify(finalArray))
    //     const result = await axios.get(
    //      `https://roads.googleapis.com/v1/snapToRoads?path=${finalArray}&interpolate=true&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw `
    //       );
    // alert("innnnnnnn")
    axios.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: "AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw",
        path: finalArray.join('|')
      }, function(data) {
        this.setState({ isLoading: false  })
       // console.log("finalArray==",finalArray)
                       var datas=JSON.stringify(data.data)
         console.log("datasDirection==",datas)
       var datanew=JSON.parse(datas)
       console.log("datanew=",datanew)
          for (var i = 0; i <=JSON.parse(datas).snappedPoints.length; i++)
         {
           var latlng= JSON.parse(datas).snappedPoints[i].location
           //console.log("latlng1==",latlng)
         this.state.finalCoords.push(
             {latitude:JSON.parse(datas).snappedPoints[i].location.latitude,
                longitude:JSON.parse(datas).snappedPoints[i].location.longitude} )
         //  var latlng=data.snappedPoints[i].location
              
          }
          console.log("latlng==",JSON.stringify(this.state.finalCoords))
          this.setState({ isLoading: false  })
      
       // processSnapToRoadResponse(data);
        //drawSnappedPolyline();
      });
    }

        
    


  render() {
   // this.showTimeDistanceOnMap()
    const {
      finalCoords,
      destinationCoords,
      userLatitude,
      userLongitude,
      hasMapPermission,
      Hours,minutes,Km,meter
    } = this.state;

    if (this.state.isLoading) {
      return (
        <View style={[styles.containers, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    let polyline = null;
    let marker = null;
   
    if (finalCoords.length > 0) {
  // alert(JSON.stringify(finalCoords))
     console.log("abc=",JSON.stringify(finalCoords))
      polyline = (
        <Polyline
          coordinates={finalCoords}
          strokeWidth={4}
          strokeColor="#000"
        //  geodesic={true}
        />
      );
      marker = (
        <Marker coordinate={finalCoords[finalCoords.length - 1]}  style={{ 
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
              region={{
                latitude: this.state.destinationCoords[0].latitude,
                longitude: this.state.destinationCoords[0].longitude,
                latitudeDelta:  0.2,
                longitudeDelta:  0.2
              }}
            >
              
              {polyline}
              {marker}
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


 //   const result = await axios.get(
    //      `https://roads.googleapis.com/v1/snapToRoads?path=${this.state.coordinates}&interpolate=true&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw `
    //       );
         
   