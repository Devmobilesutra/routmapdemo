import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Buttons from 'mobilesutra_whatsappshare'
export default class wt extends Component {
    render() {
        return (
            <View>
            <Buttons title='Send To Multiple' msg='aaa' style={{marginTop: 10,  alignSelf:'center', borderRadius:12}} />
            </View>
        )
    }
}
