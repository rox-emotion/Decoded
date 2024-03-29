import * as tf from '@tensorflow/tfjs';
import { Camera, CameraType } from 'expo-camera';
import styles from './ScanScreen.styles';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import Header from '../../components/header/Header';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { captureRef } from 'react-native-view-shot';
import { useEffect, useRef } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { View, Image, StatusBar, Platform, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';

const AndroidScanScreen = ({ model }) => {
    StatusBar.setBackgroundColor('transparent');

    const cameraRef = useRef<Camera>(null)
    const isFocused = useIsFocused()
    const navigation = useNavigation()

    tf.env().set("WEBGL_DELETE_TEXTURE_THRESHOLD", 0);
    useEffect(() => {
        const timer = setTimeout(() => {
            main()
        }, 500)

        return (() => {
            clearTimeout(timer)
        })
    }, [isFocused])

    const main = async () => {
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
        const normalized = tf.tidy(() => {
            const imageTensor = decodeJpeg(imageBytes);
            const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
            const op = tf.expandDims(tf.sub(tf.div(tf.cast(resized, 'float32'), 127.5), 1), 0);
            tf.dispose([imageTensor, resized])
            return op;
        });
        startPrediction(model, normalized);
        tf.dispose(normalized)
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

            console.log(results[0].label)
            console.log(results[0].score)

            tf.dispose([tensor, output, resultData]);

            if (results[0].label == 102) {
                navigation.navigate('Poetry')
            }
            else if (results[0].label != 0 && results[0].label != 103 && results[0].score > 0.98) {
                navigation.navigate("Detail", { id: results[0].label })

            } else {
                setTimeout(() => {
                    main()
                }, 100)

            }
        } catch (error) {
            console.error('Error predicting from tesor image', error);
        }

    };

    const containerHeight = Dimensions.get("window").width * 1080 / 608
    const screenHeight = Dimensions.get("window").height
    const extraSpace = screenHeight < containerHeight ? (containerHeight - screenHeight) / 2 : 0

    return (
        <View style={styles.mainContainer}>
            {isFocused && (
                <Camera
                    style={styles.camera}
                    type={CameraType.back} ref={cameraRef}

                >

                    <View style={{ marginTop: 52 }}>
                        <Header hasMenu={false} hasBack={false} hasIcon={true} />
                    </View>


                    <View style={newStyles.mainContainer}>
                        <View style={newStyles.container}>
                            <Image
                                source={require('./../../assets/icons/target.png')}
                                style={newStyles.image}
                                resizeMode="cover"
                            />
                        </View>
                    </View>



                </Camera>

            )
            }
        </View>
    )
}

const newStyles = StyleSheet.create({
    mainContainer: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        alignSelf: 'center'
    },
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        width: '100%'
    },
});


export default AndroidScanScreen;