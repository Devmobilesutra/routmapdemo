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
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from "@react-native-community/netinfo";
import { SqliteDB } from './database';

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
      };
    this.readRoutes();
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

  handleSelect(aRouteId, aDistance, anItem) {
    this.setState({
      selectedRoutedId: aRouteId,
      selectedDistance: aDistance,
      selectedRouteItem: anItem
    });

  }
  componentDidMount() {
    // this.requestBatteryPermission()
    // this.requestFineLocation() 
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

  renderItem = ({ item }) => {
    const backgroundColor =
      item.routeId === this.state.selectedRoutedId ? 'lightgray' : 'white';

    return (
      <Item
        item={item}
        onPress={() => this.handleSelect(item.routeId, item.distance, item.routeItem)}
        style={{ backgroundColor }}
      />
    );
  };

  goToHome = () => {
    Actions.StartScreen();
  };


  async showRoute() {
    if (!this.state.selectedRoutedId || this.state.selectedDistance == 0)
      return;
    try {
      var coordinates = [];
      await this.sqliteDb.getCoordinates(
        this.state.selectedRoutedId,
        coordinates,
      );

      if (coordinates.length > 3)
        Actions.RouteScreen({
          routeCoordinates: coordinates,
          distance: this.state.selectedDistance,
        });
    } catch (error) {
      console.log('Got error', error);
    }
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
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={{ width: 200, height: 50 }}>
          <Text style={{ fontSize: 30 }}>Date 📅 </Text>
        </TouchableOpacity>
        <FlatList
          // style={{ backgroundColor: 'green' }}
          data={this.state.routes}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.routeId}
          extraData={this.state.selectedRoutedId}
        />

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
