/**
 * @format
 */

import {AppRegistry, Button,YellowBox} from 'react-native';
import App from './App';
import MapsTest from './MapScreen';
import Maps from './components/Map';
import RoadMaps from './components/RoadMaps';
import aa from './components/aa'

import {name as appName} from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);

