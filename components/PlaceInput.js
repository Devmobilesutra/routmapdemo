import React, { Component } from 'react'
import { Text, StyleSheet, View ,TextInput,TouchableOpacity,Keyboard} from 'react-native'
import axios from 'axios'
import _ from "lodash"
export default class PlaceInput extends Component {
    constructor(props){
        super(props)
        this.state={
        destinationInput:'',
        predictions:[]
        };  
        this.getPlaces=this.getPlaces.bind(this);  
        this.getPlacesDebounced=_.debounce(this.getPlaces,1000)
        this.setDestination=this.setDestination.bind(this)
      }
      
    
    //   getUsers = async () => {
    //     let res = await axios.get("https://reqres.in/api/users?page=1");
    //     let { data } = res.data;
    //     this.setState({ users: data });
    // };

    getPlaces= async (input) => {
        const {userLatitude,userLongtude}=this.props;
        const result= await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDEKqWAnL87yLjzZbOn6LdVQuK7BJTuvUw &input=${input}&location=${userLatitude}, ${userLongtude}&radius=2000`
        );
         console.log("datas==",JSON.stringify(result.data.predictions))
        this.setState({predictions:result.data.predictions});      
       
    }

   

    setDestination(main_text,place_id){
        Keyboard.dismiss();
        this.setState({destinationInput:main_text,predictions:[]})
        this.props.showDirectionsOnMap(place_id)
    }
    render() {
        const {suggetionStyle,main_textstyle,secondary_textstyle,PlaceInputStyle}=styles
        
      
        const predictions=this.state.predictions.map(prediction=>{
            const {id,structured_formatting,place_id}=prediction;
         return(
             <TouchableOpacity key={id} onPress={()=>this.setDestination(structured_formatting.main_text,place_id)}>
            <View style={suggetionStyle}>
                <Text style={main_textstyle}  >{structured_formatting.main_text}</Text>
                <Text style={secondary_textstyle}>{structured_formatting.secondary_text}</Text>
            </View>
            </TouchableOpacity>
        )
        }
            
            )
        return (
            <View>
           <TextInput
           value={this.state.destinationInput}
           autoCapitalize="none"
           autoCorrect={true}
           style={PlaceInputStyle}
           onChangeText={input => {
               this.setState({destinationInput:input});
               this.getPlacesDebounced(input)}
        }
           placeholder="where to? "
           > 
          </TextInput>
           {predictions}
           </View>
        )
    }
}


const styles = StyleSheet.create({

PlaceInputStyle:{
   
    height:40,
    backgroundColor:'white',
    marginTop:50,
    padding:5

},
suggetionStyle:{
    borderTopWidth:0.5,
    borderColor:'#777',
    backgroundColor:'white',
    padding:15,
    
},
secondary_textstyle:{
    color:'#777'
},

main_textstyle:{
    color:'#000'
}

})
