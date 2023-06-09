import React from 'react'
import {TextInput, TouchableOpacity, Text, SafeAreaView } from 'react-native'
import { useState } from 'react';

const DebugScreen = ({ navigation }) => {
    const [detail, setDetail] = useState('');

    const moveOver = () => {
        navigation.navigate("Detail", { id: detail })
    }

    return (
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{marginTop:40}}></Text>
            <TextInput
                style={{ backgroundColor: 'red', width: 200, height: 50 }}
                onChangeText={(value) => { setDetail(value) }}
                value={detail}
                keyboardType="numeric"
            />

            <TouchableOpacity onPress={(moveOver)}>
                <Text style={{fontSize:50}}>Go</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default DebugScreen;