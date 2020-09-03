import React, { Component } from 'react';
import { Alert ,View,Text} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
var newArray=[]
export default class BackgroundGeo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isgeoLoc:false,
          hasMapPermission: true,
          userLatitude: 0,
          userLongitude:0,
          myKey:'',
          ms:0,
          sec:0,
          destinationCoords:[],
      

          //    destinationCoords: [
          //   {lat:18.50737,long:73.80767},
          //   {lat:18.50775,long:73.80787},
          //   {lat:18.50787,long:73.80844},
          //   {lat:18.50826,long:73.80925},
          //   {lat:18.50838,long:73.81012},
          //   {lat:18.50902,long:73.81107},
          //   {lat:18.50943,long:73.81178},
          //   {lat:18.50954,long:73.81263},
          //   {lat:18.50737,long:73.80767},
          //   {lat:18.50775,long:73.80787},
          //   {lat:18.50787,long:73.80844},
          //   {lat:18.50826,long:73.80925},
          //   {lat:18.50838,long:73.81012},
          //   {lat:18.50902,long:73.81107},
          //   {lat:18.50943,long:73.81178},
          //   {lat:18.50954,long:73.81263},
          // ],    
            
                          
        };
    }
    componentDidMount() {
        BackgroundGeolocation.configure({
          desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
          stationaryRadius: 0,
          distanceFilter: 0,
          notificationTitle: 'Background tracking',
          notificationText: 'enabled',
          debug: true,
          startOnBoot: false,
          stopOnTerminate: true,
          locationProvider:  BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
        //  locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
          interval: 5000,
        //   fastestInterval: 5000,
        //   activitiesInterval: 10000,
          stopOnStillActivity: false,
          url: 'http://192.168.81.15:3000/location',
          httpHeaders: {
            'X-FOO': 'bar'
          },
          // customize post properties
          postTemplate: {
            lat: '@latitude',
            lon: '@longitude',
            foo: 'bar' // you can also add your own properties
          }
        });
     
        BackgroundGeolocation.on('location', (location) => {
             // handle stationary locations here
  // {"accuracy": 20, "altitude": 517.5, "bearing": 180.9255828857422, "id": 87, "isFromMockProvider": false, "latitude": 18.4941995,
  // "locationProvider": 1, "longitude": 73.8100013, "mockLocationsEnabled": false, "provider": "fused", "speed": 0.3230378329753876,
  // "time": 1595832221178}
            console.log("locationssssssssssssss1",location.latitude)
            console.log("locationssssssssssssss2",location.longitude)
            
            this.setState({
                userLatitude: location.latitude,
                userLongitude:location.longitude
              });
              console.log(this.state.userLatitude)
              const result = [];
              result.push({
               latitude: this.state.userLatitude,
                longitude: this.state.userLongitude}
             )
             console.log(result)                  
           result.forEach(obj => {
             if (!newArray.some(o => o[0] === obj.latitude )) {
              newArray.push([
                 obj.latitude,
                 obj.longitude
               ]);
             }     
           });
                  console.log("destarray=",JSON.stringify(newArray))

          BackgroundGeolocation.startTask(taskKey => {
            // execute long running task
            // eg. ajax post location
            // IMPORTANT: task has to be ended by endTask
            BackgroundGeolocation.endTask(taskKey);
          });
        });
     
        BackgroundGeolocation.on('stationary', (stationaryLocation) => {

          console.log("goesb in stationary...............")
          BackgroundGeolocation.switchMode(BackgroundGeolocation.FOREGROUND_MODE);
         
       //   Actions.sendLocation(stationaryLocation);
        });
     
        BackgroundGeolocation.on('error', (error) => {
          console.log('[ERROR] BackgroundGeolocation error:', error);
        });
     
        BackgroundGeolocation.on('start', () => {
          console.log('[INFO] BackgroundGeolocation service has been started');
        });
     
        BackgroundGeolocation.on('stop', () => {
          console.log('[INFO] BackgroundGeolocation service has been stopped');
        });
     
        BackgroundGeolocation.on('authorization', (status) => {
          console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
          if (status !== BackgroundGeolocation.AUTHORIZED) {
            // we need to set delay or otherwise alert may not be shown
            setTimeout(() =>
              Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
              ]), 1000);
          }
        });     
        BackgroundGeolocation.on('background', () => {
          console.log('[INFO] App is in background');
        });
     
        BackgroundGeolocation.on('foreground', () => {
          console.log('[INFO] App is in foreground');
        });
     
        BackgroundGeolocation.on('abort_requested', () => {
          console.log('[INFO] Server responded with 285 Updates Not Required');     
          // Here we can decide whether we want stop the updates or not.
          // If you've configured the server to return 285, then it means the server does not require further update.
          // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
          // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
        });
     
        BackgroundGeolocation.on('http_authorization', () => {
          console.log('[INFO] App needs to authorize the http requests');
        });
     
        BackgroundGeolocation.checkStatus(status => {
          console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
          console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
          console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);     
          // you don't need to check status before start (this is just the example)
          if (!status.isRunning) {
            BackgroundGeolocation.start(); //triggers start on start event
          }
        });
     
      }
      
     
      componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
      }
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
            </View>
        )
    }
}
