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
import haversine from "haversine"
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import {NavigationEvents} from 'react-navigation';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
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
          // coordinates: [
          //   [18.50737,73.80767],
          //   [18.50775,73.80787],
          //   [18.50787,73.80844],
          //   [18.50826,73.80925],
          //   [18.50838,73.81012],
          //   [18.50902,73.81107],
          //   [18.50943,73.81178],
          //   [18.50954,73.81263],
          // ],    
        
         coordinates:this.props.navigation.getParam('destinationCoords'),
          //.getParam('destinationCoords'),
            
            
                coords:[],
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
 // this.state.coordinates=this.props.navigation.getParam('destinationCoords');
    }

     componentDidMount() {
      this.focusListner = this.props.navigation.addListener("didFocus",() => {
        console.log("in.. _componentFocused........");

    
    
        console.log("in component did")
      //  console.log('array2: ',JSON.stringify(this.state.coordinates[0]));
     //   alert(this.state.coordinates.length)
    
       this.state.coordinates= this.state.coordinates.join('|')
       console.log("Join=",this.state.coordinates);
                   axios.get(
              `https://roads.googleapis.com/v1/snapToRoads?path=${this.state.coordinates}&interpolate=true&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw `
               ) .then(resp=>{
             
                var datas=resp.data
                console.log("resp=",JSON.stringify(datas));
               // console.log("len=",JSON.parse(datas.snappedPoints[0]))
            
              
           var datanew=JSON.stringify(datas);
           console.log("datanew=",datanew)
           console.log("datasDirection==",JSON.parse(datanew).snappedPoints[0].location.latitude)
    
    
              for (var i = 0; i <JSON.parse(datanew).snappedPoints.length; i++)
             {
              //  var latlng= JSON.parse(datanew).snappedPoints[i].location
              //  console.log("latlng1==",latlng)
              //  this.state.finalCoords.push(latlng)
             this.state.finalCoords.push({latitude:JSON.parse(datanew).snappedPoints[i].location.latitude,
                    longitude:JSON.parse(datanew).snappedPoints[i].location.longitude} )
             //  var latlng=data.snappedPoints[i].location
                  
              }
              console.log("latlng==",JSON.stringify(this.state.finalCoords))
              this.setState({userLatitude:this.state.finalCoords[0].latitude,
                userLongitude:this.state.finalCoords[0].longitude})
                 
             
            //  alert("success..")
               
                
               this.setState({ isLoading: false  })
               this.forceUpdate();
               this.calculateDistance()
              
              })  
              .catch(function (error) {
                console.log(error);
              });   
      });
    

    //   console.log('coordinates==',this.state.coordinates);
    //   this._componentFocused();
    
    //   this._sub = this.props.navigation.addListener(
    //     'didFocus',
    //     this._componentFocused
       
    //   );
    //   console.log("in.. ComponentDidMount........");
    
    //   this.props.navigation.addListener("didBlur", () => {
    //     // user has navigated away from this screen
    // });



  }
  

//  _componentFocused = () => {
             
  //}

  calculateDistance=()=>{
  //  alert("in calc....");
    console.log("RAjaniDAta=",JSON.stringify(this.state.finalCoords))

      var dist=0
      var dest1=0;
    for(var i=0;i<this.state.finalCoords.length;i++){
try{
    dist=haversine(this.state.finalCoords[i], this.state.finalCoords[i+1], {unit: 'meter'})
}catch(err) {
  // handle error here
}
 // dist=Math.round(dist,2)
 dist=Number(dist.toFixed(2));
    console.log("distancr1=",dist)
     dest1 += dist
    console.log("newDistance=",dest1)


           var Km = Math.floor(dest1 /1000)
            var meter = dest1 % 1000

            Km=Number(Km.toFixed(0));
            meter=Number(meter.toFixed(0));
            console.log("TimeDistanceKm=",Km,meter)
            this.setState({ Km:Km  });
            this.setState({ meter:meter  });

    }

}
  render() {
 
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
 //alert(JSON.stringify(finalCoords))
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
              latitude:userLatitude,
              longitude: userLongitude,

                // latitude: 18.499880,
                // longitude: 73.810669,
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

