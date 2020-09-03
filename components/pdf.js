import React, { Component } from 'react'
import { Text, View ,TouchableOpacity,TouchableHighlight,StyleSheet,PermissionsAndroid} from 'react-native'

// import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { Table } from 'reactstrap';


export default class PdfFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    toolsUsed: [
     {
       name: 'ABC',
       price: 10,
       count: 3,
       id: Math.floor(Math.random() * 150).toString(),
     },
     {
       name: 'XYZ',
       price: 5,
       count: 3,
       id: Math.floor(Math.random() * 150).toString(),
     },
     {
       name: 'DEF',
       price: 10,
       count: 7,
       id: Math.floor(Math.random() * 150).toString(),
     },
   ],

   OrderDetails: [
     {
        amount: 80,
         item_id: 81,
        item_name: 'Sugar',
         large_unit: 2,
         mobile_id: 2152020102033,
         rate: 40,
         small_unit: 0,
     },
     {
        amount: 100,
         item_id: 82,
       item_name: 'Rice',
         large_unit: 2,
         mobile_id: 2152020102033,
         rate: 50,
         small_unit: 0,
     },
   ],

   CustomerDetails: [
     {
       customer_name: "ABC XYZ",
       mobile_no: 888888888,
       address: "B2 Patil Garden,Tejas Nagar,Kothrud,Pune",
       pincode: 411038,
       payment_mode: "Card",
       payment_status:"Done",
       total_amount: "180",
       payment_id:101,
       device_id:"xxx7777"
     }
   ],

  OrderMaster: [
    {
      shop_id: 88643,
       payment_mode: "Card",
       payment_status:"Done",
       expected_delivery_date: "2020-May-21",
       mobile_order_id: 2152020102033,
       remark: "abc",
       total_amount: "100",
      order_id: "ord1",
      order_date: "20202-May-21",
    }
  ]
}
}


printTool = () => {

    let OrderDetails = this.state.OrderDetails.map((OrderDetails,index) => {
      return (
        `<tr key={OrderDetails.item_id}>
          <td style="text-align: center; padding: 10;">`+OrderDetails.item_id+`</td>
          <td style="text-align: center; padding: 10;">`+OrderDetails.item_name+`</td>
          <td style="text-align: center; padding: 10;">`+OrderDetails.rate+`</td>
          <td style="text-align: center; padding: 10;">`+OrderDetails.large_unit+`</td>
          <td style="text-align: center; padding: 10;">`+OrderDetails.amount+`</td>
        </tr>`
      )
    })
    
    return ( 
      `<table border="1", align="center">
        <thead>
          <tr>
            <th style="text-align: center; padding: 10;"> Item ID </th>
            <th style="text-align: center; padding: 10;"> Item Name </th>
            <th style="text-align: center; padding: 10;"> Price </th>
            <th style="text-align: center; padding: 10;"> Quantity </th>
            <th style="text-align: center; padding: 10;"> Amount </th>
          </tr>
        </thead>

        <tr>
          <tbody>`
            +OrderDetails+
          `</tbody>
        </tr>
      </table>`
    );
  }


    askPermission() {
      var that = this;
      async function requestExternalWritePermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'CameraExample App External Storage Write Permission',
              message:
                'CameraExample App needs access to Storage data in your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If WRITE_EXTERNAL_STORAGE Permission is granted
            //changing the state to show Create PDF option
            that.createPDF();
          } else {
            alert('WRITE_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Write permission err', err);
          console.warn(err);
        }
      }
      //Calling the External Write permission function
      if (Platform.OS === 'android') {
        requestExternalWritePermission();
      } else {
        this.createPDF();
      }
    }
  

async createPDF() {
    
      let options = {
      html:
        `
          <body>
            <h1 style="text-align: center;"> GPSCoordinates </h1>  
            <br /> 

          
            <br/>
            <div style="align-items: center;">
              <h2>Coordinate Array:</h2>
              ${this.printTool()} 
            </div>  
            <br/>
            <br/>

           
                
          </body>
        `,
 
       fileName: `Coordinates${Math.floor(Math.random() * 100)}`,
       directory: await PDFLib.getDocumentsDirectory(),
     };
 
     try {
      let file = await RNHTMLtoPDF.convert(options);
      this.setState({filePath: file.filePath}, () => alert(this.state.filePath));
      this.setState({filePath:file.filePath});
      console.log('Success',file)
    } catch (err){
      console.log(err)
    }
}


render() {
  return (
    <View style={{justifyContent:'center', alignItems:'center'}}>
      <TouchableOpacity onPress={this.askPermission.bind(this)}>
        <Text styles={{justifyContent:'center', alignItems:'center'}}>Create PDF</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{this.state.filePath}</Text>
    </View>
  )
}
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F4F4F',
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    color: 'black',
    textAlign:'center',
    fontSize: 25,
    marginTop:16,
  },
  ImageStyle: {
    height: 150,
    width: 150,
    resizeMode: 'stretch',
  },
});

