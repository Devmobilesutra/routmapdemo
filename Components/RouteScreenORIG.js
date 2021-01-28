import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'

const RouteScreen = () => {
   const goToHome = () => {
      Actions.StartScreen()
   }
   return (
      <TouchableOpacity style = {{ margin: 128 }} onPress = {goToHome}>
         <Text>{global.isInternet ? "Connected" : "Not Connected"}</Text>
      </TouchableOpacity>
   )
}
export default RouteScreen