// import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import React from 'react';
import { Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';


export class database1 {
    constructor(){ 
        try {
            
        var db = openDatabase({ name: 'routes.db' });
        db.transaction(function(txn) {
            txn.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table' AND name='routes'",
              [],
              function(tx, res) {
                console.log('item a:', res.rows.length);
                if (res.rows.length == 0) {
                  txn.executeSql('DROP TABLE IF EXISTS routes', []);
                  txn.executeSql(
                    // 'CREATE TABLE IF NOT EXISTS Cart(id VARCHAR(50) PRIMARY KEY, quantity VARCHAR(20) ,price VARCHAR(20),product_name VARCHAR(20),imgurl VARCHAR(255),category_name VARCHAR(20))',
                    "CREATE TABLE IF NOT EXISTS routes ( " +
                    "routeid TEXT PRIMARY KEY, " +
                    "datetime TEXT NOT NULL, " +
                    "distance REAL NOT NULL" +
                    ");",
                    [],
                    (tx, results) => {
                        console.log('ajit')
                        db.transaction(function(txn) {
                            txn.executeSql(
                              "SELECT name FROM sqlite_master WHERE type='table' AND name='routedata'",
                              [],
                              function(tx, res) {
                                console.log('routedata a:', res.rows.length);
                                if (res.rows.length == 0) {
                                  txn.executeSql('DROP TABLE IF EXISTS routedata', []);
                                  txn.executeSql(
                                    // 'CREATE TABLE IF NOT EXISTS Cart(id VARCHAR(50) PRIMARY KEY, quantity VARCHAR(20) ,price VARCHAR(20),product_name VARCHAR(20),imgurl VARCHAR(255),category_name VARCHAR(20))',
                                    "CREATE TABLE IF NOT EXISTS routedata ( " +
                                    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                                    'routeid TEXT NOT NULL, ' +
                                    "latitude REAL, " +
                                    "longitude REAL, " +
                                    "datetime TEXT NOT NULL, " +
                                    "time TEXT ,"+
                                    "FOREIGN KEY(routeid) REFERENCES routes(routeid)" + // 1 to M reationship
                                    ");",
                                    []
                                    
                                  ),(err) => console.log("Error on opening database 'master'", err)
                                  console.log('Create table success fully');
                                //   return(db);
                                }
                              }
                            );
                            });
                    }   
                
                  ),(err) => console.log("Error on opening database 'master'", err)
                  console.log('Create table success fully');
                //   return(db);
                }
              }
            );
          });
        
         
                
    } catch (error) {
        console.log('error in database1 construrctor',error)        
    }
        
    }

    inserRootCoordinate=(props)=>{
        try {
            
        let routeid = props.id;
        var db = openDatabase({ name: 'routes.db' });
        props.travalingobject.map(object=>{
            let latitude = object.latitude;
            let longitude = object.longitude;
            let time = object.time;
            db.transaction((tx)=> {
        
                // Loop would be here in case of many values
                console.log('inside db');
                tx.executeSql(
                'INSERT INTO routedata( routeid, latitude, longitude, datetime, time) VALUES (?,?,?,?,?)',
                [routeid, latitude, longitude,routeid,time],
                (tx, results) => {
                    // console.log('Insert Results',results.rowsAffected);
                    if(results.rowsAffected>0){
                          console.log('successfully add data in inserRootCoordinate ');
                        //   this.inserRootCoordinate({travalingobject:props.travalingobject,id:id});
                    }else{
                        console.log('failed add');
                    }
                },(err) => console.log("Error on opening database 'inserRootCoordinate'", err)
            );
        });
        })
    } catch (error) {
        console.log("Error on opening database 'inserRootCoordinate'", error)
    }
    }

    insertRoot = (props)=>{
        try {
            
       
        var db = openDatabase({ name: 'routes.db' });
        console.log(props);
        let distance= props.distance;
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let date1 = d.getDate();
        let hr = d.getHours();
        let mm = d.getMinutes();
        let ss = d.getSeconds();
        if(hr<10){
        hr="0"+hr;  
        }
        if(mm<10){
          mm="0"+mm;  
        }
        if(ss<10){
          ss="0"+ss;  
        }
        

        // let id = year+"-"+month+"-"+date1+"-"+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds();
        let id = year+"-"+month+"-"+date1+"-"+hr+"-"+mm+"-"+ss;
        db.transaction((tx)=> {
        
            // Loop would be here in case of many values
            console.log('inside db');
            tx.executeSql(
            'INSERT INTO routes(routeid, datetime, distance ) VALUES (?,?,?)',
            [id, id, distance],
            (tx, results) => {
                // console.log('Insert Results',results.rowsAffected);
                if(results.rowsAffected>0){
                      console.log('successfully add data in insertRoot');
                      this.inserRootCoordinate({travalingobject:props.travalingobject,id:id});
                }else{
                    console.log('failed add');
                    Alert.alert("Error" ,"somthing error to Save coordinates in sqlite1 ");
                }
            },(err) => console.log("Error on opening database 'insertRoot'", err)
        );
    });
    } catch (error) {
        console.log("Error on opening database 'insertRoot'", error)
    }
    }
    async saveDatabaseReport(props){
        this.insertRoot(props);
    }

    getRootDetails(id){
        var db = openDatabase({ name: 'routes.db' });
        var query = "SELECT latitude,longitude  FROM routedata WHERE  routeid = '" +id + "'";

        // var query = "SELECT routeid, distance FROM routes";
        return new Promise(resolve => {
          db
            .transaction(tx => {
              tx.executeSql(query, [], (tx, results) => {
                var Coordinate = [];
                for (let i = 0; i < results.rows.length; i++) {
                  Coordinate.push(results.rows.item(i));
                }
    
                resolve(Coordinate);
              });
            })
            .then(result => {})
            .catch(err => {
              //console.log(err);
            });
        });
      }
    

    getAllRoot(){
        try {
       
        var db = openDatabase({ name: 'routes.db' });
        var query = "SELECT routeid, distance FROM routes";
        return new Promise(resolve => {
          db
            .transaction(tx => {
              tx.executeSql(query, [], (tx, results) => {
                var roots = [];
                for (let i = 0; i < results.rows.length; i++) {
                    // console.log(results.rows.item(i));
                  roots.push(results.rows.item(i));
                }
    
                resolve(roots);
              });
            })
            .then(result => {})
            .catch(err => {
              //console.log(err);
            });
        });
      
      
    } catch (error) {
            console.log('error',error);
    }
}   
}