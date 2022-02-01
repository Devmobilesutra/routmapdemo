import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import { openDatabase } from 'react-native-sqlite-storage';
import NetInfo from "@react-native-community/netinfo";
import { SqliteDB } from './database';
import { database1 } from './database1';

var db = new database1();
const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.routeItem}</Text>
  </TouchableOpacity>
);

class ListRoutes extends React.Component {
  sqliteDb = new SqliteDB();
  constructor(props) {
    super();
    global.isInternet = false,
      this.state = {
        routes: [],
        selectedRoutedId: null,
        selectedDistance: 0,
        selectedRouteItem: '',
        check: false,
        coordinates:[],
        Loding:false,
      };
    // this.readRoutes();
  }



  async readRoutes() {
    try {
      var data = [];
      await this.sqliteDb.listRoutes(data);
      this.setState({ routes: data });
    } catch (error) {
      console.log('Got error', error);
    }
  }
  selectRoot(aRouteId,aDistance){
     this.setState({
      selectedRoutedId: aRouteId,
      selectedDistance: aDistance,
      // selectedRouteItem: anItem
    });
  }
  getAllCoordinates() {
   
    try {
      this.setState({Loding:true,coordinates:[]})
       let db = openDatabase({ name: 'routes.db' });
      //  var query = "SELECT routeid, distance FROM routes";
      var query = "SELECT latitude,longitude  FROM routedata WHERE  routeid = '" +this.state.selectedRoutedId + "'";
         db
           .transaction(tx => {
             tx.executeSql(query, [], (tx, results) => {
                // roots = [];
               for (let i = 0; i < results.rows.length; i++) {
                   console.log(`Ajit`,results.rows.item(i));
                 this.state.coordinates.push(results.rows.item(i));
               }
   
               
             });
           })
          
     
     
   } catch (error) {
           console.log('error',error);
   }


  }
  componentDidMount() {
    // this.requestBatteryPermission()
    // this.requestFineLocation()
    this.getAllRoots(); 
    this.unsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange
    );
  }
  handleConnectivityChange = (state) => {
    // global.isInternet = state.isConnected;
    console.log(state.isConnected)
    this.setState({
      check: state.isConnected
    })
  }
  
  getAllRoots=()=>{
    // try {
    
    //     db.getAllRoot()
    //     .then((data)=>{
    //       console.log("getAllRoots",data.lenght);
    //     }).catch(e=>console.log('get AllRoots ',e));
    //   } catch (error) {
    //       console.log('error1',error);
    //   }
    try {
      console.log();
       let db = openDatabase({ name: 'routes.db' });
       var query = "SELECT routeid, distance FROM routes ORDER BY routeid DESC";
       
         db
           .transaction(tx => {
             tx.executeSql(query, [], (tx, results) => {
                // roots = [];
               for (let i = 0; i < results.rows.length; i++) {
                  //  console.log(`Ajit`,results.rows.item(i));
                 this.state.routes.push({routeid:results.rows.item(i)['routeid'],
                 distance: results.rows.item(i)['distance'].toFixed(1)
                });
                // console.log('ajit1',this.state.routes);
                this.setState({});
                }
               
               
             });
           })
          
    //  this.setState({});
     
   } catch (error) {
           console.log('error',error);
   }
  }
  renderItem = ({ item }) => {
    const backgroundColor =
      item.routeid === this.state.selectedRoutedId ? 'lightgray' : 'white';
      
    
    return (
      // <Item
      //   item={item}
      //   onPress={() => this.handleSelect(item.routed, item.distance)}
      //   style={{ backgroundColor }}
      // />
      
      <View
        style={{marginBottom:'2%'}}
      >
       
       <TouchableOpacity
        onPress={()=>this.selectRoot(item.routeid,item.distance)}
       > 
        <View
        style={{backgroundColor:backgroundColor,
        width:'90%',
        height:40,
        justifyContent:'space-between',
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'center'
        }}
        >
          <Text
          style={{fontSize:15,marginLeft:20}}
          >
            {`${item.routeid}`}
          </Text>
          <Text
            style={{fontSize:15,marginRight:20}}
          >{`${item.distance} KM`}</Text>
        </View>
        </TouchableOpacity>
        
      </View>
    );
  };

  goToHome = () => {
    Actions.StartScreen();
  };


  async showRoute() {
    if (!this.state.selectedRoutedId || this.state.selectedDistance == 0)
       return;
    // try {
    //   var coordinates = [];
    //   await this.sqliteDb.getCoordinates(
    //     this.state.selectedRoutedId,
    //     coordinates,
    //   );

    //   if (coordinates.length > 3)
    //     Actions.RouteScreen({
    //       routeCoordinates: coordinates,
    //       distance: this.state.selectedDistance,
    //     });
    // } catch (error) {
    //   console.log('Got error', error);
    // }

    this.getAllCoordinates();

    setTimeout(
      ()=>{
        this.setState({Loding:false})
        Actions.RouteScreen({
          routeCoordinates: this.state.coordinates,
          distance: this.state.selectedDistance
        });
      },
      1000
    )
  }

  async deleteRoute() {
    if (!this.state.selectedRoutedId) return;
    try {
      await this.sqliteDb.deleteRoute(this.state.selectedRoutedId);
      const filtered = this.state.routes.filter(
        (item) => item.routeId !== this.state.selectedRoutedId,
      );
      this.setState({ routes: filtered, selectedRoutedId: null });
    } catch (error) {
      console.log('Got error', error);
    }
  }


  // Date Once written: "27 Nov 2020 08:41:52 AM"
  // Test with this
  postServer = (routeName, distance, coordinates) => {
    console.log('routeName: ' + routeName);
    console.log('distance: ' + distance);
    console.log('coordinates: ' + coordinates);

    var data = new FormData();
    data.append('date', routeName);
    data.append('distance', distance);
    data.append('lat_long', coordinates);

    fetch('http://mobilesutra.com/SSRDP/service/Distance/lat_long', {
      method: 'post',
      body: data
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Post success", responseData);
      })
      .catch((error) => {
        console.log("Error in Post", error);
      }
      )
  };

  async uploadServer() {
    if (!this.state.selectedRoutedId || this.state.selectedDistance == 0)
      return;

    try {
      var coordinates = [];
      await this.sqliteDb.getCoordinates(
        this.state.selectedRoutedId,
        coordinates,
      );

      var str = JSON.stringify(coordinates);

      if (coordinates.length > 3)
        this.postServer(this.state.selectedRouteItem,
          this.state.selectedDistance.toString(),
        )
    }
    catch (error) {
      console.log('Got error', error);
    }

  };

  render() {
    if(this.state.Loding){
      return(
        <ActivityIndicator
        size='large'
        color='#1E90FF'
          style={{justifyContent:'center',flex:1,alignSelf:'center'}}
        />
      );
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={{ width: 200, height: 50 }}>
          <Text style={{ fontSize: 30 }}>Date 📅 </Text>
        </TouchableOpacity>
        {
          this.state.routes.length>0?
        <FlatList
          // style={{ backgroundColor: 'green' }}
          style={{width:'100%',height:'30%'}}
          data={this.state.routes}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.routeid}
          extraData={this.state.selectedRoutedId}
        />
        :
        <View
           style={{width:'100%',height:'30%',justifyContent:'center',
           alignItems:'center'}}
        >
          <Text>{`no route available`}</Text>
        </View>
        }
        <View style={styles.container1}>
          <TouchableOpacity
            style={styles.buttonContainer1}
            onPress={this.showRoute.bind(this)}>
            <Text style={{ fontWeight: 'bold' }}> Show Route </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer1}
            onPress={this.deleteRoute.bind(this)}>
            <Text style={{ fontWeight: 'bold' }}> Delete </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container1}>
          <TouchableOpacity
            style={styles.buttonContainer1}
            onPress={this.uploadServer.bind(this)}
            disabled={this.state.started}>
            <Text style={{ fontWeight: 'bold' }}> Upload To Server </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 2,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',

  },
  buttonContainer1: {
    padding: 10,
    margin: '2%',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
    marginBottom: 10,
  },
});

export default ListRoutes;
