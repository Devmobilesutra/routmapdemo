import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import StartScreen from './Components/StartScreen'
import RouteScreen from './Components/RouteScreen'
import ListRoutes from './Components/ListRoutes'

const Routes = () => (
   <Router>
      <Scene key = "root">
         <Scene key = "StartScreen" component = {StartScreen} title = "Start Route" initial = {true} />
         <Scene key = "RouteScreen" component = {RouteScreen} title = "Show Route" />
         <Scene key = "ListRoutes" component = {ListRoutes} title = "List Routes" />
      </Scene>
   </Router>
)
export default Routes