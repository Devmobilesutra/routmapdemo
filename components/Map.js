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
export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
           hasMapPermission: true,
          userLatitude: 18.4995289,
          userLongitude: 73.8107656,
        
          destinationCoords:[{"latitude":18.50737,"longitude":73.80767},{"latitude":18.50749,"longitude":73.80764},{"latitude":18.50757,"longitude":73.80787},{"latitude":18.50775,"longitude":73.80824},{"latitude":18.50787,"longitude":73.80844},{"latitude":18.5081,"longitude":73.80889},{"latitude":18.50826,"longitude":73.80925},{"latitude":18.50828,"longitude":73.80938},{"latitude":18.50838,"longitude":73.81012},{"latitude":18.50843,"longitude":73.81039},{"latitude":18.50872,"longitude":73.8107},{"latitude":18.50902,"longitude":73.81107},{"latitude":18.50932,"longitude":73.81151},{"latitude":18.50943,"longitude":73.81178},{"latitude":18.5095,"longitude":73.81209},{"latitude":18.50954,"longitude":73.81263},{"latitude":18.50961,"longitude":73.81366},{"latitude":18.5097,"longitude":73.81433},{"latitude":18.5098,"longitude":73.81475},{"latitude":18.50995,"longitude":73.81517},{"latitude":18.51028,"longitude":73.81582},{"latitude":18.51067,"longitude":73.81669},{"latitude":18.51081,"longitude":73.81713},{"latitude":18.51084,"longitude":73.81725},{"latitude":18.51085,"longitude":73.81754},{"latitude":18.51084,"longitude":73.81768},{"latitude":18.51084,"longitude":73.81825},{"latitude":18.5109,"longitude":73.81858},{"latitude":18.51101,"longitude":73.81911},{"latitude":18.51101,"longitude":73.8193},{"latitude":18.51098,"longitude":73.81945},{"latitude":18.51091,"longitude":73.81964},{"latitude":18.51065,"longitude":73.82012},{"latitude":18.5105,"longitude":73.82041},{"latitude":18.51032,"longitude":73.82076},{"latitude":18.5101,"longitude":73.82109},{"latitude":18.50961,"longitude":73.82159},{"latitude":18.50916,"longitude":73.82204},{"latitude":18.50846,"longitude":73.82264},{"latitude":18.50808,"longitude":73.82295},{"latitude":18.5069,"longitude":73.82392},{"latitude":18.50653,"longitude":73.82423},{"latitude":18.50635,"longitude":73.8244},{"latitude":18.50621,"longitude":73.82457},{"latitude":18.50616,"longitude":73.82466},{"latitude":18.50605,"longitude":73.82499},{"latitude":18.506,"longitude":73.82539},{"latitude":18.506,"longitude":73.82551},{"latitude":18.50614,"longitude":73.82596},{"latitude":18.50671,"longitude":73.82729},{"latitude":18.50693,"longitude":73.82776},{"latitude":18.50699,"longitude":73.82787},{"latitude":18.50711,"longitude":73.8279},{"latitude":18.5072,"longitude":73.82793},{"latitude":18.50745,"longitude":73.82815},{"latitude":18.50784,"longitude":73.8284},{"latitude":18.50814,"longitude":73.82853},{"latitude":18.50846,"longitude":73.82859},{"latitude":18.50882,"longitude":73.82863},{"latitude":18.50893,"longitude":73.82862},{"latitude":18.50921,"longitude":73.82856},{"latitude":18.50956,"longitude":73.82854},{"latitude":18.50971,"longitude":73.82856},{"latitude":18.50982,"longitude":73.8286},{"latitude":18.50993,"longitude":73.82867},{"latitude":18.50999,"longitude":73.82874},{"latitude":18.51009,"longitude":73.82892},{"latitude":18.51016,"longitude":73.829},{"latitude":18.51026,"longitude":73.82906},{"latitude":18.51048,"longitude":73.82916},{"latitude":18.51067,"longitude":73.82957},{"latitude":18.51104,"longitude":73.82942},{"latitude":18.51214,"longitude":73.82902},{"latitude":18.51264,"longitude":73.82887},{"latitude":18.51336,"longitude":73.82873},{"latitude":18.51386,"longitude":73.82872},{"latitude":18.5143,"longitude":73.82873},{"latitude":18.51461,"longitude":73.82873},{"latitude":18.51483,"longitude":73.82876},{"latitude":18.51525,"longitude":73.82884},{"latitude":18.51543,"longitude":73.82883},{"latitude":18.51671,"longitude":73.8293},{"latitude":18.51743,"longitude":73.82958},{"latitude":18.51801,"longitude":73.82988},{"latitude":18.51847,"longitude":73.83011},{"latitude":18.51878,"longitude":73.83025},{"latitude":18.51902,"longitude":73.8303},{"latitude":18.51977,"longitude":73.83037},{"latitude":18.52018,"longitude":73.83042},{"latitude":18.52021,"longitude":73.8304},{"latitude":18.52027,"longitude":73.83039},{"latitude":18.52033,"longitude":73.83042},{"latitude":18.52035,"longitude":73.83049},{"latitude":18.52032,"longitude":73.83055},{"latitude":18.52018,"longitude":73.83078},{"latitude":18.52012,"longitude":73.8338},{"latitude":18.52005,"longitude":73.83432},{"latitude":18.5194,"longitude":73.83619},{"latitude":18.5193,"longitude":73.8365},{"latitude":18.5193,"longitude":73.8367},{"latitude":18.51935,"longitude":73.83699},{"latitude":18.51948,"longitude":73.83738},{"latitude":18.5196,"longitude":73.83769},{"latitude":18.51971,"longitude":73.83787},{"latitude":18.51983,"longitude":73.83804},{"latitude":18.51987,"longitude":73.83811},{"latitude":18.51986,"longitude":73.83832},{"latitude":18.51943,"longitude":73.84072},{"latitude":18.51939,"longitude":73.84087},{"latitude":18.51935,"longitude":73.84131},{"latitude":18.51991,"longitude":73.8412},{"latitude":18.52042,"longitude":73.84115},{"latitude":18.52053,"longitude":73.84113},{"latitude":18.52105,"longitude":73.84106},{"latitude":18.52134,"longitude":73.84103},{"latitude":18.52265,"longitude":73.84091},{"latitude":18.52363,"longitude":73.84112},{"latitude":18.52456,"longitude":73.84132},{"latitude":18.52553,"longitude":73.84158},{"latitude":18.52592,"longitude":73.84169},{"latitude":18.52631,"longitude":73.84186},{"latitude":18.52658,"longitude":73.842},{"latitude":18.52694,"longitude":73.8422},{"latitude":18.52685,"longitude":73.84248},{"latitude":18.52664,"longitude":73.84317},{"latitude":18.52656,"longitude":73.84353},{"latitude":18.52651,"longitude":73.84388},{"latitude":18.52617,"longitude":73.84381}],
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
          //destinationCoords :this.props.navigation.getParam('destinationCoords'),
         //destinationCoords :[],
          isLoading: true
        };
        this.locationWatchId = null;
         this.map = React.createRef();
    //this.showTimeDistanceOnMap=this.showTimeDistanceOnMap.bind(this)
      // this.getAsyncData()
          }   
    //  async getAsyncData(){
    //  console.log("in getAsync..................")
    //   try {
    //     const value = await AsyncStorage.getItem('@MySuperStore:key');
    // const destinationCoords = [ ...this.state.destinationCoords, value ];
    // this.setState({ destinationCoords });
    // console.log("data=" + value);
    // console.log("destinationCoordsMap=" + this.state.destinationCoords);
    // } catch (error) {
    // console.log("Error retrieving data" + error);
    // }}

    async componentDidMount() {
    console.log("in component did")
    console.log("destinationCoordsMap1=" +JSON.stringify (this.state.destinationCoords));
    //this.setState({ isLoading: true  })
    var SourceLat,SourceLong;
    var DestLat,DestLong;
    var a=0;
   // alert(JSON.stringify(this.state.destinationCoords))
    for(var i=0;i<=this.state.destinationCoords.length;i++){
      console.log("infor",a++)
      SourceLat=this.state.destinationCoords[i].latitude
      SourceLong=this.state.destinationCoords[i].longitude
      console.log("sourceLat=",SourceLat)
      console.log("source long=",SourceLong)
    //  for(var j=i+1;j<=this.state.destinationCoords.length;j++){
        DestLat=this.state.destinationCoords[i+1].latitude
        DestLong=this.state.destinationCoords[i+1].longitude
        console.log("Destlat=",  DestLat)
        console.log("Destlong=",  DestLong)
      const result = await axios.get(
         `https://maps.googleapis.com/maps/api/directions/json?origin=${SourceLat},${SourceLong}&destination=${DestLat},${DestLong}&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw`
          );
          console.log("datasDirection==",JSON.stringify(result.data))
          this.setState({ isLoading: false  })
          const points = PolyLine.decode(
            result.data.routes[0].overview_polyline.points );
        
          const latLng = points.map(point => ({
            latitude: point[0],
            longitude: point[1]
          }));
          this.setState({ destinationCoordsNew: latLng });
         console.log("latlong1=",JSON.stringify( this.state.destinationCoordsNew ));                 
          var joined = this.state.finalCoords.concat(this.state.destinationCoordsNew);
         this.setState({ finalCoords: joined })
         
         this.map.current.fitToCoordinates(latLng, {
            edgePadding: { top: 40, bottom: 40, left: 40, right: 40 }
          });             
          console.log("finalCoords=",JSON.stringify( this.state.finalCoords ));
          //this.showTimeDistanceOnMap(this.state.finalCoords)
    }
    
    console.log("finallyyy..=" +JSON.stringify (this.state.finalCoords));
       
  }


 async compabconentDidUpdate() {
    if(finalCoords && finalCoords.length>1){
        console.log("showTimeDistanceOnMap")
          // alert("showTimeDistanceOnMap")
    console.log("finalCoordsshowTimeDistanceOnMap=" + this.state.finalCoords);
    this.setState({ isLoading: true  })
    var SourceLat,SourceLong;
    var DestLat,DestLong;
    var a=0;
    alert(JSON.stringify(this.state.finalCoords))
    for(var i=0;i<=this.state.finalCoords.length;i++){
      
      SourceLat=this.state.finalCoords[i].latitude
      SourceLong=this.state.finalCoords[i].longitude
      console.log("sourceLat=",SourceLat)
      console.log("source long=",SourceLong)
    //  for(var j=i+1;j<=this.state.destinationCoords.length;j++){
        DestLat=this.state.finalCoords[i+1].latitude
        DestLong=this.state.finalCoords[i+1].longitude
        console.log("Destlat=",  DestLat)
        console.log("Destlong=",  DestLong)
        
            const result1 = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric &origins=${SourceLat},${SourceLong}&destinations=${DestLat},${DestLong}&key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw `)
            this.setState({ isLoading: false  })
            var distance=JSON.stringify(result1.data.rows[0].elements[0].distance.text);
            var duration=JSON.stringify(result1.data.rows[0].elements[0].duration.text);
    
            times1=0,dests1=0;
            // duration= parseInt(duration)
            // distance=parseInt(distance)
            distance = distance.replace ( /[^\d.]/g, '' );
            duration = duration.replace ( /[^\d.]/g, '' );
           // console.log("TimeDistance1=",duration,distance)
         
            
            times1=parseInt(times1+duration)
            dests1=parseInt(dests1+distance)

            var Hours = Math.floor(times1 /60)
            var minutes = times1 % 60
            console.log("TimeDistanceHour=",Hours,minutes)
            this.setState({ Hours:Hours  });
            this.setState({ minutes:minutes  });


           
            var Km = Math.floor(dests1 /1000)
            var meter = dests1 % 1000
            console.log("TimeDistanceKm=",Km,meter)
            this.setState({ Km:Km  });
            this.setState({ meter:meter  });
        
        }
    }

               
    
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