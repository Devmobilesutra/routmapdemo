import React, { Component } from 'react'
import { Text, View,TextInput } from 'react-native'

var arrays= {
    "status": true,
    "statusCode": 200,
    "message": "Project List fetched successfully.",
    "data": [
        {
            "id": "1",
            "p_name": "Electric wheelchairs",
            "threauptic_area": "UNKNOWN",
            "market": "UNKNOWN",
            "project_scope": "Long term",
            "start_date": "2020-07-11 12:29:48",
            "end_date": "2020-12-10",
            "project_plan": "Development of smart wheelchair.",
            "project_proposal": "Formally Solicited",
            "project_sow": "All deliverable and due dates.",
            "event_name": "Wheelchair Fair",
            "engagement_type": "Gamification technology",
            "procedure_type": "Hardware",
            "specialty": "Wheel",
            "no_of_participant": "5",
            "project_manager": "Neel",
            "team_members": "sham,ram,pooja,nisha",
            "submitted_by": "sham",
            "shortlisted_respondents": "pooja,sham",
            "finalist_respondents": "nisha",
            "project_status": "in progress",
            "comment": "This project gives this information regarding wheelchair.",
            "project_docs": "UNKNOWN",
            "last_updated_on": "2020-07-11 12:29:48"
        },
        {
            "id": "2",
            "p_name": "Gas cum Electric Autoclave",
            "threauptic_area": "UNKNOWN",
            "market": "UNKNOWN",
            "project_scope": "Short term",
            "start_date": "2020-07-11 12:29:48",
            "end_date": "2020-09-15",
            "project_plan": "Get all information of Gas cum Electric Autoclave.",
            "project_proposal": "Unsolicited",
            "project_sow": "Costs and deadlines for payment.",
            "event_name": "Gas cum Electric Autoclave",
            "engagement_type": "Gamification technology",
            "procedure_type": "Hardware",
            "specialty": "Autoclave",
            "no_of_participant": "4",
            "project_manager": "Neeta",
            "team_members": "sheetal,chetan,yasin,akshya",
            "submitted_by": "yasin",
            "shortlisted_respondents": "sheetal,chetan",
            "finalist_respondents": "akshya",
            "project_status": "in progress",
            "comment": "Need to complete within time.",
            "project_docs": "UNKNOWN",
            "last_updated_on": "2020-07-11 12:29:48"
        }
    ]
}
export default class search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query:'',
            filterarr:[]
        }}
        getPlacesDebounced(input){
            this.setState({query:input})
            const { filterarr } = this.state;
            this.setState({filterarr:arrays.data})
            
           return filterarr.filter(filterarr => filterarr.p_name.toLowerCase().indexOf(input.toLowerCase()) >= 0);
       

        }
    render() {
        console.log("aaaaaaaaaaaa",this.state.filterarr)
        return (
            <View style={{flex:1,justifyContent:'center',alignContent:'center',flexDirection:'column'}}>
                <TextInput style={{flex:0.5,margin:15,justifyContent:'center',alignContent:'center',height:'0%',width:'80%',borderColor:'black',borderWidth:2}}
                placeholder='Enter here'
                value={this.state.query}
                onChangeText={input => {
                        this.getPlacesDebounced(input)}
             }
                >

                </TextInput>
                <Text style={{flex:5,justifyContent:'center',alignContent:'center'}}>mhvjhgjh</Text>
            </View>
        )
    }
}

