import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import React from 'react';
import ToastAndroid, { Alert } from 'react-native';
import RNFS from 'react-native-fs'

export class SqliteDB {
  db = null;

  constructor() {
  }

  openDbInternal = (options) => new Promise((resolve, reject) => {
    SQLite.openDatabase(options,
      (db) => {
        resolve(db);
      },
      (error) => {
        reject(error);
      });
  });

  closeDbInternal = (options) => new Promise((resolve, reject) => {
    this.db.close(resolve, reject);
  });

  execSqlInternal = (sql, params = []) => new Promise((resolve, reject) => {
    this.db.executeSql(sql, params, (results) => {
      resolve(results);
    },
      (error) => {
        reject(error);
      });
  });


  async openDb(aFileName) {
    if (!this.db)
      this.db = await this.openDbInternal(
        {
          name: aFileName,
          createFromLocation: 2
        });
  }

  async closeDb(aFileName) {
    if (this.db) {
      await this.closeDbInternal();
      this.db = null;
    }
  }

  async execSql(sql, params) {
    res = await this.execSqlInternal(sql, params);
    return res;
  }

  //application specific methods
  async writeCoordinates(coordsArray, distance) {

    try {
      await this.openDb('routes.db');

      await this.execSql(
        "CREATE TABLE IF NOT EXISTS routes ( " +
        "routeid INTEGER PRIMARY KEY NOT NULL, " +
        "datetime TEXT NOT NULL, " +
        "distance REAL NOT NULL" +
        ");"
      );

      await this.execSql(
        "CREATE TABLE IF NOT EXISTS routedata ( " +
        "id INTEGER PRIMARY KEY NOT NULL, " +
        'routeid INTEGER NOT NULL, ' +
        "latitude REAL, " +
        "longitude REAL, " +
        "datetime TEXT NOT NULL, " +
        "FOREIGN KEY(routeid) REFERENCES routes(routeid)" + // 1 to M reationship
        ");"
      );

      var todayDate = new Date().toISOString();
      var result = await this.execSql(
        'INSERT INTO routes (datetime, distance) VALUES (?,?)',
        [todayDate,
          distance
        ]);

      if (result.insertId == undefined)
        throw "Insert error: can not get insertId";

      // let arr = [
      //   {latitude : '18.5192464	', longitude : '73.8075354'},
      //   {latitude : '18.5183531	', longitude : '73.8075218'},
      //   {latitude : '18.5178709	', longitude : '73.807665'},
      //   {latitude : '18.5174183	', longitude : '73.8077583'},
      //   {latitude : '18.5170604	', longitude : '73.8077856'},
      //   {latitude : '18.51656	', longitude : '73.8077917'},
      //   {latitude : '18.516135	', longitude : '73.8077933'}
      // ];

      for (var i = 0; i < coordsArray.length; i++) {
        // console.log(arr[i]);
        Alert.alert("Coordinate array", coordsArray[i]);
        await this.execSql(
          'INSERT INTO routedata (id, routeid, latitude, longitude, datetime) VALUES (?,?,?,?)',
          [
            result.insertId,
            coordsArray[i].latitude,
            coordsArray[i].longitude,
            todayDate
          ]);
      }

      // var result1 = await this.execSql(
      //   'SELECT * FROM routes');
      //   console.log(result1);
      await this.closeDb();
    }
    catch (error) {
      throw error;
    }
  }

  async newWriteCoordinates(Coordinate, distance) {
    await this.openDb('routes.db');

    var routes = await this.execSql(
      "CREATE TABLE IF NOT EXISTS routes ( " +
      "routeid INTEGER PRIMARY KEY NOT NULL, " +
      "datetime TEXT NOT NULL, " +
      "distance REAL NOT NULL" +
      ");"
    );
    console.log("Routes", routes);

    var routeData = await this.execSql(
      "CREATE TABLE IF NOT EXISTS routedata ( " +
      "id INTEGER PRIMARY KEY NOT NULL, " +
      'routeid INTEGER NOT NULL, ' +
      "latitude REAL, " +
      "longitude REAL, " +
      "datetime TEXT NOT NULL, " +
      "FOREIGN KEY(routeid) REFERENCES routes(routeid)" + // 1 to M reationship
      ");"
    );
    console.log("Routedata", routeData);

    var TodaysDate = new Date().toLocaleDateString();
    //query
    var result = await this.execSql(
      'INSERT INTO routes (datetime, distance) VALUES (?,?)',
      [TodaysDate,
        distance
      ]);
    console.log("insert routes", result);

    if (result.insertId == undefined)
      throw "Insert error: can not get insertId";

    var arr = [];
    for (var i = 0; i < Coordinate.length; i++) {
      // console.log(arr[i]);
      // Alert.alert("Coordinate array", coordsArray[i]);
      await this.execSql(
        'INSERT INTO routedata (id, routeid, latitude, longitude, datetime) VALUES (?,?,?,?)',
        [
          result.insertId,
          Coordinate[i].latitude,
          Coordinate[i].longitude,
          todayDate
        ]);
      arr.push({
        "id": result.insertId,
        "lat": Coordinate[i].latitude,
        "lan": Coordinate[i].longitude,
        "date": todayDate
      })
    }
    var path = RNFS.DocumentDirectoryPath + coordinates`${Math.random() * 100}`.txt;
    RNFS.writeFile(path, arr, 'utf8').then((success) => { console.log("FILE WRITTEN") }).catch((error) => { error.message })

    await this.closeDb();
  }
  
  async listRoutes(routes) {
    try {
      await this.openDb('routes.db');

      var res = await this.execSql("SELECT * FROM routes ORDER BY datetime DESC", []);
      var rows = res.rows;
      for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);

        var date = moment(item['datetime']);
        var dateComponent = date.format('DD MMM YYYY');
        var timeComponent = date.format('hh:mm:ss A');

        routes.push({
          routeId: item['routeid'].toString(),
          routeItem: dateComponent + ' ' + timeComponent +
            '\n' + item['distance'].toFixed(1) + ' km',
          distance: item['distance']
        })
      }

      await this.closeDb();
    }
    catch (error) {
      throw error;
    }
  }

  async getCoordinates(routeId, coordinates) {
    try {
      await this.openDb('routes.db');

      var res = await this.execSql("SELECT * FROM routedata where routeid=?", [routeId]);
      var rows = res.rows;
      for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);

        var date = moment(item['datetime']);
        var dateComponent = date.utc().format('DD MMM YYYY');
        var timeComponent = date.utc().format('HH:mm:ss');
``
        coordinates.push({
          latitude: item['latitude'],
          longitude: item['longitude']
        })
      }

      await this.closeDb();
    }
    catch (error) {
      throw error;
    }
  }

  async deleteRoute(routeId) {
    try {
      await this.openDb('routes.db');

      await this.execSql("DELETE FROM routedata WHERE routeId=?", [routeId]);
      await this.execSql("DELETE FROM routes WHERE routeId=?", [routeId]);

      await this.closeDb();
    }
    catch (error) {
      throw error;
    }
  }
};