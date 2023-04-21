import { SafeAreaView, View, Text, Button, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from './SplashScreen.styles'
import { useRef } from 'react'
import { CurrentRenderContext, useNavigation } from '@react-navigation/native'
import { Video } from 'expo-av';

const SplashScreen = () => {
    const videoPlayer = useRef(null);
    const navigation = useNavigation();
    const videoSource = require('./../../assets/video/a.mp4');

    useEffect(() => {
        if (videoPlayer.current) {
            videoPlayer.current.playAsync();
        }
    }, []);

    return (
        <View style={styles.container}>
            <Video
                ref={videoPlayer}
                source={videoSource}
                resizeMode="cover"
                onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                        navigation.navigate('Scan');
                    }
                }}
                style={styles.video}
            />
        </View>

    );
}

export default SplashScreen;