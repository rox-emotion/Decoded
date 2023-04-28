import React from "react";
import { useNavigation } from '@react-navigation/native'
import { Video } from 'expo-av';
import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import styles from "./SplashScreen.styles";
import { useDispatch } from 'react-redux';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import { setModel } from "../../store/modelActions";

const NewSplashScreen = () => {
    const videoPlayer = useRef(null);
    const navigation = useNavigation();
    const videoSource = require('./../../assets/video/a.mp4');
    const dispatch = useDispatch();
    const [isTfReady, setIsTfReady] = useState(false);

    //WHEN TF READY AND MODEL READY WILL APPEAR THE BUTTON (NEEDS CHANGING ON THE VIDEO)

    useEffect(() => {
        if (videoPlayer.current) {
            videoPlayer.current.playAsync();
        }
    }, []);

    useEffect(() => {
        prepareModel();
        loadTensorFlow();
      }, []);

    const prepareModel = async () => {
        console.log("prepareModel")
        const modelJson = require('./../../assets/model_normalized/model.json');
        const modelWeights = require('./../../assets/model_normalized/weights.bin')
        const model = await tf.loadLayersModel(
            bundleResourceIO(modelJson, modelWeights)
        ).catch((e) => {
            console.log("[LOADING MODEL ERROR] info:", e)
        })
        dispatch(setModel(model));
        console.log('model in splash')
        console.log(model)
        console.log("model prepared")
        return model;
    }

    const loadTensorFlow = async () => {
        console.log("load tensorflow")
        await tf.ready();
        setIsTfReady(true)
        console.log("tensorflow loaded")
    }

  

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

export default NewSplashScreen;