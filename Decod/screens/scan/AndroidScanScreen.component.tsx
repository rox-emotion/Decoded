import * as tf from '@tensorflow/tfjs';
import { Camera, CameraType } from 'expo-camera';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import styles from './ScanScreen.styles';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import Header from '../../components/header/Header';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { captureRef } from 'react-native-view-shot';
import { useEffect, useRef, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { View, Image } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';
import { LayersModel } from '@tensorflow/tfjs';

const AndroidScanScreen = ({ model }) => {
    const cameraRef = useRef<Camera>(null)
    const isFocused = useIsFocused()
    const navigation = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            main()
        }, 500)

        return (() => {
            clearTimeout(timer)
        })
    }, [isFocused])

    const main = async () => {
        let photo = { uri: './' };
        if (cameraRef.current) {
            try {
                console.log('Start picture taking');
                const uri = await captureRef(cameraRef, {
                    format: 'jpg',
                    quality: 0.8,
                });

                await transformImageToTensor(uri);

            }
            catch (e) {
                console.log(e)
            }
        }
    }

    const resizeImage = async (photoUri: string) => {
        const resizedImage = await ImageManipulator.manipulateAsync(
            photoUri,
            [{ resize: { width: 224, height: 224 } }],
            { format: ImageManipulator.SaveFormat.JPEG }
        );
        return resizedImage;
    };

    const transformImageToTensor = async (uri) => {

        const resizedImage = await resizeImage(uri);
        const imageString = await FileSystem.readAsStringAsync(resizedImage.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const imageBytes = new Uint8Array(Buffer.from(imageString, 'base64'));
        const imageTensor = decodeJpeg(imageBytes);
        const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
        const normalized = tf.expandDims(tf.sub(tf.div(tf.cast(resized, 'float32'), 127.5), 1), 0);
        startPrediction(model, normalized);
    }

    const startPrediction = async (model, tensor) => {
        try {
            const output = await model.predict(tensor, { batchSize: 1 });
            let resultData = output.dataSync();
            const results = [];

            for (let i = 0; i < resultData.length; i++) {
                results.push({ score: resultData[i], label: i });
            }
            results.sort((curr, prev) => prev.score - curr.score);
            tf.dispose([tensor]);

            console.log(results[0].label)
            console.log(results[0].score)

            if (results[0].label != 0 && results[0].label != 103 && results[0].score > 0.98) {
                navigation.navigate("Detail", { id: results[0].label })

            } else {
                main()
            }
        } catch (error) {
            console.error('Error predicting from tesor image', error);
        }

    };

    return (
        <View style={styles.mainContainer}>
            {isFocused && (
                <Camera
                    style={styles.camera}
                    type={CameraType.back} ref={cameraRef}
                >
                    <View style={{ paddingTop: 28 }}>
                        <Header hasMenu={false} hasBack={false} hasIcon={true} />
                    </View>

                    <Image
                        source={require('./../../assets/icons/target_icon.png')}
                        style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.05, alignSelf: 'center' }}

                    />

                </Camera>
            )
            }
        </View>
    )
}

export default AndroidScanScreen;