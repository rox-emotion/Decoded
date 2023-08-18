import React from "react";
import { Video } from 'expo-av';
import { Dimensions, StatusBar, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import styles from "./SplashScreen.styles";
import * as tf from '@tensorflow/tfjs';

const SplashScreen = () => {
    StatusBar.setBackgroundColor('#26170D');

    const videoPlayer = useRef(null);
    const videoSource = require('./../../assets/video/a.mp4');
    const [isTfReady, setIsTfReady] = useState(false);
    
    useEffect(() => {
        if (videoPlayer.current) {
            videoPlayer.current.playAsync();
        }
    }, []);

    useEffect(() => {
        loadTensorFlow();
    }, []);

    const loadTensorFlow = async () => {
        await tf.ready();
        setIsTfReady(true)
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Video
                    ref={videoPlayer}
                    source={videoSource}
                    resizeMode="cover"
                    style={styles.video}

                />
            </View>
        </View>

    );

}

export default SplashScreen;