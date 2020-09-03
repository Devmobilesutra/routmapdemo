import React, { Component } from 'react'
import { Text, StyleSheet, View,TouchableOpacity } from 'react-native'
import RNFS from 'react-native-fs'
export default class timeDistance extends Component {
  
    render() {
        const {Hours,minutes,Km,meter}=this.props;
       
        return (
            <View style={styles.main}>
                <Text style={styles.txt1}> {Km} </Text>
                <Text style={styles.txt2}> Km  </Text>
                {/* <Text style={styles.txt1}>{meter} </Text>
                <Text style={styles.txt2}>Mtr</Text> */}

                {/* <TouchableOpacity style={styles.buttonContainer12} onPress={this.getStoredArray}>
    <Text style={{fontWeight:'bold',color:'black'}}  > GetStoredArray </Text>
    </TouchableOpacity> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
main:{
    position: 'absolute',
  bottom:0,
    height:35,
    width:'100%',
    marginLeft:100,
    backgroundColor:'white',
     flexDirection:'row',
     padding:5
},
buttonContainer12: {
    padding:2,
   height:40,
   width:130,
   marginLeft:60,
  
  backgroundColor:'#34DDDD',  textAlign:'center',
  justifyContent:'center',
  

},
txt1:{
    color:'black',
    
},

txt2:{
    color:'grey',
    
}



})
