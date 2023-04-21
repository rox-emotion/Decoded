import React from 'react'
import { View, TextInput, TouchableOpacity, Text, SafeAreaView } from 'react-native'
import { useState } from 'react';

const DebugScreen = ({ navigation }) => {
    const [detail, setDetail] = useState('');

    const moveOver = () => {
        navigation.navigate("Detail", { id: detail })
    }

    return (
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                style={{ backgroundColor: 'red', width: 100, height: 50 }}
                onChangeText={(value) => { setDetail(value) }}
                value={detail}
                keyboardType="numeric"
            />

            <TouchableOpacity onPress={(moveOver)}>
                <Text>Go</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default DebugScreen;