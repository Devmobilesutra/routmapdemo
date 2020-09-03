import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  Button,
  PermissionsAndroid,
  TouchableOpacity,AsyncStorage,
  TouchableWithoutFeedback,
  DeviceEventEmitter, NativeAppEventEmitter, Platform ,Vibration
} from "react-native";
import Map from "./Map";
import axios from "axios";
//import PlaceInput from "./components/PlaceInput";
import PolyLine from "@mapbox/polyline";
import Geolocation from 'react-native-geolocation-service';
import MapView, { Polyline, Marker } from "react-native-maps";
import BackgroundTimer from 'react-native-background-timer'
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000];
export default class Global extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
          destinationCoordss:[{"abc":1,"egd":2}],
                          
        };
       
      }
    }