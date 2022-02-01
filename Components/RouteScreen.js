import React from 'react'
import {
   TouchableOpacity, StyleSheet, Text, View, TouchableWithoutFeedback,
   ActivityIndicator,
   Alert,
   Dimensions
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import axios from "axios";
import haversine from "haversine"
import MapView, { Polyline, Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import RNFS from 'react-native-fs'
import { interpolate } from 'react-native-reanimated';
import MapScreen from './MapScreen';
const { width, height } = Dimensions.get('window');
var interval = 0;
var temp = [];
var t2 =[];
const GOOGLE_MAPS_APIKEY = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw';

class RouteScreen extends React.Component {
   routeCoordinates = [];
   prevLatLong=null;
   constructor(props) {
      super(props);
      global.isInternet = false;

      this.state = {
         tempRoot: [],
         tryRender: ".",
         roadCoordinates: [],
         isLoading: true,
         markers: []
      }
      this.mapView = null;
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

  async componentDidMount() {
      interval = setInterval(this.tryRendering.bind(this), 1000);
      this.convertToRoadCoordinates();
      // console.log(this.routeCoordinates[0].latitude)
     await this.directionApi();
     console.log('ajit',t2)
     console.log('bbbb',0.0922*(width/height)/parseInt(this.props.distance));
   
      // `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}`
   }
   componentWillUnmount(){
      
   }
   decode(t) {
		let points = [];
		for (let step of t) {
			let encoded = step.polyline.points;
			let index = 0, len = encoded.length;
			let lat = 0, lng = 0;
			while (index < len) {
				let b, shift = 0, result = 0;
				do {
					b = encoded.charAt(index++).charCodeAt(0) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);

				let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
				lat += dlat;
				shift = 0;
				result = 0;
				do {
					b = encoded.charAt(index++).charCodeAt(0) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
				lng += dlng;

				points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
			}
		}
      // console.log("points",points);
		return points;
	}
   getlatitude=(index)=>{
      if(
         this.routeCoordinates.length > index
      ) 
      {
         console.log(index,this.routeCoordinates.length)
         return `${this.routeCoordinates[index].latitude},${this.routeCoordinates[index].longitude}`;
      }
      else if(this.routeCoordinates.length == index && this.state.tempRoot>0){
         this.setState({isLoading : false});
         return 'null';
      }
     
   }
   calcDistance = newLatLng => { 
      // if (!this.collecting)
      //   return 0;
      if (this.prevLatLong == null) {
        this.prevLatLong = newLatLng;
        return 0;
      }
      //Determines the great-circle distance between two points on a sphere given their longitudes and latitudes
      return haversine(this.prevLatLong, newLatLng) || 0;
    };
   directionApi = async() =>{
      let temp=[];
       t2=[];
      this.setState({isLoading : true});
      let i = 0;
      console.log(this.routeCoordinates.length)
      while(i < this.routeCoordinates.length){
        
         // let coordinate = this.routeCoordinates[i]
         if( this.routeCoordinates.length-1 >= i){
            var d=this.calcDistance(this.routeCoordinates[i]);
            if(d>=0.1 || i== this.routeCoordinates.length-1){
               console.log(d);
               let coordinate = this.prevLatLong;
               this.prevLatLong = this.routeCoordinates[i];
               // let coordinate = this.routeCoordinates[i]
               let des = this.routeCoordinates[i];
                  t2.push(i);
                  // let origin=  this.routeCoordinates.slice(i, i+1);
                  let origin=  `${coordinate.latitude},${coordinate.longitude}`;
                  let destination = `${des.latitude},${des.longitude}`;
                  // let destination = this.getlatitude(index+1);
                  let waypoints = [];
                  let apikey = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw';
                  let mode = 'driving';
                  let language = 'en';
                  let region = '';
                  // if(destination!='null'){
                  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}`
                  // console.log('lat',origin);
                   await fetch(url)
            		.then(response => response.json())
                  .then(json => {
                     // console.log(json);
                     console.log(i)
                     

                     if(json.routes.length){
                        // console.log('ajit')
                        var route = json.routes[0];
                        var coordinates = this.decode([{polyline: route.overview_polyline}])
                        var arr1 = temp.concat(coordinates);
                           temp = arr1;
                           // this.state.markers=[];
                           this.setState({tempRoot:arr1},()=>{
                                             // this.state.markers.push(this.state.tempRoot[0]);
                                             // this.state.markers.push(this.state.tempRoot[this.state.tempRoot.length-1]);
                                 // console.log('coordinate \n',this.state.tempRoot);
                                             
                         })  
                         
                     }
                     
                  }).catch(e=>this.message(e));

            }
           
      // }
               }
               else if(i <= this.routeCoordinates.length-1){
                  this.setState({isLoading : false});
               }
               i++;
               // console.log(i)
   }
}
   // directionApi= async()=>{
   //    let temp=[];
   //     t2=[];
   //    this.setState({isLoading : true});
   //    await this.routeCoordinates.map((coordinate,index)=>{
   //       if( this.routeCoordinates.length != index){

   //       t2.push(index);
   //       // let origin=  this.routeCoordinates.slice(i, i+1);
   //       let origin=  `${coordinate.latitude},${coordinate.longitude}`;
   //       // let destination = this.routeCoordinates.slice(index+1, index + 2);
   //       let destination = this.getlatitude(index+1);
   //       let waypoints = [];
   //       let apikey = 'AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw';
   //       let mode = 'driving';
   //       let language = 'en';
   //       let region = '';
   //       if(destination!='null'){
   //       let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}`
   //       // console.log('lat',origin);
   //       return  fetch(url)
	// 		.then(response => response.json())
	// 		.then(json => {
   //          // console.log('Joson',index)
   //          if (json.status !== 'OK') {
	// 				const errorMessage = json.error_message || json.status || 'Unknown error';
	// 				// Alert.alert(errorMessage);
	// 			}
   //          let precision = 'low';
   //          var route = json.routes[0];
   //          if(route.overview_polyline){
   //             var coordinates = this.decode([{polyline: route.overview_polyline}])
   //             var c = [this.decode([{polyline: route.overview_polyline}])]
   //          //  let coordinates =[
   //          //    (precision === 'low') ?
   //          //       this.decode([{polyline: route.overview_polyline}]) :
   //          //       route.legs.reduce((carry, curr) => {
   //          //          return [
   //          //             ...carry,
   //          //             ...this.decode(curr.steps),
   //          //          ];
   //          //       }, [])
   //          //  ]
            
            
   //          // var arr1 = temp.concat(coordinates);
   //          // temp = arr1;
   //          // this.state.markers=[];
   //          // this.setState({tempRoot:arr1},()=>{
   //          //             // this.state.markers.push(this.state.tempRoot[0]);
   //          //             // this.state.markers.push(this.state.tempRoot[this.state.tempRoot.length-1]);
   //          //             // console.log('coordinate \n',this.state.tempRoot);
                        
   //          //          })

   //          t2.splice(index, 1, c[0]);
   //          // console.log('coordinate \n',t2);
   //          return t2;
   //          // for(var i=0;i<coordinates.length;i++){
   //          //    temp.push(coordinates[i]);
   //          //       this.setState({tempRoot:temp},()=>{
   //          //          console.log('coordinate \n',this.state.tempRoot);
   //          //       })
                  
   //          // }
   //          // this.concatCoordinate(coordinates);
   //          // this.tempRoot.push(coordinates)
   //          // console.log("points",this.tempRoot);
   //       }
   //       })
   //       .catch(e=>this.message(e)
            
   //       );
   //       }
   //       else{
   //          console.log('hgkkhjfgfh', t2)
   //          this.setState({isLoading : false});
   //       }
   //    }
   //       else{
   //          console.log('hgh', t2)
   //          this.setState({isLoading : false});
   //       }
   //    });
      
   // }

   message=(e)=>{
      console.log('Ajit111',e == `TypeError: undefined is not an object (evaluating 'route.overview_polyline')` )
      if(e == 'TypeError: Network request failed' && this.state.isLoading){
         this.setState({isLoading : false});
         Alert.alert('TypeError: Network request failed')
         Actions.pop();
      }else if(e == `TypeError: undefined is not an object (evaluating 'route.overview_polyline')`)
      {
         // console.log('hgkkhjfgfh', t2)
         // this.seperatearray()
         // this.setState({isLoading : false});
      }
      else if(e== `TypeError: Cannot read properties of undefined (reading 'overview_polyline')`){
         // this.seperatearray()
         // this.setState({isLoading : false});
      }
      else{
         console.log('Ajit111',e )
         this.setState({isLoading : false});
      }
   }
   seperatearray=()=>{
      let temp = [];
      this.state.tempRoot=[];
      // console.log(t2[0])
      t2.map((group,index)=>
         {
            console.log( typeof group)
            if(index<t2.length-1 && typeof group == 'object'){
               // console.log( typeof group)
               // console.log(group,index);
               var arr1 = temp.concat(group);
            temp = arr1;
            this.state.markers=[];
            // console.log(temp)
            this.setState({tempRoot:arr1},()=>{
                     //   console.log('coordinate \n',this.state.tempRoot)
                        
                     })
            }
            else{
               if(typeof t2[0] =='number' && temp.length==0){
                  Alert.alert('Something wents wrong','please try again');
                  Actions.pop();
               }
               // this.setState({isLoading : false})
            
            }
            
         })
    

      }
      

   
   concatCoordinate =(coordinates)=>{
      // const arr = coordinates[0]
      var arr = coordinates;
      // console.log(arr ,"\n")
      // arr.map((coordinate)=>{
      //    // this.state.tempRoot.push(coordinate)
      //    temp.push(coordinate);
      //    this.setState({tempRoot:temp},()=>{
      //       console.log('coordinate \n',this.state.tempRoot);
      //    })
         

      // })
      for(var i=0;i<arr.length;i++){
         temp.push(arr[i]);
            this.setState({tempRoot:temp},()=>{
               console.log('coordinate \n',this.state.tempRoot);
            })
            
      }
   }
   // Convert route coordinates to snapped coordinates for road drawing
   convertToRoadCoordinates() {
      var chunkSize = 100;
      var groups = this.routeCoordinates.map((e, i) => {
         return i % chunkSize === 0 ? this.routeCoordinates.slice(i, i + chunkSize) : null;
      }).filter(e => { return e });
      //group = [{100 routeCoordinates},{next 100 routeCoordinates}...]
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
            this.setState({});
         }

         if (isLast){
            this.state.markers.push(this.state.roadCoordinates[0]);
            this.state.markers.push(this.state.roadCoordinates[this.state.roadCoordinates.length - 1]);
            this.setState({ isLoading: false });

         }
            // console.log(this.state.roadCoordinates.length,"this.state.roadCoordinates")
      })
         .catch(function (error) {
            console.log("axios error", error);
         });
   }
   toFixedCoordinate(props){
      console.log("ajiiii",props)
      this.mapView.fitToCoordinates(props, {
         edgePadding: {
             right: (width / 20),
             bottom: (height / 20),
             left: (width / 20),
             top: (height / 20),
         }
         });
   }

   goToHome = () => {
      Actions.StartScreen()
   }
   render() {
      const {
         roadCoordinates,
         tempRoot,
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

      else if (tempRoot.length > 0 ) {
         // for (var i = 0; i <= tempRoot.length; i++) {
         //    this.state.markers.push(tempRoot[0]);
         //    this.state.markers.push(tempRoot[tempRoot.length - 1]);
         // }
         // this.state.markers.push(roadCoordinates[0]);
         // this.state.markers.push(roadCoordinates[roadCoordinates.length - 1]);

         polyline = (
            <Polyline
               // coordinates={this.state.tempRoot}
               coordinates={tempRoot}
               strokeWidth={3}
               strokeColor="#1E90FF"
               geodesic={true}
            />
         );

         return (
            <TouchableWithoutFeedback onPress={this.hideKeyboard}>
               <View style={styles.container}>
                  <MapView
                     ref={c=>this.mapView=c}
                     showsUserLocation
                     followsUserLocation
                     // origin={origin}
                     style={styles.map}
                     
                     region={{
                        // latitude: this.state.roadCoordinates[0].latitude,
                        // longitude: this.state.roadCoordinates[0].longitude,
                        latitude: this.state.tempRoot[0].latitude,
                        longitude: this.state.tempRoot[0].longitude,
                        latitudeDelta: 0.0922,
                        // longitudeDelta: 0.0922*(width/height)
                        longitudeDelta: this.state.tempRoot.length?parseInt(this.props.distance)/100*0.922 :0.0922*(width/height)
                     }}
                     // onMapReady={(result) => this.toFixedCoordinate(this.state) }
                  >

                     {polyline}
                     {
                        this.state.markers.map((CoordinatePoints,index)=>
                        <Marker
                            coordinate={{
                                latitude: CoordinatePoints.latitude,
                                longitude: CoordinatePoints.longitude,
                        }}
                        key={index}
                        // title={CoordinatePoints.shopname}
                        // description={CoordinatePoints.time}
                        // image={require('../Assets/pngwing.png')}
                        pinColor={'#1E90FF'}
                       
                        />
                        )
                     }
                     
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
      else{
         return (
            <View style={[styles.containers, styles.horizontal]}>
               <Text>{"Loading" + this.state.tryRender}</Text>
               <ActivityIndicator size="large" color="#0000ff" />
            </View>
         )
      }
      // else {
      //    return (
      //       <View>
      //          <Text>{"No Data yet. Working."}</Text>
      //       </View>
      //    )
      // }
   }
   // render(){
   //    return(
   //       <MapScreen Coordinates={this.props.routeCoordinates} />
   //    );
   // }

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