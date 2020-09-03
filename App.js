import React, { Component } from 'react';
import { addNavigationHelpers } from 'react-navigation';

import RouterComponent from './Router';

import {Router, Scene, Actions, ActionConst,Stack,Drawer} from 'react-native-router-flux';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import Example from './components/bb'
import Mapss from './components/mappsNew'
import Buttons from './components/ButtonNew';
import RoadMaps from './components/RoadMaps';
import MapDirection from './components/MapDirection';
import whatsapp from './components/wt';
import BackgroundGeo from './components/BackgroundGeo'
class App extends  Component{
    constructor(){
        super()
  
    }
    render(){
      
        return(
            <Router>
            <Stack key="root"  >
            <Scene key="Example" component={Example} title="Example"  hideNavBar={true}/>            
           
            <Scene key="Buttons" component={Buttons} title="Dashboard"  hideNavBar={true}/> 
         <Scene key="Mapss" component={Mapss} title="Mapss"  /> 
      
           
                
               
            </Stack> 
          </Router>
        )
    }
}
export default App

// const bindAction = dispatch => {
//     return Object.assign({dispatch: dispatch}, bindActionCreators(ActionCreators, dispatch)); 
//     // add dispatch itself to props, so available for addNavigationHelpers
// };

// const mapStateToProps = state => ({
//   navigation: state.navigation, // needed for addNavigationHelpers
// });

// export default connect(mapStateToProps, bindAction)(App);